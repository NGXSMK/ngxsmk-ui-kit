import { ChangeDetectionStrategy, Component, computed, effect, input } from '@angular/core';
import { AbstractCanvasChart, ChartHover, SHARED_CHART_STYLES, easeOutBack, niceTicks, rgba } from '@ngxsmk/core/chart-engine';

export interface NgxsmkScatterDataPoint {
  x: number;
  y: number;
  label?: string;
}

@Component({
  standalone: true,
  selector: 'ngxsmk-chart-scatter',
  template: `
    <div class="ngxsmk-chart-surface">
      <canvas #canvas></canvas>
      <div #tooltip class="ngxsmk-chart-tip"></div>
    </div>
  `,
  host: { class: 'ngxsmk-chart-scatter' },
  styles: SHARED_CHART_STYLES,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkScatterChart extends AbstractCanvasChart {
  readonly data = input<NgxsmkScatterDataPoint[]>([]);
  readonly color = input('var(--ngxsmk-color-primary)');

  private readonly xs = computed(() => this.data().map((d) => d.x));
  private readonly ys = computed(() => this.data().map((d) => d.y));

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
    if (!data.length) return;

    const minX = Math.min(...this.xs(), 0);
    const maxX = Math.max(...this.xs(), 0);
    const minY = Math.min(...this.ys(), 0);
    const maxY = Math.max(...this.ys(), 0);
    const rx = maxX - minX || 1;
    const ry = maxY - minY || 1;
    const plot = this.plot;
    const xAt = (v: number) => plot.x + ((v - minX) / rx) * plot.w;
    const yAt = (v: number) => plot.y + plot.h - ((v - minY) / ry) * plot.h;

    const yTicks = niceTicks(minY, maxY, 4).map((v) => ({ y: yAt(v), label: String(v) }));
    const xTicks = niceTicks(minX, maxX, 4).map((v) => ({ x: xAt(v), label: String(v) }));
    this.drawCartesianGrid(yTicks, xTicks);

    const color = this.colorVar(this.color(), t.primary);
    const n = data.length;
    data.forEach((d, i) => {
      const local = Math.max(0, Math.min(1, (progress * n - i) / 1));
      if (local <= 0) return;
      const r = 5 * easeOutBack(local);
      const x = xAt(d.x);
      const y = yAt(d.y);
      ctx.beginPath();
      ctx.arc(x, y, Math.max(0.5, r), 0, Math.PI * 2);
      ctx.fillStyle = rgba(color, 0.85);
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = rgba(t.surface, 1);
      ctx.stroke();
    });
  }

  protected hitTest(x: number, y: number): ChartHover | null {
    const data = this.data();
    if (!data.length) return null;
    const minX = Math.min(...this.xs(), 0);
    const maxX = Math.max(...this.xs(), 0);
    const minY = Math.min(...this.ys(), 0);
    const maxY = Math.max(...this.ys(), 0);
    const rx = maxX - minX || 1;
    const ry = maxY - minY || 1;
    const plot = this.plot;
    const xAt = (v: number) => plot.x + ((v - minX) / rx) * plot.w;
    const yAt = (v: number) => plot.y + plot.h - ((v - minY) / ry) * plot.h;
    let best = -1;
    let bestD = Infinity;
    data.forEach((d, i) => {
      const dx = x - xAt(d.x);
      const dy = y - yAt(d.y);
      const d2 = dx * dx + dy * dy;
      if (d2 < bestD) {
        bestD = d2;
        best = i;
      }
    });
    if (best < 0 || bestD > 100) return null;
    const d = data[best];
    const lines = [`x: ${d.x}`, `y: ${d.y}`];
    if (d.label) lines.unshift(d.label);
    return { title: d.label, lines, color: rgba(this.colorVar(this.color(), this.theme.primary), 1) };
  }
}
