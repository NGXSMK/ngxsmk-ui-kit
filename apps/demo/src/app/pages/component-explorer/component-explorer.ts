import {
  Component,
  inject,
  signal,
  computed,
  HostListener,
  ChangeDetectionStrategy,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import {
  ComponentRegistry,
  ComponentMetadata,
  CATEGORY_LABELS,
} from '../../core/component-registry';

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
  imports: [RouterLink, TranslatePipe],
  template: `
    <div class="explorer">
      <header class="explorer-header">
        <div class="version-badge">
          <span class="pulse-dot"></span>
          <span class="badge-tag">Registry</span>
          <span class="badge-divider"></span>
          <span class="badge-text">{{ registry.totalCount() }} Components • {{ registry.categories().length }} Categories</span>
        </div>
        <h1 class="explorer-title">Component <span class="highlight">Catalog</span></h1>
        <p class="explorer-subtitle">
          {{
            'explorer.subtitle'
              | translate
                : { count: registry.totalCount(), categories: registry.categories().length }
          }}
        </p>
        <div class="explorer-search">
          <svg
            class="explorer-search-icon"
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
            class="explorer-search-input"
            [attr.placeholder]="'explorer.searchPlaceholder' | translate"
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
            {{ 'explorer.all' | translate }}
          </button>
          @for (cat of registry.categories(); track cat) {
            <button
              class="explorer-tab"
              [class.active]="selectedCategory() === cat"
              (click)="selectedCategory.set(cat)"
            >
              <span class="cat-icon">{{ iconFor(cat) }}</span>
              <span>{{ catLabelKey(cat) | translate }}</span>
            </button>
          }
        </div>
      </header>

      @if (filteredGroups().length === 0) {
        <div class="explorer-empty">
          <div class="explorer-empty-icon">◈</div>
          <p>{{ 'explorer.noMatch' | translate: { query: query() } }}</p>
          <button class="explorer-empty-btn" (click)="query.set('')">
            {{ 'explorer.clearSearch' | translate }}
          </button>
        </div>
      }

      @for (group of filteredGroups(); track group.category) {
        <section class="explorer-group">
          <div class="explorer-group-header">
            <h2 class="explorer-group-title">{{
              catLabelKey(group.category) | translate
            }}</h2>
            <span class="explorer-group-count">{{
              'explorer.componentCount' | translate: { count: group.components.length }
            }}</span>
          </div>

          <div class="explorer-grid">
            @for (comp of group.components; track comp.name) {
              <a
                class="explorer-card"
                [routerLink]="['/showcase', routeFor(comp.category)]"
                [fragment]="slug(comp)"
              >
                <div class="explorer-card-header">
                  <div class="traffic-lights" aria-hidden="true">
                    <span class="light red"></span>
                    <span class="light yellow"></span>
                    <span class="light green"></span>
                  </div>
                  <span
                    class="explorer-card-dot"
                    [style.background]="colorFor(comp.category)"
                    [style.box-shadow]="'0 0 10px ' + colorFor(comp.category)"
                  ></span>
                  <span class="explorer-card-name">{{ comp.name }}</span>
                  <svg
                    class="explorer-card-arrow"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
                @if (comp.selector) {
                  <div class="explorer-card-selector">
                    <code>&lt;{{ comp.selector.replace('[', '').replace(']', '') }}&gt;</code>
                  </div>
                }
                <p class="explorer-card-desc">{{ comp.description }}</p>
                <div class="explorer-card-meta">
                  <span class="explorer-card-tag">{{ comp.packageName }}</span>
                  @if (comp.inputs.length > 0) {
                    <span class="explorer-card-prop">{{
                      'explorer.inputsCount' | translate: { count: comp.inputs.length }
                    }}</span>
                  }
                  @if (comp.signals.length > 0) {
                    <span class="explorer-card-prop explorer-card-prop--signal">{{
                      'explorer.signalsCount' | translate: { count: comp.signals.length }
                    }}</span>
                  }
                </div>
              </a>
            }
          </div>
        </section>
      }

      <!-- SCROLL TO TOP FLOATING BUTTON -->
      @if (showScrollTop()) {
        <button
          type="button"
          class="explorer-scroll-top"
          (click)="scrollToTop()"
          [title]="'explorer.scrollTop' | translate"
          [attr.aria-label]="'explorer.scrollTop' | translate"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
      min-height: 0;
      background: transparent;
    }
    .explorer {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1.5rem 0 3rem;
      font-family: var(--font-body, 'Inter', system-ui, sans-serif);
      color: var(--color-text-main, #0f172a);
    }
    @media (max-width: 640px) {
      .explorer {
        padding: 1rem 0 2rem;
      }
    }

    .explorer-header {
      margin-bottom: 2.5rem;
    }
    .explorer-title {
      font-size: clamp(2rem, 3.5vw, 2.75rem);
      font-weight: 800;
      letter-spacing: -0.035em;
      margin: 0.75rem 0 0.5rem;
      font-family: var(--font-display, 'Plus Jakarta Sans', system-ui, sans-serif);
      line-height: 1.15;
    }
    .highlight {
      background: linear-gradient(135deg, #6366f1 0%, #f59e0b 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .explorer-subtitle {
      font-size: 1.0625rem;
      color: var(--color-text-secondary, #64748b);
      margin: 0 0 1.5rem;
      line-height: 1.6;
      max-width: 680px;
    }

    .explorer-search {
      position: relative;
      margin-bottom: 1.25rem;
      max-width: 640px;
    }
    .explorer-search-icon {
      position: absolute;
      left: 1.125rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--color-text-muted, #94a3b8);
      pointer-events: none;
    }
    .explorer-search-input {
      width: 100%;
      padding: 0.875rem 3rem 0.875rem 3.125rem;
      border: 1px solid var(--color-border-card, rgba(148, 163, 184, 0.25));
      border-radius: 9999px;
      background: var(--color-bg-card, #ffffff);
      font-size: 0.95rem;
      color: var(--color-text-main, #0f172a);
      outline: none;
      box-shadow: 0 4px 16px -4px rgba(0, 0, 0, 0.05);
      transition:
        border-color 0.2s,
        box-shadow 0.2s;
      box-sizing: border-box;
      font-family: inherit;
    }
    .explorer-search-input:focus {
      border-color: #6366f1;
      box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.15), 0 8px 24px -4px rgba(99, 102, 241, 0.12);
    }
    .explorer-search-input::placeholder {
      color: var(--color-text-muted, #94a3b8);
    }
    .explorer-search-clear {
      position: absolute;
      right: 0.875rem;
      top: 50%;
      transform: translateY(-50%);
      border: none;
      background: var(--color-bg-subtle, #f1f5f9);
      color: var(--color-text-secondary, #64748b);
      width: 1.625rem;
      height: 1.625rem;
      border-radius: 50%;
      cursor: pointer;
      font-size: 0.8rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.15s, color 0.15s;
    }
    .explorer-search-clear:hover {
      background: rgba(99, 102, 241, 0.15);
      color: #6366f1;
    }

    .explorer-tabs {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    .explorer-tab {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.45rem 0.95rem;
      border: 1px solid var(--color-border-card, rgba(148, 163, 184, 0.25));
      border-radius: 9999px;
      background: var(--color-bg-card, #ffffff);
      color: var(--color-text-secondary, #64748b);
      font-size: 0.825rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      font-family: inherit;
      white-space: nowrap;
    }
    .explorer-tab .cat-icon {
      font-size: 0.85rem;
      opacity: 0.7;
    }
    .explorer-tab:hover {
      border-color: rgba(99, 102, 241, 0.4);
      color: var(--color-text-main, #0f172a);
      transform: translateY(-1px);
    }
    .explorer-tab.active {
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(245, 158, 11, 0.08));
      border-color: rgba(99, 102, 241, 0.45);
      color: #6366f1;
      font-weight: 600;
      box-shadow: 0 4px 12px -2px rgba(99, 102, 241, 0.15);
    }
    .explorer-tab.active .cat-icon {
      opacity: 1;
    }

    .explorer-empty {
      text-align: center;
      padding: 4rem 1rem;
      color: var(--color-text-secondary, #64748b);
    }
    .explorer-empty-icon {
      font-size: 2.5rem;
      margin-bottom: 0.75rem;
      opacity: 0.4;
      color: #6366f1;
    }
    .explorer-empty p {
      font-size: 1.05rem;
      margin: 0 0 1rem;
    }
    .explorer-empty-btn {
      padding: 0.55rem 1.4rem;
      border: 1px solid rgba(99, 102, 241, 0.35);
      border-radius: 9999px;
      background: var(--color-bg-card, #ffffff);
      color: #6366f1;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.2s;
    }
    .explorer-empty-btn:hover {
      background: rgba(99, 102, 241, 0.1);
      transform: translateY(-1px);
    }

    .explorer-group {
      margin-bottom: 3rem;
    }
    .explorer-group-header {
      display: flex;
      align-items: baseline;
      gap: 0.75rem;
      margin-bottom: 1.25rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid var(--color-border-card, rgba(148, 163, 184, 0.15));
    }
    .explorer-group-title {
      font-size: 1.35rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      margin: 0;
      font-family: var(--font-display, 'Plus Jakarta Sans', system-ui, sans-serif);
      color: var(--color-text-main, #0f172a);
    }
    .explorer-group-count {
      font-size: 0.85rem;
      color: var(--color-text-muted, #94a3b8);
      font-weight: 500;
    }

    .explorer-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1rem;
    }

    .explorer-card {
      display: flex;
      flex-direction: column;
      gap: 0.625rem;
      padding: 1.25rem;
      border: 1px solid var(--color-border, rgba(148, 163, 184, 0.2));
      border-radius: var(--radius-xl, 20px);
      background: var(--color-bg-card, #ffffff);
      text-decoration: none;
      color: inherit;
      box-shadow: 0 4px 16px -4px rgba(15, 23, 42, 0.05);
      transition:
        transform 0.22s cubic-bezier(0.16, 1, 0.3, 1),
        border-color 0.22s ease,
        box-shadow 0.22s ease;
      position: relative;
    }
    .explorer-card:hover {
      transform: translateY(-4px);
      border-color: rgba(99, 102, 241, 0.45);
      box-shadow: 0 18px 36px -10px rgba(99, 102, 241, 0.2);
    }
    .explorer-card:hover .explorer-card-arrow {
      transform: translateX(3px);
      color: var(--brand-primary, #6366f1);
    }
    .explorer-card-header {
      display: flex;
      align-items: center;
      gap: 0.625rem;
    }
    .explorer-card-arrow {
      margin-left: auto;
      color: var(--color-text-dim, #94a3b8);
      transition: transform 0.2s ease, color 0.2s ease;
    }
    .explorer-card-selector {
      margin-top: -0.15rem;
    }
    .explorer-card-selector code {
      font-family: var(--font-family-mono, monospace);
      font-size: 0.74rem;
      color: var(--brand-primary, #6366f1);
      background: rgba(99, 102, 241, 0.08);
      padding: 0.12rem 0.45rem;
      border-radius: 6px;
      border: 1px solid rgba(99, 102, 241, 0.16);
    }
    .explorer-card-dot {
      width: 0.55rem;
      height: 0.55rem;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .explorer-card-name {
      font-family: var(--font-display, 'Plus Jakarta Sans', system-ui, sans-serif);
      font-weight: 700;
      font-size: 1.05rem;
      letter-spacing: -0.015em;
      color: var(--color-text-main, #0f172a);
    }
    .explorer-card-desc {
      font-size: 0.85rem;
      color: var(--color-text-secondary, #64748b);
      margin: 0;
      line-height: 1.55;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .explorer-card-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 0.45rem;
      margin-top: auto;
      padding-top: 0.75rem;
      border-top: 1px solid var(--color-border-card, rgba(148, 163, 184, 0.12));
    }
    .explorer-card-tag {
      font-size: 0.72rem;
      font-weight: 600;
      padding: 0.2rem 0.55rem;
      border-radius: 9999px;
      background: rgba(99, 102, 241, 0.1);
      color: #6366f1;
      letter-spacing: 0.02em;
    }
    .explorer-card-prop {
      font-size: 0.72rem;
      font-weight: 500;
      color: var(--color-text-secondary, #64748b);
      padding: 0.2rem 0.55rem;
      border-radius: 9999px;
      background: var(--color-bg-subtle, #f1f5f9);
    }
    .explorer-card-prop--signal {
      background: rgba(16, 185, 129, 0.1) !important;
      color: #10b981 !important;
      font-weight: 600 !important;
    }

    .explorer-scroll-top {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      z-index: 100;
      width: 2.85rem;
      height: 2.85rem;
      border-radius: 9999px;
      border: 1px solid rgba(99, 102, 241, 0.35);
      background: var(--color-bg-card, #ffffff);
      color: #6366f1;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 8px 24px -4px rgba(99, 102, 241, 0.25);
      transition:
        transform 0.2s cubic-bezier(0.16, 1, 0.3, 1),
        background 0.2s,
        box-shadow 0.2s;
    }
    .explorer-scroll-top:hover {
      transform: translateY(-3px);
      background: linear-gradient(135deg, #6366f1, #4f46e5);
      color: #ffffff;
      box-shadow: 0 12px 28px -4px rgba(99, 102, 241, 0.4);
    }

    @media (max-width: 640px) {
      .explorer-grid {
        grid-template-columns: 1fr;
      }
      .explorer-tabs {
        gap: 0.25rem;
      }
      .explorer-tab {
        padding: 0.25rem 0.625rem;
        font-size: var(--ngxsmk-text-body-xs-size);
      }
      .explorer-scroll-top {
        bottom: 1rem;
        right: 1rem;
        width: 2.25rem;
        height: 2.25rem;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComponentExplorer {
  protected readonly registry = inject(ComponentRegistry);

  protected readonly query = signal('');
  protected readonly selectedCategory = signal<string | null>(null);
  protected readonly showScrollTop = signal(false);

  @HostListener('window:scroll')
  protected onWindowScroll(): void {
    if (typeof window === 'undefined') return;
    const yOffset = window.pageYOffset || document.documentElement.scrollTop;
    this.showScrollTop.set(yOffset > 300);
  }

  protected scrollToTop(): void {
    if (typeof window === 'undefined') return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

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
          (c: ComponentMetadata) =>
            c.name.toLowerCase().includes(q) ||
            c.description.toLowerCase().includes(q) ||
            c.tags.some((t: string) => t.toLowerCase().includes(q)) ||
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

  protected readonly CATEGORY_LABEL_KEY: Record<string, string> = {
    form: 'explorer.cat.form',
    layout: 'explorer.cat.layout',
    navigation: 'explorer.cat.navigation',
    'data-display': 'explorer.cat.dataDisplay',
    feedback: 'explorer.cat.feedback',
    overlay: 'explorer.cat.overlay',
    chart: 'explorer.cat.chart',
    ai: 'explorer.cat.ai',
    utility: 'explorer.cat.utility',
    other: 'explorer.cat.other',
  };

  catLabelKey(category: string): string {
    return this.CATEGORY_LABEL_KEY[category] ?? category;
  }

  iconFor(category: string): string {
    return (CATEGORY_ICONS as Record<string, string>)[category] || '◈';
  }

  colorFor(category: string): string {
    const colors: Record<string, string> = {
      form: '#6366f1',
      layout: '#3b82f6',
      navigation: '#8b5cf6',
      'data-display': '#06b6d4',
      feedback: '#f59e0b',
      overlay: '#ec4899',
      chart: '#10b981',
      ai: '#8b5cf6',
      enterprise: '#64748b',
      utility: '#6366f1',
      'content-typography': '#8b5cf6',
    };
    return colors[category] ?? '#6366f1';
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

  slug(comp: ComponentMetadata | string): string {
    if (typeof comp === 'string') {
      return comp
        .replace(/^Ngxsmk/, '')
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-');
    }
    if (comp.selector) {
      return comp.selector
        .replace(/^\[?ngxsmk-?/, '')
        .replace(/\]?$/, '')
        .replace(/[^a-z0-9]+/g, '-');
    }
    return comp.name
      .replace(/^Ngxsmk/, '')
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-');
  }
}
