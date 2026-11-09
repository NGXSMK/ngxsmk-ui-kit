import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  inject,
  input,
  model,
  output,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ngxsmkUniqueId } from '@ngxsmk/core/util';
import {
  NGXSMK_FORM_FIELD_CONTROL,
  NgxsmkFormField,
  NgxsmkFormFieldControl,
} from '@ngxsmk/core/form-field';
import { CvaBase } from '@ngxsmk/cdk/cva-base';

/**
 * Native date input with keyboard editing and a platform calendar.
 *
 * ```html
 * <ngxsmk-form-field label="Appointment date">
 *   <ngxsmk-date-picker [(value)]="appointmentDate" />
 * </ngxsmk-form-field>
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-date-picker',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxsmkDatePicker),
      multi: true,
    },
    {
      provide: NGXSMK_FORM_FIELD_CONTROL,
      useExisting: forwardRef(() => NgxsmkDatePicker),
    },
  ],
  template: `
    <input
      type="date"
      class="ngxsmk-date-picker__control"
      [attr.id]="id()"
      [attr.aria-label]="ariaLabel() ?? (field?.label() ? null : placeholder() || 'Date')"
      [attr.aria-invalid]="ariaInvalid() ? 'true' : null"
      [attr.aria-describedby]="ariaDescribedby()"
      [disabled]="isDisabled()"
      [value]="value()"
      [min]="min()"
      [max]="max()"
      [placeholder]="placeholder()"
      (input)="onInput($event)"
      (blur)="onBlur()"
    />
  `,
  host: {
    class: 'ngxsmk-date-picker',
    '[attr.id]': 'null',
    '[attr.aria-invalid]': "ariaInvalid() ? 'true' : null",
    '[attr.aria-describedby]': 'ariaDescribedby()',
  },
  styles: `
    :host {
      display: block;
      font-family: var(--ngxsmk-font-sans);
    }
    .ngxsmk-date-picker__control {
      display: block;
      min-inline-size: 0;
      width: 100%;
      box-sizing: border-box;
      height: var(--ngxsmk-input-height, var(--ngxsmk-control-height));
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
    .ngxsmk-date-picker__control::-webkit-calendar-picker-indicator {
      padding: var(--ngxsmk-space-2);
      margin-inline-end: calc(-1 * var(--ngxsmk-space-2));
      border-radius: var(--ngxsmk-radius-sm);
      cursor: pointer;
    }
    .ngxsmk-date-picker__control:not(:disabled)::-webkit-calendar-picker-indicator:hover {
      background-color: var(--ngxsmk-color-surface-variant);
    }
    .ngxsmk-date-picker__control:hover:not(:disabled):not([aria-invalid='true']) {
      border-color: var(--ngxsmk-color-ring);
    }
    .ngxsmk-date-picker__control:focus-visible {
      outline: none;
      border-color: var(--ngxsmk-color-ring);
      box-shadow: var(--ngxsmk-focus-ring);
    }
    .ngxsmk-date-picker__control[aria-invalid='true'],
    .ngxsmk-date-picker__control:user-invalid {
      border-color: var(--ngxsmk-color-error);
    }
    .ngxsmk-date-picker__control:disabled {
      opacity: var(--ngxsmk-opacity-disabled);
      cursor: not-allowed;
      background: var(--ngxsmk-color-surface-variant);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkDatePicker extends CvaBase<string> implements NgxsmkFormFieldControl {
  protected readonly field = inject(NgxsmkFormField, { optional: true });
  readonly value = model('');
  readonly min = input('');
  readonly max = input('');
  readonly placeholder = input('');
  readonly disabled = input(false, { transform: booleanAttribute });

  readonly id = input(ngxsmkUniqueId('ngxsmk-date-picker'));
  readonly ariaLabel = input<string | null>(null);
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
