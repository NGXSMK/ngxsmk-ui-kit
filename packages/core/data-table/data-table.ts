import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  effect,
  input,
  signal,
} from '@angular/core';
import { NgxsmkTable, NgxsmkTableColumn } from '@ngxsmk/core/table';

@Component({
  standalone: true,
  selector: 'ngxsmk-data-table',
  template: `
    <ngxsmk-table
      [columns]="displayColumns()"
      [rows]="displayRows()"
      [striped]="striped()"
      [sortable]="sortable()"
      [sortField]="sortField()"
      [sortDir]="sortDir()"
      (sortChange)="sortBy($event)"
    />

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
  readonly sortable = input(false, { transform: booleanAttribute });
  readonly striped = input(false, { transform: booleanAttribute });

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

  private readonly processedRows = computed(() => {
    const data = [...this.rows()];
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
  }

  sortBy(key: string): void {
    if (!this.sortable()) {
      return;
    }
    if (this.sortField() === key) {
      this.sortDir.update((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortField.set(key);
      this.sortDir.set('asc');
    }
    this.currentPage.set(1);
  }
}
