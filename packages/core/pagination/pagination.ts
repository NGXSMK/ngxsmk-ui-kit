import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  input,
  model,
  numberAttribute,
} from '@angular/core';

export type NgxsmkPaginationSize = 'sm' | 'md' | 'lg';

type PageItem = { kind: 'page'; page: number } | { kind: 'ellipsis'; key: string };

/**
 * Pagination control with first/prev/next/last and an ellipsis-collapsed page
 * range. Pure `computed` output — no effects, no DOM measurement — so it is
 * SSR-safe and re-renders only the changed buttons.
 *
 * ```html
 * <ngxsmk-pagination [(page)]="page" [total]="240" [pageSize]="20" />
 * <ngxsmk-pagination [(page)]="page" [pageCount]="12" [siblingCount]="2" />
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-pagination',
  template: `
    <ul class="ngxsmk-pagination__list">
      @if (showFirstLast()) {
        <li>
          <button
            type="button"
            class="ngxsmk-pagination__btn"
            [disabled]="isFirst() || disabled()"
            aria-label="First page"
            (click)="go(1)"
          >
            «
          </button>
        </li>
      }
      @if (showPrevNext()) {
        <li>
          <button
            type="button"
            class="ngxsmk-pagination__btn"
            [disabled]="isFirst() || disabled()"
            aria-label="Previous page"
            (click)="go(page() - 1)"
          >
            ‹
          </button>
        </li>
      }

      @for (item of items(); track item.kind === 'page' ? item.page : item.key) {
        @if (item.kind === 'page') {
          <li>
            <button
              type="button"
              class="ngxsmk-pagination__btn"
              [class.ngxsmk-pagination__btn--active]="item.page === page()"
              [attr.aria-current]="item.page === page() ? 'page' : null"
              [attr.aria-label]="'Page ' + item.page"
              [disabled]="disabled()"
              (click)="go(item.page)"
            >
              {{ item.page }}
            </button>
          </li>
        } @else {
          <li class="ngxsmk-pagination__ellipsis" aria-hidden="true">…</li>
        }
      }

      @if (showPrevNext()) {
        <li>
          <button
            type="button"
            class="ngxsmk-pagination__btn"
            [disabled]="isLast() || disabled()"
            aria-label="Next page"
            (click)="go(page() + 1)"
          >
            ›
          </button>
        </li>
      }
      @if (showFirstLast()) {
        <li>
          <button
            type="button"
            class="ngxsmk-pagination__btn"
            [disabled]="isLast() || disabled()"
            aria-label="Last page"
            (click)="go(pageCountResolved())"
          >
            »
          </button>
        </li>
      }
    </ul>
  `,
  host: {
    role: 'navigation',
    class: 'ngxsmk-pagination',
    '[attr.aria-label]': 'label()',
    '[attr.data-size]': 'size()',
    '[attr.data-disabled]': 'disabled() ? "" : null',
  },
  styles: `
    :host {
      display: block;
      font-family: var(--ngxsmk-font-sans, sans-serif);
    }
    .ngxsmk-pagination__list {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--ngxsmk-space-1, 0.25rem);
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .ngxsmk-pagination__btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: var(--ngxsmk-pagination-size, 2.25rem);
      height: var(--ngxsmk-pagination-size, 2.25rem);
      padding: 0 var(--ngxsmk-space-2, 0.5rem);
      font: inherit;
      font-size: var(--ngxsmk-text-body-md-size, 0.9375rem);
      font-variant-numeric: tabular-nums;
      color: var(--ngxsmk-color-on-surface, #0f172a);
      background: transparent;
      border: 1px solid transparent;
      border-radius: var(--ngxsmk-radius-md, 8px);
      cursor: pointer;
      transition:
        background-color var(--ngxsmk-duration-fast, 120ms) var(--ngxsmk-ease-out, ease),
        border-color var(--ngxsmk-duration-fast, 120ms) var(--ngxsmk-ease-out, ease);
    }
    :host([data-size='sm']) {
      --ngxsmk-pagination-size: 1.875rem;
    }
    :host([data-size='lg']) {
      --ngxsmk-pagination-size: 2.75rem;
    }
    .ngxsmk-pagination__btn:hover:not(:disabled) {
      background: var(--ngxsmk-color-surface-variant, #f1f5f9);
    }
    .ngxsmk-pagination__btn:focus-visible {
      outline: 2px solid var(--ngxsmk-color-ring, #6366f1);
      outline-offset: 2px;
    }
    .ngxsmk-pagination__btn--active {
      background: var(--ngxsmk-color-primary, #6366f1);
      color: var(--ngxsmk-color-on-primary, #fff);
      font-weight: 600;
    }
    .ngxsmk-pagination__btn--active:hover:not(:disabled) {
      background: var(--ngxsmk-color-primary, #6366f1);
    }
    .ngxsmk-pagination__btn:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }
    .ngxsmk-pagination__ellipsis {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: var(--ngxsmk-pagination-size, 2.25rem);
      height: var(--ngxsmk-pagination-size, 2.25rem);
      color: var(--ngxsmk-color-on-surface-variant, #64748b);
      user-select: none;
    }
    @media (prefers-reduced-motion: reduce) {
      .ngxsmk-pagination__btn {
        transition: none;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkPagination {
  /** Current 1-based page. */
  readonly page = model(1);
  /** Total item count — used with `pageSize` to derive page count. */
  readonly total = input(0, { transform: numberAttribute });
  readonly pageSize = input(10, { transform: numberAttribute });
  /** Explicit page count; overrides `total`/`pageSize` when > 0. */
  readonly pageCount = input(0, { transform: numberAttribute });
  /** Pages shown on each side of the current page. */
  readonly siblingCount = input(1, { transform: numberAttribute });
  /** Pages pinned at each end. */
  readonly boundaryCount = input(1, { transform: numberAttribute });
  readonly showFirstLast = input(false, { transform: booleanAttribute });
  readonly showPrevNext = input(true, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly size = input<NgxsmkPaginationSize>('md');
  readonly label = input('Pagination');

  protected readonly pageCountResolved = computed(() => {
    const explicit = this.pageCount();
    if (explicit > 0) return explicit;
    const size = Math.max(1, this.pageSize());
    return Math.max(1, Math.ceil(this.total() / size));
  });

  protected readonly isFirst = computed(() => this.page() <= 1);
  protected readonly isLast = computed(() => this.page() >= this.pageCountResolved());

  protected readonly items = computed<PageItem[]>(() => {
    const count = this.pageCountResolved();
    const current = this.clamp(this.page(), count);
    const siblings = Math.max(0, this.siblingCount());
    const boundary = Math.max(1, this.boundaryCount());

    // If everything fits, list every page.
    const totalNumbers = boundary * 2 + siblings * 2 + 3;
    if (count <= totalNumbers) {
      return range(1, count).map((page) => ({ kind: 'page', page }));
    }

    const startPages = range(1, boundary);
    const endPages = range(count - boundary + 1, count);
    const left = Math.max(current - siblings, boundary + 2);
    const right = Math.min(current + siblings, count - boundary - 1);

    const items: PageItem[] = startPages.map((page) => ({
      kind: 'page',
      page,
    }));

    if (left > boundary + 2) {
      items.push({ kind: 'ellipsis', key: 'start' });
    } else if (boundary + 1 < count - boundary) {
      items.push({ kind: 'page', page: boundary + 1 });
    }

    for (const page of range(left, right)) {
      items.push({ kind: 'page', page });
    }

    if (right < count - boundary - 1) {
      items.push({ kind: 'ellipsis', key: 'end' });
    } else if (count - boundary > boundary) {
      items.push({ kind: 'page', page: count - boundary });
    }

    items.push(...endPages.map((page): PageItem => ({ kind: 'page', page })));
    return items;
  });

  protected go(page: number): void {
    if (this.disabled()) return;
    const next = this.clamp(page, this.pageCountResolved());
    if (next === this.page()) return;
    this.page.set(next);
  }

  private clamp(page: number, count: number): number {
    return Math.min(Math.max(1, Math.trunc(page)), count);
  }
}

function range(start: number, end: number): number[] {
  const out: number[] = [];
  for (let i = start; i <= end; i++) out.push(i);
  return out;
}
