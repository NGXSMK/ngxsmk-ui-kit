import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  effect,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { NgxsmkTable, NgxsmkTableColumn, NgxsmkCellDef } from '@ngxsmk/core/table';
import { NgxsmkCheckbox } from '@ngxsmk/core/checkbox';

/**
 * Paginated, filterable data table built on `ngxsmk-table`.
 *
 * ```html
 * <ngxsmk-data-table
 *   [columns]="cols"
 *   [rows]="rows"
 *   [sortable]="true"
 *   [selectable]="true"
 *   [columnFilterable]="true"
 *   [(columnFilters)]="filters"
 *   [virtual]="true"
 *   virtualHeight="22rem"
 *   [(selectedKeys)]="selected"
 *   rowKey="id"
 * />
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-data-table',
  template: `
    @if (loading()) {
      <div
        class="ngxsmk-data-table__loading-bar"
        role="progressbar"
        aria-label="Loading data"
      ></div>
    }

    @if (columnFilterable() && filterableColumns().length) {
      <div class="ngxsmk-data-table__filters" role="search">
        @for (col of filterableColumns(); track col.key) {
          <label class="ngxsmk-data-table__filter">
            <span class="ngxsmk-data-table__filter-label">{{ col.label }}</span>
            <input
              type="search"
              class="ngxsmk-data-table__filter-input"
              [attr.aria-label]="'Filter ' + col.label"
              [value]="columnFilters()[col.key] ?? ''"
              (input)="setColumnFilter(col.key, $any($event.target).value)"
            />
          </label>
        }
      </div>
    }

    <div
      class="ngxsmk-data-table__viewport"
      [class.ngxsmk-data-table__viewport--virtual]="virtual()"
      [style.maxHeight]="virtual() ? virtualHeight() : null"
      (scroll)="onVirtualScroll($event)"
    >
      @if (virtual()) {
        <div
          class="ngxsmk-data-table__virtual-space"
          [style.height.px]="processedRows().length * rowHeight()"
        >
          <div
            class="ngxsmk-data-table__virtual-window"
            [style.transform]="'translateY(' + virtualPadTop() + 'px)'"
          >
            <ngxsmk-table
              [columns]="displayColumns()"
              [rows]="displayRows()"
              [striped]="striped()"
              [sortable]="sortable()"
              [resizable]="resizable()"
              [reorderable]="reorderable()"
              [columnWidths]="columnWidths()"
              [sortField]="sortField()"
              [sortDir]="sortDir()"
              (sortChange)="sortBy($event)"
              (columnResize)="onColumnResize($event)"
              (columnReorder)="onColumnReorder($event)"
            >
              @if (selectable()) {
                <ng-template ngxsmkCell="__select" let-row="row">
                  <ngxsmk-checkbox
                    [checked]="isSelected(row)"
                    (changed)="toggleRow(row, $event)"
                    [attr.aria-label]="'Select row'"
                  />
                </ng-template>
              }
            </ngxsmk-table>
          </div>
        </div>
      } @else {
        <ngxsmk-table
          [columns]="displayColumns()"
          [rows]="displayRows()"
          [striped]="striped()"
          [sortable]="sortable()"
          [resizable]="resizable()"
          [reorderable]="reorderable()"
          [columnWidths]="columnWidths()"
          [sortField]="sortField()"
          [sortDir]="sortDir()"
          (sortChange)="sortBy($event)"
          (columnResize)="onColumnResize($event)"
          (columnReorder)="onColumnReorder($event)"
        >
          @if (selectable()) {
            <ng-template ngxsmkCell="__select" let-row="row">
              <ngxsmk-checkbox
                [checked]="isSelected(row)"
                (changed)="toggleRow(row, $event)"
                [attr.aria-label]="'Select row'"
              />
            </ng-template>
          }
        </ngxsmk-table>
      }
    </div>

    @if (visibleCount() === 0 && !loading()) {
      <div class="ngxsmk-data-table__empty">
        {{ emptyMessage() }}
      </div>
    }

    @if (!virtual()) {
      <div class="ngxsmk-data-table__footer">
        <span class="ngxsmk-data-table__info">
          {{ pageInfo() }}
          @if (selectable() && selectedKeys().length) {
            <span class="ngxsmk-data-table__selected"> · {{ selectedKeys().length }} selected</span>
          }
        </span>
        <div class="ngxsmk-data-table__pagination">
          <button
            type="button"
            class="ngxsmk-data-table__page-btn"
            [disabled]="currentPage() <= 1"
            (click)="goToPage(currentPage() - 1)"
            aria-label="Previous page"
          >
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
              <path
                d="M10 3L5 8l5 5"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
          @for (p of pages(); track p) {
            <button
              type="button"
              class="ngxsmk-data-table__page-btn"
              [attr.aria-current]="p === currentPage() ? 'page' : null"
              [attr.data-active]="p === currentPage() ? '' : null"
              (click)="goToPage(p)"
            >
              {{ p }}
            </button>
          }
          <button
            type="button"
            class="ngxsmk-data-table__page-btn"
            [disabled]="currentPage() >= totalPages()"
            (click)="goToPage(currentPage() + 1)"
            aria-label="Next page"
          >
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
              <path
                d="M6 3l5 5-5 5"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    } @else {
      <div class="ngxsmk-data-table__footer">
        <span class="ngxsmk-data-table__info">{{ virtualInfo() }}</span>
      </div>
    }
  `,
  host: { class: 'ngxsmk-data-table' },
  styles: `
    :host {
      display: block;
      width: 100%;
      font-family: var(--ngxsmk-font-sans);
      position: relative;
    }

    .ngxsmk-data-table__loading-bar {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: var(--ngxsmk-data-table-loading-height, 3px);
      background: var(--ngxsmk-color-primary);
      z-index: 2;
      animation: ngxsmk-pulse 1.2s infinite ease-in-out;
    }

    @keyframes ngxsmk-pulse {
      0%,
      100% {
        opacity: 0.3;
      }
      50% {
        opacity: 1;
      }
    }

    .ngxsmk-data-table__empty {
      padding: var(--ngxsmk-space-6) var(--ngxsmk-space-4);
      text-align: center;
      border: 1px solid var(--ngxsmk-data-table-border, var(--ngxsmk-color-outline));
      border-top: none;
      color: var(--ngxsmk-color-on-surface-variant);
      font-size: var(--ngxsmk-text-body-sm-size);
    }

    .ngxsmk-data-table__filters {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
      gap: var(--ngxsmk-space-2);
      padding: var(--ngxsmk-space-3);
      border: 1px solid var(--ngxsmk-data-table-border, var(--ngxsmk-color-outline));
      border-bottom: none;
      border-radius: var(--ngxsmk-data-table-radius, var(--ngxsmk-radius-md))
        var(--ngxsmk-data-table-radius, var(--ngxsmk-radius-md)) 0 0;
      background: var(
        --ngxsmk-data-table-filter-bg,
        color-mix(in srgb, var(--ngxsmk-color-surface-variant) 40%, transparent)
      );
    }

    .ngxsmk-data-table__filter {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      min-width: 0;
    }

    .ngxsmk-data-table__filter-label {
      font-size: var(--ngxsmk-data-table-filter-label-size, 0.7rem);
      font-weight: 600;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: var(--ngxsmk-color-on-surface-variant);
    }

    .ngxsmk-data-table__filter-input {
      width: 100%;
      box-sizing: border-box;
      height: var(--ngxsmk-control-height-sm, 2rem);
      padding: 0 0.55rem;
      border: 1px solid var(--ngxsmk-input-border, var(--ngxsmk-color-outline));
      border-radius: var(--ngxsmk-input-radius, var(--ngxsmk-radius-sm));
      background: var(--ngxsmk-input-bg, var(--ngxsmk-color-surface));
      color: var(--ngxsmk-input-color, var(--ngxsmk-color-on-surface));
      font: inherit;
      font-size: var(--ngxsmk-text-body-sm-size);
    }

    .ngxsmk-data-table__filter-input:focus-visible {
      outline: none;
      border-color: var(--ngxsmk-color-ring);
      box-shadow: var(--ngxsmk-focus-ring);
    }

    .ngxsmk-data-table__viewport--virtual {
      overflow: auto;
      border: 1px solid var(--ngxsmk-data-table-border, var(--ngxsmk-color-outline));
      border-radius: var(--ngxsmk-data-table-radius, var(--ngxsmk-radius-md));
    }

    .ngxsmk-data-table__virtual-space {
      position: relative;
      width: 100%;
    }

    .ngxsmk-data-table__virtual-window {
      position: absolute;
      inset-inline: 0;
      top: 0;
      will-change: transform;
    }

    .ngxsmk-data-table__footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--ngxsmk-space-4);
      padding: var(--ngxsmk-space-3) var(--ngxsmk-space-4);
      border: 1px solid var(--ngxsmk-data-table-border, var(--ngxsmk-color-outline));
      border-top: none;
      font-size: var(--ngxsmk-text-body-sm-size);
      line-height: var(--ngxsmk-text-body-sm-line);
      color: var(--ngxsmk-color-on-surface-variant);
    }

    .ngxsmk-data-table__info {
      flex: 1;
    }

    .ngxsmk-data-table__selected {
      color: var(--ngxsmk-color-primary);
      font-weight: var(--ngxsmk-font-weight-medium, 500);
    }

    .ngxsmk-data-table__pagination {
      display: flex;
      align-items: center;
      gap: var(--ngxsmk-space-1);
    }

    .ngxsmk-data-table__page-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: var(--ngxsmk-data-table-page-size, 2rem);
      height: var(--ngxsmk-data-table-page-size, 2rem);
      padding: 0 var(--ngxsmk-space-1);
      border: 1px solid transparent;
      border-radius: var(--ngxsmk-pagination-radius, var(--ngxsmk-radius-sm));
      background: transparent;
      color: var(--ngxsmk-color-on-surface);
      font-family: inherit;
      font-size: inherit;
      cursor: pointer;
      transition: background var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out);
    }

    .ngxsmk-data-table__page-btn:hover:not(:disabled) {
      background: var(--ngxsmk-color-surface-hover);
    }

    .ngxsmk-data-table__page-btn--active {
      background: var(--ngxsmk-color-primary);
      color: var(--ngxsmk-color-on-primary);
      font-weight: var(--ngxsmk-font-weight-semibold, 600);
    }

    .ngxsmk-data-table__page-btn:disabled {
      opacity: var(--ngxsmk-opacity-disabled);
      cursor: not-allowed;
    }

    .ngxsmk-data-table__page-btn:focus-visible {
      outline: none;
      box-shadow: var(--ngxsmk-focus-ring);
    }

    @media (max-width: 768px) {
      .ngxsmk-data-table__footer {
        flex-wrap: wrap;
      }
      .ngxsmk-data-table__pagination {
        flex-wrap: wrap;
        justify-content: flex-end;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgxsmkTable, NgxsmkCellDef, NgxsmkCheckbox],
})
export class NgxsmkDataTable {
  readonly columns = input<NgxsmkTableColumn[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly rows = input<any[]>([]);
  readonly pageSize = input(10);
  readonly filter = input('');
  readonly emptyMessage = input('No records found');
  readonly loading = input(false, { transform: booleanAttribute });
  readonly sortable = input(false, { transform: booleanAttribute });
  readonly striped = input(false, { transform: booleanAttribute });
  /**
   * When true, skip client filter/sort/slice — `rows` is the current page and
   * `totalItems` drives pagination. Wire `(pageChange)` / `(sortChange)`.
   */
  readonly serverMode = input(false, { transform: booleanAttribute });
  /** Total row count across all pages (serverMode). */
  readonly totalItems = input(0);
  readonly selectable = input(false, { transform: booleanAttribute });
  /** Drag the header edge to resize columns. */
  readonly resizable = input(false, { transform: booleanAttribute });
  /** Drag headers to reorder columns. */
  readonly reorderable = input(false, { transform: booleanAttribute });
  /** Show per-column search inputs for columns with `filterable: true`. */
  readonly columnFilterable = input(false, { transform: booleanAttribute });
  /**
   * Window large client datasets instead of paginating. Pair with
   * `virtualHeight` / `rowHeight`. Ignores `pageSize` pagination UI.
   */
  readonly virtual = input(false, { transform: booleanAttribute });
  readonly virtualHeight = input('24rem');
  /** Estimated row height in px for virtual windowing. */
  readonly rowHeight = input(40);
  /** Object key used for selection identity. */
  readonly rowKey = input('id');
  readonly selectedKeys = model<(string | number)[]>([]);
  readonly columnWidths = model<Record<string, string>>({});
  readonly columnFilters = model<Record<string, string>>({});

  readonly pageChange = output<{ page: number; pageSize: number }>();
  readonly sortChange = output<{ field: string; dir: 'asc' | 'desc' }>();
  readonly selectionChange = output<(string | number)[]>();
  readonly columnsChange = output<NgxsmkTableColumn[]>();

  protected readonly sortField = signal<string>('');
  protected readonly sortDir = signal<'asc' | 'desc'>('asc');
  protected readonly currentPage = signal(1);
  protected readonly orderedColumns = signal<NgxsmkTableColumn[] | null>(null);
  protected readonly virtualStart = signal(0);

  constructor() {
    effect(() => {
      const total = this.totalPages();
      if (this.currentPage() > total) this.currentPage.set(total);
    });
    effect(() => {
      // Reset local order when the parent columns input identity changes.
      this.columns();
      this.orderedColumns.set(null);
    });
  }

  protected readonly processedRows = computed(() => {
    if (this.serverMode()) {
      return [...this.rows()];
    }
    let data = [...this.rows()];
    const q = this.filter().trim().toLowerCase();
    if (q) {
      data = data.filter((row) =>
        Object.values(row).some((val) => val != null && String(val).toLowerCase().includes(q)),
      );
    }
    const filters = this.columnFilters();
    for (const [key, raw] of Object.entries(filters)) {
      const fq = raw?.trim().toLowerCase();
      if (!fq) continue;
      data = data.filter((row) => String(row?.[key] ?? '').toLowerCase().includes(fq));
    }
    const field = this.sortField();
    if (field && this.sortable()) {
      const dir = this.sortDir();
      data.sort((a, b) => {
        const av = a[field];
        const bv = b[field];
        if (av == null) {
          return 1;
        }
        if (bv == null) {
          return -1;
        }
        const cmp = typeof av === 'string' ? av.localeCompare(bv) : av - bv;
        return dir === 'asc' ? cmp : -cmp;
      });
    }
    return data;
  });

  protected readonly filterableColumns = computed(() =>
    (this.orderedColumns() ?? this.columns()).filter((c) => c.filterable),
  );

  protected readonly virtualWindow = computed(() => {
    const rh = Math.max(24, this.rowHeight());
    // Rough viewport capacity from height string like `24rem` → assume 16px rem.
    const raw = this.virtualHeight().trim();
    let vh = 384;
    if (raw.endsWith('rem')) vh = parseFloat(raw) * 16;
    else if (raw.endsWith('px')) vh = parseFloat(raw);
    const capacity = Math.max(8, Math.ceil(vh / rh) + 4);
    return capacity;
  });

  protected readonly virtualPadTop = computed(() => this.virtualStart() * this.rowHeight());

  protected readonly virtualInfo = computed(() => {
    const total = this.visibleCount();
    if (!total) return '0 items';
    const start = this.virtualStart() + 1;
    const end = Math.min(total, this.virtualStart() + this.displayRows().length);
    return `${start}–${end} of ${total}`;
  });

  protected readonly visibleCount = computed(() =>
    this.serverMode() ? this.totalItems() || this.rows().length : this.processedRows().length,
  );

  protected readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.visibleCount() / this.pageSize())),
  );

  protected readonly displayRows = computed(() => {
    if (this.serverMode()) {
      return this.processedRows();
    }
    if (this.virtual()) {
      const start = this.virtualStart();
      return this.processedRows().slice(start, start + this.virtualWindow());
    }
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.processedRows().slice(start, start + this.pageSize());
  });

  protected readonly displayColumns = computed<NgxsmkTableColumn[]>(() => {
    const cols = this.orderedColumns() ?? this.columns();
    if (!this.selectable()) {
      return cols;
    }
    return [{ key: '__select', label: '', width: '2.75rem' }, ...cols];
  });

  protected readonly pageInfo = computed(() => {
    const total = this.visibleCount();
    if (this.serverMode()) {
      const start = (this.currentPage() - 1) * this.pageSize() + 1;
      const end = Math.min(this.currentPage() * this.pageSize(), total);
      return total > 0 ? `${start}–${end} of ${total}` : '0 items';
    }
    const start = (this.currentPage() - 1) * this.pageSize() + 1;
    const end = Math.min(this.currentPage() * this.pageSize(), total);
    return total > 0 ? `${start}–${end} of ${total}` : '0 items';
  });

  protected readonly pages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const maxVisible = 5;
    let start = Math.max(1, current - Math.floor(maxVisible / 2));
    const end = Math.min(total, start + maxVisible - 1);
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }
    const result: number[] = [];
    for (let i = start; i <= end; i++) {
      result.push(i);
    }
    return result;
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected rowId(row: any): string | number {
    const key = this.rowKey();
    return row?.[key] ?? JSON.stringify(row);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected isSelected(row: any): boolean {
    const id = this.rowId(row);
    return this.selectedKeys().includes(id);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected toggleRow(row: any, checked: boolean): void {
    const id = this.rowId(row);
    const next = checked
      ? [...this.selectedKeys(), id]
      : this.selectedKeys().filter((k) => k !== id);
    this.selectedKeys.set(next);
    this.selectionChange.emit(next);
  }

  protected goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) {
      return;
    }
    this.currentPage.set(page);
    this.pageChange.emit({ page, pageSize: this.pageSize() });
  }

  protected onColumnResize(event: { key: string; width: string }): void {
    this.columnWidths.update((map) => ({ ...map, [event.key]: event.width }));
  }

  protected onColumnReorder(cols: NgxsmkTableColumn[]): void {
    const next = cols.filter((c) => c.key !== '__select');
    this.orderedColumns.set(next);
    this.columnsChange.emit(next);
  }

  protected setColumnFilter(key: string, value: string): void {
    const next = { ...this.columnFilters(), [key]: value };
    this.columnFilters.set(next);
    this.currentPage.set(1);
    this.virtualStart.set(0);
  }

  protected onVirtualScroll(event: Event): void {
    if (!this.virtual()) return;
    const el = event.target as HTMLElement;
    const start = Math.max(0, Math.floor(el.scrollTop / this.rowHeight()) - 2);
    if (start !== this.virtualStart()) {
      this.virtualStart.set(start);
    }
  }

  sortBy(key: string): void {
    if (!this.sortable() || key === '__select') {
      return;
    }
    let nextDir: 'asc' | 'desc' = 'asc';
    if (this.sortField() === key) {
      nextDir = this.sortDir() === 'asc' ? 'desc' : 'asc';
      this.sortDir.set(nextDir);
    } else {
      this.sortField.set(key);
      this.sortDir.set('asc');
    }
    this.currentPage.set(1);
    this.sortChange.emit({ field: key, dir: nextDir });
  }
}
