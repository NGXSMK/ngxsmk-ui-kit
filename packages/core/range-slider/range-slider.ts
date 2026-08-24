import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';

/**
 * Dual-thumb range slider for selecting lower and upper numeric thresholds.
 *
 * ```html
 * <ngxsmk-range-slider [(minValue)]="priceMin" [(maxValue)]="priceMax" [min]="0" [max]="1000" [step]="10" />
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-range-slider',
  template: `
    <div class="ngxsmk-range-slider__container" [class.ngxsmk-range-slider--disabled]="disabled()">
      <!-- TRACK BACKGROUND -->
      <div class="ngxsmk-range-slider__track"></div>

      <!-- ACTIVE HIGHLIGHT SEGMENT -->
      <div
        class="ngxsmk-range-slider__fill"
        [style.left]="minPercent() + '%'"
        [style.width]="fillWidthPercent() + '%'"
      ></div>

      <!-- MIN RANGE INPUT THUMB -->
      <input
        type="range"
        [min]="min()"
        [max]="max()"
        [step]="step()"
        [disabled]="disabled()"
        [value]="clampedMin()"
        (input)="onMinInput($event)"
        class="ngxsmk-range-slider__input ngxsmk-range-slider__input--min"
        [attr.aria-label]="ariaMinLabel()"
      />

      <!-- MAX RANGE INPUT THUMB -->
      <input
        type="range"
        [min]="min()"
        [max]="max()"
        [step]="step()"
        [disabled]="disabled()"
        [value]="clampedMax()"
        (input)="onMaxInput($event)"
        class="ngxsmk-range-slider__input ngxsmk-range-slider__input--max"
        [attr.aria-label]="ariaMaxLabel()"
      />
    </div>
  `,
  host: {
    class: 'ngxsmk-range-slider',
  },
  styles: `
    :host {
      display: block;
      width: 100%;
      padding: 0.5rem 0;
    }

    .ngxsmk-range-slider__container {
      position: relative;
      height: 1.5rem;
      display: flex;
      align-items: center;
    }

    .ngxsmk-range-slider__track {
      position: absolute;
      width: 100%;
      height: 0.375rem;
      border-radius: var(--ngxsmk-radius-full, 9999px);
      background: var(--ngxsmk-color-surface-variant);
    }

    .ngxsmk-range-slider__fill {
      position: absolute;
      height: 0.375rem;
      border-radius: var(--ngxsmk-radius-full, 9999px);
      background: var(--ngxsmk-color-primary);
    }

    .ngxsmk-range-slider__input {
      position: absolute;
      width: 100%;
      height: 100%;
      background: none;
      pointer-events: none;
      -webkit-appearance: none;
      appearance: none;
      margin: 0;
      outline: none;
    }

    .ngxsmk-range-slider__input::-webkit-slider-thumb {
      height: 1.25rem;
      width: 1.25rem;
      border-radius: var(--ngxsmk-radius-full, 9999px);
      background: var(--ngxsmk-color-surface);
      border: 2px solid var(--ngxsmk-color-primary);
      pointer-events: auto;
      -webkit-appearance: none;
      cursor: pointer;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
      transition:
        transform 0.1s ease,
        box-shadow 0.1s ease;
    }

    .ngxsmk-range-slider__input::-moz-range-thumb {
      height: 1.25rem;
      width: 1.25rem;
      border-radius: var(--ngxsmk-radius-full, 9999px);
      background: var(--ngxsmk-color-surface);
      border: 2px solid var(--ngxsmk-color-primary);
      pointer-events: auto;
      cursor: pointer;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
      transition:
        transform 0.1s ease,
        box-shadow 0.1s ease;
    }

    .ngxsmk-range-slider__input::-webkit-slider-thumb:hover {
      transform: scale(1.1);
      box-shadow: 0 0 0 4px
        color-mix(in srgb, var(--ngxsmk-color-primary) 20%, transparent);
    }

    .ngxsmk-range-slider__input--min {
      z-index: 3;
    }

    .ngxsmk-range-slider__input--max {
      z-index: 4;
    }

    .ngxsmk-range-slider--disabled {
      opacity: 0.5;
      pointer-events: none;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkRangeSlider {
  /** Minimum slider value. Default: 0. */
  readonly min = input<number>(0);

  /** Maximum slider value. Default: 100. */
  readonly max = input<number>(100);

  /** Granular step increment. Default: 1. */
  readonly step = input<number>(1);

  /** Disable range slider inputs. Default: false. */
  readonly disabled = input<boolean>(false);

  /** Accessible label for lower limit. */
  readonly ariaMinLabel = input<string>('Minimum value');

  /** Accessible label for upper limit. */
  readonly ariaMaxLabel = input<string>('Maximum value');

  /** Two-way signal model for lower range threshold. */
  readonly minValue = model<number>(20);

  /** Two-way signal model for upper range threshold. */
  readonly maxValue = model<number>(80);

  protected readonly clampedMin = computed(() => {
    const mn = this.min();
    const mx = this.max();
    const val = Math.min(this.minValue(), this.maxValue());
    return Math.min(mx, Math.max(mn, val));
  });

  protected readonly clampedMax = computed(() => {
    const mn = this.min();
    const mx = this.max();
    const val = Math.max(this.minValue(), this.maxValue());
    return Math.min(mx, Math.max(mn, val));
  });

  protected readonly minPercent = computed(() => {
    const mn = this.min();
    const mx = this.max();
    const range = mx - mn || 1;
    return ((this.clampedMin() - mn) / range) * 100;
  });

  protected readonly fillWidthPercent = computed(() => {
    const mn = this.min();
    const mx = this.max();
    const range = mx - mn || 1;
    return ((this.clampedMax() - this.clampedMin()) / range) * 100;
  });

  protected onMinInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const val = parseFloat(target.value);
    if (val > this.clampedMax()) {
      this.minValue.set(this.clampedMax());
    } else {
      this.minValue.set(val);
    }
  }

  protected onMaxInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const val = parseFloat(target.value);
    if (val < this.clampedMin()) {
      this.maxValue.set(this.clampedMin());
    } else {
      this.maxValue.set(val);
    }
  }
}
