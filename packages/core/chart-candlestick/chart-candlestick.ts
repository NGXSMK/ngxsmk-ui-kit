import { ChangeDetectionStrategy, Component, computed, effect, input } from '@angular/core';
import { AbstractCanvasChart, ChartHover, SHARED_CHART_STYLES, niceTicks, rgba } from '@ngxsmk/core/chart-engine';

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
    <div class="ngxsmk-chart-surface">
      <canvas #canvas></canvas>
      <div #tooltip class="ngxsmk-chart-tip"></div>
    </div>
  `,
  host: { class: 'ngxsmk-chart-candlestick' },
  styles: SHARED_CHART_STYLES,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkCandlestickChart extends AbstractCanvasChart {
  readonly data = input<NgxsmkCandlestickDataPoint[]>([]);

  private readonly lows = computed(() => this.data().map((d) => d.low));
  private readonly highs = computed(() => this.data().map((d) => d.high));

  constructor() {
    super();
    effect(() => {
      this.data();
      this.requestRender();
    });
  }

  protected draw(progress: number): void {
    const ctx = this.ctx;
    const t = this.theme;
    const data = this.data();
    if (!data.length) return;

    const min = Math.min(...this.lows());
    const max = Math.max(...this.highs());
    const range = max - min || 1;
    const plot = this.plot;
    const yAt = (v: number) => plot.y + plot.h - ((v - min) / range) * plot.h;
    const count = data.length;
    const slot = plot.w / count;
    const candleW = Math.min(22, slot * 0.6);
    const grow = 1 - Math.pow(1 - progress, 2);

    const yTicks = niceTicks(min, max, 4).map((v) => ({ y: yAt(v), label: String(v) }));
    const xStep = Math.max(1, Math.ceil(count / 6));
    const xTicks = data
      .map((d, i) => ({ x: plot.x + slot * (i + 0.5), label: i % xStep === 0 || i === count - 1 ? d.date : undefined }))
      .filter((tk) => tk.label != null) as { x: number; label: string }[];
    this.drawCartesianGrid(yTicks, xTicks);

    data.forEach((d, i) => {
      const cx = plot.x + slot * (i + 0.5);
      const isBull = d.close >= d.open;
      const color = isBull ? t.success : t.error;
      const bodyTop = yAt(Math.max(d.open, d.close));
      const bodyBottom = yAt(Math.min(d.open, d.close));
      const fullH = Math.max(bodyBottom - bodyTop, 1);
      const h = fullH * grow;
      const centerY = (bodyTop + bodyBottom) / 2;
      const y = centerY - h / 2;

      ctx.globalAlpha = Math.min(1, progress * 1.5);
      ctx.strokeStyle = rgba(color, 1);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx, yAt(d.high));
      ctx.lineTo(cx, yAt(d.low));
      ctx.stroke();

      ctx.fillStyle = rgba(color, 1);
      ctx.fillRect(cx - candleW / 2, y, candleW, h);
      ctx.globalAlpha = 1;
    });
  }

  protected hitTest(x: number, y: number): ChartHover | null {
    const data = this.data();
    if (!data.length) return null;
    const plot = this.plot;
    const count = data.length;
    const slot = plot.w / count;
    const candleW = Math.min(22, slot * 0.6);
    const i = Math.floor((x - plot.x) / slot);
    if (i < 0 || i >= count) return null;
    const cx = plot.x + slot * (i + 0.5);
    if (x < cx - candleW / 2 || x > cx + candleW / 2) return null;
    const d = data[i];
    return {
      title: d.date,
      lines: [`O ${d.open}`, `H ${d.high}`, `L ${d.low}`, `C ${d.close}`],
      color: rgba(d.close >= d.open ? this.theme.success : this.theme.error, 1),
    };
  }
}
