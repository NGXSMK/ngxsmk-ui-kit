import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  model,
  signal,
} from '@angular/core';

export interface NgxsmkDropdownMenuItem {
  label: string;
  action: () => void;
  divider?: boolean;
  disabled?: boolean;
}

@Component({
  selector: 'ngxsmk-dropdown-menu',
  template: `
    <div class="ngxsmk-dropdown-menu__trigger" (click)="toggle()">
      <ng-content select="[ngxsmkDropdownTrigger]" />
    </div>
    @if (open()) {
      <div class="ngxsmk-dropdown-menu__list" (click)="onClick($event)">
        @for (item of items(); track item.label) {
          @if (item.divider) {
            <div class="ngxsmk-dropdown-menu__divider"></div>
          }
          <button
            type="button"
            class="ngxsmk-dropdown-menu__item"
            [disabled]="item.disabled"
            data-action
          >
            {{ item.label }}
          </button>
        }
      </div>
    }
  `,
  host: {
    class: 'ngxsmk-dropdown-menu',
  },
  styles: `
    :host {
      display: inline-block;
      position: relative;
      font-family: var(--ngxsmk-font-sans);
    }

    .ngxsmk-dropdown-menu__trigger {
      display: inline-flex;
    }

    .ngxsmk-dropdown-menu__list {
      position: absolute;
      top: calc(100% + var(--ngxsmk-space-1));
      right: 0;
      z-index: var(--ngxsmk-z-dropdown, 1000);
      min-width: 10rem;
      padding: var(--ngxsmk-space-1);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-md);
      background: var(--ngxsmk-color-surface);
      color: var(--ngxsmk-color-on-surface);
      box-shadow: var(--ngxsmk-shadow-lg);
    }

    .ngxsmk-dropdown-menu__item {
      display: block;
      width: 100%;
      padding: var(--ngxsmk-space-1-5) var(--ngxsmk-space-3);
      border: none;
      border-radius: var(--ngxsmk-radius-sm);
      background: transparent;
      color: var(--ngxsmk-color-on-surface);
      font-family: inherit;
      font-size: var(--ngxsmk-text-body-sm-size);
      line-height: var(--ngxsmk-text-body-sm-line);
      text-align: left;
      cursor: pointer;
      white-space: nowrap;
    }

    .ngxsmk-dropdown-menu__item:hover:not(:disabled) {
      background: var(--ngxsmk-color-surface-hover);
    }

    .ngxsmk-dropdown-menu__item:focus-visible {
      outline: 2px solid var(--ngxsmk-color-ring);
      outline-offset: -2px;
    }

    .ngxsmk-dropdown-menu__item:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .ngxsmk-dropdown-menu__divider {
      height: 1px;
      margin: var(--ngxsmk-space-1) 0;
      background: var(--ngxsmk-color-outline);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkDropdownMenu {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly items = input.required<NgxsmkDropdownMenuItem[]>();
  readonly open = model(false);

  toggle(): void {
    this.open.update((v) => !v);
  }

  protected onClick(event: Event): void {
    const target = (event.target as HTMLElement).closest('[data-action]') as HTMLElement | null;
    if (!target) return;
    const idx = Array.from(
      this.host.nativeElement.querySelectorAll('[data-action]')
    ).indexOf(target);
    if (idx >= 0) {
      const item = this.items()[idx];
      if (!item.disabled) {
        item.action();
      }
    }
    this.open.set(false);
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (this.open() && !this.host.nativeElement.contains(event.target as Node)) {
      this.open.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    this.open.set(false);
  }
}
