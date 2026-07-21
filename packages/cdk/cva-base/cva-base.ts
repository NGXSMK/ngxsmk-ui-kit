import { computed, signal } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

/**
 * Abstract base providing the CVA plumbing shared by every form component:
 * `onChange` / `onTouched` storage, `formDisabled` signal, and the composite
 * `isDisabled` computed. Sub-classes implement only `inputDisabled()` (the
 * component's own `input()` signal value) and `writeValue()` (type-specific
 * coercion).
 *
 * ```ts
 * export class NgxsmkCheckbox extends CvaBase<boolean> {
 *   readonly disabled = input(false, { transform: booleanAttribute });
 *   protected inputDisabled() { return this.disabled(); }
 *   writeValue(value: unknown) { this.checked.set(!!value); }
 * }
 * ```
 */
export abstract class CvaBase<T = unknown> implements ControlValueAccessor {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private _onChange: (value: T) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private _onTouched: () => void = () => {};

  private readonly _formDisabled = signal(false);

  /** Composite disabled state: component's own input OR form-driven disable. */
  readonly isDisabled = computed(() => this.inputDisabled() || this._formDisabled());

  /** Return the component's own `disabled` input signal value. */
  protected abstract inputDisabled(): boolean;

  abstract writeValue(value: unknown): void;

  registerOnChange(fn: (value: T) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._formDisabled.set(isDisabled);
  }

  /** Fire the registered onChange callback. */
  protected emitChange(value: T): void {
    this._onChange(value);
  }

  /** Fire the registered onTouched callback. */
  protected emitTouched(): void {
    this._onTouched();
  }
}
