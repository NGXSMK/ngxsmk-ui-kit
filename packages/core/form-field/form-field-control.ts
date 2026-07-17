import { InjectionToken, ModelSignal, Signal } from '@angular/core';

/**
 * Interface that components/directives must implement to be hosted inside a
 * `ngxsmk-form-field`.
 */
export interface NgxsmkFormFieldControl {
  readonly id: Signal<string> | (() => string);
  readonly ariaInvalid: ModelSignal<boolean>;
  readonly ariaDescribedby: ModelSignal<string | null>;
}

export const NGXSMK_FORM_FIELD_CONTROL = new InjectionToken<NgxsmkFormFieldControl>(
  'NGXSMK_FORM_FIELD_CONTROL',
);
