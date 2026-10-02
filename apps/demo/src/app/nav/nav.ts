import { Component, inject, signal, computed, HostListener, effect } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NgxsmkThemeService } from '@ngxsmk/theme';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageSwitcher } from '../i18n/language-switcher.component';
import { APP_VERSION } from '../core/version';

interface SearchItem {
  name: string;
  category: string;
  categoryKey: string;
  path: string;
}

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, TranslatePipe, LanguageSwitcher],
  template: `
    <nav class="nav" [class.nav--scrolled]="isScrolled()">
      <div class="nav__inner">
        <!-- Left Group: Brand Logo & Desktop Nav Links -->
        <div class="nav__left">
          <a class="nav__brand logo" routerLink="/" (click)="mobileOpen.set(false)">
            <div class="logo-icon-wrapper">
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                stroke-width="2.3"
              >
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
            </div>
            <div class="logo-text-group">
              <span class="logo-text">NGXSMK <span class="highlight">UI Kit</span></span>
              <span class="nav__version-badge">v{{ version }}</span>
            </div>
          </a>

          <div class="nav__links">
            <a class="nav__link" routerLink="/docs" routerLinkActive="nav__link--active">
              {{ 'nav.docs' | translate }}
            </a>
            <a
              class="nav__link"
              routerLink="/showcase/explorer"
              routerLinkActive="nav__link--active"
            >
              {{ 'nav.components' | translate }}
            </a>
            <a class="nav__link" routerLink="/templates" routerLinkActive="nav__link--active">
              Templates
            </a>
            <a class="nav__link" routerLink="/themes" routerLinkActive="nav__link--active">
              {{ 'nav.themes' | translate }}
            </a>
            <a
              class="nav__link"
              routerLink="/playground/component"
              routerLinkActive="nav__link--active"
            >
              Playground
            </a>
            <a
              class="nav__link nav__link--community"
              routerLink="/community"
              routerLinkActive="nav__link--active"
            >
              Community
            </a>
          </div>
        </div>

        <!-- Right Group: Actions, Tools, Search & CTA -->
        <div class="nav__actions">
          <!-- Global Search Pill / Icon Button -->
          <button
            class="nav__search"
            type="button"
            (click)="openSearch()"
            [attr.aria-label]="'nav.searchAria' | translate"
            title="Search components (⌘K)"
          >
            <svg
              class="nav__search-icon"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.4"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <span class="nav__search-text">{{ 'nav.search' | translate }}</span>
            <kbd class="nav__search-kbd">⌘K</kbd>
          </button>

          <!-- Theme Toggle (Sun / Moon) -->
          <button
            class="nav__icon-btn nav__theme-btn"
            type="button"
            [attr.aria-label]="(theme.isDark() ? 'nav.lightMode' : 'nav.darkMode') | translate"
            (click)="theme.toggle()"
            [title]="(theme.isDark() ? 'nav.lightMode' : 'nav.darkMode') | translate"
          >
            @if (theme.isDark()) {
              <svg
                class="nav__theme-icon nav__theme-icon--sun"
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
                class="nav__theme-icon nav__theme-icon--moon"
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

          <!-- RTL/LTR Direction Toggle -->
          <button
            class="nav__icon-btn nav__icon-btn--label"
            type="button"
            [attr.aria-label]="isRtl() ? 'Switch to LTR' : 'Switch to RTL'"
            (click)="toggleRtl()"
            [title]="isRtl() ? 'Switch to LTR layout' : 'Switch to RTL layout'"
          >
            <span class="dir-tag">{{ isRtl() ? 'LTR' : 'RTL' }}</span>
          </button>

          <!-- GitHub Link -->
          <a
            class="nav__icon-btn"
            href="https://github.com/NGXSMK/ngxsmk-ui-kit"
            target="_blank"
            rel="noopener"
            [attr.aria-label]="'nav.github' | translate"
            title="GitHub Repository"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"
              />
            </svg>
          </a>

          <!-- Language Switcher -->
          <app-language-switcher />

          <!-- Get Started CTA Button -->
          <a routerLink="/docs" class="nav__cta">
            <span>Get started</span>
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>

          <!-- Mobile Hamburger Toggle Button -->
          <button
            class="nav__menu-btn"
            type="button"
            [attr.aria-expanded]="mobileOpen()"
            [attr.aria-label]="'nav.toggleMenu' | translate"
            (click)="mobileOpen.set(!mobileOpen())"
          >
            @if (mobileOpen()) {
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.2"
                stroke-linecap="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            } @else {
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.2"
                stroke-linecap="round"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            }
          </button>
        </div>
      </div>
    </nav>

    <!-- Mobile Drawer Menu Overlay -->
    @if (mobileOpen()) {
      <!-- eslint-disable-next-line @angular-eslint/template/click-events-have-key-events, @angular-eslint/template/interactive-supports-focus -->
      <div class="nav__mobile-backdrop" (click)="mobileOpen.set(false)"></div>
      <div class="nav__mobile">
        <div class="nav__mobile-header">
          <span class="nav__mobile-title">Navigation</span>
          <button
            class="nav__mobile-close"
            type="button"
            (click)="mobileOpen.set(false)"
            aria-label="Close menu"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <!-- Mobile Search Trigger -->
        <button
          class="nav__mobile-search-btn"
          type="button"
          (click)="mobileOpen.set(false); openSearch()"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <span>{{ 'nav.search' | translate }}</span>
          <kbd>⌘K</kbd>
        </button>

        <div class="nav__mobile-links">
          <a class="nav__mobile-link" routerLink="/docs" (click)="mobileOpen.set(false)">
            <span class="nav__mobile-link-text">{{ 'nav.docs' | translate }}</span>
            <span class="nav__mobile-link-arrow">→</span>
          </a>
          <a
            class="nav__mobile-link"
            routerLink="/showcase/explorer"
            (click)="mobileOpen.set(false)"
          >
            <span class="nav__mobile-link-text">{{ 'nav.components' | translate }}</span>
            <span class="nav__mobile-badge">170+</span>
          </a>
          <a class="nav__mobile-link" routerLink="/templates" (click)="mobileOpen.set(false)">
            <span class="nav__mobile-link-text">Templates</span>
            <span class="nav__mobile-link-arrow">→</span>
          </a>
          <a class="nav__mobile-link" routerLink="/themes" (click)="mobileOpen.set(false)">
            <span class="nav__mobile-link-text">{{ 'nav.themes' | translate }}</span>
            <span class="nav__mobile-link-arrow">→</span>
          </a>
          <a
            class="nav__mobile-link"
            routerLink="/playground/component"
            (click)="mobileOpen.set(false)"
          >
            <span class="nav__mobile-link-text">Playground</span>
            <span class="nav__mobile-badge nav__mobile-badge--live">Live</span>
          </a>
          <a class="nav__mobile-link" routerLink="/community" (click)="mobileOpen.set(false)">
            <span class="nav__mobile-link-text">Community</span>
            <span class="nav__mobile-link-arrow">→</span>
          </a>
        </div>

        <div class="nav__mobile-divider"></div>

        <div class="nav__mobile-actions">
          <button type="button" class="nav__mobile-install" (click)="copyInstallCommand()">
            <code>npm i &#64;ngxsmk/core</code>
            <span class="copy-tag">{{ hasCopiedInstall() ? 'Copied! ✓' : 'Copy' }}</span>
          </button>

          <div class="nav__mobile-controls">
            <button class="nav__mobile-icon-btn" type="button" (click)="theme.toggle()">
              @if (theme.isDark()) {
                <span>☀️ Light</span>
              } @else {
                <span>🌙 Dark</span>
              }
            </button>

            <button class="nav__mobile-icon-btn" type="button" (click)="toggleRtl()">
              <span>Direction: {{ isRtl() ? 'LTR' : 'RTL' }}</span>
            </button>

            <a
              class="nav__mobile-icon-btn"
              href="https://github.com/NGXSMK/ngxsmk-ui-kit"
              target="_blank"
              rel="noopener"
            >
              <span>GitHub ↗</span>
            </a>
          </div>

          <a routerLink="/docs" class="nav__mobile-cta" (click)="mobileOpen.set(false)">
            Get started with NGXSMK →
          </a>
        </div>
      </div>
    }

    <!-- Global Command Palette Modal Dialog -->
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
              stroke-width="2.2"
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
              [value]="searchQuery()"
              (input)="onSearchInput(searchInput.value)"
              (keydown)="onSearchKeydown($event)"
            />
            <!-- eslint-disable-next-line @angular-eslint/template/click-events-have-key-events, @angular-eslint/template/interactive-supports-focus -->
            <span class="cmd-esc" (click)="closeSearch()">ESC</span>
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
                <span class="cmd-item-cat">{{ item.categoryKey | translate }}</span>
              </div>
            }
            @if (filteredSearchItems().length === 0) {
              <div class="cmd-empty">
                {{ 'search.empty' | translate: { query: searchQuery() } }}
              </div>
            }
          </div>

          <div class="cmd-footer">
            <div class="cmd-footer__hint"><kbd>↑</kbd><kbd>↓</kbd> <span>Navigate</span></div>
            <div class="cmd-footer__hint"><kbd>↵</kbd> <span>Select</span></div>
            <div class="cmd-footer__hint"><kbd>esc</kbd> <span>Close</span></div>
          </div>
        </div>
      </div>
    }
  `,
  styles: `
    .nav {
      position: sticky;
      top: 0;
      z-index: var(--ngxsmk-z-sticky, 1100);
      width: 100%;
      border-bottom: 1px solid var(--color-border, #e2e8f0);
      background: color-mix(in srgb, var(--color-bg-sidebar, #ffffff) 82%, transparent);
      backdrop-filter: blur(20px) saturate(180%);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .nav--scrolled {
      background: color-mix(in srgb, var(--color-bg-sidebar, #ffffff) 94%, transparent);
      box-shadow:
        0 4px 20px -2px rgba(0, 0, 0, 0.05),
        0 2px 6px -1px rgba(0, 0, 0, 0.03);
    }

    .nav::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 6%;
      right: 6%;
      height: 1px;
      background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(99, 102, 241, 0.35) 50%,
        transparent 100%
      );
      pointer-events: none;
    }

    .nav__inner {
      max-width: 1440px;
      width: 100%;
      margin: 0 auto;
      padding: 0 clamp(1rem, 2vw, 2rem);
      height: 4rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }

    /* Left Group */
    .nav__left {
      display: flex;
      align-items: center;
      gap: clamp(1rem, 1.8vw, 1.8rem);
      flex-shrink: 0;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      cursor: pointer;
      text-decoration: none;
      transition:
        transform 0.16s ease,
        opacity 0.16s ease;
      flex-shrink: 0;

      &:hover {
        opacity: 0.95;
        transform: translateY(-1px);
      }
    }

    .logo-icon-wrapper {
      background: linear-gradient(135deg, var(--brand-primary, #6366f1) 0%, #a855f7 100%);
      color: #ffffff;
      width: 32px;
      height: 32px;
      border-radius: 9px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 3px 10px rgba(99, 102, 241, 0.38);
      flex-shrink: 0;
    }

    .logo-text-group {
      display: flex;
      align-items: baseline;
      gap: 0.45rem;
    }

    .logo-text {
      font-family: var(--font-family-display, sans-serif);
      font-weight: 750;
      font-size: 1.08rem;
      letter-spacing: -0.025em;
      color: var(--color-text-main, #0f172a);
      white-space: nowrap;
    }

    .highlight {
      background: linear-gradient(135deg, var(--brand-primary, #6366f1) 0%, #a855f7 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-weight: 800;
    }

    .nav__version-badge {
      font-family: var(--font-family-mono, monospace);
      font-size: 0.65rem;
      font-weight: 700;
      color: var(--brand-primary, #6366f1);
      background: rgba(99, 102, 241, 0.08);
      border: 1px solid rgba(99, 102, 241, 0.2);
      padding: 0.1rem 0.4rem;
      border-radius: var(--radius-pill, 9999px);
      line-height: 1.2;
    }

    .nav__links {
      display: flex;
      align-items: center;
      gap: 0.2rem;
      flex-shrink: 0;
    }

    .nav__link {
      position: relative;
      padding: 0.42rem 0.72rem;
      border-radius: var(--radius-sm, 8px);
      font-size: 0.84rem;
      font-weight: 550;
      text-decoration: none;
      color: var(--color-text-dim, #64748b);
      transition: all 0.15s ease;
      white-space: nowrap;

      &:hover {
        color: var(--color-text-main, #0f172a);
        background: color-mix(in srgb, var(--brand-primary, #6366f1) 8%, transparent);
      }

      &--active {
        color: var(--brand-primary, #6366f1);
        background: color-mix(in srgb, var(--brand-primary, #6366f1) 12%, transparent);
        font-weight: 650;
      }
    }

    /* Right Actions Area */
    .nav__actions {
      display: flex;
      align-items: center;
      gap: 0.45rem;
      flex-shrink: 0;
      margin-left: auto;
    }

    /* Search Pill / Icon */
    .nav__search {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      border: 1px solid var(--color-border, #e2e8f0);
      background: var(--color-bg-elevated, #f1f5f9);
      border-radius: var(--radius-pill, 9999px);
      padding: 0.36rem 0.7rem 0.36rem 0.8rem;
      height: 2.15rem;
      cursor: pointer;
      color: var(--color-text-dim, #64748b);
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      min-width: 165px;
      text-align: left;

      &:hover {
        background: var(--color-bg-card, #ffffff);
        border-color: var(--brand-primary, #6366f1);
        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.18);
        color: var(--color-text-main, #0f172a);
      }
    }

    .nav__search-icon {
      color: var(--brand-primary, #6366f1);
      flex-shrink: 0;
    }

    .nav__search-text {
      font-size: 0.8rem;
      font-weight: 500;
      flex: 1;
      color: var(--color-text-dim, #64748b);
    }

    .nav__search-kbd {
      font-family: var(--font-family-mono, monospace);
      font-size: 0.65rem;
      font-weight: 650;
      color: var(--color-text-dim, #64748b);
      border: 1px solid var(--color-border, #e2e8f0);
      background: var(--color-bg-card, #ffffff);
      padding: 0.08rem 0.35rem;
      border-radius: 4px;
      line-height: 1.1;
    }

    /* Icon Buttons */
    .nav__icon-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 2.15rem;
      height: 2.15rem;
      border: 1px solid var(--color-border, #e2e8f0);
      border-radius: var(--radius-sm, 8px);
      background: var(--color-bg-elevated, #f1f5f9);
      color: var(--color-text-dim, #64748b);
      cursor: pointer;
      transition: all 0.15s ease;
      text-decoration: none;
      flex-shrink: 0;

      &:hover {
        color: var(--color-text-main, #0f172a);
        background: var(--color-bg-card, #ffffff);
        border-color: var(--brand-primary, #6366f1);
        transform: translateY(-1px);
      }
    }

    .nav__theme-btn {
      transition:
        transform 0.2s cubic-bezier(0.16, 1, 0.3, 1),
        background-color 0.15s ease;

      &:hover {
        transform: rotate(15deg) scale(1.05);
      }
    }

    .nav__icon-btn--label {
      width: auto;
      padding: 0 0.55rem;
      font-family: var(--font-family-mono, monospace);
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 0.04em;
    }

    /* CTA Button */
    .nav__cta {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.45rem 0.95rem;
      border-radius: var(--radius-pill, 9999px);
      background: linear-gradient(135deg, var(--brand-primary, #6366f1) 0%, #4f46e5 100%);
      color: #ffffff;
      font-size: 0.81rem;
      font-weight: 650;
      text-decoration: none;
      white-space: nowrap;
      box-shadow: 0 3px 12px rgba(99, 102, 241, 0.35);
      transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
      margin-left: 0.2rem;
      flex-shrink: 0;

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 5px 18px rgba(99, 102, 241, 0.45);
        color: #ffffff;
      }
    }

    /* Mobile Hamburger Menu Toggle Button */
    .nav__menu-btn {
      display: none;
      align-items: center;
      justify-content: center;
      width: 2.15rem;
      height: 2.15rem;
      border: 1px solid var(--color-border, #e2e8f0);
      border-radius: var(--radius-sm, 8px);
      background: var(--color-bg-elevated, #f1f5f9);
      color: var(--color-text-main, #0f172a);
      cursor: pointer;
      transition: all 0.15s ease;
      flex-shrink: 0;

      &:hover {
        background: color-mix(in srgb, var(--brand-primary, #6366f1) 10%, transparent);
        border-color: var(--brand-primary, #6366f1);
      }
    }

    /* Mobile Overlay Drawer */
    .nav__mobile-backdrop {
      position: fixed;
      inset: 4rem 0 0 0;
      background: rgba(9, 13, 22, 0.6);
      backdrop-filter: blur(8px);
      z-index: 1099;
      animation: fade-in 0.2s ease-out;
    }

    .nav__mobile {
      position: absolute;
      top: 4rem;
      left: 0;
      right: 0;
      background: var(--color-bg-card, #ffffff);
      border-bottom: 1px solid var(--color-border, #e2e8f0);
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      z-index: 1100;
      padding: 1.25rem 1.5rem 2rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      max-height: calc(100dvh - 4rem);
      overflow-y: auto;
      animation: slide-down 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes slide-down {
      from {
        opacity: 0;
        transform: translateY(-8px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes fade-in {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .nav__mobile-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 0.6rem;
      border-bottom: 1px solid var(--color-border, #e2e8f0);
    }

    .nav__mobile-title {
      font-family: var(--font-family-display, sans-serif);
      font-size: 0.9rem;
      font-weight: 750;
      color: var(--color-text-main, #0f172a);
    }

    .nav__mobile-close {
      background: none;
      border: none;
      color: var(--color-text-dim, #64748b);
      cursor: pointer;
      padding: 0.25rem;

      &:hover {
        color: var(--color-text-main, #0f172a);
      }
    }

    .nav__mobile-search-btn {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      padding: 0.65rem 0.9rem;
      border-radius: var(--radius-sm, 8px);
      background: var(--color-bg-elevated, #f1f5f9);
      border: 1px solid var(--color-border, #e2e8f0);
      color: var(--color-text-dim, #64748b);
      font-size: 0.85rem;
      cursor: pointer;
      text-align: left;

      kbd {
        margin-left: auto;
        font-family: var(--font-family-mono, monospace);
        font-size: 0.68rem;
        background: var(--color-bg-card, #ffffff);
        border: 1px solid var(--color-border, #e2e8f0);
        padding: 0.1rem 0.4rem;
        border-radius: 4px;
      }
    }

    .nav__mobile-links {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .nav__mobile-link {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.65rem 0.75rem;
      border-radius: var(--radius-sm, 8px);
      text-decoration: none;
      color: var(--color-text-main, #0f172a);
      font-size: 0.9rem;
      font-weight: 600;
      transition: background 0.15s ease;

      &:hover {
        background: color-mix(in srgb, var(--brand-primary, #6366f1) 8%, transparent);
        color: var(--brand-primary, #6366f1);
      }
    }

    .nav__mobile-badge {
      font-family: var(--font-family-mono, monospace);
      font-size: 0.68rem;
      font-weight: 700;
      color: var(--brand-primary, #6366f1);
      background: rgba(99, 102, 241, 0.1);
      padding: 0.1rem 0.5rem;
      border-radius: var(--radius-pill, 9999px);

      &--live {
        background: rgba(16, 185, 129, 0.12);
        color: #10b981;
      }
    }

    .nav__mobile-divider {
      height: 1px;
      background: var(--color-border, #e2e8f0);
      margin: 0.35rem 0;
    }

    .nav__mobile-actions {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .nav__mobile-install {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.6rem 0.85rem;
      border-radius: var(--radius-sm, 8px);
      background: var(--color-bg-elevated, #f1f5f9);
      border: 1px solid var(--color-border, #e2e8f0);
      cursor: pointer;

      code {
        font-family: var(--font-family-mono, monospace);
        font-size: 0.78rem;
        color: var(--brand-primary, #6366f1);
        font-weight: 650;
      }

      .copy-tag {
        font-size: 0.72rem;
        font-weight: 700;
        color: var(--color-text-dim, #64748b);
      }
    }

    .nav__mobile-controls {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.5rem;
    }

    .nav__mobile-icon-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.55rem 0.4rem;
      border-radius: var(--radius-sm, 8px);
      background: var(--color-bg-elevated, #f1f5f9);
      border: 1px solid var(--color-border, #e2e8f0);
      color: var(--color-text-main, #0f172a);
      font-size: 0.76rem;
      font-weight: 600;
      text-decoration: none;
      cursor: pointer;

      &:hover {
        background: color-mix(in srgb, var(--brand-primary, #6366f1) 8%, transparent);
      }
    }

    .nav__mobile-cta {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.75rem 1rem;
      border-radius: var(--radius-sm, 8px);
      background: linear-gradient(135deg, var(--brand-primary, #6366f1) 0%, #4f46e5 100%);
      color: #ffffff;
      font-size: 0.9rem;
      font-weight: 650;
      text-decoration: none;
      box-shadow: 0 4px 15px rgba(99, 102, 241, 0.35);
    }

    /* Command Palette Overlay */
    .cmd-overlay {
      position: fixed;
      inset: 0;
      z-index: var(--ngxsmk-z-modal, 1400);
      background: rgba(9, 13, 22, 0.65);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding: 12vh 1rem 1rem;
      animation: cmd-fade-in 0.18s ease-out;
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
      background: var(--color-bg-card, #ffffff);
      border: 1px solid var(--color-border, #e2e8f0);
      border-radius: var(--radius-lg, 16px);
      box-shadow:
        0 25px 60px -15px rgba(0, 0, 0, 0.4),
        0 0 0 1px rgba(99, 102, 241, 0.2);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      max-height: 500px;
      animation: cmd-scale-up 0.18s cubic-bezier(0.16, 1, 0.3, 1);
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
      padding: 0 1.25rem;
      height: 3.75rem;
      border-bottom: 1px solid var(--color-border, #e2e8f0);
      gap: 0.75rem;
    }

    .cmd-search-icon {
      color: var(--brand-primary, #6366f1);
      flex-shrink: 0;
    }

    .cmd-input {
      flex: 1;
      height: 100%;
      border: none !important;
      outline: none !important;
      background: transparent !important;
      padding: 0 !important;
      font-size: 0.95rem;
      font-family: inherit;
      color: var(--color-text-main, #0f172a);

      &::placeholder {
        color: var(--color-text-dim, #94a3b8);
      }
    }

    .cmd-esc {
      font-family: var(--font-family-mono, monospace);
      font-size: 0.65rem;
      font-weight: 700;
      color: var(--color-text-dim, #94a3b8);
      border: 1px solid var(--color-border, #e2e8f0);
      padding: 0.15rem 0.4rem;
      border-radius: 4px;
      cursor: pointer;
      user-select: none;
      background: var(--color-bg-elevated, #f1f5f9);
    }

    .cmd-results {
      flex: 1;
      overflow-y: auto;
      padding: 0.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }

    .cmd-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.55rem 0.85rem;
      border-radius: var(--radius-sm, 8px);
      cursor: pointer;
      transition:
        background-color 0.12s ease,
        color 0.12s ease;
      font-size: 0.85rem;
      color: var(--color-text-main, #0f172a);

      &.active {
        background: color-mix(in srgb, var(--brand-primary, #6366f1) 12%, transparent);
        color: var(--brand-primary, #6366f1);
        font-weight: 600;
      }
    }

    .cmd-item-left {
      display: flex;
      align-items: center;
      gap: 0.625rem;
    }

    .cmd-item-icon {
      font-size: 0.75rem;
      color: var(--brand-primary, #6366f1);
      opacity: 0.85;
    }

    .cmd-item-name {
      font-weight: 550;
    }

    .cmd-item-cat {
      font-family: var(--font-family-mono, monospace);
      font-size: 0.7rem;
      color: var(--color-text-dim, #94a3b8);
      background: var(--color-bg-elevated, #f1f5f9);
      padding: 0.12rem 0.45rem;
      border-radius: var(--radius-pill, 9999px);
      font-weight: 600;
    }

    .cmd-item.active .cmd-item-cat {
      background: color-mix(in srgb, var(--brand-primary, #6366f1) 22%, transparent);
      color: var(--brand-primary, #6366f1);
    }

    .cmd-footer {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      padding: 0.65rem 1.25rem;
      border-top: 1px solid var(--color-border, #e2e8f0);
      background: var(--color-bg-elevated, #f1f5f9);
      font-size: 0.72rem;
      color: var(--color-text-dim, #94a3b8);
    }

    .cmd-footer__hint {
      display: flex;
      align-items: center;
      gap: 0.35rem;

      kbd {
        background: var(--color-bg-card, #ffffff);
        border: 1px solid var(--color-border, #e2e8f0);
        border-radius: 4px;
        padding: 0.1rem 0.35rem;
        font-family: var(--font-family-mono, monospace);
        font-size: 0.65rem;
        line-height: 1;
        color: var(--color-text-main, #0f172a);
      }
    }

    .cmd-empty {
      padding: 2.5rem 0;
      text-align: center;
      color: var(--color-text-dim, #94a3b8);
      font-size: 0.85rem;
    }

    /* Progressive Responsive Collapse (Zero Overlap Guaranteed) */
    @media (max-width: 1220px) {
      .nav__link--community {
        display: none;
      }
    }

    @media (max-width: 1120px) {
      .nav__search {
        min-width: 0;
        padding: 0;
        width: 2.15rem;
        height: 2.15rem;
        justify-content: center;
      }
      .nav__search-text,
      .nav__search-kbd {
        display: none;
      }
    }

    @media (max-width: 1020px) {
      .nav__cta {
        display: none;
      }
    }

    @media (max-width: 920px) {
      .nav__links {
        display: none;
      }
      .nav__menu-btn {
        display: inline-flex;
      }
    }

    @media (max-width: 580px) {
      .nav__icon-btn--label {
        display: none;
      }
      .logo-text-group .nav__version-badge {
        display: none;
      }
    }

    @media (max-width: 440px) {
      a.nav__icon-btn {
        display: none;
      }
    }
  `,
})
export class AppNav {
  protected readonly version = APP_VERSION;
  protected readonly theme = inject(NgxsmkThemeService);
  private readonly router = inject(Router);

  protected readonly isSearchOpen = signal(false);
  protected readonly searchQuery = signal('');
  protected readonly activeIndex = signal(0);
  protected readonly mobileOpen = signal(false);
  protected readonly isRtl = signal(false);
  protected readonly isScrolled = signal(false);
  protected readonly hasCopiedInstall = signal(false);

  constructor() {
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

  @HostListener('window:scroll')
  protected onWindowScroll(): void {
    if (typeof window !== 'undefined') {
      this.isScrolled.set(window.scrollY > 12);
    }
  }

  copyInstallCommand(): void {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText('npm i @ngxsmk/core');
      this.hasCopiedInstall.set(true);
      setTimeout(() => this.hasCopiedInstall.set(false), 2000);
    }
  }

  toggleRtl(): void {
    this.isRtl.update((v) => !v);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('dir', this.isRtl() ? 'rtl' : 'ltr');
    }
  }

  protected readonly categories = [
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
      title: 'Forms',
      path: 'forms',
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
        'Sparkline',
        'Gauge Meter',
      ],
    },
    {
      title: 'AI',
      path: 'ai',
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
      title: 'Utilities & Hooks',
      path: 'utilities',
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
  ];

  protected readonly flatItems = computed(() => {
    const items: SearchItem[] = [];
    for (const cat of this.categories) {
      for (const item of cat.items) {
        items.push({
          name: item,
          category: cat.title,
          categoryKey: 'category.' + cat.path,
          path: cat.path,
        });
      }
    }
    return items;
  });

  protected readonly filteredSearchItems = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const items = this.flatItems();
    if (!q) return items.slice(0, 10);
    return items.filter(
      (item) => item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q),
    );
  });

  @HostListener('window:keydown', ['$event'])
  protected handleGlobalShortcut(event: KeyboardEvent): void {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
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
    const slug = item.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-');
    const targetUrl = `/showcase/${item.path}`;
    const currentBasePath = this.router.url.split('?')[0].split('#')[0];

    if (currentBasePath === targetUrl) {
      const el = document.getElementById(slug);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.history.replaceState(null, '', `${targetUrl}#${slug}`);
        return;
      }
    }

    this.router.navigate(['/showcase', item.path], { fragment: slug });
  }
}
