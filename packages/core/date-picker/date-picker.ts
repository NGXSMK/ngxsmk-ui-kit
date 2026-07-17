import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { ngxsmkUniqueId } from '@ngxsmk/core/util';
import { NGXSMK_FORM_FIELD_CONTROL, NgxsmkFormFieldControl } from '@ngxsmk/core/form-field';

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
export class NgxsmkDatePicker implements ControlValueAccessor, NgxsmkFormFieldControl {
  readonly value = model('');
  readonly min = input('');
  readonly max = input('');
  readonly placeholder = input('');
  readonly disabled = input(false, { transform: booleanAttribute });

  readonly id = input(ngxsmkUniqueId('ngxsmk-date-picker'));
  readonly ariaInvalid = model(false);
  readonly ariaDescribedby = model<string | null>(null);

  readonly changed = output<string>();

  // CVA hooks
  private onChange: (val: string) => void = () => {};
  private onTouched: () => void = () => {};
  private readonly formDisabled = signal(false);
  protected readonly isDisabled = computed(() => this.disabled() || this.formDisabled());

  writeValue(val: string): void {
    this.value.set(val || '');
  }

  registerOnChange(fn: (val: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.formDisabled.set(isDisabled);
  }

  protected onInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.value.set(val);
    this.changed.emit(val);
    this.onChange(val);
  }

  protected onBlur(): void {
    this.onTouched();
  }
}
