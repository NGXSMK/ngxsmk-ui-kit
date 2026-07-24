import { Component, signal, computed, ElementRef, ViewChild, inject, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TranslatePipe } from '@ngx-translate/core';
import { AppNav } from '../nav/nav';

interface CategoryGroup {
  label: string;
  icon: string;
  categories: { path: string; label: string; items: string[] }[];
}

@Component({
  selector: 'showcase-layout',
  standalone: true,
  imports: [FormsModule, RouterOutlet, RouterLink, RouterLinkActive, AppNav, TranslatePipe],
  template: `
    <app-nav />
    <div class="sc-layout">
      <aside class="sc-sidebar" [class.sc-sidebar--open]="mobileOpen()">
        <div class="sc-sidebar__brand">
          <span class="sc-sidebar__brand-name">NGXSMK</span>
          <span class="sc-sidebar__version">v2.0.0</span>
        </div>

        <div class="sc-sidebar__search">
          <svg
            class="sc-sidebar__search-icon"
            width="14"
            height="14"
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
            class="sc-sidebar__search-input"
            type="search"
            [attr.placeholder]="'showcase.searchPlaceholder' | translate"
            [ngModel]="searchQuery()"
            (ngModelChange)="searchQuery.set($event)"
          />
          <kbd class="sc-sidebar__search-kbd">⌘K</kbd>
        </div>

        <div class="sc-sidebar__nav">
          <a
            class="sc-sidebar__overview"
            routerLink="/showcase/explorer"
            routerLinkActive="sc-sidebar__overview--active"
            (click)="mobileOpen.set(false)"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
            {{ 'showcase.componentExplorer' | translate }}
          </a>

          @for (group of filteredGroups(); track group.label) {
            <div class="sc-sidebar__group">
              <button
                class="sc-sidebar__group-header"
                type="button"
                (click)="toggleGroup(group.label)"
                [attr.aria-expanded]="expandedGroups().has(group.label)"
              >
                <span class="sc-sidebar__group-icon" [innerHTML]="group.icon"></span>
                <span class="sc-sidebar__group-name">{{
                  groupLabelKey(group.label) | translate
                }}</span>
                <span class="sc-sidebar__group-count">{{ groupItemCount(group) }}</span>
                <svg
                  class="sc-sidebar__group-chevron"
                  [class.sc-sidebar__group-chevron--open]="expandedGroups().has(group.label)"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              @if (expandedGroups().has(group.label)) {
                <div class="sc-sidebar__group-items">
                  @for (cat of group.categories; track cat.path) {
                    <a
                      class="sc-sidebar__link"
                      routerLink="/showcase/{{ cat.path }}"
                      routerLinkActive="sc-sidebar__link--active"
                      (click)="mobileOpen.set(false)"
                    >
                      {{ 'category.' + cat.path | translate }}
                    </a>
                  }
                </div>
              }
            </div>
          }
        </div>

        <div class="sc-sidebar__footer">
          <a
            class="sc-sidebar__footer-link"
            href="https://github.com/ngxsmk/ngxsmk-ui-kit"
            target="_blank"
            rel="noopener"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
              />
            </svg>
            GitHub
          </a>
        </div>
      </aside>

      @if (mobileOpen()) {
        <!-- eslint-disable-next-line @angular-eslint/template/click-events-have-key-events, @angular-eslint/template/interactive-supports-focus -->
        <div class="sc-backdrop" (click)="mobileOpen.set(false)"></div>
      }

      <main #contentEl class="sc-content">
        <button
          class="sc-menu-btn"
          type="button"
          (click)="mobileOpen.set(true)"
          [attr.aria-label]="'showcase.openCategories' | translate"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          >
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
          {{ 'showcase.categories' | translate }}
        </button>
        <router-outlet />
      </main>
    </div>
  `,
  styles: `
    .sc-layout {
      display: grid;
      grid-template-columns: 260px 1fr;
      height: calc(100dvh - 3.5rem);
      font-family: 'Inter', var(--ngxsmk-font-sans, system-ui), sans-serif;
      color: var(--ngxsmk-color-on-surface, #09090b);
      background: var(--ngxsmk-color-background, #fafafa);
    }

    .sc-sidebar {
      border-right: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
      display: flex;
      flex-direction: column;
      background: var(--ngxsmk-color-surface, #ffffff);
      overflow: hidden;
    }

    .sc-sidebar__brand {
      display: flex;
      align-items: center;
      gap: var(--ngxsmk-space-2, 0.5rem);
      padding: var(--ngxsmk-space-4, 1rem) var(--ngxsmk-space-4, 1rem);
      border-bottom: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
    }

    .sc-sidebar__brand-name {
      font-family: 'Outfit', var(--ngxsmk-font-sans, system-ui), sans-serif;
      font-size: var(--ngxsmk-text-body-md-size);
      font-weight: 700;
      letter-spacing: -0.02em;
      color: var(--ngxsmk-color-on-surface, #09090b);
    }

    .sc-sidebar__version {
      font-size: var(--ngxsmk-text-body-xs-size);
      font-weight: 500;
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
      background: var(--ngxsmk-color-surface-variant, #f4f4f5);
      padding: 0.1rem 0.4rem;
      border-radius: var(--ngxsmk-radius-sm, 0.25rem);
      line-height: 1.4;
    }

    .sc-sidebar__search {
      position: relative;
      padding: var(--ngxsmk-space-3, 0.75rem) var(--ngxsmk-space-3, 0.75rem);
      border-bottom: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
    }

    .sc-sidebar__search-icon {
      position: absolute;
      left: calc(0.75rem + 0.625rem);
      top: 50%;
      transform: translateY(-50%);
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
      pointer-events: none;
    }

    .sc-sidebar__search-input {
      width: 100%;
      padding: 0.4rem 2.5rem 0.4rem 2rem;
      border: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
      border-radius: var(--ngxsmk-radius-md, 0.375rem);
      background: var(--ngxsmk-color-background, #fafafa);
      color: var(--ngxsmk-color-on-surface, #09090b);
      font-size: var(--ngxsmk-text-body-sm-size);
      outline: none;
      transition:
        border-color 0.15s,
        box-shadow 0.15s;
    }

    .sc-sidebar__search-input:focus {
      border-color: var(--ngxsmk-color-primary, #7c3aed);
      background: var(--ngxsmk-color-surface, #ffffff);
      box-shadow: 0 0 0 3px
        color-mix(in srgb, var(--ngxsmk-color-primary, #7c3aed) 12%, transparent);
    }

    .sc-sidebar__search-input::placeholder {
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
    }

    .sc-sidebar__search-kbd {
      position: absolute;
      right: calc(0.75rem + 0.5rem);
      top: 50%;
      transform: translateY(-50%);
      font-family: var(--ngxsmk-font-mono);
      font-size: 0.65rem;
      font-weight: 500;
      color: var(--ngxsmk-color-on-surface-variant, #a1a1aa);
      background: var(--ngxsmk-color-surface, #ffffff);
      border: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
      border-radius: 0.25rem;
      padding: 0.1rem 0.35rem;
      line-height: 1.3;
      pointer-events: none;
    }

    .sc-sidebar__nav {
      flex: 1;
      overflow-y: auto;
      overscroll-behavior: contain;
      -webkit-overflow-scrolling: touch;
      padding: var(--ngxsmk-space-2, 0.5rem) var(--ngxsmk-space-3, 0.75rem);
      display: flex;
      flex-direction: column;
      gap: var(--ngxsmk-space-1, 0.25rem);
    }

    .sc-sidebar__overview {
      display: flex;
      align-items: center;
      gap: var(--ngxsmk-space-2, 0.5rem);
      padding: var(--ngxsmk-space-2, 0.5rem) var(--ngxsmk-space-2, 0.5rem);
      border-radius: var(--ngxsmk-radius-md, 0.375rem);
      font-size: var(--ngxsmk-text-body-sm-size);
      font-weight: 600;
      text-decoration: none;
      color: var(--ngxsmk-color-on-surface, #09090b);
      transition: background 0.15s;
    }

    .sc-sidebar__overview:hover {
      background: color-mix(in srgb, var(--ngxsmk-color-on-surface, #09090b) 4%, transparent);
    }

    .sc-sidebar__overview--active {
      color: var(--ngxsmk-color-primary, #7c3aed);
      background: color-mix(in srgb, var(--ngxsmk-color-primary, #7c3aed) 8%, transparent);
    }

    .sc-sidebar__group {
      display: flex;
      flex-direction: column;
    }

    .sc-sidebar__group-header {
      display: flex;
      align-items: center;
      gap: var(--ngxsmk-space-2, 0.5rem);
      width: 100%;
      padding: var(--ngxsmk-space-2, 0.5rem) var(--ngxsmk-space-2, 0.5rem);
      border: none;
      border-radius: var(--ngxsmk-radius-md, 0.375rem);
      background: none;
      font-family: inherit;
      font-size: var(--ngxsmk-text-body-sm-size);
      font-weight: 600;
      color: var(--ngxsmk-color-on-surface, #09090b);
      cursor: pointer;
      transition: background 0.15s;
      text-align: left;
    }

    .sc-sidebar__group-header:hover {
      background: color-mix(in srgb, var(--ngxsmk-color-on-surface, #09090b) 4%, transparent);
    }

    .sc-sidebar__group-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 18px;
      height: 18px;
      flex-shrink: 0;
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
    }

    .sc-sidebar__group-icon :is(svg) {
      width: 16px;
      height: 16px;
    }

    .sc-sidebar__group-name {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .sc-sidebar__group-count {
      font-size: 0.65rem;
      font-weight: 500;
      color: var(--ngxsmk-color-on-surface-variant, #a1a1aa);
      background: var(--ngxsmk-color-surface-variant, #f4f4f5);
      padding: 0.05rem 0.4rem;
      border-radius: 9999px;
      line-height: 1.4;
    }

    .sc-sidebar__group-chevron {
      flex-shrink: 0;
      color: var(--ngxsmk-color-on-surface-variant, #a1a1aa);
      transition: transform 0.15s ease;
    }

    .sc-sidebar__group-chevron--open {
      transform: rotate(180deg);
    }

    .sc-sidebar__group-items {
      display: flex;
      flex-direction: column;
      gap: 1px;
      padding-left: calc(18px + var(--ngxsmk-space-2, 0.5rem));
    }

    .sc-sidebar__link {
      display: block;
      padding: var(--ngxsmk-space-1-5, 0.375rem) var(--ngxsmk-space-2, 0.5rem);
      border-radius: var(--ngxsmk-radius-md, 0.375rem);
      font-size: var(--ngxsmk-text-body-sm-size);
      text-decoration: none;
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
      transition:
        color 0.15s,
        background 0.15s;
    }

    .sc-sidebar__link:hover {
      color: var(--ngxsmk-color-on-surface, #09090b);
      background: color-mix(in srgb, var(--ngxsmk-color-on-surface, #09090b) 4%, transparent);
    }

    .sc-sidebar__link--active {
      background: var(--ngxsmk-color-primary-container, #ede9fe);
      color: var(--ngxsmk-color-on-primary-container, #4c1d95);
      font-weight: 600;
    }

    .sc-sidebar__footer {
      padding: var(--ngxsmk-space-3, 0.75rem) var(--ngxsmk-space-4, 1rem);
      border-top: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
    }

    .sc-sidebar__footer-link {
      display: flex;
      align-items: center;
      gap: var(--ngxsmk-space-2, 0.5rem);
      font-size: var(--ngxsmk-text-body-sm-size);
      font-weight: 500;
      text-decoration: none;
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
      transition: color 0.15s;
    }

    .sc-sidebar__footer-link:hover {
      color: var(--ngxsmk-color-on-surface, #09090b);
    }

    .sc-content {
      grid-column: 2;
      overflow-y: auto;
      overscroll-behavior: contain;
      -webkit-overflow-scrolling: touch;
      scroll-behavior: smooth;
      padding: var(--ngxsmk-space-8, 2rem);
      background: var(--ngxsmk-color-background, #fafafa);
    }

    .sc-menu-btn {
      display: none;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: var(--ngxsmk-space-4, 1rem);
      padding: var(--ngxsmk-space-2, 0.5rem) var(--ngxsmk-space-3, 0.75rem);
      border: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
      border-radius: var(--ngxsmk-radius-md, 0.375rem);
      background: var(--ngxsmk-color-surface, #ffffff);
      color: var(--ngxsmk-color-on-surface, #09090b);
      font-size: var(--ngxsmk-text-body-sm-size);
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s;
    }

    .sc-menu-btn:hover {
      background: color-mix(in srgb, var(--ngxsmk-color-on-surface, #09090b) 4%, transparent);
    }

    .sc-backdrop {
      display: none;
    }

    @media (max-width: 768px) {
      .sc-layout {
        grid-template-columns: 1fr;
      }

      .sc-sidebar {
        position: fixed;
        top: 3.5rem;
        bottom: 0;
        left: 0;
        width: min(280px, 85vw);
        min-width: min(280px, 85vw);
        z-index: var(--ngxsmk-z-overlay, 1200);
        transform: translateX(-100%);
        transition: transform 0.2s ease;
        box-shadow: var(--ngxsmk-shadow-xl, 0 20px 25px -5px rgba(0, 0, 0, 0.1));
      }

      .sc-sidebar--open {
        transform: translateX(0);
      }

      .sc-backdrop {
        display: block;
        position: fixed;
        inset: 3.5rem 0 0 0;
        z-index: var(--ngxsmk-z-overlay, 1200);
        background: rgba(9, 9, 11, 0.4);
        backdrop-filter: blur(2px);
      }

      .sc-menu-btn {
        display: inline-flex;
      }

      .sc-content {
        padding: var(--ngxsmk-space-4, 1rem);
      }
    }

    @media (max-width: 480px) {
      .sc-content {
        padding: var(--ngxsmk-space-3, 0.75rem);
      }
    }
  `,
})
export class ShowcaseLayout {
  protected readonly searchQuery = signal('');
  protected readonly mobileOpen = signal(false);
  protected readonly expandedGroups = signal<Set<string>>(
    new Set([
      'Content',
      'Navigation',
      'Layout',
      'Forms',
      'Feedback',
      'Data Display',
      'Overlay',
      'Charts',
      'AI',
      'Enterprise',
      'Utilities',
    ]),
  );

  @ViewChild('contentEl') contentEl?: ElementRef<HTMLElement>;
  private readonly router = inject(Router);

  constructor() {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      setTimeout(() => {
        const tree = this.router.parseUrl(this.router.url);
        if (tree.fragment) {
          const el = document.getElementById(tree.fragment);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            return;
          }
        }
        if (this.contentEl) {
          this.contentEl.nativeElement.scrollTop = 0;
        }
        window.scrollTo(0, 0);
      }, 0);
    });

    effect(() => {
      if (typeof document !== 'undefined') {
        if (this.mobileOpen()) {
          document.body.style.overflow = 'hidden';
        } else {
          document.body.style.overflow = '';
        }
      }
    });
  }

  protected toggleGroup(label: string): void {
    this.expandedGroups.update((groups) => {
      const next = new Set(groups);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  }

  protected groupItemCount(group: CategoryGroup): number {
    return group.categories.reduce((sum, cat) => sum + cat.items.length, 0);
  }

  private readonly allGroups: CategoryGroup[] = [
    {
      label: 'Content',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/></svg>',
      categories: [
        {
          path: 'content-typography',
          label: 'Content & Typography',
          items: [
            'Heading',
            'Text',
            'Blockquote',
            'Code',
            'Kbd',
            'Link',
            'Thumbnail',
            'Timestamp',
            'Token',
            'Citation',
            'Markdown',
          ],
        },
      ],
    },
    {
      label: 'Navigation',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>',
      categories: [
        {
          path: 'navigation',
          label: 'Navigation',
          items: [
            'Breadcrumb Item',
            'Outline',
            'Tab Menu',
            'Nav Icon',
            'Nav Heading Menu',
            'Side Nav',
            'Top Nav',
            'Mega Menu',
            'Mobile Nav',
          ],
        },
      ],
    },
    {
      label: 'Layout',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>',
      categories: [
        {
          path: 'layout',
          label: 'Layout',
          items: [
            'Center',
            'Section',
            'Container',
            'Grid',
            'Flex',
            'HStack',
            'VStack',
            'Stack',
            'Divider',
            'Aspect Ratio',
            'Spacer',
            'Collapsible',
            'Resizable',
            'App Shell',
            'Form Layout',
          ],
        },
      ],
    },
    {
      label: 'Forms',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
      categories: [
        {
          path: 'forms',
          label: 'Forms',
          items: [
            'Button',
            'Button Group',
            'Toggle Button',
            'Toggle Button Group',
            'Input',
            'Checkbox',
            'Checkbox List',
            'Radio',
            'Switch',
            'Textarea',
            'Number Input',
            'Select',
            'Multi Select',
            'Autocomplete',
            'Combobox',
            'Typeahead',
            'Power Search',
            'Slider',
            'Date Picker',
            'Segmented Control',
            'Selector',
            'Multi Selector',
            'Tokenizer',
            'Input Group',
            'Field',
            'Form Field',
            'OTP Input',
            'Range Slider',
          ],
        },
      ],
    },
    {
      label: 'Feedback',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',
      categories: [
        {
          path: 'feedback',
          label: 'Feedback',
          items: [
            'Alert',
            'Banner',
            'Badge',
            'Progress',
            'Skeleton',
            'Spinner',
            'Empty State',
            'Status Dot',
          ],
        },
      ],
    },
    {
      label: 'Data Display',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/></svg>',
      categories: [
        {
          path: 'data-display',
          label: 'Data Display',
          items: [
            'Tabs',
            'Accordion',
            'Avatar',
            'Tag & Chip',
            'Table',
            'Data Table',
            'List',
            'Metadata List',
            'Overflow List',
            'Stat',
            'Status Dot',
          ],
        },
      ],
    },
    {
      label: 'Overlay',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18"/><rect x="3" y="6" width="18" height="12" rx="2"/></svg>',
      categories: [
        {
          path: 'overlay',
          label: 'Overlay',
          items: [
            'Dialog',
            'Alert Dialog',
            'Tooltip',
            'Hover Card',
            'Sheet',
            'Dropdown Menu',
            'Context Menu',
            'Lightbox',
          ],
        },
      ],
    },
    {
      label: 'Charts',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
      categories: [
        {
          path: 'charts',
          label: 'Charts',
          items: [
            'Line Chart',
            'Bar Chart',
            'Pie Chart',
            'Area Chart',
            'Scatter Chart',
            'Candlestick Chart',
            'Heatmap',
            'Dashboard',
            'Sparkline',
            'Gauge',
          ],
        },
      ],
    },
    {
      label: 'AI',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a4 4 0 0 0-4 4v2H6a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h2v2a4 4 0 0 0 8 0v-2h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-2V6a4 4 0 0 0-4-4z"/></svg>',
      categories: [
        {
          path: 'ai',
          label: 'AI',
          items: [
            'Agent Card',
            'Chat Window',
            'Chat Input',
            'Chat Layout',
            'Chat Send Button',
            'Chat Dictation Button',
            'Chat Tokens',
            'Conversation List',
            'Composer Drawer',
            'Streaming Text',
            'Markdown Viewer',
            'Code Block',
            'Diff Viewer',
            'Citation Viewer',
            'Tool Call Viewer',
            'Reasoning Timeline',
            'Memory Viewer',
            'Voice Input',
            'Audio Player',
            'Image Viewer',
            'Audio Visualizer',
            'Token Counter',
          ],
        },
      ],
    },
    {
      label: 'Enterprise',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
      categories: [
        {
          path: 'enterprise',
          label: 'Enterprise',
          items: [
            'Kanban Board',
            'Scheduler',
            'Timeline Gantt',
            'Workflow Builder',
            'Rule Builder',
            'Spreadsheet',
            'Pivot Table',
            'Diagram Builder',
            'Flow Editor',
            'JSON Viewer',
            'Terminal',
            'Org Chart',
            'Query Builder',
          ],
        },
      ],
    },
    {
      label: 'Utilities',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
      categories: [
        {
          path: 'utilities',
          label: 'Utilities & Hooks',
          items: [
            'Visually Hidden',
            'Focus Trap',
            'Click Outside',
            'Keyboard Shortcut',
            'Scroll Lock',
            'Resize Observer',
            'Intersection Observer',
            'Lazy Load',
            'Layer Provider',
            'Media Query',
            'Media Theme',
          ],
        },
      ],
    },
  ];

  protected readonly filteredGroups = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return this.allGroups;
    return this.allGroups
      .map((g) => ({
        ...g,
        categories: g.categories.filter(
          (c) =>
            c.label.toLowerCase().includes(q) ||
            g.label.toLowerCase().includes(q) ||
            c.items.some((item) => item.toLowerCase().includes(q)),
        ),
      }))
      .filter((g) => g.categories.length > 0);
  });

  protected readonly GROUP_LABEL_KEY: Record<string, string> = {
    Content: 'showcase.group.content',
    Navigation: 'category.navigation',
    Layout: 'category.layout',
    Forms: 'category.forms',
    Feedback: 'category.feedback',
    'Data Display': 'category.data-display',
    Overlay: 'category.overlay',
    Charts: 'category.charts',
    AI: 'category.ai',
    Enterprise: 'category.enterprise',
    Utilities: 'showcase.group.utilities',
  };

  groupLabelKey(label: string): string {
    return this.GROUP_LABEL_KEY[label] ?? label;
  }
}
