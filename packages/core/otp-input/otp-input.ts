import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  QueryList,
  ViewChildren,
  computed,
  effect,
  input,
  model,
  output,
  signal,
} from '@angular/core';

/**
 * Multi-digit One-Time Password (OTP) verification input control.
 * Features auto-advancing focus, backspace auto-reverse, paste support, and full keyboard navigation.
 *
 * ```html
 * <ngxsmk-otp-input [(value)]="otpCode" [length]="6" (completed)="onVerify($event)" />
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-otp-input',
  template: `
    <div class="ngxsmk-otp-input__group" role="group" [attr.aria-label]="ariaLabel()">
      @for (slot of slots(); track $index) {
        <input
          #inputEl
          [type]="masked() ? 'password' : 'text'"
          [attr.inputmode]="type() === 'numeric' ? 'numeric' : 'text'"
          [pattern]="type() === 'numeric' ? '[0-9]*' : '.*'"
          [maxLength]="1"
          [disabled]="disabled()"
          [placeholder]="placeholder()"
          [value]="slot"
          autocomplete="one-time-code"
          class="ngxsmk-otp-input__slot"
          [class.ngxsmk-otp-input__slot--filled]="slot !== ''"
          [class.ngxsmk-otp-input__slot--active]="activeSlot() === $index"
          (input)="onInput($event, $index)"
          (keydown)="onKeyDown($event, $index)"
          (paste)="onPaste($event, $index)"
          (focus)="onFocus($index)"
        />
      }
    </div>
  `,
  host: {
    class: 'ngxsmk-otp-input',
    '[attr.data-disabled]': 'disabled() ? "" : null',
  },
  styles: `
    :host {
      display: inline-block;
    }

    .ngxsmk-otp-input__group {
      display: flex;
      align-items: center;
      gap: var(--ngxsmk-space-2, 0.5rem);
    }

    .ngxsmk-otp-input__slot {
      width: 2.75rem;
      height: 3.25rem;
      text-align: center;
      font-family: var(--ngxsmk-font-mono, monospace);
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--ngxsmk-color-on-surface, #09090b);
      background: var(--ngxsmk-color-surface, #ffffff);
      border: 1.5px solid var(--ngxsmk-color-outline, #e4e4e7);
      border-radius: var(--ngxsmk-radius-md, 0.375rem);
      outline: none;
      transition:
        border-color 0.15s ease,
        box-shadow 0.15s ease,
        background-color 0.15s ease;
    }

    .ngxsmk-otp-input__slot:focus,
    .ngxsmk-otp-input__slot--active {
      border-color: var(--ngxsmk-color-primary, #7c3aed);
      box-shadow: 0 0 0 3px
        color-mix(in srgb, var(--ngxsmk-color-primary, #7c3aed) 15%, transparent);
    }

    .ngxsmk-otp-input__slot--filled {
      background: var(--ngxsmk-color-surface-variant, #f4f4f5);
      border-color: var(--ngxsmk-color-outline, #d4d4d8);
    }

    .ngxsmk-otp-input__slot:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkOtpInput {
  @ViewChildren('inputEl') private inputEls!: QueryList<ElementRef<HTMLInputElement>>;

  /** Number of OTP input slots. Default: 6. */
  readonly length = input<number>(6);

  /** Expected character type: 'numeric' | 'alphanumeric' | 'text'. Default: 'numeric'. */
  readonly type = input<'numeric' | 'alphanumeric' | 'text'>('numeric');

  /** Mask input characters like a password field. Default: false. */
  readonly masked = input<boolean>(false);

  /** Disable all slots. Default: false. */
  readonly disabled = input<boolean>(false);

  /** Placeholder character for empty slots. Default: '•'. */
  readonly placeholder = input<string>('•');

  /** Accessible ARIA label description. */
  readonly ariaLabel = input<string>('One time password input');

  /** Two-way signal bound value string. */
  readonly value = model<string>('');

  /** Emits completed OTP string when all slots are filled. */
  readonly completed = output<string>();

  protected readonly activeSlot = signal<number>(0);

  protected readonly slots = computed<string[]>(() => {
    const val = this.value();
    const len = this.length();
    const arr: string[] = [];
    for (let i = 0; i < len; i++) {
      arr.push(val[i] ?? '');
    }
    return arr;
  });

  constructor() {
    effect(() => {
      const val = this.value();
      if (val.length === this.length()) {
        this.completed.emit(val);
      }
    });
  }

  protected onInput(event: Event, index: number): void {
    const inputEl = event.target as HTMLInputElement;
    const char = inputEl.value.slice(-1);

    if (this.type() === 'numeric' && !/^\d$/.test(char)) {
      inputEl.value = this.slots()[index] ?? '';
      return;
    }

    const currentSlots = [...this.slots()];
    currentSlots[index] = char;
    const newValue = currentSlots.join('');
    this.value.set(newValue);

    if (char && index < this.length() - 1) {
      this.focusSlot(index + 1);
    }
  }

  protected onKeyDown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace') {
      const currentSlots = [...this.slots()];
      if (currentSlots[index]) {
        currentSlots[index] = '';
        this.value.set(currentSlots.join(''));
      } else if (index > 0) {
        currentSlots[index - 1] = '';
        this.value.set(currentSlots.join(''));
        this.focusSlot(index - 1);
      }
      event.preventDefault();
    } else if (event.key === 'ArrowLeft' && index > 0) {
      this.focusSlot(index - 1);
      event.preventDefault();
    } else if (event.key === 'ArrowRight' && index < this.length() - 1) {
      this.focusSlot(index + 1);
      event.preventDefault();
    }
  }

  protected onPaste(event: ClipboardEvent, index: number): void {
    event.preventDefault();
    const pasteData = event.clipboardData?.getData('text')?.trim() ?? '';
    if (!pasteData) return;

    let chars = pasteData.split('');
    if (this.type() === 'numeric') {
      chars = chars.filter((c) => /^\d$/.test(c));
    }

    const currentSlots = [...this.slots()];
    let writeIdx = index;
    for (const c of chars) {
      if (writeIdx < this.length()) {
        currentSlots[writeIdx] = c;
        writeIdx++;
      }
    }

    const newValue = currentSlots.join('');
    this.value.set(newValue);

    const nextFocus = Math.min(writeIdx, this.length() - 1);
    this.focusSlot(nextFocus);
  }

  protected onFocus(index: number): void {
    this.activeSlot.set(index);
  }

  private focusSlot(index: number): void {
    const inputs = this.inputEls?.toArray();
    if (inputs && inputs[index]) {
      inputs[index].nativeElement.focus();
      inputs[index].nativeElement.select();
      this.activeSlot.set(index);
    }
  }
}
