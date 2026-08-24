import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import { NgxsmkTable, NgxsmkTableColumn } from '@ngxsmk/core/table';

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

    <ngxsmk-table
      [columns]="displayColumns()"
      [rows]="displayRows()"
      [striped]="striped()"
      [sortable]="sortable()"
      [sortField]="sortField()"
      [sortDir]="sortDir()"
      (sortChange)="sortBy($event)"
    />

    @if (processedRows().length === 0 && !loading()) {
      <div class="ngxsmk-data-table__empty">
        {{ emptyMessage() }}
      </div>
    }

    <div class="ngxsmk-data-table__footer">
      <span class="ngxsmk-data-table__info">
        {{ pageInfo() }}
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
              d="M10 4L6 8l4 4"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
        @for (page of pages(); track page) {
          <button
            type="button"
            class="ngxsmk-data-table__page-btn"
            [class.ngxsmk-data-table__page-btn--active]="page === currentPage()"
            (click)="goToPage(page)"
          >
            {{ page }}
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
              d="M6 4l4 4-4 4"
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
      height: 3px;
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
      border: 1px solid var(--ngxsmk-color-outline);
      border-top: none;
      color: var(--ngxsmk-color-on-surface-variant);
      font-size: var(--ngxsmk-text-body-sm-size);
    }

    .ngxsmk-data-table__footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--ngxsmk-space-4);
      padding: var(--ngxsmk-space-3) var(--ngxsmk-space-4);
      border: 1px solid var(--ngxsmk-color-outline);
      border-top: none;
      font-size: var(--ngxsmk-text-body-sm-size);
      line-height: var(--ngxsmk-text-body-sm-line);
      color: var(--ngxsmk-color-on-surface-variant);
    }

    .ngxsmk-data-table__info {
      flex: 1;
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
      min-width: 2rem;
      height: 2rem;
      padding: 0 var(--ngxsmk-space-1);
      border: 1px solid transparent;
      border-radius: var(--ngxsmk-radius-sm);
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
  imports: [NgxsmkTable],
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

  readonly pageChange = output<{ page: number; pageSize: number }>();
  readonly sortChange = output<{ field: string; dir: 'asc' | 'desc' }>();

  protected readonly sortField = signal<string>('');
  protected readonly sortDir = signal<'asc' | 'desc'>('asc');
  protected readonly currentPage = signal(1);

  constructor() {
    // Keep the page in range if the row count shrinks (e.g. external filtering).
    effect(() => {
      const total = this.totalPages();
      if (this.currentPage() > total) this.currentPage.set(total);
    });
  }

  protected readonly processedRows = computed(() => {
    let data = [...this.rows()];
    const q = this.filter().trim().toLowerCase();
    if (q) {
      data = data.filter((row) =>
        Object.values(row).some((val) => val != null && String(val).toLowerCase().includes(q)),
      );
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

  protected readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.processedRows().length / this.pageSize())),
  );

  protected readonly displayRows = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.processedRows().slice(start, start + this.pageSize());
  });

  protected readonly displayColumns = computed<NgxsmkTableColumn[]>(() => {
    const cols = this.columns();
    if (!this.sortable()) {
      return cols;
    }
    return cols.map((col) => ({
      ...col,
    }));
  });

  protected readonly pageInfo = computed(() => {
    const total = this.processedRows().length;
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

  protected goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) {
      return;
    }
    this.currentPage.set(page);
    this.pageChange.emit({ page, pageSize: this.pageSize() });
  }

  sortBy(key: string): void {
    if (!this.sortable()) {
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
