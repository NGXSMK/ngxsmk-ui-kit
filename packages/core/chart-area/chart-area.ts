import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

export interface NgxsmkAreaChartDataPoint {
  label: string;
  value: number;
}

@Component({
  standalone: true,
  selector: 'ngxsmk-chart-area',
  template: `
    <svg
      class="ngxsmk-chart-area__svg"
      [attr.width]="width()"
      [attr.height]="height()"
      [attr.viewBox]="viewBox()"
    >
      <defs>
        <linearGradient
          [id]="gradientId()"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop offset="0%" [attr.stop-color]="color()" stop-opacity="0.4" />
          <stop offset="100%" [attr.stop-color]="color()" stop-opacity="0.05" />
        </linearGradient>
      </defs>
      <path
        class="ngxsmk-chart-area__area"
        [attr.d]="areaPath()"
        [attr.fill]="areaFill()"
      />
      <polyline
        class="ngxsmk-chart-area__line"
        [attr.points]="points()"
        [attr.stroke]="color()"
      />
    </svg>
  `,
  host: { class: 'ngxsmk-chart-area' },
  styles: `
    .ngxsmk-chart-area__svg {
      display: block;
      max-width: 100%;
      height: auto;
      overflow: visible;
    }
    .ngxsmk-chart-area__line {
      fill: none;
      stroke-width: 2;
      stroke-linejoin: round;
      stroke-linecap: round;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkAreaChart {
  readonly data = input<NgxsmkAreaChartDataPoint[]>([]);
  readonly width = input(400);
  readonly height = input(200);
  readonly color = input('var(--ngxsmk-color-primary)');

  protected readonly uid = computed(() =>
    `ngxsmk-area-${NgxsmkAreaChart._uid++}`,
  );

  protected readonly gradientId = computed(() => `${this.uid()}-gradient`);

  protected readonly areaFill = computed(
    () => `url(#${this.gradientId()})`,
  );

  protected readonly values = computed(() => this.data().map((d) => d.value));

  protected readonly minVal = computed(() => Math.min(...this.values(), 0));

  protected readonly maxVal = computed(() => Math.max(...this.values(), 0));

  protected readonly range = computed(() => this.maxVal() - this.minVal() || 1);

  protected readonly viewBox = computed(
    () => `0 0 ${this.width()} ${this.height()}`,
  );

  protected readonly coords = computed(() => {
    const w = this.width();
    const h = this.height();
    const pad = 16;
    const plotW = w - pad * 2;
    const plotH = h - pad * 2;
    const vals = this.values();
    const r = this.range();
    const min = this.minVal();
    return vals.map((v, i) => {
      const x = pad + (i / (vals.length - 1 || 1)) * plotW;
      const y = pad + plotH - ((v - min) / r) * plotH;
      return { x, y };
    });
  });

  protected readonly points = computed(() =>
    this.coords().map((c) => `${c.x},${c.y}`).join(' '),
  );

  protected readonly areaPath = computed(() => {
    const h = this.height();
    const pad = 16;
    const plotH = h - pad * 2;
    const baseY = pad + plotH;
    const coords = this.coords();
    if (coords.length === 0) return '';
    const top = coords.map((c) => `${c.x},${c.y}`).join(' L ');
    return `M ${coords[0].x},${baseY} L ${top} L ${coords[coords.length - 1].x},${baseY} Z`;
  });

  private static _uid = 0;
}
