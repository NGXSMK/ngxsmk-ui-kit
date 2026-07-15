import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface NgxsmkCandlestickDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

@Component({
  standalone: true,
  selector: 'ngxsmk-chart-candlestick',
  template: `
    <svg
      class="ngxsmk-chart-candlestick__svg"
      [attr.width]="width()"
      [attr.height]="height()"
      [attr.viewBox]="viewBox()"
    >
      @for (candle of candles(); track $index) {
        <g class="ngxsmk-chart-candlestick__candle">
          <line
            class="ngxsmk-chart-candlestick__wick"
            [attr.x1]="candle.x"
            [attr.x2]="candle.x"
            [attr.y1]="candle.highY"
            [attr.y2]="candle.lowY"
            stroke="var(--ngxsmk-color-on-surface)"
          />
          <rect
            class="ngxsmk-chart-candlestick__body"
            [attr.x]="candle.bodyX"
            [attr.y]="candle.bodyY"
            [attr.width]="candle.bodyW"
            [attr.height]="candle.bodyH"
            [attr.fill]="candle.fill"
          />
        </g>
      }
    </svg>
  `,
  host: { class: 'ngxsmk-chart-candlestick' },
  styles: `
    .ngxsmk-chart-candlestick__svg {
      display: block;
      max-width: 100%;
      height: auto;
      overflow: visible;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkCandlestickChart {
  readonly data = input<NgxsmkCandlestickDataPoint[]>([]);
  readonly width = input(400);
  readonly height = input(200);

  protected readonly lows = computed(() => this.data().map((d) => d.low));

  protected readonly highs = computed(() => this.data().map((d) => d.high));

  protected readonly minVal = computed(() => Math.min(...this.lows(), 0));

  protected readonly maxVal = computed(() => Math.max(...this.highs(), 0));

  protected readonly range = computed(() => this.maxVal() - this.minVal() || 1);

  protected readonly viewBox = computed(() => `0 0 ${this.width()} ${this.height()}`);

  protected readonly candles = computed(() => {
    const w = this.width();
    const h = this.height();
    const pad = 16;
    const plotW = w - pad * 2;
    const plotH = h - pad * 2;
    const count = this.data().length || 1;
    const candleW = (plotW / count) * 0.6;
    const r = this.range();
    const min = this.minVal();
    const scale = (v: number) => pad + plotH - ((v - min) / r) * plotH;
    return this.data().map((d, i) => {
      const x = pad + (i / count) * plotW + plotW / count / 2;
      const highY = scale(d.high);
      const lowY = scale(d.low);
      const openY = scale(d.open);
      const closeY = scale(d.close);
      const isBullish = d.close >= d.open;
      const bodyTop = isBullish ? closeY : openY;
      const bodyBottom = isBullish ? openY : closeY;
      return {
        x,
        highY,
        lowY,
        bodyX: x - candleW / 2,
        bodyY: bodyTop,
        bodyW: candleW,
        bodyH: Math.max(bodyBottom - bodyTop, 1),
        fill: isBullish ? 'var(--ngxsmk-color-success)' : 'var(--ngxsmk-color-error)',
      };
    });
  });
}
