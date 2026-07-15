import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { ngxsmkUniqueId } from '@ngxsmk/core/util';

/**
 * Expandable section container.
 *
 * ```html
 * <ngxsmk-accordion>
 *   <ngxsmk-accordion-item label="Is it accessible?">Yes.</ngxsmk-accordion-item>
 *   <ngxsmk-accordion-item label="Is it styled?">Via tokens.</ngxsmk-accordion-item>
 * </ngxsmk-accordion>
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-accordion',
  template: `<ng-content />`,
  host: { class: 'ngxsmk-accordion' },
  styles: `
    :host {
      display: block;
      border: 1px solid var(--ngxsmk-accordion-border-color, var(--ngxsmk-color-outline));
      border-radius: var(--ngxsmk-accordion-radius, var(--ngxsmk-radius-lg));
      background: var(--ngxsmk-accordion-bg, var(--ngxsmk-color-surface));
      overflow: hidden;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkAccordion {
  /** Allow several items open at once. */
  readonly multiple = input(false, { transform: booleanAttribute });

  private readonly expandedValues = signal<ReadonlySet<string>>(new Set());

  isExpanded(value: string): boolean {
    return this.expandedValues().has(value);
  }

  toggle(value: string): void {
    this.expandedValues.update((current) => {
      const next = new Set(current);
      if (next.has(value)) {
        next.delete(value);
      } else {
        if (!this.multiple()) {
          next.clear();
        }
        next.add(value);
      }
      return next;
    });
  }
}

@Component({
  standalone: true,
  selector: 'ngxsmk-accordion-item',
  template: `
    <h3 class="ngxsmk-accordion-item__heading">
      <button
        type="button"
        class="ngxsmk-accordion-item__trigger"
        [id]="triggerId"
        [disabled]="disabled()"
        [attr.aria-expanded]="expanded()"
        [attr.aria-controls]="panelId"
        (click)="accordion.toggle(itemValue())"
      >
        <span>{{ label() }}</span>
        <svg
          class="ngxsmk-accordion-item__chevron"
          viewBox="0 0 16 16"
          width="14"
          height="14"
          aria-hidden="true"
        >
          <path
            d="M4 6l4 4 4-4"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </h3>
    <div
      class="ngxsmk-accordion-item__region"
      role="region"
      [id]="panelId"
      [attr.aria-labelledby]="triggerId"
    >
      <div class="ngxsmk-accordion-item__content"><ng-content /></div>
    </div>
  `,
  host: {
    class: 'ngxsmk-accordion-item',
    '[attr.data-expanded]': 'expanded() ? "" : null',
    '[attr.data-disabled]': 'disabled() ? "" : null',
  },
  styles: `
    :host {
      display: block;
      font-family: var(--ngxsmk-font-sans);
    }

    :host(:not(:last-child)) {
      border-bottom: 1px solid var(--ngxsmk-accordion-border-color, var(--ngxsmk-color-outline));
    }

    .ngxsmk-accordion-item__heading {
      margin: 0;
    }

    .ngxsmk-accordion-item__trigger {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--ngxsmk-space-3);
      width: 100%;
      padding: var(--ngxsmk-space-4);
      border: none;
      background: transparent;
      color: var(--ngxsmk-color-on-surface);
      font-family: inherit;
      font-size: var(--ngxsmk-text-body-md-size);
      font-weight: 500;
      line-height: var(--ngxsmk-text-body-md-line);
      text-align: start;
      cursor: pointer;
    }

    .ngxsmk-accordion-item__trigger:hover {
      background: var(--ngxsmk-color-surface-hover);
    }

    .ngxsmk-accordion-item__trigger:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .ngxsmk-accordion-item__trigger:focus-visible {
      outline: 2px solid var(--ngxsmk-color-ring);
      outline-offset: -2px;
    }

    .ngxsmk-accordion-item__chevron {
      flex-shrink: 0;
      transition: transform var(--ngxsmk-duration-normal) var(--ngxsmk-ease-out);
    }

    :host([data-expanded]) .ngxsmk-accordion-item__chevron {
      transform: rotate(180deg);
    }

    .ngxsmk-accordion-item__region {
      display: grid;
      grid-template-rows: 0fr;
      transition: grid-template-rows var(--ngxsmk-duration-normal) var(--ngxsmk-ease-out);
    }

    :host([data-expanded]) .ngxsmk-accordion-item__region {
      grid-template-rows: 1fr;
    }

    .ngxsmk-accordion-item__content {
      overflow: hidden;
      min-height: 0;
      padding-inline: var(--ngxsmk-space-4);
      color: var(--ngxsmk-color-on-surface-variant);
      font-size: var(--ngxsmk-text-body-md-size);
      line-height: var(--ngxsmk-text-body-md-line);
    }

    :host([data-expanded]) .ngxsmk-accordion-item__content {
      padding-bottom: var(--ngxsmk-space-4);
    }

    @media (prefers-reduced-motion: reduce) {
      .ngxsmk-accordion-item__region,
      .ngxsmk-accordion-item__chevron {
        transition: none;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkAccordionItem {
  protected readonly accordion = inject(NgxsmkAccordion);

  readonly label = input.required<string>();
  /** Identity within the accordion; defaults to a generated id. */
  readonly value = input('');
  readonly disabled = input(false, { transform: booleanAttribute });

  private readonly generatedValue = ngxsmkUniqueId('ngxsmk-accordion-item');
  protected readonly itemValue = computed(() => this.value() || this.generatedValue);

  protected readonly triggerId = ngxsmkUniqueId('ngxsmk-accordion-trigger');
  protected readonly panelId = ngxsmkUniqueId('ngxsmk-accordion-panel');

  protected readonly expanded = computed(() => this.accordion.isExpanded(this.itemValue()));
}
