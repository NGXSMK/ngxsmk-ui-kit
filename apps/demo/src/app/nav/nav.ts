import { Component, inject, signal, computed, HostListener } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NgxsmkThemeService } from '@ngxsmk/theme';
import { NgxsmkTooltip } from '@ngxsmk/core/tooltip';

interface SearchItem {
  name: string;
  category: string;
  path: string;
}

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgxsmkTooltip],
  template: `
    <nav class="ngxsmk-nav">
      <div class="ngxsmk-nav__inner">
        <a class="ngxsmk-nav__brand" routerLink="/">
          <span class="ngxsmk-nav__logo" aria-hidden="true">◈</span>
          <span class="ngxsmk-nav__wordmark">NGXSMK</span>
        </a>

        <button
          class="ngxsmk-nav__menu-btn"
          type="button"
          [attr.aria-expanded]="mobileOpen()"
          aria-label="Toggle navigation menu"
          (click)="mobileOpen.set(!mobileOpen())"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          >
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>

        <div class="ngxsmk-nav__links">
          <a class="ngxsmk-nav__link" routerLink="/docs" routerLinkActive="ngxsmk-nav__link--active"
            >Docs</a
          >
          <a
            class="ngxsmk-nav__link"
            routerLink="/showcase"
            routerLinkActive="ngxsmk-nav__link--active"
            >Components</a
          >
          <a
            class="ngxsmk-nav__link"
            routerLink="/templates"
            routerLinkActive="ngxsmk-nav__link--active"
            >Templates</a
          >
          <a
            class="ngxsmk-nav__link"
            routerLink="/themes"
            routerLinkActive="ngxsmk-nav__link--active"
            >Themes</a
          >
          <a
            class="ngxsmk-nav__link"
            routerLink="/playground"
            routerLinkActive="ngxsmk-nav__link--active"
            >Playground</a
          >
        </div>

        <div class="ngxsmk-nav__actions">
          <!-- Premium search bar pill in navbar -->
          <button
            class="ngxsmk-nav__search-btn"
            (click)="openSearch()"
            aria-label="Search all components"
          >
            <svg
              class="search-icon"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <span class="search-text">Search...</span>
            <span class="search-kbd"><kbd>⌘K</kbd></span>
          </button>

          <button
            class="ngxsmk-nav__icon-btn"
            [attr.aria-label]="theme.isDark() ? 'Switch to light mode' : 'Switch to dark mode'"
            [ngxsmkTooltip]="theme.isDark() ? 'Switch to light mode' : 'Switch to dark mode'"
            (click)="theme.toggle()"
          >
            @if (theme.isDark()) {
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="12" cy="12" r="5" />
                <path
                  d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
                />
              </svg>
            } @else {
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            }
          </button>

          <a
            class="ngxsmk-nav__icon-btn"
            href="https://github.com"
            target="_blank"
            aria-label="GitHub"
            ngxsmkTooltip="GitHub"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"
              />
            </svg>
          </a>

          <a class="ngxsmk-nav__cta" routerLink="/">Get started</a>
        </div>
      </div>
    </nav>

    @if (mobileOpen()) {
      <div class="ngxsmk-nav__mobile">
        <a class="ngxsmk-nav__mobile-link" routerLink="/docs" (click)="mobileOpen.set(false)"
          >Docs</a
        >
        <a class="ngxsmk-nav__mobile-link" routerLink="/showcase" (click)="mobileOpen.set(false)"
          >Components</a
        >
        <a class="ngxsmk-nav__mobile-link" routerLink="/templates" (click)="mobileOpen.set(false)"
          >Templates</a
        >
        <a class="ngxsmk-nav__mobile-link" routerLink="/themes" (click)="mobileOpen.set(false)"
          >Themes</a
        >
        <a class="ngxsmk-nav__mobile-link" routerLink="/playground" (click)="mobileOpen.set(false)"
          >Playground</a
        >
        <a
          class="ngxsmk-nav__cta ngxsmk-nav__mobile-cta"
          routerLink="/"
          (click)="mobileOpen.set(false)"
          >Get started</a
        >
      </div>
    }

    <!-- Global search dialog overlay (Command Palette) -->
    @if (isSearchOpen()) {
      <!-- eslint-disable-next-line @angular-eslint/template/click-events-have-key-events, @angular-eslint/template/interactive-supports-focus -->
      <div class="cmd-overlay" (click)="closeSearch()">
        <!-- eslint-disable-next-line @angular-eslint/template/click-events-have-key-events, @angular-eslint/template/interactive-supports-focus -->
        <div class="cmd-dialog" (click)="$event.stopPropagation()">
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
              placeholder="Search components (e.g. Button, Kanban, Chat)..."
              [value]="searchQuery()"
              (input)="onSearchInput(searchInput.value)"
              (keydown)="onSearchKeydown($event)"
            />
            <!-- eslint-disable-next-line @angular-eslint/template/click-events-have-key-events, @angular-eslint/template/interactive-supports-focus -->
            <span class="cmd-esc-hint" (click)="closeSearch()">ESC</span>
          </div>

          <div class="cmd-results">
            @for (item of filteredSearchItems(); track item.name; let idx = $index) {
              <!-- eslint-disable-next-line @angular-eslint/template/click-events-have-key-events, @angular-eslint/template/interactive-supports-focus -->
              <div
                class="cmd-item"
                [class.active]="idx === activeIndex()"
                (mouseenter)="activeIndex.set(idx)"
                (click)="selectItem(item)"
              >
                <div class="cmd-item-left">
                  <span class="cmd-item-icon">◈</span>
                  <span class="cmd-item-name">{{ item.name }}</span>
                </div>
                <span class="cmd-item-cat">{{ item.category }}</span>
              </div>
            }
            @if (filteredSearchItems().length === 0) {
              <div class="cmd-empty">No components match "{{ searchQuery() }}".</div>
            }
          </div>
        </div>
      </div>
    }
  `,
  styles: `
    .ngxsmk-nav {
      position: sticky;
      top: 0;
      z-index: var(--ngxsmk-z-sticky, 1100);
      border-bottom: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
      background: color-mix(in srgb, var(--ngxsmk-color-surface, #ffffff) 85%, transparent);
      backdrop-filter: saturate(1.4) blur(16px);
      transition: border-color 0.2s;
      font-family: 'DM Sans', var(--ngxsmk-font-sans, system-ui), sans-serif;
    }

    .ngxsmk-nav__inner {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 var(--ngxsmk-space-6, 1.5rem);
      height: 3.5rem;
      display: flex;
      align-items: center;
      gap: var(--ngxsmk-space-8, 2rem);
    }

    .ngxsmk-nav__brand {
      display: flex;
      align-items: center;
      gap: var(--ngxsmk-space-2, 0.5rem);
      text-decoration: none;
      color: var(--ngxsmk-color-on-surface, #09090b);
      font-weight: 700;
      font-size: 1rem;
      flex-shrink: 0;
      font-family: 'Outfit', var(--ngxsmk-font-sans, system-ui), sans-serif;
    }

    .ngxsmk-nav__logo {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1.5rem;
      height: 1.5rem;
      border-radius: var(--ngxsmk-radius-md, 0.375rem);
      background: var(--ngxsmk-color-primary, #7c3aed);
      color: #ffffff;
      font-size: 0.75rem;
    }

    .ngxsmk-nav__wordmark {
      letter-spacing: -0.02em;
      font-weight: 800;
    }

    .ngxsmk-nav__links {
      display: flex;
      align-items: center;
      gap: var(--ngxsmk-space-1, 0.25rem);
      margin-right: auto;
    }

    .ngxsmk-nav__link {
      padding: var(--ngxsmk-space-1-5, 0.375rem) var(--ngxsmk-space-3, 0.75rem);
      border-radius: var(--ngxsmk-radius-md, 0.375rem);
      font-size: 0.8125rem;
      font-weight: 500;
      text-decoration: none;
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
      transition:
        color 0.15s,
        background 0.15s;
    }

    .ngxsmk-nav__link:hover {
      color: var(--ngxsmk-color-on-surface, #09090b);
      background: color-mix(in srgb, var(--ngxsmk-color-on-surface, #09090b) 4%, transparent);
    }

    .ngxsmk-nav__link--active {
      color: var(--ngxsmk-color-on-surface, #09090b);
      background: color-mix(in srgb, var(--ngxsmk-color-on-surface, #09090b) 4%, transparent);
      font-weight: 600;
    }

    .ngxsmk-nav__actions {
      display: flex;
      align-items: center;
      gap: var(--ngxsmk-space-1-5, 0.375rem);
      flex-shrink: 0;
    }

    /* Premium Search Bar Pill in Navbar */
    .ngxsmk-nav__search-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      border: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
      background: var(--ngxsmk-color-surface-variant, #f4f4f5);
      border-radius: var(--ngxsmk-radius-md, 0.375rem);
      padding: 0.375rem 0.5rem 0.375rem 0.75rem;
      height: 2rem;
      cursor: pointer;
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
      transition:
        background-color 0.15s,
        border-color 0.15s;
      width: 140px;
      text-align: left;
    }
    .ngxsmk-nav__search-btn:hover {
      background: var(--ngxsmk-color-surface-hover, #e4e4e7);
      border-color: color-mix(
        in srgb,
        var(--ngxsmk-color-outline) 60%,
        var(--ngxsmk-color-primary)
      );
    }
    .search-icon {
      flex-shrink: 0;
    }
    .search-text {
      font-size: 0.75rem;
      font-weight: 500;
      flex: 1;
    }
    .search-kbd {
      font-size: 0.625rem;
      opacity: 0.7;
    }
    .search-kbd kbd {
      font-family: inherit;
    }

    .ngxsmk-nav__icon-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 2rem;
      height: 2rem;
      border: none;
      border-radius: var(--ngxsmk-radius-md, 0.375rem);
      background: transparent;
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
      cursor: pointer;
      transition:
        color 0.15s,
        background 0.15s;
      text-decoration: none;
    }

    .ngxsmk-nav__icon-btn:hover {
      color: var(--ngxsmk-color-on-surface, #09090b);
      background: color-mix(in srgb, var(--ngxsmk-color-on-surface, #09090b) 4%, transparent);
    }

    .ngxsmk-nav__cta {
      display: inline-flex;
      align-items: center;
      padding: var(--ngxsmk-space-2, 0.5rem) var(--ngxsmk-space-4, 1rem);
      margin-left: var(--ngxsmk-space-2, 0.5rem);
      border-radius: var(--ngxsmk-radius-md, 0.375rem);
      background: var(--ngxsmk-color-primary, #7c3aed);
      color: #ffffff;
      font-size: 0.8125rem;
      font-weight: 600;
      text-decoration: none;
      transition: opacity 0.15s;
    }

    .ngxsmk-nav__cta:hover {
      opacity: 0.9;
    }

    /* Command Palette Overlay */
    .cmd-overlay {
      position: fixed;
      inset: 0;
      z-index: 10000;
      background: rgba(9, 9, 11, 0.4);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding-top: 10vh;
      animation: cmd-fade-in 0.15s ease-out;
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
      max-width: 600px;
      background: var(--ngxsmk-color-surface, #ffffff);
      border: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
      border-radius: var(--ngxsmk-radius-xl, 0.75rem);
      box-shadow: var(--ngxsmk-shadow-xl, 0 20px 25px -5px rgba(0, 0, 0, 0.1));
      overflow: hidden;
      display: flex;
      flex-direction: column;
      max-height: 400px;
      animation: cmd-scale-up 0.15s cubic-bezier(0.16, 1, 0.3, 1);
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
      padding: 0 var(--ngxsmk-space-4, 1rem);
      height: 3.5rem;
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
      background: transparent;
      outline: none;
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
      padding: var(--ngxsmk-space-2, 0.5rem);
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
      transition:
        background-color 0.1s,
        color 0.1s;
      font-size: 0.875rem;
      color: var(--ngxsmk-color-on-surface, #09090b);
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

    .cmd-empty {
      padding: var(--ngxsmk-space-8) 0;
      text-align: center;
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
      font-size: 0.875rem;
    }

    .ngxsmk-nav__menu-btn {
      display: none;
      align-items: center;
      justify-content: center;
      width: 2rem;
      height: 2rem;
      border: none;
      border-radius: var(--ngxsmk-radius-md, 0.375rem);
      background: transparent;
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
      cursor: pointer;
    }
    .ngxsmk-nav__menu-btn:hover {
      color: var(--ngxsmk-color-on-surface, #09090b);
      background: color-mix(in srgb, var(--ngxsmk-color-on-surface, #09090b) 4%, transparent);
    }

    .ngxsmk-nav__mobile {
      position: absolute;
      top: 3.5rem;
      left: 0;
      right: 0;
      display: flex;
      flex-direction: column;
      gap: 0.125rem;
      padding: var(--ngxsmk-space-2, 0.5rem);
      background: var(--ngxsmk-color-surface, #ffffff);
      border-bottom: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
      box-shadow: var(--ngxsmk-shadow-lg, 0 20px 25px -5px rgba(0, 0, 0, 0.1));
      z-index: var(--ngxsmk-z-sticky, 1100);
    }
    .ngxsmk-nav__mobile-link {
      padding: var(--ngxsmk-space-2, 0.5rem) var(--ngxsmk-space-3, 0.75rem);
      border-radius: var(--ngxsmk-radius-md, 0.375rem);
      font-size: 0.875rem;
      font-weight: 500;
      text-decoration: none;
      color: var(--ngxsmk-color-on-surface, #09090b);
    }
    .ngxsmk-nav__mobile-link:hover {
      background: color-mix(in srgb, var(--ngxsmk-color-on-surface, #09090b) 4%, transparent);
    }
    .ngxsmk-nav__mobile-cta {
      margin: var(--ngxsmk-space-2, 0.5rem) 0 0;
      justify-content: center;
    }

    @media (max-width: 768px) {
      .ngxsmk-nav__links {
        display: none;
      }
      .ngxsmk-nav__menu-btn {
        display: inline-flex;
      }
      .ngxsmk-nav__cta {
        display: none;
      }
    }

    @media (max-width: 640px) {
      .ngxsmk-nav__search-btn {
        width: auto;
        padding: 0;
        justify-content: center;
        width: 2rem;
        border: none;
        background: transparent;
      }
      .ngxsmk-nav__search-btn:hover {
        background: color-mix(in srgb, var(--ngxsmk-color-on-surface, #09090b) 4%, transparent);
      }
      .search-text,
      .search-kbd {
        display: none;
      }
    }
  `,
})
export class AppNav {
  protected readonly theme = inject(NgxsmkThemeService);
  private readonly router = inject(Router);

  protected readonly isSearchOpen = signal(false);
  protected readonly searchQuery = signal('');
  protected readonly activeIndex = signal(0);
  protected readonly mobileOpen = signal(false);

  protected readonly categories = [
    {
      title: 'Forms',
      path: 'forms',
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
    {
      title: 'AI',
      path: 'ai',
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
    {
      title: 'Enterprise',
      path: 'enterprise',
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
    {
      title: 'Content & Typography',
      path: 'content-typography',
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
    {
      title: 'Navigation',
      path: 'navigation',
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
    {
      title: 'Layout',
      path: 'layout',
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
    {
      title: 'Feedback',
      path: 'feedback',
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
    {
      title: 'Data Display',
      path: 'data-display',
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
    {
      title: 'Overlay',
      path: 'overlay',
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
    {
      title: 'Charts',
      path: 'charts',
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
    {
      title: 'Utilities & Hooks',
      path: 'utilities',
      items: [
        'Visually Hidden',
        'Focus Trap',
        'Click Outside',
        'Keyboard Shortcut',
        'Copy to Clipboard',
        'Scroll Lock',
        'Resize Observer',
        'Intersection Observer',
        'Lazy Load',
        'Layer Provider',
        'Media Query',
        'Media Theme',
      ],
    },
  ];

  protected readonly flatItems = computed(() => {
    const items: SearchItem[] = [];
    for (const cat of this.categories) {
      for (const item of cat.items) {
        items.push({
          name: item,
          category: cat.title,
          path: cat.path,
        });
      }
    }
    return items;
  });

  protected readonly filteredSearchItems = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const items = this.flatItems();
    if (!q) return items.slice(0, 10); // Show first 10 by default
    return items.filter(
      (item) => item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q),
    );
  });

  @HostListener('window:keydown', ['$event'])
  protected handleGlobalShortcut(event: KeyboardEvent): void {
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      event.preventDefault();
      if (this.isSearchOpen()) {
        this.closeSearch();
      } else {
        this.openSearch();
      }
    }
  }

  protected openSearch(): void {
    this.searchQuery.set('');
    this.activeIndex.set(0);
    this.isSearchOpen.set(true);
    setTimeout(() => {
      const inputEl = document.querySelector('.cmd-input') as HTMLInputElement;
      inputEl?.focus();
    }, 50);
  }

  protected closeSearch(): void {
    this.isSearchOpen.set(false);
  }

  protected onSearchInput(val: string): void {
    this.searchQuery.set(val);
    this.activeIndex.set(0);
  }

  protected onSearchKeydown(event: KeyboardEvent): void {
    const items = this.filteredSearchItems();
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
      this.selectItem(items[this.activeIndex()]);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this.closeSearch();
    }
  }

  private scrollActiveIntoView(): void {
    setTimeout(() => {
      const activeEl = document.querySelector('.cmd-item.active');
      activeEl?.scrollIntoView({ block: 'nearest' });
    });
  }

  protected selectItem(item: SearchItem): void {
    this.closeSearch();
    const fragment = item.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-');
    this.router.navigate(['/showcase', item.path], { fragment });
  }
}
