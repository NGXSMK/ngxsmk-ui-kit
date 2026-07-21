import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';

export interface SegmentedOption {
  value: string;
  label: string;
  disabled?: boolean;
}

@Component({
  standalone: true,
  selector: 'ngxsmk-segmented-control',
  template: `
    <div class="ngxsmk-segmented-control__group" role="radiogroup">
      @for (opt of options(); track opt.value) {
        <button
          type="button"
          class="ngxsmk-segmented-control__item"
          role="radio"
          [attr.aria-checked]="value() === opt.value"
          [disabled]="opt.disabled"
          (click)="select(opt.value)"
        >
          {{ opt.label }}
        </button>
      }
    </div>
  `,
  host: { class: 'ngxsmk-segmented-control' },
  styles: `
    :host {
      display: inline-flex;
      font-family: var(--ngxsmk-font-sans);
    }
    .ngxsmk-segmented-control__group {
      display: flex;
      background: var(--ngxsmk-color-surface-variant);
      padding: var(--ngxsmk-space-1);
      border-radius: var(--ngxsmk-radius-lg);
      gap: var(--ngxsmk-space-1);
    }
    .ngxsmk-segmented-control__item {
      padding: var(--ngxsmk-space-1-5) var(--ngxsmk-space-3);
      border: none;
      border-radius: var(--ngxsmk-radius-md);
      background: transparent;
      color: var(--ngxsmk-color-on-surface-variant);
      font-size: var(--ngxsmk-text-body-sm-size);
      font-weight: 500;
      cursor: pointer;
      transition:
        color var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out),
        background-color var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out),
        border-color var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out),
        box-shadow var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out),
        transform var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out),
        opacity var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out);
    }
    .ngxsmk-segmented-control__item[aria-checked='true'] {
      background: var(--ngxsmk-color-surface);
      color: var(--ngxsmk-color-on-surface);
      box-shadow: var(--ngxsmk-shadow-sm);
    }
    .ngxsmk-segmented-control__item:hover:not([disabled]) {
      color: var(--ngxsmk-color-on-surface);
    }
    .ngxsmk-segmented-control__item:focus-visible {
      outline: none;
      box-shadow: var(--ngxsmk-focus-ring);
      position: relative;
      z-index: 1;
    }
    .ngxsmk-segmented-control__item[disabled] {
      opacity: var(--ngxsmk-opacity-disabled);
      cursor: not-allowed;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkSegmentedControl {
  readonly options = input.required<SegmentedOption[]>();
  readonly value = model('');
  readonly changed = output<string>();

  select(v: string): void {
    this.value.set(v);
    this.changed.emit(v);
  }
}
