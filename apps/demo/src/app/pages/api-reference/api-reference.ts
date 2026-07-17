import { Component, computed, effect, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AppNav } from '../../nav/nav';
import { NgxsmkTag } from '@ngxsmk/core/tag';
import { NgxsmkSelect, NgxsmkSelectOption } from '@ngxsmk/core/select';
import { NgxsmkHeading } from '@ngxsmk/core/heading';
import {
  CATEGORY_LABELS,
  ComponentRegistry,
  ComponentCategory,
} from '../../core/component-registry';

const ENTRY_CATEGORY: Record<string, ComponentCategory> = {
  '@ngxsmk/core/accordion': 'data-display',
  '@ngxsmk/core/agent-card': 'ai',
  '@ngxsmk/core/ai-chat': 'ai',
  '@ngxsmk/core/alert-dialog': 'overlay',
  '@ngxsmk/core/animation': 'utility',
};

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
  other: 'content-typography',
};

interface ApiInput {
  name: string;
  type: string;
  required?: boolean;
  twoWay?: boolean;
  default?: string;
}
interface ApiOutput {
  name: string;
  type: string;
}
interface ApiEntry {
  entryPoint: string;
  name: string;
  kind: string;
  selector: string;
  description: string;
  inputs: ApiInput[];
  outputs: ApiOutput[];
}
interface ApiDb {
  version: string;
  components: ApiEntry[];
}

/**
 * Generated API reference. Data comes from /component-api.json, which is
 * produced by tools/scripts/generate-ai-docs.mjs from the component sources —
 * the same pipeline that feeds llms.txt and the MCP server.
 */
@Component({
  selector: 'api-reference-page',
  standalone: true,
  imports: [AppNav, NgxsmkTag, RouterLink, NgxsmkSelect, TranslatePipe, NgxsmkHeading],
  template: `
    <app-nav />

    <div class="api-container">
      <header class="api-header">
        <div class="api-badges">
          @if (db(); as d) {
            <ngxsmk-tag class="api-badge">v{{ d.version }}</ngxsmk-tag>
            <ngxsmk-tag class="api-badge">{{
              'api.apiCount' | translate: { count: d.components.length }
            }}</ngxsmk-tag>
          }
        </div>
        <ngxsmk-heading level="h1" class="api-title">{{ 'api.title' | translate }}</ngxsmk-heading>
        <p class="api-subtitle">{{ 'api.subtitle' | translate }}</p>
        <div class="api-search-row">
          <input
            class="api-search"
            type="search"
            [placeholder]="'api.searchPlaceholder' | translate"
            [value]="query()"
            (input)="onQuery($event)"
            [attr.aria-label]="'api.searchPlaceholder' | translate"
          />
          <div class="api-category">
            <ngxsmk-select
              [placeholder]="'api.allCategories' | translate"
              [options]="categoryOptions()"
              [value]="selectedCategory()"
              (changed)="onCategoryChange($event)"
            />
          </div>
        </div>
      </header>

      @if (!db()) {
        <p class="api-loading">{{ 'api.loading' | translate }}</p>
      } @else {
        <div class="api-layout">
          <aside class="api-sidebar">
            <div class="api-sidebar-inner">
              @for (group of filteredGroups(); track group.entryPoint) {
                <div class="api-sidebar-group">
                  <span class="api-sidebar-entry">{{ group.entryPoint }}</span>
                  @for (c of group.items; track c.name) {
                    <button
                      type="button"
                      class="api-sidebar-link"
                      [class.active]="activeName() === c.name"
                      (click)="scrollTo(c.name)"
                    >
                      {{ c.name }}
                    </button>
                  }
                </div>
              }
            </div>
          </aside>

          <main class="api-main">
            @if (filteredGroups().length === 0) {
              <p class="api-loading">
                {{ 'api.noMatch' | translate: { query: query() } }}
              </p>
            }
            @for (group of filteredGroups(); track group.entryPoint) {
              @for (c of group.items; track c.name) {
                <section class="api-entry" [id]="c.name" tabindex="-1">
                  <div class="api-entry-head">
                    <ngxsmk-heading level="h2" class="api-entry-name">
                      <a
                        class="api-entry-link"
                        [routerLink]="['/showcase', routeForEntry(c)]"
                        [fragment]="slug(c.name)"
                        >{{ c.name }}</a
                      >
                    </ngxsmk-heading>
                    <span class="api-kind" [attr.data-kind]="c.kind">{{ c.kind }}</span>
                    <button
                      class="api-anchor"
                      type="button"
                      [title]="'api.copyLink' | translate: { name: c.name }"
                      (click)="copyLink(c.name)"
                    >
                      #
                    </button>
                  </div>

                  <div class="api-meta-list">
                    <div class="api-meta-row">
                      <code class="api-entry-meta">{{ c.selector }}</code>
                      <button
                        class="api-copy"
                        type="button"
                        (click)="copy(c.selector, 'sel-' + c.name)"
                      >
                        {{
                          copiedKey() === 'sel-' + c.name
                            ? ('api.copied' | translate)
                            : ('api.copy' | translate)
                        }}
                      </button>
                    </div>
                    <div class="api-meta-row">
                      <code class="api-entry-meta"
                        >import {{ '{' }} {{ c.name }} {{ '}' }} from '{{ c.entryPoint }}'</code
                      >
                      <button
                        class="api-copy"
                        type="button"
                        (click)="copy(importLine(c), 'imp-' + c.name)"
                      >
                        {{
                          copiedKey() === 'imp-' + c.name
                            ? ('api.copied' | translate)
                            : ('api.copy' | translate)
                        }}
                      </button>
                    </div>
                  </div>

                  @if (c.description) {
                    <p class="api-entry-desc">{{ c.description }}</p>
                  }

                  @if (c.inputs.length) {
                    <ngxsmk-heading level="h3" class="api-table-title">{{
                      'api.inputs' | translate
                    }}</ngxsmk-heading>
                    <div class="api-table-wrap">
                      <table class="api-table">
                        <thead>
                          <tr>
                            <th>{{ 'api.colName' | translate }}</th>
                            <th>{{ 'api.colType' | translate }}</th>
                            <th>{{ 'api.colDefault' | translate }}</th>
                          </tr>
                        </thead>
                        <tbody>
                          @for (i of c.inputs; track i.name) {
                            <tr>
                              <td>
                                <code>{{
                                  i.twoWay ? '[(' + i.name + ')]' : '[' + i.name + ']'
                                }}</code>
                                @if (i.required) {
                                  <span class="api-tag api-tag--required">{{
                                    'api.required' | translate
                                  }}</span>
                                }
                                @if (i.twoWay) {
                                  <span class="api-tag api-tag--twoway">{{
                                    'api.twoway' | translate
                                  }}</span>
                                }
                              </td>
                              <td>
                                <code class="api-type">{{ i.type }}</code>
                              </td>
                              <td>
                                @if (i.default) {
                                  <code>{{ i.default }}</code>
                                } @else {
                                  <span class="api-muted">—</span>
                                }
                              </td>
                            </tr>
                          }
                        </tbody>
                      </table>
                    </div>
                  }

                  @if (c.outputs.length) {
                    <ngxsmk-heading level="h3" class="api-table-title">{{
                      'api.outputs' | translate
                    }}</ngxsmk-heading>
                    <div class="api-table-wrap">
                      <table class="api-table">
                        <thead>
                          <tr>
                            <th>{{ 'api.colName' | translate }}</th>
                            <th>{{ 'api.colEmits' | translate }}</th>
                          </tr>
                        </thead>
                        <tbody>
                          @for (o of c.outputs; track o.name) {
                            <tr>
                              <td>
                                <code>({{ o.name }})</code>
                              </td>
                              <td>
                                <code class="api-type">{{ o.type }}</code>
                              </td>
                            </tr>
                          }
                        </tbody>
                      </table>
                    </div>
                  }
                </section>
              }
            }
          </main>
        </div>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
      background-color: var(--ngxsmk-color-background, #fafafa);
      background-image: radial-gradient(var(--ngxsmk-color-outline, #e4e4e7) 1px, transparent 1px);
      background-size: 24px 24px;
      min-height: 100vh;
    }
    .api-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: var(--ngxsmk-space-12, 3rem) var(--ngxsmk-space-6, 1.5rem);
      font-family: 'DM Sans', var(--ngxsmk-font-sans, system-ui), sans-serif;
    }
    .api-header {
      margin-bottom: 2.5rem;
    }
    .api-badges {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }
    .api-badge {
      font-size: 0.7rem;
      font-weight: 600;
    }
    ngxsmk-heading.api-title {
      font-family: 'Outfit', var(--ngxsmk-font-sans, system-ui), sans-serif;
      font-size: 2.5rem;
      font-weight: 800;
      letter-spacing: -0.03em;
      margin: 0 0 0.5rem;
      color: var(--ngxsmk-color-on-surface);
    }
    .api-subtitle {
      font-size: 1rem;
      color: var(--ngxsmk-color-on-surface-variant);
      margin: 0 0 1.5rem;
      max-width: 640px;
      line-height: 1.5;
    }
    .api-search-row {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
      align-items: center;
    }
    .api-search {
      flex: 1 1 320px;
      max-width: 480px;
      padding: 0.625rem 1rem;
      font-size: 0.9375rem;
      font-family: inherit;
      color: var(--ngxsmk-color-on-surface);
      background: var(--ngxsmk-color-surface);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-lg);
      outline: none;
      transition:
        border-color 0.15s,
        box-shadow 0.15s;
    }
    .api-search:focus {
      border-color: var(--ngxsmk-color-primary);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--ngxsmk-color-primary) 20%, transparent);
    }
    .api-category {
      flex: 0 0 auto;
      width: 220px;
      max-width: 100%;
    }
    @media (max-width: 640px) {
      .api-category {
        width: 100%;
      }
    }
    .api-loading {
      color: var(--ngxsmk-color-on-surface-variant);
      font-size: 0.9375rem;
    }

    .api-layout {
      display: grid;
      grid-template-columns: 220px minmax(0, 1fr);
      gap: 2.5rem;
      align-items: start;
    }
    .api-sidebar {
      position: sticky;
      top: 5rem;
      max-height: calc(100vh - 6rem);
    }
    .api-sidebar-inner {
      max-height: 100%;
      overflow-y: auto;
      padding-right: 0.5rem;
      scrollbar-width: thin;
    }
    .api-sidebar-group {
      margin-bottom: 1rem;
    }
    .api-sidebar-entry {
      display: block;
      font-family: var(--ngxsmk-font-mono);
      font-size: 0.6875rem;
      color: var(--ngxsmk-color-on-surface-variant);
      margin-bottom: 0.25rem;
      word-break: break-all;
    }
    .api-sidebar-link {
      display: block;
      width: 100%;
      text-align: left;
      font: inherit;
      border: 0;
      background: none;
      cursor: pointer;
      font-size: 0.8125rem;
      color: var(--ngxsmk-color-on-surface-variant);
      text-decoration: none;
      padding: 0.2rem 0.5rem;
      border-radius: var(--ngxsmk-radius-sm);
      border-left: 2px solid transparent;
      transition:
        background 0.15s,
        color 0.15s,
        border-color 0.15s;
    }
    .api-sidebar-link:hover {
      background: var(--ngxsmk-color-surface-hover, var(--ngxsmk-color-surface-variant));
      color: var(--ngxsmk-color-primary);
    }
    .api-sidebar-link.active {
      color: var(--ngxsmk-color-primary);
      background: color-mix(in srgb, var(--ngxsmk-color-primary) 10%, transparent);
      border-left-color: var(--ngxsmk-color-primary);
    }
    @media (max-width: 900px) {
      .api-layout {
        grid-template-columns: minmax(0, 1fr);
      }
      .api-sidebar {
        display: none;
      }
    }

    .api-entry {
      margin-bottom: 3rem;
      scroll-margin-top: 5rem;
    }
    .api-entry:focus {
      outline: 2px solid var(--ngxsmk-color-primary);
      outline-offset: 4px;
      border-radius: var(--ngxsmk-radius-lg);
    }
    .api-entry:focus-visible {
      outline: 2px solid var(--ngxsmk-color-primary);
      outline-offset: 4px;
      border-radius: var(--ngxsmk-radius-lg);
    }
    .api-entry-head {
      display: flex;
      align-items: center;
      gap: 0.625rem;
      margin-bottom: 0.5rem;
    }
    ngxsmk-heading.api-entry-name {
      font-family: 'Outfit', var(--ngxsmk-font-sans, system-ui), sans-serif;
      font-size: 1.375rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      margin: 0;
      color: var(--ngxsmk-color-on-surface);
    }
    .api-entry-link {
      color: inherit;
      text-decoration: none;
      transition: color 0.15s;
    }
    .api-entry-link:hover {
      color: var(--ngxsmk-color-primary);
    }
    .api-kind {
      font-size: 0.625rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      padding: 0.15rem 0.5rem;
      border-radius: 999px;
      border: 1px solid transparent;
      white-space: nowrap;
    }
    .api-kind[data-kind='component'] {
      color: var(--ngxsmk-color-primary);
      background: color-mix(in srgb, var(--ngxsmk-color-primary) 12%, transparent);
    }
    .api-kind[data-kind='directive'] {
      color: #0ea5e9;
      background: color-mix(in srgb, #0ea5e9 12%, transparent);
    }
    .api-kind[data-kind='pipe'] {
      color: #8b5cf6;
      background: color-mix(in srgb, #8b5cf6 12%, transparent);
    }
    .api-anchor {
      margin-left: auto;
      width: 1.75rem;
      height: 1.75rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-family: var(--ngxsmk-font-mono);
      font-size: 0.875rem;
      color: var(--ngxsmk-color-on-surface-variant);
      background: transparent;
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-sm);
      cursor: pointer;
      opacity: 0;
      transition:
        opacity 0.15s,
        color 0.15s,
        border-color 0.15s;
    }
    .api-entry:hover .api-anchor,
    .api-anchor:focus-visible {
      opacity: 1;
    }
    .api-anchor:hover {
      color: var(--ngxsmk-color-primary);
      border-color: var(--ngxsmk-color-primary);
    }

    .api-meta-list {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
      margin-bottom: 0.5rem;
    }
    .api-meta-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .api-entry-meta {
      font-family: var(--ngxsmk-font-mono);
      font-size: 0.75rem;
      color: var(--ngxsmk-color-on-surface-variant);
      background: var(--ngxsmk-color-surface-variant);
      border-radius: var(--ngxsmk-radius-sm);
      padding: 0.25rem 0.5rem;
      word-break: break-all;
    }
    .api-copy {
      flex: 0 0 auto;
      font-size: 0.6875rem;
      font-weight: 600;
      color: var(--ngxsmk-color-on-surface-variant);
      background: var(--ngxsmk-color-surface);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-sm);
      padding: 0.2rem 0.5rem;
      cursor: pointer;
      transition:
        color 0.15s,
        border-color 0.15s,
        background 0.15s;
    }
    .api-copy:hover {
      color: var(--ngxsmk-color-primary);
      border-color: var(--ngxsmk-color-primary);
    }
    .api-entry-desc {
      font-size: 0.875rem;
      color: var(--ngxsmk-color-on-surface-variant);
      line-height: 1.6;
      margin: 0.5rem 0 0;
      max-width: 720px;
    }
    ngxsmk-heading.api-table-title {
      font-size: 0.8125rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--ngxsmk-color-on-surface);
      margin: 1.25rem 0 0.5rem;
    }
    .api-table-wrap {
      overflow-x: auto;
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-lg);
    }
    .api-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.8125rem;
    }
    .api-table thead th {
      position: sticky;
      top: 0;
      z-index: 1;
      text-align: left;
      font-weight: 600;
      color: var(--ngxsmk-color-on-surface-variant);
      background: var(--ngxsmk-color-surface-variant);
      padding: 0.5rem 0.75rem;
      white-space: nowrap;
    }
    .api-table tbody tr {
      transition: background 0.12s;
    }
    .api-table tbody tr:hover {
      background: var(--ngxsmk-color-surface-hover, var(--ngxsmk-color-surface-variant));
    }
    .api-table td {
      padding: 0.5rem 0.75rem;
      border-top: 1px solid var(--ngxsmk-color-outline);
      color: var(--ngxsmk-color-on-surface);
      vertical-align: top;
    }
    .api-table code {
      font-family: var(--ngxsmk-font-mono);
      font-size: 0.75rem;
    }
    .api-type {
      color: var(--ngxsmk-color-primary);
      word-break: break-word;
    }
    .api-tag {
      display: inline-block;
      margin-left: 0.375rem;
      font-size: 0.625rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      padding: 0.05rem 0.35rem;
      border-radius: 999px;
    }
    .api-tag--required {
      color: #e11d48;
      background: color-mix(in srgb, #e11d48 12%, transparent);
    }
    .api-tag--twoway {
      color: #0ea5e9;
      background: color-mix(in srgb, #0ea5e9 12%, transparent);
    }
    .api-muted {
      color: var(--ngxsmk-color-on-surface-variant);
    }
  `,
})
export class ApiReferencePage {
  private readonly http = inject(HttpClient);

  protected readonly db = signal<ApiDb | undefined>(undefined);
  protected readonly query = signal('');
  protected readonly activeName = signal('');
  protected readonly copiedKey = signal<string | null>(null);
  protected readonly selectedCategory = signal('');

  private readonly registry = inject(ComponentRegistry);

  protected readonly entryCategory = computed(() => {
    const map: Record<string, ComponentCategory> = {};
    for (const c of this.registry.allComponents()) {
      map[c.name] = c.category;
    }
    return map;
  });

  protected categoryOf(c: ApiEntry): string {
    return this.entryCategory()[c.name] ?? ENTRY_CATEGORY[c.entryPoint] ?? 'other';
  }

  protected routeForEntry(c: ApiEntry): string {
    const cat = this.categoryOf(c);
    return CATEGORY_ROUTE[cat] ?? 'content-typography';
  }

  protected readonly categoryOptions = computed<NgxsmkSelectOption[]>(() => {
    const data = this.db();
    if (!data) return [];
    const present = new Set<string>();
    for (const c of data.components) present.add(this.categoryOf(c));
    const ORDER: ComponentCategory[] = [
      'form',
      'layout',
      'navigation',
      'data-display',
      'feedback',
      'overlay',
      'chart',
      'ai',
      'utility',
      'other',
    ];
    const opts: NgxsmkSelectOption[] = [];
    for (const k of ORDER) {
      if (present.has(k)) {
        opts.push({ value: k, label: CATEGORY_LABELS[k] ?? k });
      }
    }
    return opts;
  });

  protected onCategoryChange(value: string) {
    this.selectedCategory.set(value);
    if (!value) return;
    setTimeout(() => {
      const first = document.querySelector<HTMLElement>('.api-main .api-entry');
      first?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  }

  protected slug(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }

  protected scrollTo(name: string) {
    const el = document.getElementById(name);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    el.focus({ preventScroll: true });
  }

  private observer?: IntersectionObserver;

  protected readonly filteredGroups = computed(() => {
    const data = this.db();
    if (!data) return [];
    const q = this.query().trim().toLowerCase();
    const selCat = this.selectedCategory();
    const matches = q
      ? data.components.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.selector.toLowerCase().includes(q) ||
            c.entryPoint.toLowerCase().includes(q) ||
            c.description.toLowerCase().includes(q) ||
            c.inputs.some((i) => i.name.toLowerCase().includes(q)) ||
            c.outputs.some((o) => o.name.toLowerCase().includes(q)),
        )
      : data.components;
    const filtered = selCat ? matches.filter((c) => this.categoryOf(c) === selCat) : matches;

    const groups = new Map<string, ApiEntry[]>();
    for (const c of filtered) {
      const list = groups.get(c.entryPoint) ?? [];
      list.push(c);
      groups.set(c.entryPoint, list);
    }
    return [...groups.entries()].map(([entryPoint, items]) => ({ entryPoint, items }));
  });

  constructor() {
    effect(() => {
      this.filteredGroups();
      if (this.db()) {
        setTimeout(() => this.setupScrollSpy(), 0);
      }
    });

    this.http.get<ApiDb>('component-api.json').subscribe((data) => this.db.set(data));
  }

  protected onQuery(event: Event) {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected importLine(c: ApiEntry): string {
    return `import { ${c.name} } from '${c.entryPoint}'`;
  }

  protected async copy(text: string, key: string) {
    try {
      await navigator.clipboard.writeText(text);
      this.copiedKey.set(key);
      setTimeout(() => {
        if (this.copiedKey() === key) this.copiedKey.set(null);
      }, 1500);
    } catch {
      /* clipboard unavailable */
    }
  }

  protected copyLink(name: string) {
    const url = `${location.origin}${location.pathname}#${name}`;
    this.copy(url, 'lnk-' + name);
  }

  private setupScrollSpy() {
    this.observer?.disconnect();
    const entries = Array.from(document.querySelectorAll<HTMLElement>('.api-entry'));
    if (!entries.length) return;
    this.observer = new IntersectionObserver(
      (observed) => {
        const visible = observed
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length) {
          this.activeName.set(visible[0].target.id);
        }
      },
      { rootMargin: '0px 0px -70% 0px', threshold: 0 },
    );
    entries.forEach((e) => this.observer?.observe(e));
  }
}
