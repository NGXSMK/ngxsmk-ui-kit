import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AppNav } from '../nav/nav';

interface CategoryGroup {
  label: string;
  categories: { path: string; label: string }[];
}

@Component({
  selector: 'showcase-layout',
  standalone: true,
  imports: [FormsModule, RouterOutlet, RouterLink, RouterLinkActive, AppNav],
  template: `
    <app-nav />
    <div class="ngxsmk-sc-layout">
      <aside class="ngxsmk-sc-sidebar" [class.ngxsmk-sc-sidebar--open]="mobileOpen()">
        <div class="ngxsmk-sc-sidebar__search">
          <svg class="ngxsmk-sc-sidebar__search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            class="ngxsmk-sc-sidebar__search-input"
            type="search"
            placeholder="Search components"
            [ngModel]="searchQuery()"
            (ngModelChange)="searchQuery.set($event)"
          />
        </div>

        <div class="ngxsmk-sc-sidebar__sections">
          <a class="ngxsmk-sc-sidebar__overview" routerLink="/showcase" routerLinkActive="ngxsmk-sc-sidebar__overview--active" (click)="mobileOpen.set(false)">Components</a>

          @for (group of filteredGroups(); track group.label) {
            <div class="ngxsmk-sc-sidebar__group">
              <div class="ngxsmk-sc-sidebar__group-label">{{ group.label }}</div>
              @for (cat of group.categories; track cat.path) {
                <a
                  class="ngxsmk-sc-sidebar__link"
                  routerLink="/showcase/{{cat.path}}"
                  routerLinkActive="ngxsmk-sc-sidebar__link--active"
                  (click)="mobileOpen.set(false)"
                >{{ cat.label }}</a>
              }
            </div>
          }
        </div>
      </aside>
      @if (mobileOpen()) {
        <div class="ngxsmk-sc-backdrop" (click)="mobileOpen.set(false)"></div>
      }
      <main class="ngxsmk-sc-content">
        <button class="ngxsmk-sc-menu-btn" type="button" (click)="mobileOpen.set(true)" aria-label="Open component categories">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
          Categories
        </button>
        <router-outlet />
      </main>
    </div>
  `,
  styles: [
    `
    .ngxsmk-sc-layout {
      display: flex;
      height: calc(100dvh - 3.5rem);
      font-family: 'DM Sans', var(--ngxsmk-font-sans, system-ui), sans-serif;
      color: var(--ngxsmk-color-on-surface, #09090b);
      background: var(--ngxsmk-color-background, #fafafa);
    }

    .ngxsmk-sc-sidebar {
      width: 240px;
      min-width: 240px;
      border-right: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
      display: flex;
      flex-direction: column;
      background: var(--ngxsmk-color-surface, #ffffff);
      overflow: hidden;
    }

    .ngxsmk-sc-sidebar__search {
      position: relative;
      padding: var(--ngxsmk-space-3, 0.75rem);
      border-bottom: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
    }

    .ngxsmk-sc-sidebar__search-icon {
      position: absolute;
      left: calc(0.75rem + 0.625rem);
      top: 50%;
      transform: translateY(-50%);
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
      pointer-events: none;
    }

    .ngxsmk-sc-sidebar__search-input {
      width: 100%;
      padding: var(--ngxsmk-space-2, 0.5rem) var(--ngxsmk-space-2, 0.5rem) var(--ngxsmk-space-2, 0.5rem) 2.25rem;
      border: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
      border-radius: var(--ngxsmk-radius-md, 0.375rem);
      background: var(--ngxsmk-color-background, #fafafa);
      color: var(--ngxsmk-color-on-surface, #09090b);
      font-size: 0.8125rem;
      outline: none;
      transition: border-color 0.15s;
    }

    .ngxsmk-sc-sidebar__search-input:focus {
      border-color: var(--ngxsmk-color-primary, #7c3aed);
      background: var(--ngxsmk-color-surface, #ffffff);
    }

    .ngxsmk-sc-sidebar__search-input::placeholder {
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
    }

    .ngxsmk-sc-sidebar__sections {
      flex: 1;
      overflow-y: auto;
      padding: var(--ngxsmk-space-3, 0.75rem);
      display: flex;
      flex-direction: column;
      gap: var(--ngxsmk-space-4, 1rem);
    }

    .ngxsmk-sc-sidebar__overview {
      display: block;
      padding: var(--ngxsmk-space-2, 0.5rem) var(--ngxsmk-space-3, 0.75rem);
      border-radius: var(--ngxsmk-radius-md, 0.375rem);
      font-size: 0.8125rem;
      font-weight: 600;
      text-decoration: none;
      color: var(--ngxsmk-color-on-surface, #09090b);
      transition: background 0.15s;
    }

    .ngxsmk-sc-sidebar__overview:hover {
      background: color-mix(in srgb, var(--ngxsmk-color-on-surface, #09090b) 4%, transparent);
    }

    .ngxsmk-sc-sidebar__overview--active {
      color: var(--ngxsmk-color-primary, #7c3aed);
    }

    .ngxsmk-sc-sidebar__group {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .ngxsmk-sc-sidebar__group-label {
      padding: var(--ngxsmk-space-2, 0.5rem) var(--ngxsmk-space-3, 0.75rem);
      font-size: 0.625rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
      font-family: 'Outfit', var(--ngxsmk-font-sans, system-ui), sans-serif;
    }

    .ngxsmk-sc-sidebar__link {
      display: block;
      padding: var(--ngxsmk-space-1-5, 0.375rem) var(--ngxsmk-space-3, 0.75rem);
      border-radius: var(--ngxsmk-radius-md, 0.375rem);
      font-size: 0.8125rem;
      text-decoration: none;
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
      transition: color 0.15s, background 0.15s;
    }

    .ngxsmk-sc-sidebar__link:hover {
      color: var(--ngxsmk-color-on-surface, #09090b);
      background: color-mix(in srgb, var(--ngxsmk-color-on-surface, #09090b) 4%, transparent);
    }

    .ngxsmk-sc-sidebar__link--active {
      background: var(--ngxsmk-color-primary-container, #ede9fe);
      color: var(--ngxsmk-color-on-primary-container, #4c1d95);
      font-weight: 600;
    }

    .ngxsmk-sc-content {
      flex: 1;
      overflow-y: auto;
      padding: var(--ngxsmk-space-8, 2rem);
      background: var(--ngxsmk-color-background, #fafafa);
    }

    .ngxsmk-sc-menu-btn {
      display: none;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: var(--ngxsmk-space-4, 1rem);
      padding: var(--ngxsmk-space-2, 0.5rem) var(--ngxsmk-space-3, 0.75rem);
      border: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
      border-radius: var(--ngxsmk-radius-md, 0.375rem);
      background: var(--ngxsmk-color-surface, #ffffff);
      color: var(--ngxsmk-color-on-surface, #09090b);
      font-size: 0.8125rem;
      font-weight: 600;
      cursor: pointer;
    }

    .ngxsmk-sc-backdrop {
      display: none;
    }

    @media (max-width: 768px) {
      .ngxsmk-sc-sidebar {
        position: fixed;
        top: 3.5rem;
        bottom: 0;
        left: 0;
        width: min(240px, 82vw);
        min-width: min(240px, 82vw);
        z-index: var(--ngxsmk-z-overlay, 1200);
        transform: translateX(-100%);
        transition: transform 0.2s ease;
        box-shadow: var(--ngxsmk-shadow-xl, 0 20px 25px -5px rgba(0, 0, 0, 0.1));
      }
      .ngxsmk-sc-sidebar--open {
        transform: translateX(0);
      }
      .ngxsmk-sc-backdrop {
        display: block;
        position: fixed;
        inset: 3.5rem 0 0 0;
        z-index: var(--ngxsmk-z-overlay, 1200);
        background: rgba(9, 9, 11, 0.4);
      }
      .ngxsmk-sc-menu-btn {
        display: inline-flex;
      }
      .ngxsmk-sc-content {
        padding: var(--ngxsmk-space-4, 1rem);
      }
    }
    `,
  ],
})
export class ShowcaseLayout {
  protected readonly searchQuery = signal('');
  protected readonly mobileOpen = signal(false);

  private readonly allGroups: CategoryGroup[] = [
    {
      label: 'Content',
      categories: [
        { path: 'content-typography', label: 'Content & Typography' },
      ],
    },
    {
      label: 'Navigation',
      categories: [
        { path: 'navigation', label: 'Navigation' },
      ],
    },
    {
      label: 'Layout',
      categories: [
        { path: 'layout', label: 'Layout' },
      ],
    },
    {
      label: 'Forms',
      categories: [
        { path: 'forms', label: 'Forms' },
      ],
    },
    {
      label: 'Feedback',
      categories: [
        { path: 'feedback', label: 'Feedback' },
      ],
    },
    {
      label: 'Data Display',
      categories: [
        { path: 'data-display', label: 'Data Display' },
      ],
    },
    {
      label: 'Overlay',
      categories: [
        { path: 'overlay', label: 'Overlay' },
      ],
    },
    {
      label: 'Charts',
      categories: [
        { path: 'charts', label: 'Charts' },
      ],
    },
    {
      label: 'AI',
      categories: [
        { path: 'ai', label: 'AI' },
      ],
    },
    {
      label: 'Enterprise',
      categories: [
        { path: 'enterprise', label: 'Enterprise' },
      ],
    },
    {
      label: 'Utilities',
      categories: [
        { path: 'utilities', label: 'Utilities & Hooks' },
      ],
    },
  ];

  protected readonly filteredGroups = () => {
    const q = this.searchQuery().toLowerCase();
    if (!q) return this.allGroups;
    return this.allGroups
      .map(g => ({
        ...g,
        categories: g.categories.filter(c =>
          c.label.toLowerCase().includes(q) || g.label.toLowerCase().includes(q)
        ),
      }))
      .filter(g => g.categories.length > 0);
  };
}
