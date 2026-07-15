import { ChangeDetectionStrategy, Component, booleanAttribute, input, output } from '@angular/core';

export interface NgxsmkTableColumn {
  key: string;
  label: string;
}

@Component({
  standalone: true,
  selector: 'ngxsmk-table',
  template: `
    <table class="ngxsmk-table__element">
      @if (columns().length) {
        <thead class="ngxsmk-table__head">
          <tr class="ngxsmk-table__row">
            @for (col of columns(); track col.key) {
              <th
                class="ngxsmk-table__header-cell"
                scope="col"
                [attr.aria-sort]="ariaSort(col.key)"
              >
                @if (sortable()) {
                  <button
                    type="button"
                    class="ngxsmk-table__sort-btn"
                    (click)="onSort(col.key)"
                  >
                    <span>{{ col.label }}</span>
                    <span
                      class="ngxsmk-table__sort-icon"
                      [attr.data-state]="sortState(col.key)"
                      aria-hidden="true"
                    >
                      <svg viewBox="0 0 16 16" width="12" height="12">
                        <path d="M4 10l4-4 4 4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    </span>
                  </button>
                } @else {
                  {{ col.label }}
                }
              </th>
            }
          </tr>
        </thead>
      }
      <tbody class="ngxsmk-table__body">
        @for (row of rows(); track $index) {
          <tr
            class="ngxsmk-table__row"
            [attr.data-striped]="striped() && $index % 2 !== 0 ? '' : null"
          >
            @if (columns().length) {
              @for (col of columns(); track col.key) {
                <td class="ngxsmk-table__cell">{{ row[col.key] }}</td>
              }
            } @else {
              <td class="ngxsmk-table__cell" colspan="1"><ng-content /></td>
            }
          </tr>
        }
      </tbody>
    </table>
  `,
  host: { class: 'ngxsmk-table', '[attr.data-striped]': 'striped() ? "" : null' },
  styles: `
    :host {
      display: block;
      width: 100%;
      overflow-x: auto;
      font-family: var(--ngxsmk-font-sans);
      font-size: var(--ngxsmk-text-body-sm-size);
      line-height: var(--ngxsmk-text-body-sm-line);
      color: var(--ngxsmk-color-on-surface);
    }

    .ngxsmk-table__element {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid var(--ngxsmk-color-outline);
    }

    .ngxsmk-table__header-cell {
      padding: var(--ngxsmk-space-3) var(--ngxsmk-space-4);
      background: var(--ngxsmk-color-surface-variant);
      color: var(--ngxsmk-color-on-surface);
      font-weight: 600;
      text-align: start;
      border-bottom: 2px solid var(--ngxsmk-color-outline-strong);
      white-space: nowrap;
    }

    .ngxsmk-table__sort-btn {
      display: inline-flex;
      align-items: center;
      gap: var(--ngxsmk-space-2);
      margin: 0;
      padding: 0;
      border: none;
      background: none;
      color: inherit;
      font: inherit;
      font-weight: inherit;
      cursor: pointer;
      border-radius: var(--ngxsmk-radius-sm);
    }
    .ngxsmk-table__sort-btn:focus-visible {
      outline: 2px solid var(--ngxsmk-color-ring);
      outline-offset: 2px;
    }

    .ngxsmk-table__sort-icon {
      display: inline-flex;
      color: var(--ngxsmk-color-on-surface-variant);
      opacity: 0.4;
      transition:
        opacity var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out),
        transform var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out);
    }
    .ngxsmk-table__sort-icon[data-state='asc'] { opacity: 1; color: var(--ngxsmk-color-primary); }
    .ngxsmk-table__sort-icon[data-state='desc'] { opacity: 1; color: var(--ngxsmk-color-primary); transform: rotate(180deg); }

    .ngxsmk-table__cell {
      padding: var(--ngxsmk-space-3) var(--ngxsmk-space-4);
      border-bottom: 1px solid var(--ngxsmk-color-outline);
    }

    :host([data-striped]) .ngxsmk-table__row[data-striped] .ngxsmk-table__cell {
      background: var(--ngxsmk-color-surface-variant);
    }

    .ngxsmk-table__row:last-child .ngxsmk-table__cell {
      border-bottom: none;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkTable {
  readonly columns = input<NgxsmkTableColumn[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly rows = input<any[]>([]);
  readonly striped = input(false, { transform: booleanAttribute });

  /** Renders headers as clickable sort controls. */
  readonly sortable = input(false, { transform: booleanAttribute });
  /** Key of the currently sorted column (for the indicator + aria-sort). */
  readonly sortField = input<string>('');
  /** Direction of the current sort. */
  readonly sortDir = input<'asc' | 'desc'>('asc');

  /** Emits the column key when a sortable header is activated. */
  readonly sortChange = output<string>();

  protected onSort(key: string): void {
    this.sortChange.emit(key);
  }

  protected sortState(key: string): 'asc' | 'desc' | null {
    return this.sortField() === key ? this.sortDir() : null;
  }

  protected ariaSort(key: string): 'ascending' | 'descending' | 'none' | null {
    if (!this.sortable()) return null;
    if (this.sortField() !== key) return 'none';
    return this.sortDir() === 'asc' ? 'ascending' : 'descending';
  }
}
