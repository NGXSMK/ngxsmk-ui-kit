import { ChangeDetectionStrategy, Component, computed, effect, input } from '@angular/core';
import {
  AbstractCanvasChart,
  ChartHover,
  SHARED_CHART_STYLES,
  niceTicks,
  rgba,
} from '@ngxsmk/core/chart-engine';

export interface NgxsmkAreaChartDataPoint {
  label: string;
  value: number;
}

@Component({
  standalone: true,
  selector: 'ngxsmk-chart-area',
  template: `
    <div class="ngxsmk-chart-surface">
      <canvas #canvas></canvas>
      <div #tooltip class="ngxsmk-chart-tip"></div>
    </div>
  `,
  host: { class: 'ngxsmk-chart-area' },
  styles: SHARED_CHART_STYLES,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkAreaChart extends AbstractCanvasChart {
  readonly data = input<NgxsmkAreaChartDataPoint[]>([]);
  readonly color = input('var(--ngxsmk-color-primary)');

  private readonly values = computed(() => this.data().map((d) => d.value));

  constructor() {
    super();
    effect(() => {
      this.data();
      this.color();
      this.requestRender();
    });
  }

  protected draw(progress: number): void {
    const ctx = this.ctx;
    const t = this.theme;
    const data = this.data();
    const vals = this.values();
    const n = vals.length;
    if (n === 0) return;

    const min = Math.min(...vals, 0);
    const max = Math.max(...vals, 0);
    const range = max - min || 1;
    const plot = this.plot;
    const xAt = (i: number) => (n === 1 ? plot.x + plot.w / 2 : plot.x + (i / (n - 1)) * plot.w);
    const yAt = (v: number) => plot.y + plot.h - ((v - min) / range) * plot.h;

    const yTicks = niceTicks(min, max, 4).map((v) => ({ y: yAt(v), label: String(v) }));
    const xStep = Math.max(1, Math.ceil(n / 6));
    const xTicks = data
      .map((d, i) => ({ x: xAt(i), label: i % xStep === 0 || i === n - 1 ? d.label : undefined }))
      .filter((tk) => tk.label != null) as { x: number; label: string }[];
    this.drawCartesianGrid(yTicks, xTicks);

    const color = this.colorVar(this.color(), t.primary);
    const baseY = plot.y + plot.h;

    ctx.save();
    ctx.beginPath();
    ctx.rect(plot.x, 0, plot.w * progress, this.H);
    ctx.clip();

    const top = data.map((d, i) => ({ x: xAt(i), y: yAt(d.value) }));

    const fillGrad = ctx.createLinearGradient(0, plot.y, 0, baseY);
    fillGrad.addColorStop(0, rgba(color, 0.38));
    fillGrad.addColorStop(1, rgba(color, 0.04));
    ctx.beginPath();
    ctx.moveTo(top[0].x, baseY);
    top.forEach((p) => ctx.lineTo(p.x, p.y));
    ctx.lineTo(top[top.length - 1].x, baseY);
    ctx.closePath();
    ctx.fillStyle = fillGrad;
    ctx.fill();

    const lineGrad = ctx.createLinearGradient(0, plot.y, 0, baseY);
    lineGrad.addColorStop(0, rgba(color, 1));
    lineGrad.addColorStop(1, rgba(color, 0.6));
    ctx.beginPath();
    top.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
    ctx.strokeStyle = lineGrad;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.stroke();

    top.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = rgba(t.surface, 1);
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = rgba(color, 1);
      ctx.stroke();
    });
    ctx.restore();
  }

  protected hitTest(x: number, y: number): ChartHover | null {
    const data = this.data();
    const vals = this.values();
    const n = vals.length;
    if (!n) return null;
    const min = Math.min(...vals, 0);
    const max = Math.max(...vals, 0);
    const range = max - min || 1;
    const plot = this.plot;
    const xAt = (i: number) => (n === 1 ? plot.x + plot.w / 2 : plot.x + (i / (n - 1)) * plot.w);
    const yAt = (v: number) => plot.y + plot.h - ((v - min) / range) * plot.h;
    let best = -1;
    let bestD = Infinity;
    data.forEach((d, i) => {
      const dx = x - xAt(i);
      const dy = y - yAt(d.value);
      const d2 = dx * dx + dy * dy;
      if (d2 < bestD) {
        bestD = d2;
        best = i;
      }
    });
    if (best < 0 || bestD > 400) return null;
    const d = data[best];
    return {
      title: d.label,
      lines: [`${d.value}`],
      color: rgba(this.colorVar(this.color(), this.theme.primary), 1),
    };
  }
}
