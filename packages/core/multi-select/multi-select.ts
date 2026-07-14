import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  model,
  output,
  signal,
  booleanAttribute,
} from '@angular/core';

@Component({
  selector: 'ngxsmk-multi-select',
  standalone: true,
  template: `
    <div
      #trigger
      class="ngxsmk-multi-select__trigger"
      [class.ngxsmk-multi-select__trigger--open]="open()"
      [class.ngxsmk-multi-select__trigger--disabled]="disabled()"
      (click)="toggle()"
    >
      <div class="ngxsmk-multi-select__tags">
        @for (s of selectedValues(); track s) {
          <span class="ngxsmk-multi-select__tag" (click)="$event.stopPropagation()">
            <span class="ngxsmk-multi-select__tag-label">{{ labelFor(s) }}</span>
            <button
              type="button"
              class="ngxsmk-multi-select__tag-remove"
              [disabled]="disabled()"
              (click)="remove(s)"
              aria-label="Remove"
            >
              &times;
            </button>
          </span>
        }
        @if (selectedValues().length === 0) {
          <span class="ngxsmk-multi-select__placeholder">
            {{ placeholder() || 'Select options...' }}
          </span>
        }
      </div>
      <svg
        class="ngxsmk-multi-select__chevron"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>

    @if (open()) {
      <ul class="ngxsmk-multi-select__listbox" role="listbox">
        @for (opt of remaining(); track opt.value) {
          <li
            role="option"
            class="ngxsmk-multi-select__option"
            (click)="selectOption(opt)"
          >
            {{ opt.label }}
          </li>
        }
        @if (remaining().length === 0) {
          <li class="ngxsmk-multi-select__empty">No options left</li>
        }
      </ul>
    }
  `,
  host: {
    class: 'ngxsmk-multi-select',
    '[attr.data-disabled]': 'disabled() ? "" : null',
  },
  styles: `
    :host {
      position: relative;
      display: block;
      width: 100%;
      font-family: var(--ngxsmk-font-sans);
      font-size: var(--ngxsmk-text-body-md-size);
      color: var(--ngxsmk-color-on-surface);
    }

    .ngxsmk-multi-select__trigger {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--ngxsmk-space-2);
      width: 100%;
      box-sizing: border-box;
      min-height: var(--ngxsmk-control-height);
      padding: var(--ngxsmk-space-1-5) var(--ngxsmk-space-3);
      border: 1px solid var(--ngxsmk-color-outline-strong);
      border-radius: var(--ngxsmk-radius-base);
      background: var(--ngxsmk-color-surface);
      cursor: pointer;
      transition: border-color var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out);
    }

    .ngxsmk-multi-select__trigger:hover {
      border-color: var(--ngxsmk-color-outline);
    }

    .ngxsmk-multi-select__trigger--open {
      border-color: var(--ngxsmk-color-primary);
      box-shadow: 0 0 0 2px var(--ngxsmk-color-primary-container);
    }

    .ngxsmk-multi-select__trigger--disabled {
      opacity: var(--ngxsmk-button-disabled-opacity, 0.5);
      cursor: not-allowed;
      pointer-events: none;
    }

    .ngxsmk-multi-select__tags {
      display: flex;
      flex-wrap: wrap;
      gap: var(--ngxsmk-space-1-5);
      flex: 1;
      align-items: center;
    }

    .ngxsmk-multi-select__placeholder {
      color: var(--ngxsmk-color-on-surface-variant);
      user-select: none;
    }

    .ngxsmk-multi-select__tag {
      display: inline-flex;
      align-items: center;
      gap: var(--ngxsmk-space-1);
      padding: var(--ngxsmk-space-0-5) var(--ngxsmk-space-2);
      background: var(--ngxsmk-color-primary-container);
      color: var(--ngxsmk-color-on-primary-container);
      border-radius: var(--ngxsmk-radius-sm);
      font-size: 0.8125rem;
      font-weight: 500;
    }

    .ngxsmk-multi-select__tag-remove {
      border: none;
      background: none;
      cursor: pointer;
      font-size: 1rem;
      line-height: 1;
      padding: 0;
      color: inherit;
      opacity: 0.7;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .ngxsmk-multi-select__tag-remove:hover {
      opacity: 1;
    }

    .ngxsmk-multi-select__chevron {
      flex: 0 0 auto;
      width: 1rem;
      height: 1rem;
      color: var(--ngxsmk-color-on-surface-variant);
      transition: transform var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out);
    }

    .ngxsmk-multi-select__trigger--open .ngxsmk-multi-select__chevron {
      transform: rotate(180deg);
    }

    .ngxsmk-multi-select__listbox {
      position: absolute;
      top: 100%;
      left: 0;
      width: 100%;
      margin-top: var(--ngxsmk-space-1);
      background: var(--ngxsmk-color-surface);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-md);
      box-shadow: var(--ngxsmk-shadow-md);
      z-index: var(--ngxsmk-z-dropdown, 1000);
      max-height: 15rem;
      overflow-y: auto;
      padding: var(--ngxsmk-space-1) 0;
      margin-bottom: 0;
      list-style-type: none;
    }

    .ngxsmk-multi-select__option {
      padding: var(--ngxsmk-space-2) var(--ngxsmk-space-3);
      cursor: pointer;
      transition: background var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out);
      color: var(--ngxsmk-color-on-surface);
    }

    .ngxsmk-multi-select__option:hover {
      background: var(--ngxsmk-color-surface-hover);
    }

    .ngxsmk-multi-select__empty {
      padding: var(--ngxsmk-space-2) var(--ngxsmk-space-3);
      color: var(--ngxsmk-color-on-surface-variant);
      text-align: center;
      font-size: 0.875rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkMultiSelect {
  readonly options = input.required<{ value: string; label: string }[]>();
  readonly value = model<string[]>([]);
  readonly placeholder = input('');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly changed = output<string[]>();

  protected readonly open = signal(false);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  protected selectedValues(): string[] {
    return this.value().filter(v => this.options().some(o => o.value === v));
  }

  protected labelFor(v: string): string {
    return this.options().find(o => o.value === v)?.label || v;
  }

  protected remaining(): { value: string; label: string }[] {
    return this.options().filter(o => !this.value().includes(o.value));
  }

  protected toggle(): void {
    if (this.disabled()) return;
    this.open.set(!this.open());
  }

  protected selectOption(opt: { value: string; label: string }): void {
    this.value.set([...this.value(), opt.value]);
    this.changed.emit(this.value());
  }

  protected remove(v: string): void {
    this.value.set(this.value().filter(x => x !== v));
    this.changed.emit(this.value());
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (this.open() && !this.host.nativeElement.contains(event.target as Node)) {
      this.open.set(false);
    }
  }
}
