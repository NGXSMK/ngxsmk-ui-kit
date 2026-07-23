import { Component, signal, computed, ElementRef, ViewChild, inject, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TranslatePipe } from '@ngx-translate/core';
import { AppNav } from '../nav/nav';

interface CategoryGroup {
  label: string;
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
        <div class="sc-sidebar__search">
          <svg
            class="sc-sidebar__search-icon"
            width="15"
            height="15"
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
        </div>

        <div class="sc-sidebar__nav">
          <a
            class="sc-sidebar__overview"
            routerLink="/showcase/explorer"
            routerLinkActive="sc-sidebar__overview--active"
            (click)="mobileOpen.set(false)"
          >
            {{ 'showcase.componentExplorer' | translate }}
          </a>

          @for (group of filteredGroups(); track group.label) {
            <div class="sc-sidebar__group">
              <div class="sc-sidebar__group-label">
                {{ groupLabelKey(group.label) | translate }}
              </div>
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
  styles: [
    `
      .sc-layout {
        display: grid;
        grid-template-columns: 1fr 4fr;
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

      .sc-sidebar__search {
        position: relative;
        padding: var(--ngxsmk-space-3, 0.75rem);
        border-bottom: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
      }

      .sc-sidebar__search-icon {
        position: absolute;
        left: calc(0.75rem + 0.5rem);
        top: 50%;
        transform: translateY(-50%);
        color: var(--ngxsmk-color-on-surface-variant, #71717a);
        pointer-events: none;
      }

      .sc-sidebar__search-input {
        width: 100%;
        padding: 0.4rem 0.5rem 0.4rem 2rem;
        border: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
        border-radius: var(--ngxsmk-radius-md, 0.375rem);
        background: var(--ngxsmk-color-background, #fafafa);
        color: var(--ngxsmk-color-on-surface, #09090b);
        font-size: var(--ngxsmk-text-body-sm-size);
        outline: none;
        transition: border-color 0.15s;
      }

      .sc-sidebar__search-input:focus {
        border-color: var(--ngxsmk-color-primary, #7c3aed);
        background: var(--ngxsmk-color-surface, #ffffff);
      }

      .sc-sidebar__search-input::placeholder {
        color: var(--ngxsmk-color-on-surface-variant, #71717a);
      }

      .sc-sidebar__nav {
        flex: 1;
        overflow-y: auto;
        overscroll-behavior: contain;
        -webkit-overflow-scrolling: touch;
        padding: var(--ngxsmk-space-2, 0.5rem) var(--ngxsmk-space-3, 0.75rem);
        display: flex;
        flex-direction: column;
        gap: var(--ngxsmk-space-3, 0.75rem);
      }

      .sc-sidebar__overview {
        display: block;
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
      }

      .sc-sidebar__group {
        display: flex;
        flex-direction: column;
        gap: 1px;
      }

      .sc-sidebar__group-label {
        padding: var(--ngxsmk-space-2, 0.5rem) var(--ngxsmk-space-2, 0.5rem);
        font-size: var(--ngxsmk-text-body-xs-size);
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--ngxsmk-color-on-surface-variant, #71717a);
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
      }

      .sc-backdrop {
        display: none;
      }

      @media (max-width: 768px) {
        .sc-sidebar {
          position: fixed;
          top: 3.5rem;
          bottom: 0;
          left: 0;
          width: min(220px, 82vw);
          min-width: min(220px, 82vw);
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
  ],
})
export class ShowcaseLayout {
  protected readonly searchQuery = signal('');
  protected readonly mobileOpen = signal(false);

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

  private readonly allGroups: CategoryGroup[] = [
    {
      label: 'Content',
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
          ],
        },
      ],
    },
    {
      label: 'Feedback',
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
          ],
        },
      ],
    },
    {
      label: 'AI',
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
          ],
        },
      ],
    },
    {
      label: 'Enterprise',
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
