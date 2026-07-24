import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, input, model } from '@angular/core';

export interface NgxsmkScrollSpyItem {
  id: string;
  label: string;
  level?: number;
}

/**
 * ScrollSpy component & table-of-contents tracker.
 * Automatically monitors document/container scroll position and highlights active section headings.
 *
 * ```html
 * <ngxsmk-scroll-spy [(activeId)]="activeSection" [items]="sections" />
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-scroll-spy',
  template: `
    <nav class="ngxsmk-scroll-spy__nav" aria-label="Table of contents">
      @if (title()) {
        <span class="ngxsmk-scroll-spy__title">{{ title() }}</span>
      }
      <ul class="ngxsmk-scroll-spy__list">
        @for (item of items(); track item.id) {
          <li
            class="ngxsmk-scroll-spy__item"
            [class.ngxsmk-scroll-spy__item--level-2]="item.level === 2"
            [class.ngxsmk-scroll-spy__item--level-3]="item.level === 3"
          >
            <button
              type="button"
              class="ngxsmk-scroll-spy__link"
              [class.ngxsmk-scroll-spy__link--active]="activeId() === item.id"
              (click)="scrollTo(item.id)"
            >
              <span class="ngxsmk-scroll-spy__indicator"></span>
              <span class="ngxsmk-scroll-spy__label">{{ item.label }}</span>
            </button>
          </li>
        }
      </ul>
    </nav>
  `,
  host: {
    class: 'ngxsmk-scroll-spy',
  },
  styles: `
    :host {
      display: block;
      font-family: var(--ngxsmk-font-sans, system-ui);
    }

    .ngxsmk-scroll-spy__title {
      display: block;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
      margin-bottom: var(--ngxsmk-space-2, 0.5rem);
    }

    .ngxsmk-scroll-spy__list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
      position: relative;
      border-left: 2px solid var(--ngxsmk-color-outline, #e4e4e7);
    }

    .ngxsmk-scroll-spy__item--level-2 {
      padding-left: 0.75rem;
    }

    .ngxsmk-scroll-spy__item--level-3 {
      padding-left: 1.25rem;
    }

    .ngxsmk-scroll-spy__link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      width: 100%;
      padding: 0.25rem 0.75rem;
      border: none;
      background: none;
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
      font-family: inherit;
      font-size: 0.825rem;
      font-weight: 500;
      text-align: left;
      cursor: pointer;
      border-radius: var(--ngxsmk-radius-sm, 0.25rem);
      transition:
        color 0.15s ease,
        background-color 0.15s ease;
      margin-left: -2px;
      border-left: 2px solid transparent;
    }

    .ngxsmk-scroll-spy__link:hover {
      color: var(--ngxsmk-color-on-surface, #09090b);
      background: color-mix(in srgb, var(--ngxsmk-color-on-surface, #09090b) 4%, transparent);
    }

    .ngxsmk-scroll-spy__link--active {
      color: var(--ngxsmk-color-primary, #7c3aed);
      border-left-color: var(--ngxsmk-color-primary, #7c3aed);
      font-weight: 600;
      background: color-mix(in srgb, var(--ngxsmk-color-primary, #7c3aed) 8%, transparent);
    }

    .ngxsmk-scroll-spy__label {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkScrollSpy implements OnInit, OnDestroy {
  /** Array of section items `{ id, label, level? }` to track. */
  readonly items = input<NgxsmkScrollSpyItem[]>([]);

  /** Navigation title header text. Default: 'On this page'. */
  readonly title = input<string>('On this page');

  /** Pixel offset from top for active section detection. Default: 100. */
  readonly offset = input<number>(100);

  /** Two-way signal bound active section ID. */
  readonly activeId = model<string>('');

  private observer?: IntersectionObserver;
  private scrollListener?: () => void;

  ngOnInit(): void {
    if (typeof window === 'undefined') return;

    this.setupScrollListener();
  }

  ngOnDestroy(): void {
    if (this.scrollListener && typeof window !== 'undefined') {
      window.removeEventListener('scroll', this.scrollListener);
    }
    this.observer?.disconnect();
  }

  public scrollTo(id: string): void {
    this.activeId.set(id);
    if (typeof document === 'undefined') return;

    const targetEl = document.getElementById(id);
    if (targetEl) {
      const top = targetEl.getBoundingClientRect().top + window.scrollY - this.offset();
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }

  private setupScrollListener(): void {
    const handleScroll = () => {
      const list = this.items();
      if (!list.length) return;

      const offset = this.offset();
      let currentActiveId = list[0].id;

      for (const item of list) {
        const el = document.getElementById(item.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= offset + 20) {
            currentActiveId = item.id;
          }
        }
      }

      if (currentActiveId && currentActiveId !== this.activeId()) {
        this.activeId.set(currentActiveId);
      }
    };

    this.scrollListener = handleScroll;
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run initial calculation
    setTimeout(handleScroll, 100);
  }
}
