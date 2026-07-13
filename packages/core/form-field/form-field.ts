import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  contentChild,
  effect,
  input,
} from '@angular/core';
import { NgxsmkInput } from '@ngxsmk/core/input';

/**
 * Wraps a form control with label, hint, and error messaging, wiring
 * `for`/`aria-describedby`/`aria-invalid` automatically when the projected
 * control is a `ngxsmk-input`.
 *
 * ```html
 * <ngxsmk-form-field label="Email" hint="Work address preferred" [error]="emailError">
 *   <ngxsmk-input type="email" [(value)]="email" />
 * </ngxsmk-form-field>
 * ```
 */
@Component({
  selector: 'ngxsmk-form-field',
  template: `
    @if (label()) {
      <label class="ngxsmk-form-field__label" [attr.for]="controlId()">
        {{ label() }}
        @if (required()) {
          <span class="ngxsmk-form-field__required" aria-hidden="true">*</span>
        }
      </label>
    }
    <ng-content />
    @if (error()) {
      <p class="ngxsmk-form-field__error" [id]="messageId()" role="alert">{{ error() }}</p>
    } @else if (hint()) {
      <p class="ngxsmk-form-field__hint" [id]="messageId()">{{ hint() }}</p>
    }
  `,
  host: {
    class: 'ngxsmk-form-field',
    '[attr.data-invalid]': 'error() ? "" : null',
  },
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: var(--ngxsmk-space-1-5);
      font-family: var(--ngxsmk-font-sans);
    }

    .ngxsmk-form-field__label {
      color: var(--ngxsmk-color-on-surface);
      font-size: var(--ngxsmk-text-label-lg-size);
      font-weight: var(--ngxsmk-text-label-lg-weight);
      line-height: var(--ngxsmk-text-label-lg-line);
    }

    .ngxsmk-form-field__required { color: var(--ngxsmk-color-error); }

    .ngxsmk-form-field__hint,
    .ngxsmk-form-field__error {
      margin: 0;
      font-size: var(--ngxsmk-text-body-sm-size);
      line-height: var(--ngxsmk-text-body-sm-line);
    }
    .ngxsmk-form-field__hint { color: var(--ngxsmk-color-on-surface-variant); }
    .ngxsmk-form-field__error { color: var(--ngxsmk-color-error); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkFormField {
  readonly label = input('');
  readonly hint = input('');
  readonly error = input('');
  readonly required = input(false, { transform: booleanAttribute });

  private readonly control = contentChild(NgxsmkInput);

  protected readonly controlId = computed(() => this.control()?.id() ?? null);
  protected readonly messageId = computed(() =>
    this.controlId() ? `${this.controlId()}-msg` : null,
  );

  constructor() {
    effect(() => {
      const control = this.control();
      if (!control) {
        return;
      }
      const describedBy = this.error() || this.hint() ? this.messageId() : null;
      control.ariaDescribedby.set(describedBy);
      control.ariaInvalid.set(this.error() ? true : false);
    });
  }
}
