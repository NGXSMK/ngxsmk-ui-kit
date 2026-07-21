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
    '[attr.id]': 'id()',
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
      width: 100%;
      box-sizing: border-box;
      padding: var(--ngxsmk-space-2) var(--ngxsmk-space-3);
      border: 1px solid var(--ngxsmk-color-outline-strong);
      border-radius: var(--ngxsmk-radius-base);
      background: var(--ngxsmk-color-surface);
      color: var(--ngxsmk-color-on-surface);
      font-family: var(--ngxsmk-font-sans);
      font-size: var(--ngxsmk-text-body-md-size);
      line-height: var(--ngxsmk-text-body-md-line);
      transition:
        border-color var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out),
        box-shadow var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out);
    }
    .ngxsmk-date-picker__control::placeholder {
      color: var(--ngxsmk-color-on-surface-variant);
    }
    .ngxsmk-date-picker__control:focus-visible {
      outline: none;
      border-color: var(--ngxsmk-color-ring);
      box-shadow: var(--ngxsmk-focus-ring);
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
  readonly value = model('');
  readonly min = input('');
  readonly max = input('');
  readonly placeholder = input('');
  readonly disabled = input(false, { transform: booleanAttribute });

  readonly id = input(ngxsmkUniqueId('ngxsmk-date-picker'));
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
