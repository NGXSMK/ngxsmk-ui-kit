import { Component, inject, signal, ViewChild, ElementRef, effect } from '@angular/core';
import { Router } from '@angular/router';
import { SearchService, SearchResult } from './search.service';
import { ComponentRegistry } from './component-registry';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-command-palette',
  standalone: true,
  imports: [TranslatePipe],
  template: `
    @if (isOpen()) {
      <div class="cmd-overlay" (click)="close()" tabindex="0" (keydown.escape)="close()">
        <div
          class="cmd-dialog"
          (click)="$event.stopPropagation()"
          tabindex="0"
          (keydown)="$event.stopPropagation()"
        >
          <div class="cmd-header">
            <svg
              class="cmd-search-icon"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              #searchInput
              type="text"
              class="cmd-input"
              [attr.placeholder]="'search.placeholder' | translate"
              [value]="query()"
              (input)="onInput(searchInput.value)"
              (keydown)="onKeydown($event)"
            />
            <span class="cmd-esc-hint" (click)="close()" tabindex="0" (keydown.enter)="close()"
              >ESC</span
            >
          </div>

          <div class="cmd-results">
            @if (query().length > 0) {
              @for (result of results(); track result.item.name; let idx = $index) {
                <div
                  class="cmd-item"
                  [class.active]="idx === activeIndex()"
                  tabindex="0"
                  (mouseenter)="activeIndex.set(idx)"
                  (click)="selectResult(result)"
                  (keydown.enter)="selectResult(result)"
                >
                  <div class="cmd-item-left">
                    <span class="cmd-item-icon">{{ categoryIcon(result.item.category) }}</span>
                    <span class="cmd-item-name">{{ result.item.name }}</span>
                  </div>
                  <div class="cmd-item-right">
                    <span class="cmd-item-cat">{{ categoryLabel(result.item.category) }}</span>
                    @if (result.score > 2) {
                      <span class="cmd-item-score">{{ 'search.best' | translate }}</span>
                    }
                  </div>
                </div>
              }
              @if (results().length === 0) {
                <div class="cmd-empty">
                  {{ 'search.noResults' | translate: { query: query() } }}
                </div>
              }
            } @else {
              <div class="cmd-suggestions">
                <div class="cmd-suggestions-header">{{ 'search.recent' | translate }}</div>
                @for (recent of recentSearches(); track recent) {
                  <div
                    class="cmd-suggestion-item"
                    (click)="query.set(recent); doSearch(recent)"
                    tabindex="0"
                    (keydown.enter)="query.set(recent); doSearch(recent)"
                  >
                    <span class="cmd-suggestion-text">{{ recent }}</span>
                  </div>
                }
                @if (recentSearches().length === 0) {
                  <div class="cmd-suggestion-empty">
                    {{ 'search.suggestionEmpty' | translate }}
                  </div>
                }
              </div>
            }
          </div>
        </div>
      </div>
    }
  `,
  styles: `
    .cmd-overlay {
      position: fixed;
      inset: 0;
      z-index: 10000;
      background: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding: 12vh 1rem 1rem;
      animation: cmd-fade-in 0.12s ease-out;
    }
    @keyframes cmd-fade-in {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .cmd-dialog {
      width: 100%;
      max-width: 560px;
      background: var(--ngxsmk-color-surface, #fff);
      border: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
      border-radius: var(--ngxsmk-radius-xl, 0.75rem);
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      max-height: 420px;
      animation: cmd-scale-up 0.12s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes cmd-scale-up {
      from {
        transform: scale(0.96) translateY(-8px);
      }
      to {
        transform: scale(1) translateY(0);
      }
    }

    .cmd-header {
      display: flex;
      align-items: center;
      padding: 0 1rem;
      height: 3.25rem;
      border-bottom: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
      gap: 0.75rem;
    }
    .cmd-search-icon {
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
      flex-shrink: 0;
    }
    .cmd-input {
      flex: 1;
      height: 100%;
      border: none;
      outline: none;
      background: transparent;
      padding: 0;
      font-size: 0.9375rem;
      font-family: inherit;
      color: var(--ngxsmk-color-on-surface, #09090b);
    }
    .cmd-input::placeholder {
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
    }
    .cmd-esc-hint {
      font-size: 0.6875rem;
      font-weight: 700;
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
      border: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
      padding: 0.15rem 0.4rem;
      border-radius: var(--ngxsmk-radius-sm);
      cursor: pointer;
      user-select: none;
      background: var(--ngxsmk-color-surface-variant, #f4f4f5);
    }

    .cmd-results {
      flex: 1;
      overflow-y: auto;
      padding: 0.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.125rem;
    }

    .cmd-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.5rem 0.75rem;
      border-radius: var(--ngxsmk-radius-md, 0.375rem);
      cursor: pointer;
      font-size: 0.875rem;
      color: var(--ngxsmk-color-on-surface, #09090b);
      transition: background-color 0.1s;
    }
    .cmd-item.active {
      background: var(--ngxsmk-color-primary-container, #ede9fe);
      color: var(--ngxsmk-color-on-primary-container, #4c1d95);
    }
    .cmd-item-left {
      display: flex;
      align-items: center;
      gap: 0.625rem;
    }
    .cmd-item-icon {
      font-size: 0.75rem;
      opacity: 0.7;
    }
    .cmd-item-name {
      font-weight: 500;
    }
    .cmd-item-right {
      display: flex;
      align-items: center;
      gap: 0.375rem;
    }
    .cmd-item-cat {
      font-size: 0.75rem;
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
      background: var(--ngxsmk-color-surface-variant, #f4f4f5);
      padding: 0.125rem 0.375rem;
      border-radius: var(--ngxsmk-radius-sm);
    }
    .cmd-item.active .cmd-item-cat {
      background: rgba(255, 255, 255, 0.4);
      color: var(--ngxsmk-color-on-primary-container, #4c1d95);
    }
    .cmd-item-score {
      font-size: 0.625rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--ngxsmk-color-primary, #7c3aed);
    }

    .cmd-empty {
      padding: 2rem 0;
      text-align: center;
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
      font-size: 0.875rem;
    }

    .cmd-suggestions {
      padding: 0.5rem;
    }
    .cmd-suggestions-header {
      font-size: 0.6875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
      padding: 0.25rem 0.5rem 0.5rem;
    }
    .cmd-suggestion-item {
      padding: 0.375rem 0.5rem;
      border-radius: var(--ngxsmk-radius-sm);
      cursor: pointer;
      font-size: 0.875rem;
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
    }
    .cmd-suggestion-item:hover {
      background: var(--ngxsmk-color-surface-variant, #f4f4f5);
      color: var(--ngxsmk-color-on-surface, #09090b);
    }
    .cmd-suggestion-empty {
      padding: 1.5rem 0.5rem;
      text-align: center;
      font-size: 0.8125rem;
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
    }
  `,
})
export class CommandPalette {
  private readonly searchService = inject(SearchService);
  private readonly registry = inject(ComponentRegistry);
  private readonly router = inject(Router);

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  readonly isOpen = signal(false);
  readonly query = signal('');
  readonly activeIndex = signal(0);

  readonly results = signal<SearchResult[]>([]);
  readonly recentSearches = signal<string[]>([]);

  private readonly CATEGORY_ICONS: Record<string, string> = {
    form: '▦',
    layout: '▦',
    navigation: '⊞',
    'data-display': '☰',
    feedback: '⚑',
    overlay: '◇',
    chart: '▤',
    ai: '⚡',
    enterprise: '⚙',
    'content-typography': 'T',
    utility: '🔧',
    other: '◈',
  };

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        this.recentSearches.set(this.searchService.getRecentSearches());
      }
    });
  }

  open(): void {
    this.query.set('');
    this.activeIndex.set(0);
    this.results.set([]);
    this.isOpen.set(true);
    this.recentSearches.set(this.searchService.getRecentSearches());
    setTimeout(() => this.searchInput?.nativeElement?.focus(), 50);
  }

  close(): void {
    this.isOpen.set(false);
  }

  onInput(value: string): void {
    this.query.set(value);
    this.activeIndex.set(0);

    if (!value.trim()) {
      this.results.set([]);
      return;
    }

    const results = this.searchService.search({ query: value, limit: 12 });
    this.results.set(results);
  }

  doSearch(value: string): void {
    this.query.set(value);
    this.onInput(value);
  }

  onKeydown(event: KeyboardEvent): void {
    const items = this.results();
    if (items.length === 0) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.activeIndex.set((this.activeIndex() + 1) % items.length);
      this.scrollActiveIntoView();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.activeIndex.set((this.activeIndex() - 1 + items.length) % items.length);
      this.scrollActiveIntoView();
    } else if (event.key === 'Enter') {
      event.preventDefault();
      this.selectResult(items[this.activeIndex()]);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this.close();
    }
  }

  selectResult(result: SearchResult): void {
    this.close();
    this.searchService.addToFavorites(result.item.name);
    const path = result.item.category.replace(/[^a-z0-9]+/g, '-');
    const fragment = result.item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    this.router.navigate(['/showcase', path], { fragment });
  }

  categoryLabel(category: string): string {
    return category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ');
  }

  categoryIcon(category: string): string {
    return this.CATEGORY_ICONS[category] || '◈';
  }

  private scrollActiveIntoView(): void {
    setTimeout(() => {
      const active = document.querySelector('.cmd-item.active');
      active?.scrollIntoView({ block: 'nearest' });
    });
  }
}
