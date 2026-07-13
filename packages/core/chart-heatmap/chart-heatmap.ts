import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

export interface NgxsmkHeatmapLabels {
  x: string[];
  y: string[];
}

@Component({
  selector: 'ngxsmk-chart-heatmap',
  template: `
    <svg
      class="ngxsmk-chart-heatmap__svg"
      [attr.width]="width()"
      [attr.height]="height()"
      [attr.viewBox]="viewBox()"
    >
      @for (row of cells(); track $index) {
        @for (cell of row; track $index) {
          <g>
            <rect
              class="ngxsmk-chart-heatmap__cell"
              [attr.x]="cell.x"
              [attr.y]="cell.y"
              [attr.width]="cell.w"
              [attr.height]="cell.h"
              [attr.fill]="cell.fill"
            />
            <text
              class="ngxsmk-chart-heatmap__value"
              [attr.x]="cell.x + cell.w / 2"
              [attr.y]="cell.y + cell.h / 2"
              text-anchor="middle"
              dominant-baseline="central"
            >{{ cell.label }}</text>
          </g>
        }
      }
    </svg>
  `,
  host: { class: 'ngxsmk-chart-heatmap' },
  styles: `
    .ngxsmk-chart-heatmap__svg {
      display: block;
      max-width: 100%;
      height: auto;
      overflow: visible;
    }
    .ngxsmk-chart-heatmap__cell {
      stroke: var(--ngxsmk-color-surface);
      stroke-width: 1;
    }
    .ngxsmk-chart-heatmap__value {
      font-family: var(--ngxsmk-font-sans);
      font-size: var(--ngxsmk-text-label-sm-size);
      fill: var(--ngxsmk-color-on-surface);
      pointer-events: none;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkHeatmapChart {
  readonly data = input<number[][]>([]);
  readonly labels = input<NgxsmkHeatmapLabels>({ x: [], y: [] });
  readonly width = input(400);
  readonly height = input(200);

  protected readonly flatValues = computed(() =>
    this.data().flat().filter((v) => v !== undefined),
  );

  protected readonly minVal = computed(() =>
    this.flatValues().length ? Math.min(...this.flatValues()) : 0,
  );

  protected readonly maxVal = computed(() =>
    this.flatValues().length ? Math.max(...this.flatValues()) : 1,
  );

  protected readonly viewBox = computed(
    () => `0 0 ${this.width()} ${this.height()}`,
  );

  protected readonly cells = computed(() => {
    const rows = this.data().length || 1;
    const cols = this.data().length
      ? Math.max(...this.data().map((r) => r.length), 1)
      : 1;
    const labelW = 50;
    const labelH = 20;
    const cellW = (this.width() - labelW) / cols;
    const cellH = (this.height() - labelH) / rows;
    const range = this.maxVal() - this.minVal() || 1;

    const interpolate = (val: number) => {
      const t = (val - this.minVal()) / range;
      const r = Math.round(255 - t * 200);
      const g = Math.round(255 - t * 200);
      const b = 255;
      return `rgb(${r},${g},${b})`;
    };

    return this.data().map((row, ri) =>
      row.map((val, ci) => ({
        x: labelW + ci * cellW,
        y: labelH + ri * cellH,
        w: cellW,
        h: cellH,
        fill: interpolate(val),
        label: String(val),
      })),
    );
  });
}
