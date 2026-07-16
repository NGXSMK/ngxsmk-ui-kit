import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  effect,
  ElementRef,
  input,
  model,
  output,
  viewChild,
} from '@angular/core';

/**
 * Numeric field with âˆ’ / + steppers and min/max/step constraints.
 *
 * ```html
 * <ngxsmk-number-input [min]="0" [max]="10" [step]="1" [(value)]="quantity" />
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-number-input',
  template: `
    <button
      type="button"
      class="ngxsmk-number-input__btn"
      tabindex="-1"
      aria-label="Decrement"
      [disabled]="disabled() || value() <= min()"
      (click)="bump(-1)"
    >
      âˆ’
    </button>
      <input
        #field
        class="ngxsmk-number-input__field"
        type="number"
        [min]="min()"
        [max]="max()"
        [step]="step()"
        [disabled]="disabled()"
        [attr.placeholder]="placeholder() || null"
        (input)="onInput($event)"
        (change)="onCommit($event)"
      />
    <button
      type="button"
      class="ngxsmk-number-input__btn"
      tabindex="-1"
      aria-label="Increment"
      [disabled]="disabled() || value() >= max()"
      (click)="bump(1)"
    >
      +
    </button>
  `,
  host: { class: 'ngxsmk-number-input' },
  styles: `
    :host {
      display: inline-flex;
      align-items: stretch;
      width: 100%;
      max-width: 10rem;
      height: var(--ngxsmk-control-height);
      border: 1px solid var(--ngxsmk-color-outline-strong);
      border-radius: var(--ngxsmk-radius-base);
      background: var(--ngxsmk-color-surface);
      font-family: var(--ngxsmk-font-sans);
      overflow: hidden;
      transition:
        border-color var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out),
        box-shadow var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out);
    }
    :host(:focus-within) {
      border-color: var(--ngxsmk-color-ring);
      box-shadow: var(--ngxsmk-focus-ring);
    }

    .ngxsmk-number-input__field {
      flex: 1 1 auto;
      min-width: 0;
      border: none;
      background: transparent;
      color: var(--ngxsmk-color-on-surface);
      font: inherit;
      font-size: var(--ngxsmk-text-body-md-size);
      text-align: center;
      padding: 0 var(--ngxsmk-space-2);
      outline: none;
      -moz-appearance: textfield;
      appearance: textfield;
    }
    .ngxsmk-number-input__field::-webkit-outer-spin-button,
    .ngxsmk-number-input__field::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    .ngxsmk-number-input__btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      width: 2rem;
      border: none;
      background: var(--ngxsmk-color-surface-variant);
      color: var(--ngxsmk-color-on-surface);
      font-size: var(--ngxsmk-text-title-md-size);
      line-height: 1;
      cursor: pointer;
      user-select: none;
      transition: background var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out);
    }
    .ngxsmk-number-input__btn:hover:not(:disabled) {
      background: var(--ngxsmk-color-surface-hover);
    }
    .ngxsmk-number-input__btn:disabled {
      opacity: var(--ngxsmk-opacity-disabled);
      cursor: not-allowed;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkNumberInput {
  readonly value = model(0);
  readonly min = input(0);
  readonly max = input(100);
  readonly step = input(1);
  readonly placeholder = input('');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly changed = output<number>();

  private readonly fieldRef = viewChild<ElementRef<HTMLInputElement>>('field');

  constructor() {
    // Keep the visible field in sync with the model, but never while the user
    // is actively editing (focused) so typing/backspacing isn't clobbered.
    effect(() => {
      const el = this.fieldRef()?.nativeElement;
      const next = String(this.value());
      if (el && el !== document.activeElement && el.value !== next) {
        el.value = next;
      }
    });
  }

  protected readonly clamp = computed(
    () => (n: number) => Math.min(this.max(), Math.max(this.min(), n)),
  );

  protected bump(direction: number): void {
    this.commit(this.value() + direction * this.step());
  }

  protected onInput(event: Event): void {
    const el = event.target as HTMLInputElement;
    const raw = el.value;
    // Allow an empty field while editing; commit resolves it on blur/change.
    if (raw.trim() === '') return;
    const parsed = Number(raw);
    if (Number.isNaN(parsed)) return;
    // Let the user type freely; clamp only on commit (blur/change/stepper).
    this.value.set(parsed);
    this.changed.emit(parsed);
  }

  protected onCommit(event: Event): void {
    const el = event.target as HTMLInputElement;
    const raw = el.value.trim();
    const parsed = raw === '' ? this.min() : Number(raw);
    this.commit(parsed);
  }

  private commit(next: number): void {
    const clamped = this.clamp()(Number.isNaN(next) ? this.min() : next);
    const rounded = this.roundToStep(clamped);
    if (rounded !== this.value()) {
      this.value.set(rounded);
    }
    this.changed.emit(rounded);
  }

  private roundToStep(n: number): number {
    const step = this.step();
    if (!step || step <= 0) return n;
    const decimals = (String(step).split('.')[1] ?? '').length;
    const factor = 10 ** decimals;
    return Math.round(n * factor) / factor;
  }
}
