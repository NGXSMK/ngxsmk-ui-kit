import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
  model,
  output,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ngxsmkUniqueId } from '@ngxsmk/core/util';
import { NGXSMK_FORM_FIELD_CONTROL, NgxsmkFormFieldControl } from '@ngxsmk/core/form-field';
import { CvaBase } from '@ngxsmk/cdk/cva-base';

/**
 * Time-only form control (`HH:MM` / `HH:MM:SS`) with form-field + CVA support.
 *
 * ```html
 * <ngxsmk-form-field label="Start">
 *   <ngxsmk-time-picker [(value)]="start" step="60" />
 * </ngxsmk-form-field>
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-time-picker',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxsmkTimePicker),
      multi: true,
    },
    {
      provide: NGXSMK_FORM_FIELD_CONTROL,
      useExisting: forwardRef(() => NgxsmkTimePicker),
    },
  ],
  template: `
    <input
      type="time"
      class="ngxsmk-time-picker__control"
      [attr.id]="id()"
      [attr.aria-invalid]="ariaInvalid() ? 'true' : null"
      [attr.aria-describedby]="ariaDescribedby()"
      [disabled]="isDisabled()"
      [value]="value()"
      [min]="min()"
      [max]="max()"
      [step]="step()"
      [placeholder]="placeholder()"
      (input)="onInput($event)"
      (blur)="onBlur()"
    />
  `,
  host: {
    class: 'ngxsmk-time-picker',
    '[attr.aria-invalid]': "ariaInvalid() ? 'true' : null",
    '[attr.aria-describedby]': 'ariaDescribedby()',
  },
  styles: `
    :host {
      display: block;
      font-family: var(--ngxsmk-font-sans);
    }
    .ngxsmk-time-picker__control {
      display: block;
      width: 100%;
      box-sizing: border-box;
      height: var(--ngxsmk-input-height, var(--ngxsmk-control-height, 2.5rem));
      padding: 0 var(--ngxsmk-input-padding-inline, var(--ngxsmk-space-3));
      border: 1px solid var(--ngxsmk-input-border, var(--ngxsmk-color-outline-strong));
      border-radius: var(--ngxsmk-input-radius, var(--ngxsmk-radius-base));
      background: var(--ngxsmk-input-bg, var(--ngxsmk-color-surface));
      color: var(--ngxsmk-input-color, var(--ngxsmk-color-on-surface));
      font-family: var(--ngxsmk-font-sans);
      font-size: var(--ngxsmk-text-body-md-size);
      line-height: var(--ngxsmk-text-body-md-line);
      transition:
        border-color var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out),
        box-shadow var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out);
    }
    .ngxsmk-time-picker__control:hover:not(:disabled):not([aria-invalid='true']) {
      border-color: var(--ngxsmk-color-ring);
    }
    .ngxsmk-time-picker__control:focus-visible {
      outline: none;
      border-color: var(--ngxsmk-color-ring);
      box-shadow: var(--ngxsmk-focus-ring);
    }
    .ngxsmk-time-picker__control:disabled {
      opacity: var(--ngxsmk-opacity-disabled);
      cursor: not-allowed;
      background: var(--ngxsmk-color-surface-variant);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkTimePicker extends CvaBase<string> implements NgxsmkFormFieldControl {
  readonly value = model('');
  readonly min = input('');
  readonly max = input('');
  /** Step in seconds (native `input[type=time]`). Default 60 = minute precision. */
  readonly step = input('60');
  readonly placeholder = input('');
  readonly disabled = input(false, { transform: booleanAttribute });

  readonly id = input(ngxsmkUniqueId('ngxsmk-time-picker'));
  readonly ariaInvalid = model(false);
  readonly ariaDescribedby = model<string | null>(null);

  readonly changed = output<string>();

  protected inputDisabled(): boolean {
    return this.disabled();
  }

  protected onInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.value.set(val);
    this.changed.emit(val);
    this.emitChange(val);
  }

  protected onBlur(): void {
    this.emitTouched();
  }

  writeValue(val: string): void {
    this.value.set(val || '');
  }
}
