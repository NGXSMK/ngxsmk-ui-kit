import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  output,
} from '@angular/core';
import { ngxsmkUniqueId } from '@ngxsmk/core/util';

/**
 * Themed text input. Pairs with `ngxsmk-form-field` for label, hint, and error
 * wiring, or sits standalone. Uses a `model()` so it composes with the rest of
 * the control family (`ngxsmk-textarea`, `ngxsmk-select`, …).
 *
 * ```html
 * <ngxsmk-input type="email" placeholder="you@example.com" [(value)]="email" />
 * <ngxsmk-form-field label="Email" error="Required">
 *   <ngxsmk-input type="email" [(value)]="email" />
 * </ngxsmk-form-field>
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-input',
  template: `
    <input
      class="ngxsmk-input__control"
      [type]="type()"
      [value]="value()"
      [disabled]="disabled()"
      [attr.placeholder]="placeholder()"
      [attr.aria-invalid]="ariaInvalid() ? 'true' : null"
      [attr.aria-describedby]="ariaDescribedby()"
      (input)="onInput($event)"
    />
  `,
  host: {
    class: 'ngxsmk-input',
    '[attr.id]': 'id()',
    '[attr.aria-invalid]': "ariaInvalid() ? 'true' : null",
    '[attr.aria-describedby]': 'ariaDescribedby()',
    '[attr.data-disabled]': "disabled() ? '' : null",
  },
  styles: `
    :host {
      display: flex;
      align-items: center;
      width: 100%;
      box-sizing: border-box;
      height: var(--ngxsmk-control-height);
      padding: 0 var(--ngxsmk-space-3);
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
    :host(:focus-within) {
      border-color: var(--ngxsmk-color-ring);
      box-shadow: var(--ngxsmk-focus-ring);
    }
    :host([aria-invalid='true']) {
      border-color: var(--ngxsmk-color-error);
    }
    :host([aria-invalid='true']:focus-within) {
      box-shadow: var(--ngxsmk-focus-ring-error);
    }
    :host([data-disabled]) {
      opacity: var(--ngxsmk-opacity-disabled);
    }

    .ngxsmk-input__control {
      flex: 1;
      min-width: 0;
      width: 100%;
      height: 100%;
      margin: 0;
      border: 0;
      background: transparent;
      outline: none;
      padding: 0;
      font: inherit;
      color: inherit;
    }
    .ngxsmk-input__control::placeholder {
      color: var(--ngxsmk-color-on-surface-variant);
    }
    .ngxsmk-input__control:disabled {
      cursor: not-allowed;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkInput {
  readonly value = model('');
  readonly type = input('text');
  readonly placeholder = input('');
  readonly disabled = input(false, { transform: booleanAttribute });

  /** DOM id; `ngxsmk-form-field` wires its label's `for` to this. */
  readonly id = input(ngxsmkUniqueId('ngxsmk-input'));

  /** Set by `ngxsmk-form-field` to flag validation state. */
  readonly ariaInvalid = model(false);
  readonly ariaDescribedby = model<string | null>(null);

  readonly changed = output<string>();

  protected onInput(e: Event): void {
    const value = (e.target as HTMLInputElement).value;
    this.value.set(value);
    this.changed.emit(value);
  }
}
