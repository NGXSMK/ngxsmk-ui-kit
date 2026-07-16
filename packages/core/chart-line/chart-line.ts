import { ChangeDetectionStrategy, Component, computed, effect, input } from '@angular/core';
import {
  AbstractCanvasChart,
  ChartHover,
  RGBA,
  SHARED_CHART_STYLES,
  niceTicks,
  rgba,
} from '@ngxsmk/core/chart-engine';

export interface NgxsmkChartDataPoint {
  label: string;
  value: number;
}

@Component({
  standalone: true,
  selector: 'ngxsmk-chart-line',
  template: `
    <div class="ngxsmk-chart-surface">
      <canvas #canvas></canvas>
      <div #tooltip class="ngxsmk-chart-tip"></div>
    </div>
  `,
  host: { class: 'ngxsmk-chart-line' },
  styles: SHARED_CHART_STYLES,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkLineChart extends AbstractCanvasChart {
  readonly data = input<NgxsmkChartDataPoint[]>([]);
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
    const grad = ctx.createLinearGradient(0, plot.y, 0, plot.y + plot.h);
    grad.addColorStop(0, rgba(color, 1));
    grad.addColorStop(1, rgba(color, 0.5));

    ctx.save();
    ctx.beginPath();
    ctx.rect(plot.x, 0, plot.w * progress, this.H);
    ctx.clip();

    ctx.beginPath();
    data.forEach((d, i) => {
      const x = xAt(i);
      const y = yAt(d.value);
      if (i) ctx.lineTo(x, y);
      else ctx.moveTo(x, y);
    });
    ctx.strokeStyle = grad;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.stroke();

    data.forEach((d, i) => {
      const x = xAt(i);
      const y = yAt(d.value);
      ctx.beginPath();
      ctx.arc(x, y, 3.5, 0, Math.PI * 2);
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
