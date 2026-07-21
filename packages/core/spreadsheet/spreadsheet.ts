import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'ngxsmk-spreadsheet',
  template: `
    <div class="ngxsmk-spreadsheet__table" role="grid">
      @for (row of data(); track $index) {
        <div class="ngxsmk-spreadsheet__row" role="row">
          @for (cell of row; track $index) {
            <div class="ngxsmk-spreadsheet__cell" role="gridcell">{{ cell }}</div>
          }
        </div>
      }
    </div>
  `,
  host: { class: 'ngxsmk-spreadsheet' },
  styles: `
    :host {
      display: block;
      overflow: auto;
      -webkit-overflow-scrolling: touch;
      border: 1px solid var(--ngxsmk-color-outline-variant);
      border-radius: var(--ngxsmk-radius-md);
      font-family: var(--ngxsmk-font-mono);
      font-size: var(--ngxsmk-text-body-sm-size);
    }
    .ngxsmk-spreadsheet__table {
      display: table;
      border-collapse: collapse;
      width: 100%;
    }
    .ngxsmk-spreadsheet__row {
      display: table-row;
    }
    .ngxsmk-spreadsheet__cell {
      display: table-cell;
      padding: var(--ngxsmk-space-2) var(--ngxsmk-space-3);
      border: 1px solid var(--ngxsmk-color-outline-variant);
      min-width: 6rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkSpreadsheet {
  readonly data = input.required<string[][]>();
  readonly columns = input<string[]>([]);
}
