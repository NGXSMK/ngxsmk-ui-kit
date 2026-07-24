import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

export type NgxsmkSparklineVariant = 'line' | 'area' | 'bar';

export interface NgxsmkSparklinePoint {
  x: number;
  y: number;
  value: number;
  index: number;
}

export interface NgxsmkSparklineBar {
  x: number;
  y: number;
  width: number;
  height: number;
  value: number;
  index: number;
}

/**
 * Compact SVG micro-chart (sparkline) for inline dashboard metrics, trend indicators, and stat cards.
 *
 * ```html
 * <ngxsmk-sparkline [data]="[10, 25, 18, 40, 32, 55, 48, 65]" variant="area" />
 * <ngxsmk-sparkline [data]="[12, 5, 20, 15, 30]" variant="bar" />
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-sparkline',
  template: `
    <svg
      [attr.viewBox]="'0 0 ' + numericWidth() + ' ' + numericHeight()"
      [style.width]="cssWidth()"
      [style.height]="cssHeight()"
      class="ngxsmk-sparkline__svg"
      role="graphics-document"
      [attr.aria-label]="label()"
      (mouseleave)="onMouseLeave()"
    >
      <defs>
        <linearGradient [id]="gradientId()" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" [attr.stop-color]="color()" [attr.stop-opacity]="fillOpacity()" />
          <stop offset="100%" [attr.stop-color]="color()" stop-opacity="0" />
        </linearGradient>
      </defs>

      <!-- BAR VARIANT -->
      @if (variant() === 'bar') {
        @for (bar of barRects(); track bar.index) {
          <rect
            [attr.x]="bar.x"
            [attr.y]="bar.y"
            [attr.width]="bar.width"
            [attr.height]="bar.height"
            [attr.fill]="color()"
            rx="1.5"
            class="ngxsmk-sparkline__bar"
            [class.ngxsmk-sparkline__bar--hovered]="activePoint()?.index === bar.index"
            (mouseenter)="onBarHover(bar)"
          />
        }
      } @else {
        <!-- AREA FILL -->
        @if (variant() === 'area' && areaPath()) {
          <path [attr.d]="areaPath()" [attr.fill]="'url(#' + gradientId() + ')'" />
        }

        <!-- LINE PATH -->
        @if (linePath()) {
          <path
            [attr.d]="linePath()"
            fill="none"
            [attr.stroke]="color()"
            [attr.stroke-width]="strokeWidth()"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="ngxsmk-sparkline__line"
          />
        }

        <!-- DOTS -->
        @if (showDots()) {
          @for (pt of points(); track pt.index) {
            <circle
              [attr.cx]="pt.x"
              [attr.cy]="pt.y"
              [attr.r]="dotRadius()"
              [attr.fill]="color()"
              class="ngxsmk-sparkline__dot"
            />
          }
        }

        <!-- HOVER CROSSHAIR & DOT -->
        @if (interactive() && activePoint(); as active) {
          <line
            [attr.x1]="active.x"
            [attr.y1]="0"
            [attr.x2]="active.x"
            [attr.y2]="numericHeight()"
            stroke="var(--ngxsmk-color-outline, #e4e4e7)"
            stroke-width="1"
            stroke-dasharray="2 2"
          />
          <circle
            [attr.cx]="active.x"
            [attr.cy]="active.y"
            [attr.r]="strokeWidth() + 2"
            [attr.fill]="color()"
            stroke="var(--ngxsmk-color-surface, #ffffff)"
            stroke-width="2"
          />
        }

        <!-- TRANSPARENT HOVER SENSORS -->
        @if (interactive()) {
          @for (pt of points(); track pt.index) {
            <rect
              [attr.x]="pt.x - sensorWidth() / 2"
              y="0"
              [attr.width]="sensorWidth()"
              [attr.height]="numericHeight()"
              fill="transparent"
              style="cursor: pointer;"
              (mouseenter)="onPointHover(pt)"
            />
          }
        }
      }
    </svg>

    <!-- HOVER TOOLTIP -->
    @if (interactive() && activePoint(); as active) {
      <div class="ngxsmk-sparkline__tooltip">
        <span class="ngxsmk-sparkline__tooltip-val">{{ active.value }}</span>
      </div>
    }
  `,
  host: {
    class: 'ngxsmk-sparkline',
    '[class.ngxsmk-sparkline--interactive]': 'interactive()',
  },
  styles: `
    :host {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      vertical-align: middle;
    }

    .ngxsmk-sparkline__svg {
      overflow: visible;
      display: block;
    }

    .ngxsmk-sparkline__bar {
      transition:
        opacity 0.15s ease,
        transform 0.15s ease;
      opacity: 0.85;
    }

    .ngxsmk-sparkline__bar:hover,
    .ngxsmk-sparkline__bar--hovered {
      opacity: 1;
    }

    .ngxsmk-sparkline__tooltip {
      position: absolute;
      top: -1.75rem;
      padding: 0.15rem 0.4rem;
      border-radius: var(--ngxsmk-radius-sm, 0.25rem);
      background: var(--ngxsmk-color-on-surface, #09090b);
      color: var(--ngxsmk-color-surface, #ffffff);
      font-family: var(--ngxsmk-font-mono, monospace);
      font-size: 0.7rem;
      font-weight: 600;
      pointer-events: none;
      white-space: nowrap;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
      z-index: 10;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkSparkline {
  /** Numeric values series to display. */
  readonly data = input<number[]>([]);

  /** Visual variant: 'line' | 'area' | 'bar'. */
  readonly variant = input<NgxsmkSparklineVariant>('line');

  /** Width in pixels or CSS units. Default: 120. */
  readonly width = input<number | string>(120);

  /** Height in pixels or CSS units. Default: 32. */
  readonly height = input<number | string>(32);

  /** Stroke/bar/fill primary color string or CSS variable. */
  readonly color = input<string>('var(--ngxsmk-color-primary, #7c3aed)');

  /** Area fill opacity (0–1) for area variant. Default: 0.2. */
  readonly fillOpacity = input<number>(0.2);

  /** Line stroke width in pixels. Default: 2. */
  readonly strokeWidth = input<number>(2);

  /** Radius for data points dots on line variant. Default: 0 (hidden). */
  readonly dotRadius = input<number>(2);

  /** Whether data point dots are rendered. */
  readonly showDots = input<boolean>(false);

  /** Enable hover tooltips and interactive crosshairs. */
  readonly interactive = input<boolean>(true);

  /** Accessible label description for screen readers. */
  readonly label = input<string>('Sparkline chart');

  protected readonly activePoint = signal<NgxsmkSparklinePoint | null>(null);

  private static instanceCounter = 0;
  protected readonly gradientId = computed(
    () => `ngxsmk-sparkline-grad-${++NgxsmkSparkline.instanceCounter}`,
  );

  protected readonly numericWidth = computed(() => {
    const w = this.width();
    return typeof w === 'number' ? w : parseFloat(w) || 120;
  });

  protected readonly numericHeight = computed(() => {
    const h = this.height();
    return typeof h === 'number' ? h : parseFloat(h) || 32;
  });

  protected readonly cssWidth = computed(() => {
    const w = this.width();
    return typeof w === 'number' ? `${w}px` : w;
  });

  protected readonly cssHeight = computed(() => {
    const h = this.height();
    return typeof h === 'number' ? `${h}px` : h;
  });

  protected readonly minMax = computed(() => {
    const arr = this.data();
    if (!arr.length) return { min: 0, max: 1 };
    let min = Math.min(...arr);
    let max = Math.max(...arr);
    if (min === max) {
      min = min - 1;
      max = max + 1;
    }
    return { min, max };
  });

  protected readonly points = computed<NgxsmkSparklinePoint[]>(() => {
    const arr = this.data();
    if (!arr.length) return [];
    const w = this.numericWidth();
    const h = this.numericHeight();
    const padY = this.strokeWidth() + 2;
    const availH = h - padY * 2;
    const { min, max } = this.minMax();
    const range = max - min || 1;

    const stepX = arr.length > 1 ? w / (arr.length - 1) : w / 2;

    return arr.map((val, idx) => {
      const x = arr.length > 1 ? idx * stepX : w / 2;
      const normalizedY = (val - min) / range;
      const y = h - padY - normalizedY * availH;
      return { x, y, value: val, index: idx };
    });
  });

  protected readonly linePath = computed(() => {
    const pts = this.points();
    if (!pts.length) return '';
    return pts.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`, '');
  });

  protected readonly areaPath = computed(() => {
    const pts = this.points();
    if (!pts.length) return '';
    const h = this.numericHeight();
    const firstX = pts[0].x;
    const lastX = pts[pts.length - 1].x;
    const line = this.linePath();
    return `${line} L ${lastX} ${h} L ${firstX} ${h} Z`;
  });

  protected readonly barRects = computed<NgxsmkSparklineBar[]>(() => {
    const arr = this.data();
    if (!arr.length) return [];
    const w = this.numericWidth();
    const h = this.numericHeight();
    const { min, max } = this.minMax();
    const range = max - min || 1;
    const gap = 2;
    const barW = Math.max(2, (w - gap * (arr.length - 1)) / arr.length);

    return arr.map((val, idx) => {
      const normalizedY = (val - Math.min(0, min)) / range;
      const barH = Math.max(2, normalizedY * h);
      const x = idx * (barW + gap);
      const y = h - barH;
      return { x, y, width: barW, height: barH, value: val, index: idx };
    });
  });

  protected readonly sensorWidth = computed(() => {
    const pts = this.points();
    if (pts.length <= 1) return this.numericWidth();
    return this.numericWidth() / (pts.length - 1);
  });

  protected onPointHover(pt: NgxsmkSparklinePoint): void {
    this.activePoint.set(pt);
  }

  protected onBarHover(bar: NgxsmkSparklineBar): void {
    this.activePoint.set({
      x: bar.x + bar.width / 2,
      y: bar.y,
      value: bar.value,
      index: bar.index,
    });
  }

  protected onMouseLeave(): void {
    this.activePoint.set(null);
  }
}
