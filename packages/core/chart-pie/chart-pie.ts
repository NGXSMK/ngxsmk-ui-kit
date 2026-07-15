import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface NgxsmkPieChartDataPoint {
  label: string;
  value: number;
}

@Component({
  standalone: true,
  selector: 'ngxsmk-chart-pie',
  template: `
    <svg
      class="ngxsmk-chart-pie__svg"
      [attr.width]="size()"
      [attr.height]="size()"
      [attr.viewBox]="viewBox()"
    >
      @for (slice of slices(); track $index) {
        <path class="ngxsmk-chart-pie__slice" [attr.d]="slice.d" [attr.fill]="slice.fill" />
      }
      @if (donut()) {
        <circle
          class="ngxsmk-chart-pie__hole"
          [attr.cx]="cx()"
          [attr.cy]="cy()"
          [attr.r]="innerRadius()"
        />
      }
    </svg>
  `,
  host: { class: 'ngxsmk-chart-pie' },
  styles: `
    .ngxsmk-chart-pie__svg {
      display: block;
      max-width: 100%;
      height: auto;
      overflow: visible;
    }
    .ngxsmk-chart-pie__hole {
      fill: var(--ngxsmk-color-surface, #fff);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkPieChart {
  readonly data = input<NgxsmkPieChartDataPoint[]>([]);
  readonly size = input(200);
  readonly donut = input(false);

  protected readonly cx = computed(() => this.size() / 2);

  protected readonly cy = computed(() => this.size() / 2);

  protected readonly radius = computed(() => this.size() / 2 - 8);

  protected readonly innerRadius = computed(() => this.radius() * 0.55);

  protected readonly viewBox = computed(() => `0 0 ${this.size()} ${this.size()}`);

  protected readonly total = computed(() => this.data().reduce((a, d) => a + d.value, 0));

  protected readonly palette = [
    'var(--ngxsmk-color-primary)',
    'var(--ngxsmk-color-secondary)',
    'var(--ngxsmk-color-tertiary)',
    'var(--ngxsmk-color-error)',
    'var(--ngxsmk-color-warning)',
    'var(--ngxsmk-color-success)',
    'var(--ngxsmk-color-info)',
    'var(--ngxsmk-color-surface-variant)',
  ];

  protected readonly slices = computed(() => {
    const total = this.total() || 1;
    const r = this.radius();
    const cx = this.cx();
    const cy = this.cy();
    let startAngle = 0;
    return this.data().map((d, i) => {
      const sliceAngle = (d.value / total) * 360;
      const endAngle = startAngle + sliceAngle;
      const startRad = ((startAngle - 90) * Math.PI) / 180;
      const endRad = ((endAngle - 90) * Math.PI) / 180;
      const x1 = cx + r * Math.cos(startRad);
      const y1 = cy + r * Math.sin(startRad);
      const x2 = cx + r * Math.cos(endRad);
      const y2 = cy + r * Math.sin(endRad);
      const largeArc = sliceAngle > 180 ? 1 : 0;
      const pathData = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
      const slice = { d: pathData, fill: this.palette[i % this.palette.length] };
      startAngle = endAngle;
      return slice;
    });
  });
}
