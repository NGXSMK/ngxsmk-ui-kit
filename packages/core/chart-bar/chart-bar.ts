import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

export interface NgxsmkBarChartDataPoint {
  label: string;
  value: number;
}

@Component({
  selector: 'ngxsmk-chart-bar',
  template: `
    <svg
      class="ngxsmk-chart-bar__svg"
      [attr.width]="width()"
      [attr.height]="height()"
      [attr.viewBox]="viewBox()"
    >
      @for (bar of bars(); track $index) {
        <rect
          class="ngxsmk-chart-bar__rect"
          [attr.x]="bar.x"
          [attr.y]="bar.y"
          [attr.width]="bar.w"
          [attr.height]="bar.h"
          [attr.fill]="color()"
        />
      }
    </svg>
  `,
  host: { class: 'ngxsmk-chart-bar' },
  styles: `
    .ngxsmk-chart-bar__svg {
      display: block;
      max-width: 100%;
      height: auto;
      overflow: visible;
    }
    .ngxsmk-chart-bar__rect {
      transition: height var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkBarChart {
  readonly data = input<NgxsmkBarChartDataPoint[]>([]);
  readonly width = input(400);
  readonly height = input(200);
  readonly color = input('var(--ngxsmk-color-primary)');

  protected readonly values = computed(() => this.data().map((d) => d.value));

  protected readonly minVal = computed(() => Math.min(...this.values(), 0));

  protected readonly maxVal = computed(() => Math.max(...this.values(), 0));

  protected readonly range = computed(() => this.maxVal() - this.minVal() || 1);

  protected readonly viewBox = computed(
    () => `0 0 ${this.width()} ${this.height()}`,
  );

  protected readonly bars = computed(() => {
    const w = this.width();
    const h = this.height();
    const pad = 16;
    const plotW = w - pad * 2;
    const plotH = h - pad * 2;
    const vals = this.values();
    const r = this.range();
    const min = this.minVal();
    const count = vals.length || 1;
    const barW = plotW / count * 0.7;
    return vals.map((v, i) => {
      const barH = ((v - min) / r) * plotH;
      const x = pad + (i / count) * plotW + (plotW / count - barW) / 2;
      const y = pad + plotH - barH;
      return { x, y, w: barW, h: barH };
    });
  });
}
