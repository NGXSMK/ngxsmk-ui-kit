import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type NgxsmkGaugeVariant = 'arch' | 'half' | 'full';

/**
 * Circular arc gauge & speedometer meter component.
 *
 * ```html
 * <ngxsmk-gauge [value]="78" label="Performance" units="%" />
 * <ngxsmk-gauge [value]="140" [min]="0" [max]="200" units="km/h" variant="half" />
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-gauge',
  template: `
    <div
      class="ngxsmk-gauge__container"
      [style.width]="size() + 'px'"
      [style.height]="viewHeight() + 'px'"
      role="meter"
      [attr.aria-valuenow]="clampedValue()"
      [attr.aria-valuemin]="min()"
      [attr.aria-valuemax]="max()"
      [attr.aria-label]="label() || 'Gauge meter'"
    >
      <svg
        [attr.width]="size()"
        [attr.height]="size()"
        [attr.viewBox]="'0 0 ' + size() + ' ' + size()"
        class="ngxsmk-gauge__svg"
      >
        <!-- BACKGROUND TRACK ARC -->
        <circle
          [attr.cx]="center()"
          [attr.cy]="center()"
          [attr.r]="radius()"
          fill="none"
          stroke="var(--ngxsmk-color-surface-variant, #f4f4f5)"
          [attr.stroke-width]="thickness()"
          [attr.stroke-dasharray]="dashArray()"
          [attr.stroke-dashoffset]="0"
          [style.transform]="'rotate(' + startAngle() + 'deg)'"
          [style.transform-origin]="center() + 'px ' + center() + 'px'"
          stroke-linecap="round"
        />

        <!-- VALUE PROGRESS ARC -->
        <circle
          [attr.cx]="center()"
          [attr.cy]="center()"
          [attr.r]="radius()"
          fill="none"
          [attr.stroke]="color()"
          [attr.stroke-width]="thickness()"
          [attr.stroke-dasharray]="dashArray()"
          [attr.stroke-dashoffset]="progressOffset()"
          [style.transform]="'rotate(' + startAngle() + 'deg)'"
          [style.transform-origin]="center() + 'px ' + center() + 'px'"
          stroke-linecap="round"
          class="ngxsmk-gauge__progress"
        />
      </svg>

      <!-- CENTER LABEL CONTENT -->
      <div class="ngxsmk-gauge__content">
        @if (showValue()) {
          <div class="ngxsmk-gauge__value-group">
            <span class="ngxsmk-gauge__value">{{ clampedValue() }}</span>
            @if (units()) {
              <span class="ngxsmk-gauge__units">{{ units() }}</span>
            }
          </div>
        }
        @if (label()) {
          <span class="ngxsmk-gauge__label">{{ label() }}</span>
        }
      </div>
    </div>
  `,
  host: {
    class: 'ngxsmk-gauge',
  },
  styles: `
    :host {
      display: inline-block;
    }

    .ngxsmk-gauge__container {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .ngxsmk-gauge__svg {
      display: block;
      overflow: visible;
    }

    .ngxsmk-gauge__progress {
      transition: stroke-dashoffset 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .ngxsmk-gauge__content {
      position: absolute;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      pointer-events: none;
      margin-top: 0.25rem;
    }

    .ngxsmk-gauge__value-group {
      display: flex;
      align-items: baseline;
      gap: 0.15rem;
    }

    .ngxsmk-gauge__value {
      font-family: 'Outfit', var(--ngxsmk-font-sans, system-ui), sans-serif;
      font-size: 1.75rem;
      font-weight: 700;
      line-height: 1.1;
      color: var(--ngxsmk-color-on-surface, #09090b);
    }

    .ngxsmk-gauge__units {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
    }

    .ngxsmk-gauge__label {
      font-size: 0.75rem;
      font-weight: 500;
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
      margin-top: 0.1rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkGauge {
  /** Numeric value. */
  readonly value = input<number>(0);

  /** Minimum value. Default: 0. */
  readonly min = input<number>(0);

  /** Maximum value. Default: 100. */
  readonly max = input<number>(100);

  /** Outer diameter size in pixels. Default: 160. */
  readonly size = input<number>(160);

  /** Stroke thickness in pixels. Default: 12. */
  readonly thickness = input<number>(12);

  /** Primary progress stroke color. */
  readonly color = input<string>('var(--ngxsmk-color-primary, #7c3aed)');

  /** Gauge shape variant: 'arch' (270°), 'half' (180°), 'full' (360°). Default: 'arch'. */
  readonly variant = input<NgxsmkGaugeVariant>('arch');

  /** Sub-label description displayed under value. */
  readonly label = input<string>('');

  /** Unit string appended to numeric value (e.g. '%', 'km/h', '°C'). */
  readonly units = input<string>('');

  /** Whether to render the numeric value text. Default: true. */
  readonly showValue = input<boolean>(true);

  protected readonly clampedValue = computed(() => {
    const val = this.value();
    const mn = this.min();
    const mx = this.max();
    return Math.min(mx, Math.max(mn, val));
  });

  protected readonly center = computed(() => this.size() / 2);
  protected readonly radius = computed(() => (this.size() - this.thickness()) / 2);
  protected readonly circumference = computed(() => 2 * Math.PI * this.radius());

  protected readonly maxAngle = computed(() => {
    switch (this.variant()) {
      case 'half':
        return 180;
      case 'full':
        return 360;
      case 'arch':
      default:
        return 270;
    }
  });

  protected readonly startAngle = computed(() => {
    switch (this.variant()) {
      case 'half':
        return 180;
      case 'full':
        return -90;
      case 'arch':
      default:
        return 135;
    }
  });

  protected readonly viewHeight = computed(() => {
    if (this.variant() === 'half') {
      return this.size() / 2 + this.thickness();
    }
    return this.size();
  });

  protected readonly arcLength = computed(() => (this.maxAngle() / 360) * this.circumference());

  protected readonly dashArray = computed(() => `${this.arcLength()} ${this.circumference()}`);

  protected readonly progressOffset = computed(() => {
    const mn = this.min();
    const mx = this.max();
    const range = mx - mn || 1;
    const pct = (this.clampedValue() - mn) / range;
    return this.arcLength() * (1 - pct);
  });
}
