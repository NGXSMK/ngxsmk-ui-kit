import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  booleanAttribute,
  input,
  model,
  output,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ngxsmkUniqueId } from '@ngxsmk/core/util';
import { CvaBase } from '@ngxsmk/cdk/cva-base';
import { NGXSMK_FORM_FIELD_CONTROL, NgxsmkFormFieldControl } from '@ngxsmk/core/form-field';

@Component({
  standalone: true,
  selector: 'ngxsmk-slider',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxsmkSlider),
      multi: true,
    },
    {
      provide: NGXSMK_FORM_FIELD_CONTROL,
      useExisting: forwardRef(() => NgxsmkSlider),
    },
  ],
  template: `
    <input
      type="range"
      class="ngxsmk-slider__control"
      [id]="id()"
      [min]="min()"
      [max]="max()"
      [step]="step()"
      [value]="value()"
      [disabled]="isDisabled()"
      [attr.aria-label]="ariaLabel() || null"
      [attr.aria-valuetext]="ariaValueText() || null"
      [attr.aria-invalid]="ariaInvalid() ? 'true' : null"
      [attr.aria-describedby]="ariaDescribedby()"
      (input)="onInput($event)"
      (blur)="onBlur()"
    />
  `,
  host: {
    class: 'ngxsmk-slider',
    '[attr.data-disabled]': 'isDisabled() ? "" : null',
    '[attr.data-invalid]': 'ariaInvalid() ? "" : null',
  },
  styles: `
    :host {
      display: block;
      font-family: var(--ngxsmk-font-sans);
      padding: var(--ngxsmk-space-2) 0;
    }
    .ngxsmk-slider__control {
      -webkit-appearance: none;
      appearance: none;
      width: 100%;
      height: 0.375rem;
      border-radius: var(--ngxsmk-radius-full);
      background: var(--ngxsmk-color-surface-variant);
      outline: none;
      cursor: pointer;
    }
    .ngxsmk-slider__control::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 1.125rem;
      height: 1.125rem;
      border-radius: 50%;
      background: var(--ngxsmk-color-primary);
      border: 2px solid var(--ngxsmk-color-surface);
      box-shadow: var(--ngxsmk-shadow-sm);
      cursor: pointer;
      transition: transform var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out);
    }
    .ngxsmk-slider__control::-webkit-slider-thumb:hover {
      transform: scale(1.15);
    }
    .ngxsmk-slider__control::-moz-range-thumb {
      width: 1.125rem;
      height: 1.125rem;
      border-radius: 50%;
      background: var(--ngxsmk-color-primary);
      border: 2px solid var(--ngxsmk-color-surface);
      box-shadow: var(--ngxsmk-shadow-sm);
      cursor: pointer;
    }
    .ngxsmk-slider__control:focus-visible {
      outline: none;
      box-shadow: var(--ngxsmk-focus-ring);
    }
    :host([data-disabled]) .ngxsmk-slider__control {
      opacity: var(--ngxsmk-opacity-disabled);
      cursor: not-allowed;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkSlider extends CvaBase<number> implements NgxsmkFormFieldControl {
  readonly min = input(0);
  readonly max = input(100);
  readonly step = input(1);
  readonly value = model(0);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly id = input(ngxsmkUniqueId('ngxsmk-slider'));

  /** Accessible name for the slider — required when not wrapped in a <label>. */
  readonly ariaLabel = input('');
  /** Human-readable value description, e.g. 'Medium' instead of '50'. */
  readonly ariaValueText = input('');
  readonly ariaInvalid = model(false);
  readonly ariaDescribedby = model<string | null>(null);

  readonly changed = output<number>();

  protected inputDisabled(): boolean {
    return this.disabled();
  }

  writeValue(val: unknown): void {
    const num = typeof val === 'number' ? val : parseFloat(val as string) || 0;
    this.value.set(num);
  }

  protected onBlur(): void {
    this.emitTouched();
  }

  protected onInput(event: Event): void {
    const val = parseFloat((event.target as HTMLInputElement).value);
    this.value.set(val);
    this.emitChange(val);
    this.changed.emit(val);
  }
}
