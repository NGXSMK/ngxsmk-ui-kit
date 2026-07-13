import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface PivotRow {
  label: string;
  values: Record<string, number>;
}

@Component({
  selector: 'ngxsmk-pivot-table',
  template: `
    <div class="ngxsmk-pivot-table__grid">
      <div class="ngxsmk-pivot-table__header">{{ rowLabel() }}</div>
      @for (col of columns(); track col) {
        <div class="ngxsmk-pivot-table__header">{{ col }}</div>
      }
      @for (row of rows(); track row.label) {
        <div class="ngxsmk-pivot-table__row-label">{{ row.label }}</div>
        @for (col of columns(); track col) {
          <div class="ngxsmk-pivot-table__cell">{{ row.values[col] ?? '-' }}</div>
        }
      }
    </div>
  `,
  host: { class: 'ngxsmk-pivot-table' },
  styles: `
    :host { display: block; font-family: var(--ngxsmk-font-mono); font-size: 0.8125rem; border: 1px solid var(--ngxsmk-color-outline-variant); border-radius: var(--ngxsmk-radius-md); overflow: auto; }
    .ngxsmk-pivot-table__grid { display: grid; grid-template-columns: auto repeat(auto-fill, minmax(6rem, 1fr)); }
    .ngxsmk-pivot-table__header, .ngxsmk-pivot-table__row-label, .ngxsmk-pivot-table__cell { padding: var(--ngxsmk-space-2) var(--ngxsmk-space-3); border: 1px solid var(--ngxsmk-color-outline-variant); }
    .ngxsmk-pivot-table__header { background: var(--ngxsmk-color-surface-variant); font-weight: 600; color: var(--ngxsmk-color-on-surface); }
    .ngxsmk-pivot-table__row-label { font-weight: 500; background: var(--ngxsmk-color-surface-variant); }
    .ngxsmk-pivot-table__cell { text-align: right; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkPivotTable {
  readonly rows = input.required<PivotRow[]>();
  readonly columns = input.required<string[]>();
  readonly rowLabel = input('Category');
}
