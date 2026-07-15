import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  ComponentRegistry,
  ComponentMetadata,
  CATEGORY_LABELS,
} from '../../core/component-registry';
import { SearchService } from '../../core/search.service';

const CATEGORY_ICONS: Record<string, string> = {
  form: '▦',
  layout: '▦',
  navigation: '⊞',
  'data-display': '☰',
  feedback: '⚑',
  overlay: '◇',
  chart: '▤',
  ai: '⚡',
  enterprise: '⚙',
  utility: '🔧',
  other: '◈',
};

@Component({
  selector: 'app-component-explorer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="explorer">
      <header class="explorer-header">
        <h1 class="explorer-title">Component Library</h1>
        <p class="explorer-subtitle">
          {{ registry.totalCount() }} signal-native components across
          {{ registry.categories().length }} categories
        </p>
        <div class="explorer-search">
          <svg
            class="explorer-search-icon"
            width="16"
            height="16"
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
            class="explorer-search-input"
            placeholder="Search by name, tag, or description..."
            [value]="query()"
            (input)="query.set(searchInput.value)"
          />
          @if (query()) {
            <button
              class="explorer-search-clear"
              (click)="query.set(''); searchInput.value = ''; searchInput.focus()"
            >
              ✕
            </button>
          }
        </div>
        <div class="explorer-tabs">
          <button
            class="explorer-tab"
            [class.active]="!selectedCategory()"
            (click)="selectedCategory.set(null)"
          >
            All
          </button>
          @for (cat of registry.categories(); track cat) {
            <button
              class="explorer-tab"
              [class.active]="selectedCategory() === cat"
              (click)="selectedCategory.set(cat)"
            >
              {{ iconFor(cat) }} {{ labelFor(cat) }}
            </button>
          }
        </div>
      </header>

      @if (filteredGroups().length === 0) {
        <div class="explorer-empty">
          <div class="explorer-empty-icon">◈</div>
          <p>No components match "{{ query() }}"</p>
          <button class="explorer-empty-btn" (click)="query.set('')">Clear search</button>
        </div>
      }

      @for (group of filteredGroups(); track group.category) {
        <section class="explorer-group">
          <div class="explorer-group-header">
            <h2 class="explorer-group-title">{{ labelFor(group.category) }}</h2>
            <span class="explorer-group-count">{{ group.components.length }} components</span>
          </div>
          <div class="explorer-grid">
            @for (comp of group.components; track comp.name) {
              <a
                class="explorer-card"
                [routerLink]="['/showcase', routeFor(comp.category)]"
                [fragment]="slug(comp.name)"
              >
                <div class="explorer-card-header">
                  <span
                    class="explorer-card-dot"
                    [style.background]="colorFor(comp.category)"
                  ></span>
                  <span class="explorer-card-name">{{ comp.name }}</span>
                </div>
                <p class="explorer-card-desc">{{ comp.description }}</p>
                <div class="explorer-card-meta">
                  <span class="explorer-card-tag">{{ comp.packageName }}</span>
                  @if (comp.inputs.length > 0) {
                    <span class="explorer-card-prop">{{ comp.inputs.length }} inputs</span>
                  }
                  @if (comp.signals.length > 0) {
                    <span class="explorer-card-prop">{{ comp.signals.length }} signals</span>
                  }
                </div>
              </a>
            }
          </div>
        </section>
      }
    </div>
  `,
  styles: `
    .explorer {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 1.5rem 4rem;
      font-family: 'DM Sans', var(--ngxsmk-font-sans, system-ui), sans-serif;
      color: var(--ngxsmk-color-on-surface, #09090b);
    }

    .explorer-header {
      margin-bottom: 2.5rem;
    }
    .explorer-title {
      font-size: 1.75rem;
      font-weight: 800;
      letter-spacing: -0.03em;
      margin: 0 0 0.25rem;
      font-family: 'Outfit', sans-serif;
    }
    .explorer-subtitle {
      font-size: 0.875rem;
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
      margin: 0 0 1.5rem;
    }

    .explorer-search {
      position: relative;
      margin-bottom: 1rem;
    }
    .explorer-search-icon {
      position: absolute;
      left: 0.875rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
      pointer-events: none;
    }
    .explorer-search-input {
      width: 100%;
      padding: 0.75rem 2.5rem 0.75rem 2.75rem;
      border: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
      border-radius: var(--ngxsmk-radius-lg, 0.5rem);
      background: var(--ngxsmk-color-surface, #fff);
      font-size: 0.9375rem;
      color: var(--ngxsmk-color-on-surface, #09090b);
      outline: none;
      transition:
        border-color 0.15s,
        box-shadow 0.15s;
      box-sizing: border-box;
    }
    .explorer-search-input:focus {
      border-color: var(--ngxsmk-color-primary, #7c3aed);
      box-shadow: 0 0 0 3px
        color-mix(in srgb, var(--ngxsmk-color-primary, #7c3aed) 15%, transparent);
    }
    .explorer-search-input::placeholder {
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
    }
    .explorer-search-clear {
      position: absolute;
      right: 0.625rem;
      top: 50%;
      transform: translateY(-50%);
      border: none;
      background: var(--ngxsmk-color-surface-variant, #f4f4f5);
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 50%;
      cursor: pointer;
      font-size: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .explorer-search-clear:hover {
      background: var(--ngxsmk-color-outline, #e4e4e7);
      color: var(--ngxsmk-color-on-surface, #09090b);
    }

    .explorer-tabs {
      display: flex;
      flex-wrap: wrap;
      gap: 0.375rem;
    }
    .explorer-tab {
      padding: 0.375rem 0.75rem;
      border: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
      border-radius: var(--ngxsmk-radius-full, 9999px);
      background: var(--ngxsmk-color-surface, #fff);
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
      font-size: 0.8125rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s;
      font-family: inherit;
      white-space: nowrap;
    }
    .explorer-tab:hover {
      border-color: var(--ngxsmk-color-primary, #7c3aed);
      color: var(--ngxsmk-color-on-surface, #09090b);
    }
    .explorer-tab.active {
      background: var(--ngxsmk-color-primary, #7c3aed);
      border-color: var(--ngxsmk-color-primary, #7c3aed);
      color: #fff;
    }

    .explorer-empty {
      text-align: center;
      padding: 4rem 1rem;
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
    }
    .explorer-empty-icon {
      font-size: 2.5rem;
      margin-bottom: 0.75rem;
      opacity: 0.4;
    }
    .explorer-empty p {
      font-size: 0.9375rem;
      margin: 0 0 1rem;
    }
    .explorer-empty-btn {
      padding: 0.5rem 1.25rem;
      border: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
      border-radius: var(--ngxsmk-radius-md, 0.375rem);
      background: var(--ngxsmk-color-surface, #fff);
      color: var(--ngxsmk-color-on-surface, #09090b);
      font-size: 0.8125rem;
      cursor: pointer;
      font-family: inherit;
    }
    .explorer-empty-btn:hover {
      background: var(--ngxsmk-color-surface-variant, #f4f4f5);
    }

    .explorer-group {
      margin-bottom: 2.5rem;
    }
    .explorer-group-header {
      display: flex;
      align-items: baseline;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }
    .explorer-group-title {
      font-size: 1.125rem;
      font-weight: 700;
      margin: 0;
      font-family: 'Outfit', sans-serif;
    }
    .explorer-group-count {
      font-size: 0.75rem;
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
    }

    .explorer-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 0.75rem;
    }

    .explorer-card {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
      padding: 1rem;
      border: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
      border-radius: var(--ngxsmk-radius-lg, 0.5rem);
      background: var(--ngxsmk-color-surface, #fff);
      text-decoration: none;
      color: inherit;
      transition:
        border-color 0.15s,
        box-shadow 0.15s,
        transform 0.15s;
    }
    .explorer-card:hover {
      border-color: var(--ngxsmk-color-primary, #7c3aed);
      box-shadow: 0 4px 12px
        color-mix(in srgb, var(--ngxsmk-color-primary, #7c3aed) 12%, transparent);
      transform: translateY(-2px);
    }
    .explorer-card-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .explorer-card-dot {
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .explorer-card-name {
      font-weight: 600;
      font-size: 0.875rem;
    }
    .explorer-card-desc {
      font-size: 0.75rem;
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
      margin: 0;
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .explorer-card-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 0.375rem;
      margin-top: auto;
      padding-top: 0.5rem;
    }
    .explorer-card-tag {
      font-size: 0.625rem;
      font-weight: 600;
      padding: 0.125rem 0.375rem;
      border-radius: var(--ngxsmk-radius-sm);
      background: var(--ngxsmk-color-primary-container, #ede9fe);
      color: var(--ngxsmk-color-on-primary-container, #4c1d95);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .explorer-card-prop {
      font-size: 0.625rem;
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
      padding: 0.125rem 0.375rem;
      border-radius: var(--ngxsmk-radius-sm);
      background: var(--ngxsmk-color-surface-variant, #f4f4f5);
    }
  `,
})
export class ComponentExplorer {
  protected readonly registry = inject(ComponentRegistry);
  protected readonly searchService = inject(SearchService);

  protected readonly query = signal('');
  protected readonly selectedCategory = signal<string | null>(null);

  protected readonly categories = computed(() => this.registry.categories());

  protected readonly filteredGroups = computed(() => {
    const q = this.query().toLowerCase().trim();
    const cat = this.selectedCategory();
    const groups: { category: string; components: ComponentMetadata[] }[] = [];

    for (const [category, components] of this.registry.byCategory()) {
      if (cat && category !== cat) continue;

      let filtered = components;
      if (q) {
        filtered = components.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.description.toLowerCase().includes(q) ||
            c.tags.some((t) => t.toLowerCase().includes(q)) ||
            c.selector.toLowerCase().includes(q),
        );
      }

      if (filtered.length > 0) {
        groups.push({ category, components: filtered });
      }
    }

    return groups;
  });

  labelFor(category: string): string {
    return (
      (CATEGORY_LABELS as Record<string, string>)[category] ??
      category.charAt(0).toUpperCase() + category.slice(1)
    );
  }

  iconFor(category: string): string {
    return (CATEGORY_ICONS as Record<string, string>)[category] || '◈';
  }

  colorFor(category: string): string {
    const colors: Record<string, string> = {
      form: '#7c3aed',
      layout: '#0891b2',
      navigation: '#0d9488',
      'data-display': '#2563eb',
      feedback: '#d97706',
      overlay: '#dc2626',
      chart: '#059669',
      ai: '#7c3aed',
      enterprise: '#0891b2',
      utility: '#6b7280',
      'content-typography': '#4f46e5',
    };
    return colors[category] ?? '#6b7280';
  }

  routeFor(category: string): string {
    const CATEGORY_ROUTE: Record<string, string> = {
      form: 'forms',
      layout: 'layout',
      navigation: 'navigation',
      'data-display': 'data-display',
      feedback: 'feedback',
      overlay: 'overlay',
      chart: 'charts',
      ai: 'ai',
      enterprise: 'enterprise',
      utility: 'utilities',
      'content-typography': 'content-typography',
      other: 'content-typography',
    };
    return CATEGORY_ROUTE[category] ?? 'content-typography';
  }

  slug(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }
}
