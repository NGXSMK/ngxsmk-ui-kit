import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

export interface NgxsmkScatterDataPoint {
  x: number;
  y: number;
  label?: string;
}

@Component({
  standalone: true,
  selector: 'ngxsmk-chart-scatter',
  template: `
    <svg
      class="ngxsmk-chart-scatter__svg"
      [attr.width]="width()"
      [attr.height]="height()"
      [attr.viewBox]="viewBox()"
    >
      @for (pt of circles(); track $index) {
        <g>
          <circle
            class="ngxsmk-chart-scatter__dot"
            [attr.cx]="pt.cx"
            [attr.cy]="pt.cy"
            r="4"
            [attr.fill]="color()"
          />
          @if (pt.label) {
            <text
              class="ngxsmk-chart-scatter__label"
              [attr.x]="pt.cx"
              [attr.y]="pt.cy - 8"
              text-anchor="middle"
            >{{ pt.label }}</text>
          }
        </g>
      }
    </svg>
  `,
  host: { class: 'ngxsmk-chart-scatter' },
  styles: `
    .ngxsmk-chart-scatter__svg {
      display: block;
      max-width: 100%;
      height: auto;
      overflow: visible;
    }
    .ngxsmk-chart-scatter__dot {
      transition: cx var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out),
                  cy var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out);
    }
    .ngxsmk-chart-scatter__label {
      font-family: var(--ngxsmk-font-sans);
      font-size: var(--ngxsmk-text-label-sm-size);
      fill: var(--ngxsmk-color-on-surface-variant);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkScatterChart {
  readonly data = input<NgxsmkScatterDataPoint[]>([]);
  readonly width = input(400);
  readonly height = input(200);

  protected readonly color = input('var(--ngxsmk-color-primary)');

  protected readonly xs = computed(() => this.data().map((d) => d.x));

  protected readonly ys = computed(() => this.data().map((d) => d.y));

  protected readonly minX = computed(() => Math.min(...this.xs(), 0));

  protected readonly maxX = computed(() => Math.max(...this.xs(), 0));

  protected readonly minY = computed(() => Math.min(...this.ys(), 0));

  protected readonly maxY = computed(() => Math.max(...this.ys(), 0));

  protected readonly rangeX = computed(
    () => this.maxX() - this.minX() || 1,
  );

  protected readonly rangeY = computed(
    () => this.maxY() - this.minY() || 1,
  );

  protected readonly viewBox = computed(
    () => `0 0 ${this.width()} ${this.height()}`,
  );

  protected readonly circles = computed(() => {
    const w = this.width();
    const h = this.height();
    const pad = 20;
    const plotW = w - pad * 2;
    const plotH = h - pad * 2;
    const minX = this.minX();
    const minY = this.minY();
    const rx = this.rangeX();
    const ry = this.rangeY();
    return this.data().map((d) => ({
      cx: pad + ((d.x - minX) / rx) * plotW,
      cy: pad + plotH - ((d.y - minY) / ry) * plotH,
      label: d.label,
    }));
  });
}
