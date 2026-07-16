import { ChangeDetectionStrategy, Component, computed, effect, input } from '@angular/core';
import { AbstractCanvasChart, ChartHover, SHARED_CHART_STYLES, rgba } from '@ngxsmk/core/chart-engine';

export interface NgxsmkPieChartDataPoint {
  label: string;
  value: number;
}

@Component({
  standalone: true,
  selector: 'ngxsmk-chart-pie',
  template: `
    <div class="ngxsmk-chart-surface">
      <canvas #canvas></canvas>
      <div #tooltip class="ngxsmk-chart-tip"></div>
    </div>
  `,
  host: { class: 'ngxsmk-chart-pie' },
  styles: SHARED_CHART_STYLES,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkPieChart extends AbstractCanvasChart {
  readonly data = input<NgxsmkPieChartDataPoint[]>([]);
  readonly size = input(200);
  readonly donut = input(false);

  private readonly total = computed(() => this.data().reduce((a, d) => a + d.value, 0) || 1);

  protected override get drawWidth(): number {
    return this.responsive() && this.measured.w ? this.measured.w : this.size();
  }
  protected override get drawHeight(): number {
    return this.responsive() && this.measured.w ? this.measured.w : this.size();
  }

  constructor() {
    super();
    effect(() => {
      this.data();
      this.donut();
      this.size();
      this.requestRender();
    });
  }

  protected draw(progress: number): void {
    const ctx = this.ctx;
    const t = this.theme;
    const data = this.data();
    if (!data.length) return;

    const cx = this.W / 2;
    const cy = this.H / 2 - 8;
    const radius = Math.min(this.W, this.H) / 2 - 14;
    const innerR = radius * 0.58;
    const total = this.total();
    const scale = 0.9 + 0.1 * progress;
    const r = radius * scale;

    const legend: { color: string; label: string }[] = [];
    let acc = -Math.PI / 2;
    const sweep = Math.PI * 2 * progress;
    data.forEach((d, i) => {
      const angle = (d.value / total) * Math.PI * 2;
      const start = acc;
      const end = acc + angle;
      const drawEnd = Math.min(end, -Math.PI / 2 + sweep);
      if (drawEnd > start) {
        const color = t.palette[i % t.palette.length];
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, r, start, drawEnd);
        if (this.donut()) {
          ctx.arc(cx, cy, innerR, drawEnd, start, true);
        }
        ctx.closePath();
        ctx.fillStyle = rgba(color, 1);
        ctx.fill();
      }
      acc = end;
      legend.push({ color: rgba(t.palette[i % t.palette.length], 1), label: d.label });
    });

    this.drawLegend(legend, this.H - 14);
  }

  protected hitTest(x: number, y: number): ChartHover | null {
    const data = this.data();
    if (!data.length) return null;
    const cx = this.W / 2;
    const cy = this.H / 2 - 8;
    const radius = Math.min(this.W, this.H) / 2 - 14;
    const innerR = radius * 0.58;
    const dx = x - cx;
    const dy = y - cy;
    const dist = Math.hypot(dx, dy);
    if (dist > radius || (this.donut() && dist < innerR)) return null;
    let ang = Math.atan2(dy, dx) + Math.PI / 2;
    if (ang < 0) ang += Math.PI * 2;
    const total = this.total();
    let acc = 0;
    for (let i = 0; i < data.length; i++) {
      const slice = (data[i].value / total) * Math.PI * 2;
      if (ang >= acc && ang < acc + slice) {
        return {
          title: data[i].label,
          lines: [`${data[i].value}`, `${((data[i].value / total) * 100).toFixed(1)}%`],
          color: rgba(this.theme.palette[i % this.theme.palette.length], 1),
        };
      }
      acc += slice;
    }
    return null;
  }
}
