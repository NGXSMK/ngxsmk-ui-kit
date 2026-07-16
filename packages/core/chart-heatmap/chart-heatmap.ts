import { ChangeDetectionStrategy, Component, computed, effect, input } from '@angular/core';
import { AbstractCanvasChart, ChartHover, SHARED_CHART_STYLES, mix, rgba } from '@ngxsmk/core/chart-engine';

export interface NgxsmkHeatmapLabels {
  x: string[];
  y: string[];
}

@Component({
  standalone: true,
  selector: 'ngxsmk-chart-heatmap',
  template: `
    <div class="ngxsmk-chart-surface">
      <canvas #canvas></canvas>
      <div #tooltip class="ngxsmk-chart-tip"></div>
    </div>
  `,
  host: { class: 'ngxsmk-chart-heatmap' },
  styles: SHARED_CHART_STYLES,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkHeatmapChart extends AbstractCanvasChart {
  readonly data = input<number[][]>([]);
  readonly labels = input<NgxsmkHeatmapLabels>({ x: [], y: [] });
  readonly color = input('var(--ngxsmk-color-primary)');

  private readonly flat = computed(() => this.data().flat().filter((v) => v !== undefined));
  private readonly minVal = computed(() => (this.flat().length ? Math.min(...this.flat()) : 0));
  private readonly maxVal = computed(() => (this.flat().length ? Math.max(...this.flat()) : 1));

  constructor() {
    super();
    effect(() => {
      this.data();
      this.labels();
      this.color();
      this.requestRender();
    });
  }

  protected draw(progress: number): void {
    const ctx = this.ctx;
    const t = this.theme;
    const data = this.data();
    const rows = data.length;
    if (!rows) return;
    const cols = Math.max(...data.map((r) => r.length), 1);
    const labelW = 48;
    const labelH = 22;
    const plot = this.plot;
    const cellW = (this.W - labelW) / cols;
    const cellH = (this.H - labelH) / rows;
    const lo = this.minVal();
    const hi = this.maxVal();
    const range = hi - lo || 1;
    const high = this.colorVar(this.color(), t.primary);
    const low = mix(t.surfaceVariant, t.surface, 0.4);

    data.forEach((row, ri) => {
      row.forEach((val, ci) => {
        const x = labelW + ci * cellW;
        const y = labelH + ri * cellH;
        const tt = (val - lo) / range;
        const color = mix(low, high, tt);
        const local = Math.max(0, Math.min(1, progress * 1.4 - (ri + ci) / (rows + cols)));
        ctx.globalAlpha = Math.max(0, local);
        ctx.fillStyle = rgba(color, 1);
        ctx.fillRect(x + 1, y + 1, cellW - 2, cellH - 2);
        ctx.globalAlpha = 1;
      });
    });

    ctx.fillStyle = rgba(t.onSurfaceVariant, 1);
    ctx.font = this.font;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'right';
    const yLabels = this.labels().y;
    data.forEach((_, ri) => {
      const y = labelH + ri * cellH + cellH / 2;
      ctx.fillText(yLabels[ri] ?? '', labelW - 6, y);
    });
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    const xLabels = this.labels().x;
    for (let ci = 0; ci < cols; ci++) {
      const x = labelW + ci * cellW + cellW / 2;
      ctx.fillText(xLabels[ci] ?? '', x, 4);
    }
  }

  protected hitTest(x: number, y: number): ChartHover | null {
    const data = this.data();
    const rows = data.length;
    if (!rows) return null;
    const cols = Math.max(...data.map((r) => r.length), 1);
    const labelW = 48;
    const labelH = 22;
    const cellW = (this.W - labelW) / cols;
    const cellH = (this.H - labelH) / rows;
    const ci = Math.floor((x - labelW) / cellW);
    const ri = Math.floor((y - labelH) / cellH);
    if (ri < 0 || ri >= rows || ci < 0 || ci >= cols) return null;
    const row = data[ri];
    const val = row?.[ci];
    if (val === undefined) return null;
    const xLabel = this.labels().x[ci] ?? '';
    const yLabel = this.labels().y[ri] ?? '';
    return {
      title: xLabel && yLabel ? `${yLabel} · ${xLabel}` : xLabel || yLabel,
      lines: [`${val}`],
      color: rgba(this.colorVar(this.color(), this.theme.primary), 1),
    };
  }
}
