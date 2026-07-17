import { Directive, forwardRef, input, model } from '@angular/core';
import { ngxsmkUniqueId } from '@ngxsmk/core/util';
import { NGXSMK_FORM_FIELD_CONTROL, NgxsmkFormFieldControl } from '@ngxsmk/core/form-field';

/**
 * Directive applied to native text inputs and textareas to style them and
 * integrate them with `ngxsmk-form-field`.
 *
 * ```html
 * <ngxsmk-form-field label="Email">
 *   <input ngxsmkInput type="email" [(ngModel)]="email" />
 * </ngxsmk-form-field>
 *
 * <ngxsmk-form-field label="Comment">
 *   <textarea ngxsmkInput [(ngModel)]="comment"></textarea>
 * </ngxsmk-form-field>
 * ```
 */
@Directive({
  standalone: true,
  selector: 'input[ngxsmkInput], textarea[ngxsmkInput]',
  host: {
    '[attr.id]': 'id()',
    '[attr.aria-invalid]': "ariaInvalid() ? 'true' : null",
    '[attr.aria-describedby]': 'ariaDescribedby()',
  },
  providers: [
    {
      provide: NGXSMK_FORM_FIELD_CONTROL,
      useExisting: forwardRef(() => NgxsmkInputDirective),
    },
  ],
})
export class NgxsmkInputDirective implements NgxsmkFormFieldControl {
  readonly id = input(ngxsmkUniqueId('ngxsmk-input'));
  readonly ariaInvalid = model(false);
  readonly ariaDescribedby = model<string | null>(null);
}
