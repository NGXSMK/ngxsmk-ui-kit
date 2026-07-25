import {
  Directive,
  ElementRef,
  booleanAttribute,
  effect,
  forwardRef,
  inject,
  input,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CvaBase } from '@ngxsmk/cdk/cva-base';

/**
 * Mask token characters. Anything else in a mask is a literal that the
 * directive inserts for the user.
 *
 * - `#` — a digit
 * - `A` — a letter
 * - `*` — a letter or a digit
 */
export const NGXSMK_MASK_TOKENS: Record<string, RegExp> = {
  '#': /\d/,
  A: /[a-z]/i,
  '*': /[a-z0-9]/i,
};

/** Result of applying a mask to raw input. */
export interface NgxsmkMaskResult {
  /** What the user sees, literals included. */
  formatted: string;
  /** Only the characters that filled a token — what the form model receives. */
  unmasked: string;
}

/**
 * Applies `mask` to `raw`, inserting literals as the user types.
 *
 * Exported because the mask is pure string math: it is useful for validating
 * or formatting a value outside a live input.
 */
export function applyNgxsmkMask(raw: string, mask: string): NgxsmkMaskResult {
  let formatted = '';
  let unmasked = '';
  let read = 0;

  for (const maskChar of mask) {
    const token = NGXSMK_MASK_TOKENS[maskChar];

    if (token) {
      // Skip anything the user typed that this slot cannot accept, so pasting
      // a pre-formatted value works as well as typing a bare one.
      while (read < raw.length && !token.test(raw[read])) {
        read++;
      }
      if (read >= raw.length) break;
      formatted += raw[read];
      unmasked += raw[read];
      read++;
    } else {
      // Never emit a trailing literal — "12" under "##/##" should read "12",
      // not "12/", which would look like input the user has not given yet.
      if (read >= raw.length) break;
      formatted += maskChar;
      if (raw[read] === maskChar) read++;
    }
  }

  return { formatted, unmasked };
}

/**
 * Formats a native `<input>` as the user types, against a character mask.
 *
 * This is the primitive under the kit's format-specific inputs — a credit-card,
 * phone, date, or postcode field is this directive plus a mask string.
 *
 * ```html
 * <input ngxsmkInput [ngxsmkMask]="'##/##'" placeholder="MM/YY" />
 * <input ngxsmkInput ngxsmkMask="#### #### #### ####" [(ngModel)]="card" />
 * <input ngxsmkInput ngxsmkMask="AAA-###" [unmask]="false" [formControl]="plate" />
 * ```
 *
 * The form model receives the unmasked value by default — `4111111111111111`
 * rather than `4111 1111 1111 1111` — because that is what a server expects.
 * Set `unmask` to `false` to store what the user sees instead.
 */
@Directive({
  standalone: true,
  selector: 'input[ngxsmkMask]',
  host: {
    '(input)': 'onInput()',
    '(blur)': 'onBlur()',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxsmkMaskedInput),
      multi: true,
    },
  ],
})
export class NgxsmkMaskedInput extends CvaBase<string> {
  /** The mask pattern, e.g. `'#### #### #### ####'`. */
  readonly ngxsmkMask = input.required<string>();

  /** Emit only the token characters to the model. Default `true`. */
  readonly unmask = input(true, { transform: booleanAttribute });

  readonly disabled = input(false, { transform: booleanAttribute });

  private readonly el = inject<ElementRef<HTMLInputElement>>(ElementRef);

  constructor() {
    super();
    // Re-run the mask when it changes so an already-populated field reformats
    // rather than keeping the shape of the previous mask.
    effect(() => {
      const mask = this.ngxsmkMask();
      const element = this.el.nativeElement;
      if (!element.value) return;
      element.value = applyNgxsmkMask(element.value, mask).formatted;
    });

    effect(() => {
      this.el.nativeElement.disabled = this.isDisabled();
    });
  }

  protected override inputDisabled(): boolean {
    return this.disabled();
  }

  override writeValue(value: unknown): void {
    const raw = value == null ? '' : String(value);
    this.el.nativeElement.value = applyNgxsmkMask(raw, this.ngxsmkMask()).formatted;
  }

  protected onInput(): void {
    const element = this.el.nativeElement;
    const caret = element.selectionStart ?? element.value.length;
    // Count of token characters before the caret — a position that survives
    // reformatting, unlike a raw character offset.
    const significantBefore = countTokenChars(element.value.slice(0, caret), this.ngxsmkMask());

    const { formatted, unmasked } = applyNgxsmkMask(element.value, this.ngxsmkMask());
    element.value = formatted;

    const restored = caretAfterTokens(formatted, this.ngxsmkMask(), significantBefore);
    element.setSelectionRange(restored, restored);

    this.emitChange(this.unmask() ? unmasked : formatted);
  }

  protected onBlur(): void {
    this.emitTouched();
  }
}

/** How many characters in `text` would land in a token slot of `mask`. */
function countTokenChars(text: string, mask: string): number {
  return applyNgxsmkMask(text, mask).unmasked.length;
}

/** Offset in `formatted` just past its `count`-th token character. */
function caretAfterTokens(formatted: string, mask: string, count: number): number {
  if (count <= 0) return 0;
  let seen = 0;

  for (let i = 0; i < formatted.length; i++) {
    // A position is a token slot when the mask says so at the same index.
    if (NGXSMK_MASK_TOKENS[mask[i]]) {
      seen++;
      if (seen === count) return i + 1;
    }
  }

  return formatted.length;
}
