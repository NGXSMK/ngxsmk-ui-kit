import { UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';

export type NgxsmkCardBrand = 'visa' | 'mastercard' | 'amex' | 'discover' | 'unknown';

/**
 * Auto-formatting credit/debit card number, expiry, and CVV payment input component with brand detection.
 *
 * ```html
 * <ngxsmk-credit-card-input [(cardNumber)]="cardNo" [(expiry)]="exp" [(cvv)]="cvc" />
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-credit-card-input',
  imports: [UpperCasePipe],
  template: `
    <div class="ngxsmk-card-input" [class.ngxsmk-card-input--disabled]="disabled()">
      <!-- CARD NUMBER FIELD -->
      <div class="ngxsmk-card-input__row">
        <div class="ngxsmk-card-input__field-wrap">
          <input
            type="text"
            inputmode="numeric"
            placeholder="0000 0000 0000 0000"
            [value]="activeCardNumber()"
            [disabled]="disabled()"
            (input)="onCardNumberInput($event)"
            class="ngxsmk-card-input__input ngxsmk-card-input__input--number"
          />

          <!-- BRAND ICON BADGE -->
          <span class="ngxsmk-card-input__brand-tag" [attr.data-brand]="cardBrand()">
            {{ cardBrand() | uppercase }}
          </span>
        </div>
      </div>

      <!-- EXPIRY & CVV SUB ROW -->
      <div class="ngxsmk-card-input__sub-row">
        <input
          type="text"
          inputmode="numeric"
          placeholder="MM / YY"
          [value]="expiry()"
          [disabled]="disabled()"
          (input)="onExpiryInput($event)"
          class="ngxsmk-card-input__input ngxsmk-card-input__input--expiry"
        />

        <input
          type="password"
          inputmode="numeric"
          placeholder="CVV"
          maxLength="4"
          [value]="cvv()"
          [disabled]="disabled()"
          (input)="onCvvInput($event)"
          class="ngxsmk-card-input__input ngxsmk-card-input__input--cvv"
        />
      </div>
    </div>
  `,
  host: {
    class: 'ngxsmk-credit-card-input',
  },
  styles: `
    :host {
      display: block;
      width: 100%;
      font-family: var(--ngxsmk-font-sans, system-ui);
    }

    .ngxsmk-card-input {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    .ngxsmk-card-input__field-wrap {
      position: relative;
      width: 100%;
    }

    .ngxsmk-card-input__input {
      width: 100%;
      height: 2.75rem;
      padding: 0 0.75rem;
      border: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
      border-radius: var(--ngxsmk-radius-md, 0.375rem);
      background: var(--ngxsmk-color-surface, #ffffff);
      color: var(--ngxsmk-color-on-surface, #09090b);
      font-family: var(--ngxsmk-font-mono, monospace);
      font-size: 0.95rem;
      font-weight: 600;
      outline: none;
      transition:
        border-color 0.15s ease,
        box-shadow 0.15s ease;
    }

    .ngxsmk-card-input__input:focus {
      border-color: var(--ngxsmk-color-primary, #7c3aed);
      box-shadow: 0 0 0 3px
        color-mix(in srgb, var(--ngxsmk-color-primary, #7c3aed) 12%, transparent);
    }

    .ngxsmk-card-input__input--number {
      padding-right: 4.5rem;
    }

    .ngxsmk-card-input__brand-tag {
      position: absolute;
      right: 0.6rem;
      top: 50%;
      transform: translateY(-50%);
      font-family: var(--ngxsmk-font-sans, system-ui);
      font-size: 0.65rem;
      font-weight: 800;
      letter-spacing: 0.05em;
      padding: 0.15rem 0.4rem;
      border-radius: var(--ngxsmk-radius-sm, 0.25rem);
      background: var(--ngxsmk-color-surface-variant, #f4f4f5);
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
    }

    .ngxsmk-card-input__brand-tag[data-brand='visa'] {
      background: #1a1f71;
      color: #ffffff;
    }

    .ngxsmk-card-input__brand-tag[data-brand='mastercard'] {
      background: #eb001b;
      color: #ffffff;
    }

    .ngxsmk-card-input__brand-tag[data-brand='amex'] {
      background: #006fcf;
      color: #ffffff;
    }

    .ngxsmk-card-input__sub-row {
      display: flex;
      gap: 0.5rem;
    }

    .ngxsmk-card-input__input--expiry {
      flex: 1.2;
    }

    .ngxsmk-card-input__input--cvv {
      flex: 1;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkCreditCardInput {
  /** Disable inputs. Default: false. */
  readonly disabled = input<boolean>(false);

  /** Two-way signal model for primary card value. */
  readonly value = model<string>('');

  /** Two-way signal model for card number string. */
  readonly cardNumber = model<string>('');

  /** Two-way signal model for expiry date MM/YY. */
  readonly expiry = model<string>('');

  /** Two-way signal model for CVV security code. */
  readonly cvv = model<string>('');

  protected readonly activeCardNumber = computed(() => {
    return this.value() || this.cardNumber();
  });

  protected readonly cardBrand = computed<NgxsmkCardBrand>(() => {
    const raw = this.activeCardNumber().replace(/\D/g, '');
    if (/^4/.test(raw)) return 'visa';
    if (/^5[1-5]|^2[2-7]/.test(raw)) return 'mastercard';
    if (/^3[47]/.test(raw)) return 'amex';
    if (/^6(?:011|5)/.test(raw)) return 'discover';
    return 'unknown';
  });

  protected onCardNumberInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    let digits = target.value.replace(/\D/g, '').slice(0, 16);
    // Format into 4-digit blocks
    const formatted = digits.match(/.{1,4}/g)?.join(' ') ?? digits;
    this.value.set(formatted);
    this.cardNumber.set(formatted);
  }

  protected onExpiryInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    let digits = target.value.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) {
      digits = `${digits.slice(0, 2)} / ${digits.slice(2)}`;
    }
    this.expiry.set(digits);
  }

  protected onCvvInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const digits = target.value.replace(/\D/g, '').slice(0, 4);
    this.cvv.set(digits);
  }
}
