import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface NgxsmkChartConfig {
  title?: string;
  type?: string;
}

@Component({
  standalone: true,
  selector: 'ngxsmk-chart-dashboard',
  template: `
    <div class="ngxsmk-chart-dashboard__grid" [style.grid-template-columns]="gridCols()">
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
    .ngxsmk-chart-dashboard__grid > * {
      display: block;
      padding: var(--ngxsmk-space-4);
      border: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
      border-radius: var(--ngxsmk-radius-lg, 0.75rem);
      background: var(--ngxsmk-color-surface, #ffffff);
      box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
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

  protected readonly gridCols = computed(() => `repeat(${this.columns()}, 1fr)`);
}
