import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  input,
  model,
  output,
} from '@angular/core';

export interface NgxsmkChipGroupOption {
  value: string;
  label: string;
  disabled?: boolean;
}

/**
 * Toggleable chip group for single- or multi-select from a fixed option set.
 * Prefer this over the deprecated `ngxsmk-selector`.
 *
 * ```html
 * <ngxsmk-chip-group
 *   [options]="[{ value: 'a', label: 'Alpha' }, { value: 'b', label: 'Beta' }]"
 *   [(value)]="selected"
 *   [multiple]="true"
 * />
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-chip-group',
  template: `
    <div
      class="ngxsmk-chip-group__list"
      role="group"
      [attr.aria-label]="ariaLabel() || null"
      [attr.aria-disabled]="disabled() ? 'true' : null"
    >
      @for (opt of options(); track opt.value) {
        <button
          type="button"
          class="ngxsmk-chip-group__chip"
          [attr.data-selected]="isSelected(opt.value) ? '' : null"
          [disabled]="disabled() || !!opt.disabled"
          [attr.aria-pressed]="isSelected(opt.value)"
          (click)="toggle(opt.value)"
        >
          {{ opt.label }}
        </button>
      }
    </div>
  `,
  host: {
    class: 'ngxsmk-chip-group',
    '[attr.data-disabled]': 'disabled() ? "" : null',
  },
  styles: `
    :host {
      display: block;
      font-family: var(--ngxsmk-font-sans);
    }

    :host([data-disabled]) {
      opacity: var(--ngxsmk-opacity-disabled, 0.5);
    }

    .ngxsmk-chip-group__list {
      display: flex;
      flex-wrap: wrap;
      gap: var(--ngxsmk-space-2);
    }

    .ngxsmk-chip-group__chip {
      padding: var(--ngxsmk-space-1) var(--ngxsmk-space-3);
      border-radius: var(--ngxsmk-radius-full);
      border: 1px solid var(--ngxsmk-color-outline);
      background: transparent;
      color: var(--ngxsmk-color-on-surface);
      font-family: inherit;
      font-size: var(--ngxsmk-text-body-sm-size);
      cursor: pointer;
      transition:
        color var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out),
        background-color var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out),
        border-color var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out),
        box-shadow var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out);
    }

    .ngxsmk-chip-group__chip[data-selected] {
      background: var(--ngxsmk-color-primary-container);
      border-color: var(--ngxsmk-color-primary);
      color: var(--ngxsmk-color-on-primary-container);
    }

    .ngxsmk-chip-group__chip:hover:not(:disabled):not([data-selected]) {
      border-color: var(--ngxsmk-color-primary);
    }

    .ngxsmk-chip-group__chip:focus-visible {
      outline: none;
      box-shadow: var(--ngxsmk-focus-ring);
    }

    .ngxsmk-chip-group__chip:disabled {
      cursor: not-allowed;
      opacity: var(--ngxsmk-opacity-disabled, 0.5);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkChipGroup {
  readonly options = input.required<NgxsmkChipGroupOption[]>();
  /** Selected option values. */
  readonly value = model<string[]>([]);
  readonly multiple = input(true, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly ariaLabel = input('');
  readonly changed = output<string[]>();

  protected isSelected(v: string): boolean {
    return this.value().includes(v);
  }

  protected toggle(v: string): void {
    if (this.disabled()) return;
    const current = [...this.value()];
    if (this.isSelected(v)) {
      this.value.set(current.filter((x) => x !== v));
    } else if (this.multiple()) {
      this.value.set([...current, v]);
    } else {
      this.value.set([v]);
    }
    this.changed.emit(this.value());
  }
}
