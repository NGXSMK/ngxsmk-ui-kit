import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  booleanAttribute,
  computed,
  forwardRef,
  input,
  model,
  numberAttribute,
  output,
  signal,
  viewChildren,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type NgxsmkPinInputType = 'numeric' | 'text' | 'alphanumeric';
export type NgxsmkPinInputSize = 'sm' | 'md' | 'lg';

const PATTERNS: Record<NgxsmkPinInputType, RegExp> = {
  numeric: /[0-9]/,
  alphanumeric: /[a-zA-Z0-9]/,
  text: /./,
};

/**
 * One-time-code / PIN entry: a row of single-character fields with paste
 * distribution, arrow/backspace navigation, and masking. Integrates with
 * `ngModel` / reactive forms as a single string value.
 *
 * ```html
 * <ngxsmk-pin-input [(value)]="code" [length]="6" (completed)="verify($event)" />
 * <ngxsmk-pin-input [formControl]="otp" mask type="numeric" />
 * ```
 *
 * State is a single `signal<string[]>`; focus is moved imperatively only inside
 * browser event handlers, so it is SSR-safe and needs no effects.
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-pin-input',
  template: `
    @for (cell of cells(); track $index) {
      <input
        #cell
        class="ngxsmk-pin-input__cell"
        [type]="mask() ? 'password' : 'text'"
        [attr.inputmode]="inputMode()"
        [attr.autocomplete]="$index === 0 ? otpAutocomplete() : 'off'"
        [attr.aria-label]="cellLabel($index)"
        [attr.placeholder]="placeholder()"
        [value]="cell"
        [disabled]="isDisabled()"
        maxlength="1"
        autocapitalize="off"
        spellcheck="false"
        (input)="onInput($event, $index)"
        (keydown)="onKeydown($event, $index)"
        (focus)="onFocus($event)"
        (paste)="onPaste($event, $index)"
        (blur)="onTouched?.()"
      />
    }
  `,
  host: {
    class: 'ngxsmk-pin-input',
    role: 'group',
    '[attr.aria-label]': 'label()',
    '[attr.data-size]': 'size()',
    '[attr.data-disabled]': 'isDisabled() ? "" : null',
  },
  styles: `
    :host {
      display: inline-flex;
      gap: var(--ngxsmk-space-2, 0.5rem);
      font-family: var(--ngxsmk-font-sans, sans-serif);
    }
    .ngxsmk-pin-input__cell {
      width: var(--ngxsmk-pin-size, 2.75rem);
      height: var(--ngxsmk-pin-size, 2.75rem);
      padding: 0;
      text-align: center;
      font-size: var(--ngxsmk-text-title-md-size, 1.125rem);
      font-variant-numeric: tabular-nums;
      color: var(--ngxsmk-color-on-surface, #0f172a);
      background: var(--ngxsmk-color-surface, #fff);
      border: 1.5px solid var(--ngxsmk-color-outline-strong, #cbd5e1);
      border-radius: var(--ngxsmk-radius-md, 8px);
      outline: none;
      transition:
        border-color var(--ngxsmk-duration-fast, 120ms) var(--ngxsmk-ease-out, ease),
        box-shadow var(--ngxsmk-duration-fast, 120ms) var(--ngxsmk-ease-out, ease);
    }
    :host([data-size='sm']) { --ngxsmk-pin-size: 2.25rem; }
    :host([data-size='lg']) { --ngxsmk-pin-size: 3.25rem; }
    .ngxsmk-pin-input__cell:focus-visible {
      border-color: var(--ngxsmk-color-primary, #6366f1);
      box-shadow: 0 0 0 3px var(--ngxsmk-color-ring-soft, rgba(99, 102, 241, 0.25));
    }
    :host([data-disabled]) .ngxsmk-pin-input__cell {
      opacity: 0.5;
      cursor: not-allowed;
    }
    @media (prefers-reduced-motion: reduce) {
      .ngxsmk-pin-input__cell { transition: none; }
    }
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxsmkPinInput),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkPinInput implements ControlValueAccessor {
  readonly value = model('');
  readonly length = input(6, { transform: numberAttribute });
  readonly type = input<NgxsmkPinInputType>('numeric');
  readonly mask = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly placeholder = input('');
  readonly size = input<NgxsmkPinInputSize>('md');
  readonly label = input('Verification code');
  /** Enables browser/SMS OTP autofill on the first cell. */
  readonly otpAutocomplete = input<'one-time-code' | 'off'>('one-time-code');
  readonly completed = output<string>();

  private readonly inputs =
    viewChildren<ElementRef<HTMLInputElement>>('cell');
  private readonly cvaDisabled = signal(false);

  protected readonly isDisabled = computed(
    () => this.disabled() || this.cvaDisabled(),
  );

  private readonly pattern = computed(() => PATTERNS[this.type()]);
  protected readonly inputMode = computed(() =>
    this.type() === 'numeric' ? 'numeric' : 'text',
  );

  /** The value split into exactly `length` cells (padded with ''). */
  protected readonly cells = computed(() => {
    const len = this.length();
    const chars = [...this.value()].slice(0, len);
    return Array.from({ length: len }, (_, i) => chars[i] ?? '');
  });

  private onChange?: (value: string) => void;
  protected onTouched?: () => void;

  protected cellLabel(i: number): string {
    return `${this.label()}, digit ${i + 1} of ${this.length()}`;
  }

  protected onFocus(event: FocusEvent): void {
    (event.target as HTMLInputElement).select();
  }

  protected onInput(event: Event, index: number): void {
    const el = event.target as HTMLInputElement;
    const raw = el.value;
    // Keep only the last valid char typed (handles overtype in a filled cell).
    const char = [...raw].reverse().find((c) => this.pattern().test(c)) ?? '';
    const next = this.cells();
    next[index] = char;
    el.value = char;
    this.setValue(next);
    if (char && index < this.length() - 1) {
      this.focusCell(index + 1);
    }
  }

  protected onKeydown(event: KeyboardEvent, index: number): void {
    switch (event.key) {
      case 'Backspace': {
        const cells = this.cells();
        if (cells[index]) {
          cells[index] = '';
          this.setValue(cells);
        } else if (index > 0) {
          cells[index - 1] = '';
          this.setValue(cells);
          this.focusCell(index - 1);
        }
        event.preventDefault();
        break;
      }
      case 'Delete': {
        const cells = this.cells();
        cells[index] = '';
        this.setValue(cells);
        event.preventDefault();
        break;
      }
      case 'ArrowLeft':
        if (index > 0) this.focusCell(index - 1);
        event.preventDefault();
        break;
      case 'ArrowRight':
        if (index < this.length() - 1) this.focusCell(index + 1);
        event.preventDefault();
        break;
      case 'Home':
        this.focusCell(0);
        event.preventDefault();
        break;
      case 'End':
        this.focusCell(this.length() - 1);
        event.preventDefault();
        break;
      default:
        break;
    }
  }

  protected onPaste(event: ClipboardEvent, index: number): void {
    event.preventDefault();
    const text = event.clipboardData?.getData('text') ?? '';
    const valid = [...text].filter((c) => this.pattern().test(c));
    if (valid.length === 0) return;
    const cells = this.cells();
    let cursor = index;
    for (const char of valid) {
      if (cursor >= this.length()) break;
      cells[cursor++] = char;
    }
    this.setValue(cells);
    this.focusCell(Math.min(cursor, this.length() - 1));
  }

  private setValue(cells: string[]): void {
    const value = cells.join('');
    this.value.set(value);
    this.onChange?.(value);
    if (value.length === this.length() && !cells.includes('')) {
      this.completed.emit(value);
    }
  }

  private focusCell(index: number): void {
    const el = this.inputs()[index]?.nativeElement;
    if (el) {
      el.focus();
      el.select();
    }
  }

  writeValue(value: unknown): void {
    this.value.set(typeof value === 'string' ? value : '');
  }
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(disabled: boolean): void {
    this.cvaDisabled.set(disabled);
  }
}
