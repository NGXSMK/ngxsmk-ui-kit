import {
  Directive,
  ElementRef,
  HostListener,
  booleanAttribute,
  effect,
  inject,
  input,
  model,
} from '@angular/core';

/**
 * Mask pattern tokens:
 * - `0` — digit
 * - `A` — letter
 * - `*` — alphanumeric
 * - any other char — literal
 *
 * ```html
 * <input ngxsmkInput ngxsmkInputMask mask="(000) 000-0000" [(value)]="phone" />
 * <input ngxsmkInputMask mask="00/00/0000" [(value)]="date" />
 * ```
 */
@Directive({
  standalone: true,
  selector: 'input[ngxsmkInputMask]',
  host: {
    '[attr.inputmode]': 'inputMode()',
    '[attr.autocomplete]': 'autocomplete()',
    '[disabled]': 'disabled() || null',
  },
})
export class NgxsmkInputMask {
  private readonly el = inject(ElementRef<HTMLInputElement>);

  /** Pattern using `0` / `A` / `*` placeholders and literal separators. */
  readonly mask = input.required<string>();
  /** Formatted display value (two-way). */
  readonly value = model('');
  /** Raw unmasked value (digits/letters only). */
  readonly rawValue = model('');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly inputMode = input('text');
  readonly autocomplete = input('off');

  constructor() {
    effect(() => {
      const formatted = this.value();
      const input = this.el.nativeElement;
      if (input.value !== formatted) {
        input.value = formatted;
      }
    });
  }

  @HostListener('input', ['$event'])
  protected onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const { formatted, raw } = applyMask(input.value, this.mask());
    input.value = formatted;
    this.value.set(formatted);
    this.rawValue.set(raw);
  }

  @HostListener('blur')
  protected onBlur(): void {
    const { formatted, raw } = applyMask(this.el.nativeElement.value, this.mask());
    this.el.nativeElement.value = formatted;
    this.value.set(formatted);
    this.rawValue.set(raw);
  }
}

function applyMask(rawInput: string, mask: string): { formatted: string; raw: string } {
  const chars = rawInput.replace(/[^a-zA-Z0-9]/g, '');
  let ri = 0;
  let formatted = '';
  let raw = '';

  for (let mi = 0; mi < mask.length && ri < chars.length; mi++) {
    const m = mask[mi];
    const c = chars[ri];
    if (m === '0') {
      if (!/\d/.test(c)) break;
      formatted += c;
      raw += c;
      ri++;
    } else if (m === 'A') {
      if (!/[a-zA-Z]/.test(c)) break;
      formatted += c;
      raw += c;
      ri++;
    } else if (m === '*') {
      formatted += c;
      raw += c;
      ri++;
    } else {
      formatted += m;
      if (c === m) ri++;
    }
  }

  return { formatted, raw };
}
