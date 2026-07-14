import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  input,
  numberAttribute,
} from '@angular/core';

export type NgxsmkMeterSize = 'sm' | 'md' | 'lg';
export type NgxsmkMeterLevel = 'optimal' | 'suboptimal' | 'poor';

/**
 * Semantic meter for a scalar measurement within a known range (disk usage,
 * score, capacity) — distinct from `progress`, which reports task completion.
 * Colour follows the `low`/`high`/`optimum` thresholds like the native
 * `<meter>` element. Pure `computed` output; no effects, SSR-safe.
 *
 * ```html
 * <ngxsmk-meter [value]="72" [low]="20" [high]="80" [optimum]="90" showValue />
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-meter',
  template: `
    @if (label()) {
      <div class="ngxsmk-meter__header">
        <span class="ngxsmk-meter__label">{{ label() }}</span>
        @if (showValue()) {
          <span class="ngxsmk-meter__value">{{ displayValue() }}</span>
        }
      </div>
    }
    <div class="ngxsmk-meter__track">
      <div
        class="ngxsmk-meter__fill"
        [style.inline-size.%]="percent()"
      ></div>
    </div>
  `,
  host: {
    role: 'meter',
    class: 'ngxsmk-meter',
    '[attr.data-size]': 'size()',
    '[attr.data-level]': 'level()',
    '[attr.aria-valuemin]': 'min()',
    '[attr.aria-valuemax]': 'max()',
    '[attr.aria-valuenow]': 'clamped()',
    '[attr.aria-valuetext]': 'displayValue()',
    '[attr.aria-label]': 'label() || ariaLabel()',
  },
  styles: `
    :host {
      display: block;
      font-family: var(--ngxsmk-font-sans, sans-serif);
      --ngxsmk-meter-color: var(--ngxsmk-color-primary, #6366f1);
    }
    :host([data-level='optimal']) { --ngxsmk-meter-color: var(--ngxsmk-color-success, #16a34a); }
    :host([data-level='suboptimal']) { --ngxsmk-meter-color: var(--ngxsmk-color-warning, #f59e0b); }
    :host([data-level='poor']) { --ngxsmk-meter-color: var(--ngxsmk-color-danger, #dc2626); }

    .ngxsmk-meter__header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: var(--ngxsmk-space-2, 0.5rem);
      margin-block-end: var(--ngxsmk-space-1, 0.25rem);
      font-size: var(--ngxsmk-text-body-sm-size, 0.8125rem);
    }
    .ngxsmk-meter__label { color: var(--ngxsmk-color-on-surface, #0f172a); font-weight: 500; }
    .ngxsmk-meter__value {
      color: var(--ngxsmk-color-on-surface-variant, #64748b);
      font-variant-numeric: tabular-nums;
    }
    .ngxsmk-meter__track {
      inline-size: 100%;
      block-size: var(--ngxsmk-meter-height, 0.5rem);
      background: var(--ngxsmk-color-surface-variant, #e2e8f0);
      border-radius: var(--ngxsmk-radius-full, 999px);
      overflow: hidden;
    }
    :host([data-size='sm']) { --ngxsmk-meter-height: 0.375rem; }
    :host([data-size='lg']) { --ngxsmk-meter-height: 0.75rem; }
    .ngxsmk-meter__fill {
      block-size: 100%;
      background: var(--ngxsmk-meter-color);
      border-radius: inherit;
      transition: inline-size var(--ngxsmk-duration-normal, 250ms) var(--ngxsmk-ease-out, ease);
    }
    @media (prefers-reduced-motion: reduce) {
      .ngxsmk-meter__fill { transition: none; }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkMeter {
  readonly value = input(0, { transform: numberAttribute });
  readonly min = input(0, { transform: numberAttribute });
  readonly max = input(100, { transform: numberAttribute });
  /** Below `low` is considered a low reading. */
  readonly low = input<number | null>(null);
  /** Above `high` is considered a high reading. */
  readonly high = input<number | null>(null);
  /** Where the "good" reading sits; decides which side counts as optimal. */
  readonly optimum = input<number | null>(null);
  readonly size = input<NgxsmkMeterSize>('md');
  readonly label = input('');
  readonly ariaLabel = input('Meter');
  readonly showValue = input(false, { transform: booleanAttribute });
  /** Custom formatter for the displayed/announced value. */
  readonly format = input<(value: number, max: number) => string>();

  protected readonly clamped = computed(() =>
    Math.min(Math.max(this.value(), this.min()), this.max()),
  );

  protected readonly percent = computed(() => {
    const span = this.max() - this.min();
    if (span <= 0) return 0;
    return ((this.clamped() - this.min()) / span) * 100;
  });

  protected readonly displayValue = computed(() => {
    const fmt = this.format();
    if (fmt) return fmt(this.clamped(), this.max());
    return `${Math.round(this.percent())}%`;
  });

  /**
   * Mirrors the native `<meter>` colour algorithm: the reading is optimal when
   * it lands in the segment containing `optimum`, one step away is suboptimal,
   * and the far segment is poor.
   */
  protected readonly level = computed<NgxsmkMeterLevel>(() => {
    const value = this.clamped();
    const low = this.low();
    const high = this.high();
    const optimum = this.optimum();

    // No thresholds → neutral (rendered with the primary colour).
    if (low === null && high === null) return 'optimal';

    const lowBound = low ?? this.min();
    const highBound = high ?? this.max();
    const inLow = value < lowBound;
    const inHigh = value > highBound;
    const region: 'low' | 'mid' | 'high' = inLow
      ? 'low'
      : inHigh
        ? 'high'
        : 'mid';

    if (optimum === null) {
      // Without an optimum, treat the middle band as good.
      return region === 'mid' ? 'optimal' : 'suboptimal';
    }

    const optimumRegion: 'low' | 'mid' | 'high' =
      optimum < lowBound ? 'low' : optimum > highBound ? 'high' : 'mid';

    if (region === optimumRegion) return 'optimal';
    if (region === 'mid' || optimumRegion === 'mid') return 'suboptimal';
    return 'poor';
  });
}
