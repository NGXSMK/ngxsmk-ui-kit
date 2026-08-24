import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  TemplateRef,
  booleanAttribute,
  computed,
  contentChildren,
  inject,
  input,
  model,
  viewChild,
} from '@angular/core';
import { ngxsmkUniqueId } from '@ngxsmk/core/util';

/**
 * Single tab. Declares its trigger label and holds its lazily rendered
 * content; `ngxsmk-tabs` renders the active panel.
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-tab',
  template: ` <ng-template #content><ng-content /></ng-template> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkTab {
  readonly value = input.required<string>();
  readonly label = input.required<string>();
  readonly disabled = input(false, { transform: booleanAttribute });

  readonly content = viewChild.required<TemplateRef<unknown>>('content');
}

/**
 * Tabbed interface with WAI-ARIA roving tabindex keyboard support.
 *
 * ```html
 * <ngxsmk-tabs [(value)]="active">
 *   <ngxsmk-tab value="overview" label="Overview">…</ngxsmk-tab>
 *   <ngxsmk-tab value="settings" label="Settings">…</ngxsmk-tab>
 * </ngxsmk-tabs>
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-tabs',
  imports: [NgTemplateOutlet],
  template: `
    <!-- eslint-disable-next-line @angular-eslint/template/interactive-supports-focus -->
    <div
      class="ngxsmk-tabs__list"
      [class.ngxsmk-tabs__list--vertical]="orientation() === 'vertical'"
      [attr.aria-orientation]="orientation()"
      role="tablist"
      (keydown)="onKeydown($event)"
    >
      @for (tab of tabs(); track tab.value()) {
        <button
          type="button"
          role="tab"
          class="ngxsmk-tabs__trigger"
          [id]="triggerId(tab.value())"
          [attr.aria-selected]="tab.value() === activeValue()"
          [attr.aria-controls]="panelId(tab.value())"
          [attr.data-active]="tab.value() === activeValue() ? '' : null"
          [disabled]="tab.disabled()"
          [tabindex]="tab.value() === activeValue() ? 0 : -1"
          (click)="select(tab.value())"
        >
          {{ tab.label() }}
        </button>
      }
    </div>
    @if (activeTab(); as tab) {
      <div
        class="ngxsmk-tabs__panel"
        role="tabpanel"
        tabindex="0"
        [id]="panelId(tab.value())"
        [attr.aria-labelledby]="triggerId(tab.value())"
      >
        <ng-container [ngTemplateOutlet]="tab.content()" />
      </div>
    }
  `,
  host: {
    class: 'ngxsmk-tabs',
    '[class.ngxsmk-tabs--vertical]': 'orientation() === "vertical"',
  },
  styles: `
    :host {
      display: block;
      font-family: var(--ngxsmk-font-sans);
    }

    :host(.ngxsmk-tabs--vertical) {
      display: flex;
      gap: var(--ngxsmk-space-4);
    }

    .ngxsmk-tabs__list {
      display: flex;
      gap: var(--ngxsmk-space-1);
      border-bottom: 1px solid var(--ngxsmk-color-outline);
    }

    .ngxsmk-tabs__list--vertical {
      flex-direction: column;
      border-bottom: none;
      border-right: 1px solid var(--ngxsmk-color-outline);
      min-width: 140px;
    }

    @media (max-width: 768px) {
      .ngxsmk-tabs__list:not(.ngxsmk-tabs__list--vertical) {
        overflow-x: auto;
        flex-wrap: nowrap;
      }
    }

    .ngxsmk-tabs__trigger {
      padding: var(--ngxsmk-space-2) var(--ngxsmk-space-4);
      margin-bottom: -1px;
      border: none;
      border-bottom: 2px solid transparent;
      background: transparent;
      color: var(--ngxsmk-color-on-surface-variant);
      font-family: inherit;
      font-size: var(--ngxsmk-text-label-lg-size);
      font-weight: var(--ngxsmk-text-label-lg-weight);
      line-height: var(--ngxsmk-text-label-lg-line);
      cursor: pointer;
      transition:
        color var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out),
        border-color var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out);
    }

    .ngxsmk-tabs__list--vertical .ngxsmk-tabs__trigger {
      margin-bottom: 0;
      margin-right: -1px;
      border-bottom: none;
      border-right: 2px solid transparent;
      text-align: left;
    }

    .ngxsmk-tabs__trigger:hover {
      color: var(--ngxsmk-color-on-surface);
    }

    .ngxsmk-tabs__trigger[data-active] {
      color: var(--ngxsmk-color-primary);
      border-bottom-color: var(--ngxsmk-color-primary);
    }

    .ngxsmk-tabs__list--vertical .ngxsmk-tabs__trigger[data-active] {
      border-bottom-color: transparent;
      border-right-color: var(--ngxsmk-color-primary);
    }

    .ngxsmk-tabs__trigger:disabled {
      opacity: var(--ngxsmk-opacity-disabled);
      cursor: not-allowed;
    }

    .ngxsmk-tabs__trigger:focus-visible {
      outline: none;
      box-shadow: var(--ngxsmk-focus-ring);
      border-radius: var(--ngxsmk-radius-sm);
    }

    .ngxsmk-tabs__panel {
      padding-top: var(--ngxsmk-space-4);
      color: var(--ngxsmk-color-on-surface);
      font-size: var(--ngxsmk-text-body-md-size);
      line-height: var(--ngxsmk-text-body-md-line);
    }

    :host(.ngxsmk-tabs--vertical) .ngxsmk-tabs__panel {
      padding-top: 0;
      flex: 1;
    }

    .ngxsmk-tabs__panel:focus-visible {
      outline: none;
      box-shadow: var(--ngxsmk-focus-ring);
      border-radius: var(--ngxsmk-radius-sm);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkTabs {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly baseId = ngxsmkUniqueId('ngxsmk-tabs');

  /** Selected tab value; defaults to the first enabled tab. */
  readonly value = model('');
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
  readonly activationMode = input<'automatic' | 'manual'>('automatic');

  protected readonly tabs = contentChildren(NgxsmkTab);

  protected readonly activeValue = computed(() => {
    const explicit = this.value();
    const tabs = this.tabs();
    if (explicit && tabs.some((t) => t.value() === explicit)) {
      return explicit;
    }
    return tabs.find((t) => !t.disabled())?.value() ?? '';
  });

  protected readonly activeTab = computed(() =>
    this.tabs().find((t) => t.value() === this.activeValue()),
  );

  protected triggerId(value: string): string {
    return `${this.baseId}-trigger-${value}`;
  }
  protected panelId(value: string): string {
    return `${this.baseId}-panel-${value}`;
  }

  protected select(value: string): void {
    this.value.set(value);
  }

  protected onKeydown(event: KeyboardEvent): void {
    const enabled = this.tabs().filter((t) => !t.disabled());
    if (enabled.length === 0) {
      return;
    }
    const current = enabled.findIndex((t) => t.value() === this.activeValue());

    const isNext =
      (this.orientation() === 'horizontal' && event.key === 'ArrowRight') ||
      (this.orientation() === 'vertical' && event.key === 'ArrowDown');

    const isPrev =
      (this.orientation() === 'horizontal' && event.key === 'ArrowLeft') ||
      (this.orientation() === 'vertical' && event.key === 'ArrowUp');

    let next: number;
    if (isNext) {
      next = (current + 1) % enabled.length;
    } else if (isPrev) {
      next = (current - 1 + enabled.length) % enabled.length;
    } else if (event.key === 'Home') {
      next = 0;
    } else if (event.key === 'End') {
      next = enabled.length - 1;
    } else {
      return;
    }
    event.preventDefault();

    const value = enabled[next].value();
    if (this.activationMode() === 'automatic') {
      this.select(value);
    }
    const triggers = this.host.nativeElement.querySelectorAll<HTMLElement>('[role="tab"]');
    for (const trigger of Array.from(triggers)) {
      if (trigger.id === this.triggerId(value)) {
        trigger.focus();
        break;
      }
    }
  }
}
