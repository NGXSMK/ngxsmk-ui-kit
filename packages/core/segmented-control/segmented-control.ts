import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  forwardRef,
  inject,
  input,
  model,
  output,
  booleanAttribute,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ngxsmkUniqueId } from '@ngxsmk/core/util';
import { CvaBase } from '@ngxsmk/cdk/cva-base';
import { NGXSMK_FORM_FIELD_CONTROL, NgxsmkFormFieldControl } from '@ngxsmk/core/form-field';

export interface NgxsmkSegmentedOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export type SegmentedOption = NgxsmkSegmentedOption;

@Component({
  standalone: true,
  selector: 'ngxsmk-segmented-control',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxsmkSegmentedControl),
      multi: true,
    },
    {
      provide: NGXSMK_FORM_FIELD_CONTROL,
      useExisting: forwardRef(() => NgxsmkSegmentedControl),
    },
  ],
  template: `
    <div
      class="ngxsmk-segmented-control__group"
      role="radiogroup"
      [id]="id()"
      [attr.aria-invalid]="ariaInvalid() ? 'true' : null"
      [attr.aria-describedby]="ariaDescribedby()"
      [attr.aria-disabled]="isDisabled() ? 'true' : null"
      (keydown)="onKeydown($event)"
    >
      @for (opt of options(); track opt.value; let i = $index) {
        <button
          type="button"
          [id]="id() + '-' + i"
          class="ngxsmk-segmented-control__item"
          role="radio"
          [attr.aria-checked]="value() === opt.value"
          [tabindex]="value() === opt.value ? 0 : -1"
          [disabled]="isDisabled() || opt.disabled"
          (click)="select(opt.value)"
        >
          {{ opt.label }}
        </button>
      }
    </div>
  `,
  host: {
    class: 'ngxsmk-segmented-control',
    '[attr.data-disabled]': 'isDisabled() ? "" : null',
    '[attr.data-invalid]': 'ariaInvalid() ? "" : null',
  },
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
      border: 1px solid transparent;
      transition: border-color var(--ngxsmk-duration-fast);
    }
    :host([data-invalid]) .ngxsmk-segmented-control__group {
      border-color: var(--ngxsmk-color-error);
    }
    .ngxsmk-segmented-control__item {
      padding: var(--ngxsmk-space-1-5) var(--ngxsmk-space-3);
      border: none;
      border-radius: var(--ngxsmk-radius-md);
      background: transparent;
      color: var(--ngxsmk-color-on-surface-variant);
      font-size: var(--ngxsmk-text-body-sm-size);
      font-weight: var(--ngxsmk-font-weight-medium, 500);
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
export class NgxsmkSegmentedControl extends CvaBase<string> implements NgxsmkFormFieldControl {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly options = input.required<NgxsmkSegmentedOption[]>();
  readonly value = model('');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly id = input(ngxsmkUniqueId('ngxsmk-segmented-control'));

  readonly ariaInvalid = model(false);
  readonly ariaDescribedby = model<string | null>(null);

  readonly changed = output<string>();

  protected inputDisabled(): boolean {
    return this.disabled();
  }

  writeValue(val: unknown): void {
    this.value.set(typeof val === 'string' ? val : '');
  }

  select(v: string): void {
    if (this.isDisabled()) return;
    this.value.set(v);
    this.emitChange(v);
    this.emitTouched();
    this.changed.emit(v);
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (this.isDisabled()) return;
    const opts = this.options().filter((o) => !o.disabled);
    if (!opts.length) return;

    const currentIdx = opts.findIndex((o) => o.value === this.value());
    let nextIdx = currentIdx;

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      nextIdx = (currentIdx + 1) % opts.length;
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      nextIdx = (currentIdx - 1 + opts.length) % opts.length;
    } else if (event.key === 'Home') {
      event.preventDefault();
      nextIdx = 0;
    } else if (event.key === 'End') {
      event.preventDefault();
      nextIdx = opts.length - 1;
    }

    if (nextIdx !== currentIdx) {
      const nextVal = opts[nextIdx].value;
      this.select(nextVal);
      const allIndex = this.options().findIndex((o) => o.value === nextVal);
      const btn = this.el.nativeElement.querySelector<HTMLButtonElement>(
        `#${this.id()}-${allIndex}`,
      );
      btn?.focus();
    }
  }
}
