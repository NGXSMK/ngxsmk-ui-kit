import { ChangeDetectionStrategy, Component, computed, effect, input } from '@angular/core';
import {
  AbstractCanvasChart,
  ChartHover,
  SHARED_CHART_STYLES,
  niceTicks,
  rgba,
} from '@ngxsmk/core/chart-engine';

export interface NgxsmkBarChartDataPoint {
  label: string;
  value: number;
}

@Component({
  standalone: true,
  selector: 'ngxsmk-chart-bar',
  template: `
    <div class="ngxsmk-chart-surface" role="region" [attr.aria-label]="ariaLabel()">
      <canvas #canvas aria-hidden="true"></canvas>
      <div #tooltip class="ngxsmk-chart-tip" aria-hidden="true"></div>
      <table class="ngxsmk-chart-sr-table">
        <caption>{{ ariaLabel() }}</caption>
        <thead>
          <tr><th scope="col">Category</th><th scope="col">Value</th></tr>
        </thead>
        <tbody>
          @for (d of data(); track d.label) {
            <tr><td>{{ d.label }}</td><td>{{ d.value }}</td></tr>
          }
        </tbody>
      </table>
    </div>
  `,
  host: { class: 'ngxsmk-chart-bar' },
  styles: SHARED_CHART_STYLES,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkBarChart extends AbstractCanvasChart {
  readonly data = input<NgxsmkBarChartDataPoint[]>([]);
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
    const baseY = plot.y + plot.h - ((0 - min) / range) * plot.h;
    const yAt = (v: number) => plot.y + plot.h - ((v - min) / range) * plot.h;

    const yTicks = niceTicks(min, max, 4).map((v) => ({ y: yAt(v), label: String(v) }));
    const slot = plot.w / n;
    const barW = Math.min(46, slot * 0.62);
    const xTicks = data.map((d, i) => ({ x: plot.x + slot * (i + 0.5), label: d.label }));
    this.drawCartesianGrid(yTicks, xTicks);

    const color = this.colorVar(this.color(), t.primary);
    data.forEach((d, i) => {
      const cx = plot.x + slot * (i + 0.5);
      const top = yAt(d.value);
      const fullH = Math.abs(baseY - top);
      const h = fullH * this.easeGrow(progress);
      const y = d.value >= 0 ? top : baseY;
      const x = cx - barW / 2;
      const r = Math.min(6, barW / 2, h);
      ctx.beginPath();
      ctx.moveTo(x, y + h);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.lineTo(x + barW - r, y);
      ctx.quadraticCurveTo(x + barW, y, x + barW, y + r);
      ctx.lineTo(x + barW, y + h);
      ctx.closePath();
      const grad = ctx.createLinearGradient(0, y, 0, y + h);
      grad.addColorStop(0, rgba(color, 1));
      grad.addColorStop(1, rgba(color, 0.65));
      ctx.fillStyle = grad;
      ctx.fill();
    });
  }

  private easeGrow(p: number): number {
    return 1 - Math.pow(1 - p, 2);
  }

  protected hitTest(x: number, y: number): ChartHover | null {
    const data = this.data();
    const vals = this.values();
    const n = vals.length;
    if (!n) return null;
    const plot = this.plot;
    const slot = plot.w / n;
    const barW = Math.min(46, slot * 0.62);
    const d = data.find((_, i) => {
      const cx = plot.x + slot * (i + 0.5);
      return x >= cx - barW / 2 && x <= cx + barW / 2 && y >= plot.y && y <= plot.y + plot.h;
    });
    if (!d) return null;
    return {
      title: d.label,
      lines: [`${d.value}`],
      color: rgba(this.colorVar(this.color(), this.theme.primary), 1),
    };
  }
}
