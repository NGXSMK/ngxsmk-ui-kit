import { ChangeDetectionStrategy, Component, computed, input, model, output } from '@angular/core';

export interface NgxsmkPromptLibraryItem {
  id: string;
  title: string;
  content: string;
  category?: string;
  tags?: string[];
}

/**
 * Searchable prompt template library grid with quick selection and tag filtering.
 *
 * ```html
 * <ngxsmk-prompt-library [prompts]="savedPrompts" (selected)="onPromptUse($event)" />
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-prompt-library',
  template: `
    <div class="ngxsmk-prompt-lib">
      <!-- SEARCH HEADER -->
      <div class="ngxsmk-prompt-lib__header">
        <input
          type="search"
          [placeholder]="placeholder()"
          [value]="searchQuery()"
          (input)="onSearchInput($event)"
          class="ngxsmk-prompt-lib__search"
        />
      </div>

      <!-- CARDS GRID -->
      <div class="ngxsmk-prompt-lib__grid">
        @if (filteredPrompts().length === 0) {
          <div class="ngxsmk-prompt-lib__empty">
            <span>No prompt templates match your search</span>
          </div>
        } @else {
          @for (item of filteredPrompts(); track item.id) {
            <div class="ngxsmk-prompt-lib__card" (click)="onSelect(item)">
              <div class="ngxsmk-prompt-lib__top">
                <span class="ngxsmk-prompt-lib__title">{{ item.title }}</span>
                @if (item.category) {
                  <span class="ngxsmk-prompt-lib__cat">{{ item.category }}</span>
                }
              </div>
              <p class="ngxsmk-prompt-lib__desc">{{ item.content }}</p>
              @if (item.tags && item.tags.length > 0) {
                <div class="ngxsmk-prompt-lib__tags">
                  @for (tag of item.tags; track tag) {
                    <span class="ngxsmk-prompt-lib__tag">#{{ tag }}</span>
                  }
                </div>
              }
            </div>
          }
        }
      </div>
    </div>
  `,
  host: {
    class: 'ngxsmk-prompt-library',
  },
  styles: `
    :host {
      display: block;
      width: 100%;
      font-family: var(--ngxsmk-font-sans, system-ui);
    }

    .ngxsmk-prompt-lib {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .ngxsmk-prompt-lib__search {
      width: 100%;
      height: 2.5rem;
      padding: 0 0.85rem;
      border: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
      border-radius: var(--ngxsmk-radius-md, 0.375rem);
      background: var(--ngxsmk-color-surface, #ffffff);
      color: var(--ngxsmk-color-on-surface, #09090b);
      font-family: inherit;
      font-size: 0.85rem;
      outline: none;
      transition:
        border-color 0.15s ease,
        box-shadow 0.15s ease;
    }

    .ngxsmk-prompt-lib__search:focus {
      border-color: var(--ngxsmk-color-primary, #7c3aed);
      box-shadow: 0 0 0 3px
        color-mix(in srgb, var(--ngxsmk-color-primary, #7c3aed) 12%, transparent);
    }

    .ngxsmk-prompt-lib__grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
      gap: 0.75rem;
    }

    .ngxsmk-prompt-lib__empty {
      grid-column: 1 / -1;
      padding: 2rem;
      text-align: center;
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
      font-size: 0.85rem;
    }

    .ngxsmk-prompt-lib__card {
      padding: 0.85rem;
      border: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
      border-radius: var(--ngxsmk-radius-md, 0.375rem);
      background: var(--ngxsmk-color-surface, #ffffff);
      cursor: pointer;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition:
        border-color 0.15s ease,
        box-shadow 0.15s ease,
        transform 0.15s ease;
    }

    .ngxsmk-prompt-lib__card:hover {
      border-color: var(--ngxsmk-color-primary, #7c3aed);
      box-shadow: 0 4px 12px rgba(124, 58, 237, 0.08);
      transform: translateY(-1px);
    }

    .ngxsmk-prompt-lib__top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
      margin-bottom: 0.4rem;
    }

    .ngxsmk-prompt-lib__title {
      font-size: 0.875rem;
      font-weight: 700;
      color: var(--ngxsmk-color-on-surface, #09090b);
    }

    .ngxsmk-prompt-lib__cat {
      font-size: 0.65rem;
      font-weight: 600;
      padding: 0.15rem 0.4rem;
      border-radius: var(--ngxsmk-radius-sm, 0.25rem);
      background: var(--ngxsmk-color-surface-variant, #f4f4f5);
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
    }

    .ngxsmk-prompt-lib__desc {
      margin: 0 0 0.5rem;
      font-size: 0.8rem;
      line-height: 1.45;
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .ngxsmk-prompt-lib__tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.25rem;
    }

    .ngxsmk-prompt-lib__tag {
      font-family: var(--ngxsmk-font-mono, monospace);
      font-size: 0.65rem;
      color: var(--ngxsmk-color-primary, #7c3aed);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkPromptLibrary {
  /** Array of prompt templates. */
  readonly prompts = input<NgxsmkPromptLibraryItem[]>([]);

  /** Placeholder search query text. */
  readonly placeholder = input<string>('Search prompts...');

  /** Two-way signal model for search filter query. */
  readonly searchQuery = model<string>('');

  /** Emits when a prompt card is selected. */
  readonly selected = output<NgxsmkPromptLibraryItem>();

  protected readonly filteredPrompts = computed(() => {
    const list = this.prompts();
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return list;

    return list.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.content.toLowerCase().includes(q) ||
        item.category?.toLowerCase().includes(q) ||
        item.tags?.some((t) => t.toLowerCase().includes(q)),
    );
  });

  protected onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery.set(target.value);
  }

  protected onSelect(item: NgxsmkPromptLibraryItem): void {
    this.selected.emit(item);
  }
}
