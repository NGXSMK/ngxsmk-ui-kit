import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

export interface NgxsmkChartDataPoint {
  label: string;
  value: number;
}

@Component({
  standalone: true,
  selector: 'ngxsmk-chart-line',
  template: `
    <svg
      class="ngxsmk-chart-line__svg"
      [attr.width]="width()"
      [attr.height]="height()"
      [attr.viewBox]="viewBox()"
    >
      <text
        class="ngxsmk-chart-line__label"
        [attr.x]="0"
        [attr.y]="height() - 4"
      >{{ minLabel() }}</text>
      <text
        class="ngxsmk-chart-line__label"
        [attr.x]="width() - 30"
        [attr.y]="height() - 4"
      >{{ maxLabel() }}</text>
      <polyline
        class="ngxsmk-chart-line__line"
        [attr.points]="points()"
        [attr.stroke]="color()"
      />
    </svg>
  `,
  host: { class: 'ngxsmk-chart-line' },
  styles: `
    .ngxsmk-chart-line__svg {
      display: block;
      max-width: 100%;
      height: auto;
      overflow: visible;
    }
    .ngxsmk-chart-line__line {
      fill: none;
      stroke-width: 2;
      stroke-linejoin: round;
      stroke-linecap: round;
    }
    .ngxsmk-chart-line__label {
      font-family: var(--ngxsmk-font-sans);
      font-size: var(--ngxsmk-text-label-sm-size);
      fill: var(--ngxsmk-color-on-surface-variant);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkLineChart {
  readonly data = input<NgxsmkChartDataPoint[]>([]);
  readonly width = input(400);
  readonly height = input(200);
  readonly color = input('var(--ngxsmk-color-primary)');

  protected readonly values = computed(() => this.data().map((d) => d.value));

  protected readonly minVal = computed(() => Math.min(...this.values(), 0));

  protected readonly maxVal = computed(() => Math.max(...this.values(), 0));

  protected readonly range = computed(() => this.maxVal() - this.minVal() || 1);

  protected readonly minLabel = computed(() => String(this.minVal()));

  protected readonly maxLabel = computed(() => String(this.maxVal()));

  protected readonly viewBox = computed(
    () => `0 0 ${this.width()} ${this.height()}`,
  );

  protected readonly points = computed(() => {
    const w = this.width();
    const h = this.height();
    const pad = 16;
    const plotW = w - pad * 2;
    const plotH = h - pad * 2;
    const vals = this.values();
    const r = this.range();
    const min = this.minVal();
    return vals
      .map((v, i) => {
        const x = pad + (i / (vals.length - 1 || 1)) * plotW;
        const y = pad + plotH - ((v - min) / r) * plotH;
        return `${x},${y}`;
      })
      .join(' ');
  });
}
