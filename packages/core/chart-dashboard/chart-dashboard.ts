import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

export interface NgxsmkChartConfig {
  title?: string;
  type?: string;
}

@Component({
  standalone: true,
  selector: 'ngxsmk-chart-dashboard',
  template: `
    <div
      class="ngxsmk-chart-dashboard__grid"
      [style.grid-template-columns]="gridCols()"
    >
      <ng-content />
    </div>
  `,
  host: { class: 'ngxsmk-chart-dashboard' },
  styles: `
    :host {
      display: block;
    }
    .ngxsmk-chart-dashboard__grid {
      display: grid;
      gap: var(--ngxsmk-space-4);
    }
    @media (max-width: 768px) {
      .ngxsmk-chart-dashboard__grid {
        grid-template-columns: 1fr !important;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkChartDashboard {
  readonly charts = input<NgxsmkChartConfig[]>([]);
  readonly columns = input(2);

  protected readonly gridCols = computed(() =>
    `repeat(${this.columns()}, 1fr)`,
  );
}
