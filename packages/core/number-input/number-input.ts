import { ChangeDetectionStrategy, Component, booleanAttribute, computed, input, model, output } from '@angular/core';

/**
 * Numeric field with − / + steppers and min/max/step constraints.
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
    >−</button>
    <input
      class="ngxsmk-number-input__field"
      type="number"
      [value]="value()"
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
    >+</button>
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
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--ngxsmk-color-ring) 25%, transparent);
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
      font-size: 1.125rem;
      line-height: 1;
      cursor: pointer;
      user-select: none;
      transition: background var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out);
    }
    .ngxsmk-number-input__btn:hover:not(:disabled) { background: var(--ngxsmk-color-surface-hover); }
    .ngxsmk-number-input__btn:disabled { opacity: 0.4; cursor: not-allowed; }
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

  protected readonly clamp = computed(() => (n: number) =>
    Math.min(this.max(), Math.max(this.min(), n)),
  );

  protected bump(direction: number): void {
    this.commit(this.value() + direction * this.step());
  }

  protected onInput(event: Event): void {
    const raw = Number((event.target as HTMLInputElement).value);
    if (Number.isNaN(raw)) return;
    // Let the user type freely; clamp only on commit (blur/change/stepper).
    this.value.set(raw);
    this.changed.emit(raw);
  }

  protected onCommit(event: Event): void {
    this.commit(Number((event.target as HTMLInputElement).value));
  }

  private commit(next: number): void {
    const clamped = this.clamp()(Number.isNaN(next) ? this.min() : next);
    this.value.set(clamped);
    this.changed.emit(clamped);
  }
}
