import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgxsmkSparkline } from '@ngxsmk/core/sparkline';

/**
 * KPI dashboard metric card with embedded sparkline trend visualization and directional change badge.
 *
 * ```html
 * <ngxsmk-stat-trend-card title="Total Revenue" value="$48,250" [trend]="14.2" [sparklineData]="[10, 25, 30, 48]" />
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-stat-trend-card',
  imports: [NgxsmkSparkline],
  template: `
    <div class="ngxsmk-stat-card">
      <div class="ngxsmk-stat-card__header">
        <span class="ngxsmk-stat-card__title">{{ title() }}</span>
        @if (trendText()) {
          <span
            class="ngxsmk-stat-card__badge"
            [class.ngxsmk-stat-card__badge--up]="isPositive() ?? trendVal() > 0"
            [class.ngxsmk-stat-card__badge--down]="
              isPositive() === false || (isPositive() === undefined && trendVal() < 0)
            "
          >
            {{ trendText() }}
          </span>
        }
      </div>

      <div class="ngxsmk-stat-card__body">
        <div class="ngxsmk-stat-card__main">
          <span class="ngxsmk-stat-card__value">{{ value() }}</span>
          @if (trendPeriod()) {
            <span class="ngxsmk-stat-card__period">{{ trendPeriod() }}</span>
          }
        </div>

        @if (activeSparkData().length > 0) {
          <div class="ngxsmk-stat-card__spark">
            <ngxsmk-sparkline
              [data]="activeSparkData()"
              variant="area"
              [width]="90"
              [height]="28"
              [color]="sparkColor()"
            />
          </div>
        }
      </div>
    </div>
  `,
  host: {
    class: 'ngxsmk-stat-trend-card',
  },
  styles: `
    :host {
      display: block;
      width: 100%;
      font-family: var(--ngxsmk-font-sans, system-ui);
    }

    .ngxsmk-stat-card {
      padding: 1rem 1.15rem;
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-lg, 0.5rem);
      background: var(--ngxsmk-color-surface);
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
    }

    .ngxsmk-stat-card__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .ngxsmk-stat-card__title {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--ngxsmk-color-on-surface-variant);
    }

    .ngxsmk-stat-card__badge {
      font-size: 0.7rem;
      font-weight: 700;
      padding: 0.1rem 0.4rem;
      border-radius: var(--ngxsmk-radius-full, 9999px);
      background: var(--ngxsmk-color-surface-variant);
      color: var(--ngxsmk-color-on-surface-variant);
    }

    .ngxsmk-stat-card__badge--up {
      background: color-mix(in srgb, var(--ngxsmk-color-success) 12%, transparent);
      color: var(--ngxsmk-color-success);
    }

    .ngxsmk-stat-card__badge--down {
      background: color-mix(in srgb, var(--ngxsmk-color-error) 12%, transparent);
      color: var(--ngxsmk-color-error);
    }

    .ngxsmk-stat-card__body {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 0.5rem;
    }

    .ngxsmk-stat-card__main {
      display: flex;
      flex-direction: column;
    }

    .ngxsmk-stat-card__value {
      font-family: 'Outfit', var(--ngxsmk-font-sans, system-ui), sans-serif;
      font-size: 1.6rem;
      font-weight: 700;
      line-height: 1.1;
      color: var(--ngxsmk-color-on-surface);
    }

    .ngxsmk-stat-card__period {
      font-size: 0.725rem;
      color: var(--ngxsmk-color-on-surface-variant);
      margin-top: 0.15rem;
    }

    .ngxsmk-stat-card__spark {
      flex-shrink: 0;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkStatTrendCard {
  /** Metric card title label. */
  readonly title = input<string>('');

  /** Primary KPI metric string or numeric value. */
  readonly value = input<string | number>('');

  /** Percentage change trend (e.g. 14.2 or '+12.4%'). */
  readonly trend = input<number | string>(0);

  /** Trend direction indicator override. */
  readonly isPositive = input<boolean | undefined>(undefined);

  /** Trend comparative description (e.g. 'vs last month'). */
  readonly trendPeriod = input<string>('vs last month');

  /** Sparkline chart dataset. */
  readonly sparklineData = input<number[]>([]);

  /** Alias for sparklineData. */
  readonly sparkData = input<number[]>([]);

  protected readonly activeSparkData = computed(() => {
    return this.sparkData().length > 0 ? this.sparkData() : this.sparklineData();
  });

  protected readonly trendVal = computed(() => {
    const t = this.trend();
    if (typeof t === 'number') return t;
    return parseFloat(t) || 0;
  });

  protected readonly trendText = computed(() => {
    const t = this.trend();
    if (typeof t === 'string') return t;
    if (t === 0) return '';
    return `${t > 0 ? '↑ +' : '↓ '}${t}%`;
  });

  protected readonly sparkColor = computed(() => {
    const pos = this.isPositive();
    if (pos === true) return 'var(--ngxsmk-color-success)';
    if (pos === false) return 'var(--ngxsmk-color-error)';
    const t = this.trendVal();
    if (t > 0) return 'var(--ngxsmk-color-success)';
    if (t < 0) return 'var(--ngxsmk-color-error)';
    return 'var(--ngxsmk-color-primary)';
  });
}
