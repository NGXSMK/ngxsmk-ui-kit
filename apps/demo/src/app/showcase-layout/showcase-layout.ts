import {
  Component,
  signal,
  computed,
  ElementRef,
  ViewChild,
  inject,
  effect,
  HostListener,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TranslatePipe } from '@ngx-translate/core';
import { AppNav } from '../nav/nav';
import { APP_VERSION } from '../core/version';

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
        <!-- Mobile Drawer Close Button -->
        <button
          class="sc-sidebar__close-btn"
          type="button"
          (click)="mobileOpen.set(false)"
          aria-label="Close sidebar"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <!-- Sidebar Header with Traffic Lights & Live Status -->
        <div class="sc-sidebar__header">
          <div class="sc-header-row">
            <div class="traffic-lights" aria-hidden="true">
              <span class="light red"></span>
              <span class="light yellow"></span>
              <span class="light green"></span>
            </div>
            <div class="sc-sidebar__status-badge">
              <span class="pulse-dot"></span>
              <span class="sc-status-label">{{ totalComponentsCount() }} ATOMS</span>
            </div>
          </div>
          <div class="sc-brand-row">
            <div class="sc-brand-info">
              <span class="sc-logo-icon">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                >
                  <polygon points="12 2 2 7 12 12 22 7 12 2" />
                  <polyline points="2 17 12 22 22 17" />
                  <polyline points="2 12 12 17 22 12" />
                </svg>
              </span>
              <div class="sc-brand-text">
                <span class="sc-sidebar__brand-name"
                  >NGXSMK <span class="highlight">Design</span></span
                >
                <span class="sc-sidebar__brand-sub">Signals & Zoneless Kit</span>
              </div>
            </div>
            <span class="sc-version-pill">v{{ version }}</span>
          </div>
        </div>

        <!-- Search Bar with Pill Style, Clear Button & ⌘K Shortcut -->
        <div class="sc-sidebar__search-section">
          <div
            class="sc-sidebar__search-box"
            [class.sc-sidebar__search-box--focused]="isSearchFocused()"
          >
            <svg
              class="sc-sidebar__search-icon"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              #searchInput
              class="sc-sidebar__search-input"
              type="search"
              [attr.placeholder]="'showcase.searchPlaceholder' | translate"
              [ngModel]="searchQuery()"
              (ngModelChange)="searchQuery.set($event)"
              (focus)="isSearchFocused.set(true)"
              (blur)="isSearchFocused.set(false)"
              (keydown.escape)="clearSearch()"
            />
            @if (searchQuery().trim()) {
              <button
                class="sc-sidebar__search-clear"
                type="button"
                (click)="clearSearch()"
                title="Clear search"
                aria-label="Clear search query"
              >
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            } @else {
              <kbd class="sc-sidebar__search-kbd">/</kbd>
            }
          </div>

          @if (searchQuery().trim()) {
            <div class="sc-search-feedback">
              <span class="sc-search-count">
                {{ totalMatches() }} {{ totalMatches() === 1 ? 'match' : 'matches' }}
              </span>
              <button class="sc-search-reset-btn" type="button" (click)="clearSearch()">
                Clear filter
              </button>
            </div>
          }
        </div>

        <!-- Quick Jump Workflow Cards -->
        <div class="sc-quick-links">
          <a
            class="sc-quick-link"
            routerLink="/showcase/explorer"
            routerLinkActive="sc-quick-link--active"
            (click)="mobileOpen.set(false)"
          >
            <span class="sc-quick-icon">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" />
              </svg>
            </span>
            <span class="sc-quick-title">{{ 'showcase.componentExplorer' | translate }}</span>
            <span class="sc-quick-badge">{{ totalComponentsCount() }}+</span>
          </a>

          <a
            class="sc-quick-link"
            routerLink="/playground/component"
            routerLinkActive="sc-quick-link--active"
            (click)="mobileOpen.set(false)"
          >
            <span class="sc-quick-icon sc-quick-icon--workbench">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <line x1="4" y1="21" x2="4" y2="14" />
                <line x1="4" y1="10" x2="4" y2="3" />
                <line x1="12" y1="21" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12" y2="3" />
                <line x1="20" y1="21" x2="20" y2="16" />
                <line x1="20" y1="12" x2="20" y2="3" />
                <line x1="1" y1="14" x2="7" y2="14" />
                <line x1="9" y1="8" x2="15" y2="8" />
                <line x1="17" y1="16" x2="23" y2="16" />
              </svg>
            </span>
            <span class="sc-quick-title">Interactive Workbench</span>
            <span class="sc-quick-badge sc-quick-badge--live">
              <span class="live-pulse"></span>
              Live
            </span>
          </a>
        </div>

        <!-- Section Header with Expand/Collapse All toggle -->
        <div class="sc-section-divider">
          <span class="sc-section-title">CATEGORIES & COMPONENTS</span>
          <button
            class="sc-collapse-all-btn"
            type="button"
            (click)="toggleAllGroups()"
            [title]="
              expandedGroups().size > 0 ? 'Collapse all categories' : 'Expand all categories'
            "
          >
            {{ expandedGroups().size > 0 ? 'Collapse' : 'Expand' }}
          </button>
        </div>

        <!-- Scrollable Navigation Tree -->
        <div class="sc-sidebar__nav" #navContainer>
          @if (filteredGroups().length === 0) {
            <div class="sc-empty-state">
              <div class="sc-empty-icon">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
              </div>
              <p class="sc-empty-title">No components found</p>
              <p class="sc-empty-hint">Try searching for button, chart, input, or table</p>
              <button class="sc-empty-action" type="button" (click)="clearSearch()">
                Reset filter
              </button>
            </div>
          }

          @for (group of filteredGroups(); track group.label) {
            <div
              class="sc-sidebar__group"
              [class.sc-sidebar__group--expanded]="isGroupExpanded(group.label)"
            >
              <div
                class="sc-sidebar__group-header-wrap"
                [class.sc-sidebar__group-header-wrap--active]="isGroupRouteActive(group)"
              >
                <button
                  class="sc-sidebar__group-header"
                  type="button"
                  (click)="toggleGroup(group.label)"
                  [attr.aria-expanded]="isGroupExpanded(group.label)"
                >
                  <span class="sc-sidebar__group-icon" [innerHTML]="group.icon"></span>
                  <span class="sc-sidebar__group-name">{{
                    groupLabelKey(group.label) | translate
                  }}</span>
                  <span class="sc-sidebar__group-count">{{ groupItemCount(group) }}</span>
                  <svg
                    class="sc-sidebar__group-chevron"
                    [class.sc-sidebar__group-chevron--open]="isGroupExpanded(group.label)"
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
              </div>

              @if (isGroupExpanded(group.label)) {
                <div class="sc-sidebar__group-items">
                  @for (cat of group.categories; track cat.path) {
                    <!-- Category Overview Link -->
                    <a
                      class="sc-sidebar__overview-link"
                      [routerLink]="['/showcase', cat.path]"
                      [class.sc-sidebar__overview-link--active]="isCategoryActive(cat.path)"
                      (click)="navigateToCategory(cat.path)"
                    >
                      <span class="sc-overview-dot"></span>
                      <span class="sc-overview-text">Overview & Playground</span>
                    </a>

                    <!-- Component Item Links -->
                    @for (item of cat.items; track item) {
                      <a
                        class="sc-sidebar__item-link"
                        [routerLink]="['/showcase', cat.path]"
                        [fragment]="toSlug(item)"
                        [class.sc-sidebar__item-link--active]="isItemActive(cat.path, item)"
                        (click)="scrollToComponent(cat.path, item, $event)"
                      >
                        <span class="sc-item-indicator"></span>
                        <span class="sc-item-title">{{ item }}</span>
                      </a>
                    }
                  }
                </div>
              }
            </div>
          }
        </div>

        <!-- Sidebar Footer Dock -->
        <div class="sc-sidebar__footer">
          <div class="sc-dock-grid">
            <a
              class="sc-dock-item"
              routerLink="/docs"
              (click)="mobileOpen.set(false)"
              title="Documentation"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              <span>Docs</span>
            </a>
            <a
              class="sc-dock-item"
              routerLink="/themes"
              (click)="mobileOpen.set(false)"
              title="Theme Generator"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="4" />
                <line x1="4.93" y1="4.93" x2="9.17" y2="9.17" />
                <line x1="14.83" y1="14.83" x2="19.07" y2="19.07" />
                <line x1="14.83" y1="9.17" x2="19.07" y2="4.93" />
                <line x1="4.93" y1="19.07" x2="9.17" y2="14.83" />
              </svg>
              <span>Themes</span>
            </a>
            <a
              class="sc-dock-item"
              routerLink="/templates"
              (click)="mobileOpen.set(false)"
              title="Full Page Templates"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18" />
                <path d="M9 21V9" />
              </svg>
              <span>Templates</span>
            </a>
            <a
              class="sc-dock-item"
              href="https://github.com/NGXSMK/ngxsmk-ui-kit"
              target="_blank"
              rel="noopener"
              title="GitHub Repository"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
                />
              </svg>
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </aside>

      @if (mobileOpen()) {
        <!-- eslint-disable-next-line @angular-eslint/template/click-events-have-key-events, @angular-eslint/template/interactive-supports-focus -->
        <div class="sc-backdrop" (click)="mobileOpen.set(false)"></div>
      }

      <main id="main-content" #contentEl class="sc-content" tabindex="-1">
        <button
          class="sc-menu-btn"
          type="button"
          (click)="mobileOpen.set(true)"
          [attr.aria-label]="'showcase.openCategories' | translate"
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          >
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
          <span>{{ 'showcase.categories' | translate }}</span>
          <span class="sc-menu-btn-count">{{ totalComponentsCount() }}</span>
        </button>
        <router-outlet />
      </main>
    </div>
  `,
  styles: `
    .sc-layout {
      display: grid;
      grid-template-columns: 290px 1fr;
      height: calc(100dvh - 3.75rem);
      font-family: var(--font-family-body, var(--ngxsmk-font-sans, system-ui, sans-serif));
      color: var(--color-text-main, #0f172a);
      background: var(--color-bg-page, #f8fafc);
      position: relative;
    }

    .sc-sidebar {
      border-right: 1px solid var(--color-border, #e2e8f0);
      display: flex;
      flex-direction: column;
      background: var(--color-bg-sidebar, #ffffff);
      overflow: hidden;
      backdrop-filter: blur(16px);
      position: relative;
      user-select: none;
    }

    .sc-sidebar__close-btn {
      display: none;
      position: absolute;
      top: 0.85rem;
      right: 0.85rem;
      width: 28px;
      height: 28px;
      align-items: center;
      justify-content: center;
      background: var(--color-bg-elevated, #f1f5f9);
      border: 1px solid var(--color-border, #e2e8f0);
      border-radius: var(--radius-sm, 8px);
      color: var(--color-text-muted, #64748b);
      cursor: pointer;
      z-index: 10;
      transition: all 0.15s ease;

      &:hover {
        color: var(--color-text-main, #0f172a);
        background: color-mix(in srgb, var(--brand-primary, #6366f1) 12%, transparent);
        border-color: var(--brand-primary, #6366f1);
      }
    }

    /* Header with Traffic Lights & Status Badge */
    .sc-sidebar__header {
      padding: 0.85rem 1rem 0.75rem;
      border-bottom: 1px solid var(--color-border, #e2e8f0);
      display: flex;
      flex-direction: column;
      gap: 0.65rem;
      background: linear-gradient(180deg, var(--color-bg-elevated, #f8fafc) 0%, transparent 100%);
    }

    .sc-header-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .traffic-lights {
      display: flex;
      align-items: center;
      gap: 6px;

      .light {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        display: inline-block;
        transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);

        &.red {
          background: #ef4444;
          box-shadow: 0 0 6px rgba(239, 68, 68, 0.35);
        }
        &.yellow {
          background: #f59e0b;
          box-shadow: 0 0 6px rgba(245, 158, 11, 0.35);
        }
        &.green {
          background: #10b981;
          box-shadow: 0 0 6px rgba(16, 185, 129, 0.35);
        }
      }

      &:hover .light {
        transform: scale(1.15);
      }
    }

    .sc-sidebar__status-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.14rem 0.5rem;
      border-radius: var(--radius-pill, 9999px);
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.25);
      font-family: var(--font-family-mono, monospace);
      font-size: 0.64rem;
      font-weight: 750;
      color: #10b981;
      letter-spacing: 0.04em;
      line-height: 1.2;

      .pulse-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #10b981;
        box-shadow: 0 0 8px #10b981;
        animation: pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      }
    }

    @keyframes pulse-glow {
      0%,
      100% {
        opacity: 1;
        transform: scale(1);
      }
      50% {
        opacity: 0.5;
        transform: scale(0.85);
      }
    }

    .sc-brand-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
    }

    .sc-brand-info {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      min-width: 0;
    }

    .sc-logo-icon {
      width: 28px;
      height: 28px;
      border-radius: 8px;
      background: linear-gradient(135deg, var(--brand-primary, #6366f1) 0%, #a855f7 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      box-shadow: 0 2px 8px rgba(99, 102, 241, 0.35);
      flex-shrink: 0;
    }

    .sc-brand-text {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .sc-sidebar__brand-name {
      font-family: var(--font-family-display, sans-serif);
      font-size: 0.9rem;
      font-weight: 750;
      letter-spacing: -0.025em;
      color: var(--color-text-main, #0f172a);
      line-height: 1.2;

      .highlight {
        background: linear-gradient(135deg, var(--brand-primary, #6366f1) 0%, #a855f7 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }

    .sc-sidebar__brand-sub {
      font-size: 0.68rem;
      font-weight: 500;
      color: var(--color-text-dim, #94a3b8);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .sc-version-pill {
      font-family: var(--font-family-mono, monospace);
      font-size: 0.68rem;
      font-weight: 700;
      color: var(--brand-primary, #6366f1);
      background: rgba(99, 102, 241, 0.08);
      border: 1px solid rgba(99, 102, 241, 0.22);
      padding: 0.12rem 0.45rem;
      border-radius: var(--radius-sm, 6px);
      line-height: 1.3;
      flex-shrink: 0;
    }

    /* Search Section */
    .sc-sidebar__search-section {
      padding: 0.7rem 0.85rem 0.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }

    .sc-sidebar__search-box {
      position: relative;
      display: flex;
      align-items: center;
      width: 100%;
      border-radius: var(--radius-pill, 9999px);
      background: var(--color-bg-elevated, #f1f5f9);
      border: 1px solid var(--color-border, #e2e8f0);
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .sc-sidebar__search-box--focused {
      border-color: var(--brand-primary, #6366f1);
      background: var(--color-bg-card, #ffffff);
      box-shadow:
        0 0 0 3px rgba(99, 102, 241, 0.2),
        0 4px 12px rgba(99, 102, 241, 0.1);
    }

    .sc-sidebar__search-icon {
      position: absolute;
      left: 0.8rem;
      color: var(--brand-primary, #6366f1);
      pointer-events: none;
      flex-shrink: 0;
    }

    .sc-sidebar__search-input {
      width: 100%;
      padding: 0.42rem 2.4rem 0.42rem 2.3rem;
      border: none;
      background: transparent;
      color: var(--color-text-main, #0f172a);
      font-size: 0.81rem;
      font-family: inherit;
      outline: none;

      &::placeholder {
        color: var(--color-text-dim, #94a3b8);
      }
    }

    .sc-sidebar__search-clear {
      position: absolute;
      right: 0.55rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: var(--color-bg-card, #ffffff);
      border: 1px solid var(--color-border, #e2e8f0);
      color: var(--color-text-dim, #94a3b8);
      cursor: pointer;
      transition: all 0.15s ease;

      &:hover {
        color: #ef4444;
        border-color: #ef4444;
        background: rgba(239, 68, 68, 0.1);
      }
    }

    .sc-sidebar__search-kbd {
      position: absolute;
      right: 0.65rem;
      font-family: var(--font-family-mono, monospace);
      font-size: 0.65rem;
      font-weight: 600;
      color: var(--color-text-dim, #94a3b8);
      background: var(--color-bg-card, #ffffff);
      border: 1px solid var(--color-border, #e2e8f0);
      border-radius: 4px;
      padding: 0.08rem 0.35rem;
      line-height: 1.2;
      pointer-events: none;
    }

    .sc-search-feedback {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 0.4rem;
      font-size: 0.72rem;
    }

    .sc-search-count {
      font-weight: 650;
      color: var(--brand-primary, #6366f1);
    }

    .sc-search-reset-btn {
      background: none;
      border: none;
      color: var(--color-text-dim, #94a3b8);
      font-size: 0.72rem;
      cursor: pointer;
      text-decoration: underline;
      padding: 0;

      &:hover {
        color: var(--color-text-main, #0f172a);
      }
    }

    /* Quick Links */
    .sc-quick-links {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
      padding: 0.3rem 0.85rem 0.5rem;
    }

    .sc-quick-link {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.45rem 0.65rem;
      border-radius: var(--radius-sm, 8px);
      background: var(--color-bg-elevated, #f8fafc);
      border: 1px solid var(--color-border, #e2e8f0);
      text-decoration: none;
      color: var(--color-text-main, #0f172a);
      font-size: 0.8rem;
      font-weight: 600;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);

      &:hover {
        background: color-mix(in srgb, var(--brand-primary, #6366f1) 8%, transparent);
        border-color: rgba(99, 102, 241, 0.3);
        transform: translateY(-1px);
        box-shadow: 0 3px 8px rgba(0, 0, 0, 0.04);
      }

      &--active {
        background: color-mix(in srgb, var(--brand-primary, #6366f1) 12%, transparent);
        border-color: var(--brand-primary, #6366f1);
        color: var(--brand-primary, #6366f1);
        box-shadow: inset 2.5px 0 0 var(--brand-primary, #6366f1);
      }
    }

    .sc-quick-icon {
      width: 24px;
      height: 24px;
      border-radius: 6px;
      background: rgba(99, 102, 241, 0.1);
      color: var(--brand-primary, #6366f1);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      &--workbench {
        background: rgba(245, 158, 11, 0.12);
        color: #f59e0b;
      }
    }

    .sc-quick-title {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .sc-quick-badge {
      font-size: 0.65rem;
      font-weight: 700;
      color: var(--color-text-dim, #94a3b8);
      background: var(--color-bg-card, #ffffff);
      border: 1px solid var(--color-border, #e2e8f0);
      padding: 0.08rem 0.4rem;
      border-radius: var(--radius-pill, 9999px);
      line-height: 1.3;

      &--live {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
        background: rgba(16, 185, 129, 0.1);
        border-color: rgba(16, 185, 129, 0.25);
        color: #10b981;

        .live-pulse {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 4px #10b981;
        }
      }
    }

    /* Section Divider */
    .sc-section-divider {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.6rem 1rem 0.3rem;
      border-top: 1px solid var(--color-border, #e2e8f0);
      margin-top: 0.2rem;
    }

    .sc-section-title {
      font-family: var(--font-family-mono, monospace);
      font-size: 0.63rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      color: var(--color-text-dim, #94a3b8);
    }

    .sc-collapse-all-btn {
      font-size: 0.68rem;
      font-weight: 600;
      color: var(--brand-primary, #6366f1);
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.1rem 0.3rem;
      border-radius: 4px;
      transition: background 0.15s;

      &:hover {
        background: rgba(99, 102, 241, 0.1);
      }
    }

    /* Nav area and custom scrollbar */
    .sc-sidebar__nav {
      flex: 1;
      overflow-y: auto;
      overscroll-behavior: contain;
      -webkit-overflow-scrolling: touch;
      padding: 0.35rem 0.85rem 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      scrollbar-width: thin;
      scrollbar-color: rgba(99, 102, 241, 0.25) transparent;

      &::-webkit-scrollbar {
        width: 4px;
      }

      &::-webkit-scrollbar-track {
        background: transparent;
      }

      &::-webkit-scrollbar-thumb {
        background: rgba(99, 102, 241, 0.2);
        border-radius: 9999px;

        &:hover {
          background: rgba(99, 102, 241, 0.45);
        }
      }
    }

    /* Empty state */
    .sc-empty-state {
      padding: 2rem 1rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.35rem;
    }

    .sc-empty-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(99, 102, 241, 0.1);
      color: var(--brand-primary, #6366f1);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 0.25rem;
    }

    .sc-empty-title {
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--color-text-main, #0f172a);
      margin: 0;
    }

    .sc-empty-hint {
      font-size: 0.73rem;
      color: var(--color-text-dim, #94a3b8);
      margin: 0;
      line-height: 1.4;
    }

    .sc-empty-action {
      margin-top: 0.6rem;
      padding: 0.35rem 0.8rem;
      font-size: 0.74rem;
      font-weight: 600;
      border-radius: var(--radius-pill, 9999px);
      background: var(--brand-primary, #6366f1);
      color: #ffffff;
      border: none;
      cursor: pointer;
      transition: opacity 0.15s ease;

      &:hover {
        opacity: 0.9;
      }
    }

    /* Category Accordion Group */
    .sc-sidebar__group {
      display: flex;
      flex-direction: column;
      margin-bottom: 0.15rem;
    }

    .sc-sidebar__group-header-wrap {
      border-radius: var(--radius-sm, 8px);
      transition: background 0.15s ease;

      &--active {
        background: color-mix(in srgb, var(--brand-primary, #6366f1) 6%, transparent);
      }
    }

    .sc-sidebar__group-header {
      display: flex;
      align-items: center;
      gap: 0.55rem;
      width: 100%;
      padding: 0.45rem 0.65rem;
      border: none;
      border-radius: var(--radius-sm, 8px);
      background: none;
      font-family: inherit;
      font-size: 0.82rem;
      font-weight: 650;
      color: var(--color-text-main, #0f172a);
      cursor: pointer;
      transition: all 0.15s cubic-bezier(0.16, 1, 0.3, 1);
      text-align: left;

      &:hover {
        background: color-mix(in srgb, var(--brand-primary, #6366f1) 8%, transparent);
        color: var(--brand-primary, #6366f1);
      }
    }

    .sc-sidebar__group-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 22px;
      height: 22px;
      border-radius: 6px;
      background: var(--color-bg-elevated, #f1f5f9);
      flex-shrink: 0;
      color: var(--brand-primary, #6366f1);
      transition: transform 0.2s ease;

      :is(svg) {
        width: 14px;
        height: 14px;
      }
    }

    .sc-sidebar__group-header:hover .sc-sidebar__group-icon {
      transform: scale(1.08);
    }

    .sc-sidebar__group-name {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .sc-sidebar__group-count {
      font-family: var(--font-family-mono, monospace);
      font-size: 0.64rem;
      font-weight: 700;
      color: var(--color-text-dim, #94a3b8);
      background: var(--color-bg-elevated, #f1f5f9);
      padding: 0.08rem 0.45rem;
      border-radius: var(--radius-pill, 9999px);
      line-height: 1.3;
    }

    .sc-sidebar__group-chevron {
      flex-shrink: 0;
      color: var(--color-text-dim, #94a3b8);
      transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);

      &--open {
        transform: rotate(180deg);
        color: var(--brand-primary, #6366f1);
      }
    }

    /* Sub-items (Components) */
    .sc-sidebar__group-items {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 1.5px;
      padding-left: 1rem;
      margin: 0.2rem 0 0.4rem 1.15rem;
      border-left: 1.5px solid color-mix(in srgb, var(--color-border, #e2e8f0) 85%, transparent);
    }

    .sc-sidebar__overview-link {
      display: flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0.28rem 0.55rem;
      border-radius: var(--radius-xs, 5px);
      font-size: 0.74rem;
      font-weight: 600;
      font-style: italic;
      text-decoration: none;
      color: var(--color-text-dim, #94a3b8);
      transition: all 0.15s ease;
      margin-bottom: 0.15rem;

      .sc-overview-dot {
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: var(--color-text-dim, #94a3b8);
        transition:
          transform 0.15s ease,
          background 0.15s ease;
      }

      &:hover {
        color: var(--brand-primary, #6366f1);
        background: color-mix(in srgb, var(--brand-primary, #6366f1) 6%, transparent);

        .sc-overview-dot {
          background: var(--brand-primary, #6366f1);
          transform: scale(1.3);
        }
      }

      &--active {
        color: var(--brand-primary, #6366f1);
        font-weight: 700;

        .sc-overview-dot {
          background: var(--brand-primary, #6366f1);
          box-shadow: 0 0 5px var(--brand-primary, #6366f1);
        }
      }
    }

    .sc-sidebar__item-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.32rem 0.55rem;
      border-radius: var(--radius-xs, 6px);
      font-size: 0.78rem;
      font-weight: 500;
      text-decoration: none;
      color: var(--color-text-muted, #475569);
      position: relative;
      transition: all 0.15s cubic-bezier(0.16, 1, 0.3, 1);

      .sc-item-indicator {
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: transparent;
        border: 1px solid var(--color-text-dim, #cbd5e1);
        flex-shrink: 0;
        transition: all 0.15s ease;
      }

      .sc-item-title {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      &:hover {
        color: var(--color-text-main, #0f172a);
        background: color-mix(in srgb, var(--brand-primary, #6366f1) 8%, transparent);
        transform: translateX(3px);

        .sc-item-indicator {
          border-color: var(--brand-primary, #6366f1);
          background: var(--brand-primary, #6366f1);
          transform: scale(1.25);
        }
      }

      &--active {
        background: linear-gradient(
          90deg,
          rgba(99, 102, 241, 0.14) 0%,
          rgba(168, 85, 247, 0.04) 100%
        );
        color: var(--brand-primary, #6366f1);
        font-weight: 650;
        box-shadow: inset 2.5px 0 0 var(--brand-primary, #6366f1);

        .sc-item-indicator {
          background: var(--brand-primary, #6366f1);
          border-color: var(--brand-primary, #6366f1);
          box-shadow: 0 0 6px var(--brand-primary, #6366f1);
          transform: scale(1.3);
        }
      }
    }

    /* Footer Dock */
    .sc-sidebar__footer {
      padding: 0.65rem 0.85rem;
      border-top: 1px solid var(--color-border, #e2e8f0);
      background: linear-gradient(180deg, transparent 0%, var(--color-bg-elevated, #f8fafc) 100%);
    }

    .sc-dock-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0.35rem;
    }

    .sc-dock-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;
      padding: 0.4rem 0.2rem;
      border-radius: var(--radius-sm, 7px);
      text-decoration: none;
      color: var(--color-text-dim, #64748b);
      font-size: 0.65rem;
      font-weight: 600;
      transition: all 0.15s ease;

      &:hover {
        color: var(--brand-primary, #6366f1);
        background: color-mix(in srgb, var(--brand-primary, #6366f1) 10%, transparent);
        transform: translateY(-1px);
      }
    }

    /* Content Area */
    .sc-content {
      grid-column: 2;
      overflow-y: auto;
      overflow-x: clip;
      overscroll-behavior: contain;
      -webkit-overflow-scrolling: touch;
      scroll-behavior: smooth;
      padding: clamp(1.5rem, 3vw, 2.5rem) clamp(1.5rem, 3.5vw, 3rem) 5rem;
      background: var(--color-bg-page, #f8fafc);
      isolation: isolate;
    }

    .sc-menu-btn {
      display: none;
      align-items: center;
      gap: 0.55rem;
      margin-bottom: 1.25rem;
      padding: 0.48rem 0.95rem;
      border: 1px solid var(--color-border, #e2e8f0);
      border-radius: var(--radius-pill, 9999px);
      background: var(--color-bg-card, #ffffff);
      backdrop-filter: blur(12px);
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
      color: var(--color-text-main, #0f172a);
      font-size: 0.82rem;
      font-weight: 650;
      cursor: pointer;
      transition: all 0.15s ease;

      &:hover {
        background: color-mix(in srgb, var(--brand-primary, #6366f1) 8%, transparent);
        border-color: var(--brand-primary, #6366f1);
        color: var(--brand-primary, #6366f1);
      }
    }

    .sc-menu-btn-count {
      font-family: var(--font-family-mono, monospace);
      font-size: 0.66rem;
      font-weight: 700;
      background: rgba(99, 102, 241, 0.1);
      color: var(--brand-primary, #6366f1);
      padding: 0.1rem 0.45rem;
      border-radius: var(--radius-pill, 9999px);
    }

    .sc-backdrop {
      display: none;
    }

    /* Responsive */
    @media (max-width: 900px) {
      .sc-layout {
        grid-template-columns: 1fr;
      }

      .sc-sidebar {
        position: fixed;
        top: 3.75rem;
        bottom: 0;
        left: 0;
        width: min(300px, 86vw);
        min-width: min(300px, 86vw);
        z-index: 1200;
        transform: translateX(-100%);
        transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.3);
      }

      .sc-sidebar--open {
        transform: translateX(0);
      }

      .sc-sidebar__close-btn {
        display: inline-flex;
      }

      .sc-backdrop {
        display: block;
        position: fixed;
        inset: 3.75rem 0 0 0;
        z-index: 1199;
        background: rgba(9, 13, 22, 0.5);
        backdrop-filter: blur(4px);
      }

      .sc-menu-btn {
        display: inline-flex;
      }

      .sc-content {
        padding: 1.25rem 1rem 4rem;
      }
    }
  `,
})
export class ShowcaseLayout {
  protected readonly version = APP_VERSION;
  protected readonly searchQuery = signal('');
  protected readonly mobileOpen = signal(false);
  protected readonly isSearchFocused = signal(false);
  protected readonly currentUrl = signal('');

  protected readonly expandedGroups = signal<Set<string>>(
    new Set(['Forms', 'Content', 'Navigation', 'AI', 'Enterprise']),
  );

  @ViewChild('contentEl') contentEl?: ElementRef<HTMLElement>;
  @ViewChild('searchInput') searchInput?: ElementRef<HTMLInputElement>;
  private readonly router = inject(Router);

  constructor() {
    this.currentUrl.set(this.router.url);

    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.currentUrl.set(this.router.url);

      const activeGroup = this.allGroups.find((g) =>
        g.categories.some((c) => this.router.url.includes(`/showcase/${c.path}`)),
      );
      if (activeGroup) {
        this.expandedGroups.update((groups) => {
          if (!groups.has(activeGroup.label)) {
            const next = new Set(groups);
            next.add(activeGroup.label);
            return next;
          }
          return groups;
        });
      }

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

  @HostListener('window:keydown', ['$event'])
  handleGlobalKeydown(event: KeyboardEvent): void {
    if (
      event.key === '/' &&
      !(
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        (event.target as HTMLElement)?.isContentEditable
      )
    ) {
      event.preventDefault();
      this.searchInput?.nativeElement.focus();
      this.searchInput?.nativeElement.select();
    }
  }

  protected clearSearch(): void {
    this.searchQuery.set('');
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

  protected toggleAllGroups(): void {
    if (this.expandedGroups().size > 0) {
      this.expandedGroups.set(new Set());
    } else {
      this.expandedGroups.set(new Set(this.allGroups.map((g) => g.label)));
    }
  }

  protected isGroupExpanded(label: string): boolean {
    if (this.searchQuery().trim().length > 0) {
      return true;
    }
    return this.expandedGroups().has(label);
  }

  protected isGroupRouteActive(group: CategoryGroup): boolean {
    return group.categories.some((c) => this.currentUrl().includes(`/showcase/${c.path}`));
  }

  protected isCategoryActive(path: string): boolean {
    const urlWithoutHash = this.currentUrl().split('?')[0].split('#')[0];
    const hash = this.currentUrl().includes('#') ? this.currentUrl().split('#')[1] : '';
    return urlWithoutHash === `/showcase/${path}` && !hash;
  }

  protected isItemActive(path: string, item: string): boolean {
    const urlWithoutHash = this.currentUrl().split('?')[0].split('#')[0];
    const hash = this.currentUrl().includes('#') ? this.currentUrl().split('#')[1] : '';
    return urlWithoutHash === `/showcase/${path}` && hash === this.toSlug(item);
  }

  protected navigateToCategory(path: string): void {
    this.mobileOpen.set(false);
    const targetUrl = `/showcase/${path}`;
    if (this.currentUrl().split('?')[0].split('#')[0] === targetUrl) {
      if (this.contentEl) {
        this.contentEl.nativeElement.scrollTop = 0;
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.history.replaceState(null, '', targetUrl);
      this.currentUrl.set(targetUrl);
    }
  }

  protected scrollToComponent(path: string, item: string, event?: Event): void {
    this.mobileOpen.set(false);
    const slug = this.toSlug(item);
    const targetUrl = `/showcase/${path}`;
    const currentBasePath = this.currentUrl().split('?')[0].split('#')[0];

    if (currentBasePath === targetUrl) {
      if (event) {
        event.preventDefault();
      }
      const el = document.getElementById(slug);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.history.replaceState(null, '', `${targetUrl}#${slug}`);
        this.currentUrl.set(`${targetUrl}#${slug}`);
      }
    }
  }

  protected toSlug(item: string): string {
    return item
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-');
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
            'Breadcrumb',
            'Menubar',
            'Stepper',
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
            'Textarea',
            'Number Input',
            'Select',
            'Multi Select',
            'Autocomplete',
            'Combobox',
            'Typeahead',
            'Power Search',
            'Checkbox',
            'Checkbox List',
            'Radio',
            'Switch',
            'Slider',
            'Time Picker',
            'Input Mask',
            'Icon',
            'Date Picker',
            'Telephone input',
            'Segmented Control',
            'Chip Group',
            'Selector',
            'Multi Selector',
            'Tokenizer',
            'Input Group',
            'Field',
            'Form Field',
            'Checkbox List Item',
            'Color Picker',
            'File Upload',
            'Date Range Picker',
            'Transfer',
            'Signature Pad',
            'OTP Input',
            'Range Slider',
            'Credit Card Input',
            'Password Strength Meter',
            'Tree Select',
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
            'Tag',
            'Chip',
            'Table',
            'Data Table',
            'List',
            'Metadata List',
            'Overflow List',
            'Stat',
            'Status Dot',
            'Card',
            'File Tree',
            'Timeline Stepper',
            'Code Editor',
            'Filter Builder',
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
            'Gauge Meter',
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
            'Interactive AI Chat Assistant',
            'Chat Window',
            'Chat Input',
            'Chat Layout',
            'Chat Send Button & Dictation Button',
            'Chat Tokenized Text',
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
            'AI Prompt Input',
            'AI Thinking Indicator',
            'Prompt Library',
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

  protected readonly totalComponentsCount = computed(() => {
    return this.allGroups.reduce(
      (sum, group) => sum + group.categories.reduce((cSum, cat) => cSum + cat.items.length, 0),
      0,
    );
  });

  protected readonly filteredGroups = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return this.allGroups;

    return this.allGroups
      .map((g) => {
        const groupMatches =
          g.label.toLowerCase().includes(q) ||
          this.groupLabelKey(g.label).toLowerCase().includes(q);

        const matchingCats = g.categories
          .map((c) => {
            const catMatches =
              c.label.toLowerCase().includes(q) || c.path.toLowerCase().includes(q);

            const matchingItems = c.items.filter(
              (item) => groupMatches || catMatches || item.toLowerCase().includes(q),
            );

            return {
              ...c,
              items: matchingItems,
            };
          })
          .filter((c) => c.items.length > 0);

        return {
          ...g,
          categories: matchingCats,
        };
      })
      .filter((g) => g.categories.length > 0);
  });

  protected readonly totalMatches = computed(() => {
    const q = this.searchQuery().trim();
    if (!q) return 0;
    return this.filteredGroups().reduce(
      (sum, g) => sum + g.categories.reduce((cSum, c) => cSum + c.items.length, 0),
      0,
    );
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
