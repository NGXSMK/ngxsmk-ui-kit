import { Component, inject, signal, computed, HostListener } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NgxsmkThemeService } from '@ngxsmk/theme';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageSwitcher } from '../i18n/language-switcher.component';

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
    <nav class="nav">
      <div class="nav__inner">
        <a class="nav__brand" routerLink="/">
          <img class="nav__logo" src="favicon.svg" alt="" aria-hidden="true" />
          <span class="nav__wordmark">NGXSMK <span class="nav__wordmark-sub">UI Kit</span></span>
        </a>

        <button
          class="nav__menu-btn"
          type="button"
          [attr.aria-expanded]="mobileOpen()"
          [attr.aria-label]="'nav.toggleMenu' | translate"
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

        <div class="nav__links">
          <a class="nav__link" routerLink="/showcase/explorer" routerLinkActive="nav__link--active">
            {{ 'nav.components' | translate }}
          </a>
          <a class="nav__link" routerLink="/docs" routerLinkActive="nav__link--active">
            {{ 'nav.docs' | translate }}
          </a>
          <a
            class="nav__link"
            routerLink="/playground/component"
            routerLinkActive="nav__link--active"
          >
            Playground
          </a>
          <a class="nav__link" routerLink="/themes" routerLinkActive="nav__link--active">
            {{ 'nav.themes' | translate }}
          </a>
          <a class="nav__link" routerLink="/templates" routerLinkActive="nav__link--active">
            Examples
          </a>
          <a class="nav__link" routerLink="/changelog" routerLinkActive="nav__link--active">
            Changelog
          </a>
        </div>

        <div class="nav__actions">
          <button
            class="nav__search"
            (click)="openSearch()"
            [attr.aria-label]="'nav.searchAria' | translate"
          >
            <svg
              width="15"
              height="15"
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
            <span class="nav__search-text">{{ 'nav.search' | translate }}</span>
            <kbd class="nav__search-kbd">⌘K</kbd>
          </button>

          <button
            class="nav__icon-btn"
            [attr.aria-label]="(theme.isDark() ? 'nav.lightMode' : 'nav.darkMode') | translate"
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
            class="nav__icon-btn"
            href="https://whatsapp.com/channel/0029Vb8PWpz1XquUOnGPUM2p"
            target="_blank"
            rel="noopener"
            [attr.aria-label]="'nav.whatsapp' | translate"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z"
              />
              <path
                d="M12 2C6.477 2 2 6.477 2 12c0 2.159.685 4.158 1.854 5.8L2.5 21.5l3.826-1.312A9.954 9.954 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.782 0-3.435-.468-4.869-1.284l-.349-.2-.228.078-2.259.775.789-2.203.084-.236-.217-.358A7.954 7.954 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"
              />
            </svg>
          </a>

          <!-- RTL Toggle Button -->
          <button
            class="nav__icon-btn"
            [attr.aria-label]="isRtl() ? 'Switch to LTR' : 'Switch to RTL'"
            (click)="toggleRtl()"
            [title]="isRtl() ? 'Switch to LTR' : 'Switch to RTL (Right-to-Left Preview)'"
          >
            <span style="font-size: 0.7rem; font-weight: 700; text-transform: uppercase;">
              {{ isRtl() ? 'LTR' : 'RTL' }}
            </span>
          </button>

          <a
            class="nav__icon-btn"
            href="https://github.com/NGXSMK/ngxsmk-ui-kit"
            target="_blank"
            [attr.aria-label]="'nav.github' | translate"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"
              />
            </svg>
          </a>

          <app-language-switcher />
        </div>
      </div>
    </nav>

    @if (mobileOpen()) {
      <div class="nav__mobile">
        <a class="nav__mobile-link" routerLink="/showcase/explorer" (click)="mobileOpen.set(false)">
          {{ 'nav.components' | translate }}
        </a>
        <a class="nav__mobile-link" routerLink="/docs" (click)="mobileOpen.set(false)">
          {{ 'nav.docs' | translate }}
        </a>
        <a
          class="nav__mobile-link"
          routerLink="/playground/component"
          (click)="mobileOpen.set(false)"
        >
          Playground
        </a>
        <a class="nav__mobile-link" routerLink="/themes" (click)="mobileOpen.set(false)">
          {{ 'nav.themes' | translate }}
        </a>
        <a class="nav__mobile-link" routerLink="/templates" (click)="mobileOpen.set(false)">
          Examples
        </a>
        <a class="nav__mobile-link" routerLink="/changelog" (click)="mobileOpen.set(false)">
          Changelog
        </a>
        <a
          class="nav__mobile-link"
          href="https://whatsapp.com/channel/0029Vb8PWpz1XquUOnGPUM2p"
          target="_blank"
          rel="noopener"
          (click)="mobileOpen.set(false)"
        >
          {{ 'nav.whatsapp' | translate }}
        </a>
        <a
          class="nav__mobile-link"
          href="https://github.com/NGXSMK/ngxsmk-ui-kit"
          target="_blank"
          (click)="mobileOpen.set(false)"
        >
          {{ 'nav.github' | translate }}
        </a>
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
        </div>
      </div>
    }
  `,
  styles: `
    .nav {
      position: sticky;
      top: 0;
      z-index: var(--ngxsmk-z-sticky, 1100);
      border-bottom: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
      background: color-mix(in srgb, var(--ngxsmk-color-surface, #ffffff) 80%, transparent);
      backdrop-filter: saturate(1.5) blur(20px);
      -webkit-backdrop-filter: saturate(1.5) blur(20px);
    }

    .nav__inner {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 var(--ngxsmk-space-6, 1.5rem);
      height: 3.5rem;
      display: flex;
      align-items: center;
      gap: var(--ngxsmk-space-6, 1.5rem);
    }

    .nav__brand {
      display: flex;
      align-items: center;
      gap: var(--ngxsmk-space-2, 0.5rem);
      text-decoration: none;
      color: var(--ngxsmk-color-on-surface, #09090b);
      font-weight: 700;
      font-size: var(--ngxsmk-text-body-lg-size);
      flex-shrink: 0;
      font-family: 'Outfit', var(--ngxsmk-font-sans, system-ui), sans-serif;
    }

    .nav__logo {
      width: 1.5rem;
      height: 1.5rem;
      flex-shrink: 0;
    }

    .nav__wordmark {
      letter-spacing: -0.02em;
      font-weight: 800;
      display: flex;
      align-items: baseline;
      gap: 0.35rem;
    }

    .nav__wordmark-sub {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--ngxsmk-color-primary, #7c3aed);
      background: color-mix(in srgb, var(--ngxsmk-color-primary, #7c3aed) 10%, transparent);
      padding: 0.1rem 0.4rem;
      border-radius: var(--ngxsmk-radius-sm, 0.25rem);
      letter-spacing: 0.02em;
    }

    .nav__links {
      display: flex;
      align-items: center;
      gap: var(--ngxsmk-space-1, 0.25rem);
      margin-right: auto;
    }

    .nav__link {
      padding: var(--ngxsmk-space-1-5, 0.375rem) var(--ngxsmk-space-3, 0.75rem);
      border-radius: var(--ngxsmk-radius-md, 0.375rem);
      font-size: var(--ngxsmk-text-body-sm-size);
      font-weight: 500;
      text-decoration: none;
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
      transition:
        color 0.15s,
        background 0.15s;
    }

    .nav__link:hover {
      color: var(--ngxsmk-color-on-surface, #09090b);
      background: color-mix(in srgb, var(--ngxsmk-color-on-surface, #09090b) 4%, transparent);
    }

    .nav__link--active {
      color: var(--ngxsmk-color-on-surface, #09090b);
      background: color-mix(in srgb, var(--ngxsmk-color-on-surface, #09090b) 4%, transparent);
      font-weight: 600;
    }

    .nav__actions {
      display: flex;
      align-items: center;
      gap: var(--ngxsmk-space-1-5, 0.375rem);
      flex-shrink: 0;
      margin-left: auto;
    }

    /* Search pill */
    .nav__search {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      border: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
      background: var(--ngxsmk-color-surface-variant, #f4f4f5);
      border-radius: var(--ngxsmk-radius-lg, 0.5rem);
      padding: 0.375rem 0.625rem 0.375rem 0.75rem;
      height: 2.125rem;
      cursor: pointer;
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
      transition:
        background-color 0.15s,
        border-color 0.15s;
      min-width: 160px;
      text-align: left;
    }

    .nav__search:hover {
      background: var(--ngxsmk-color-surface-hover, #e4e4e7);
      border-color: color-mix(
        in srgb,
        var(--ngxsmk-color-outline) 60%,
        var(--ngxsmk-color-primary)
      );
    }

    .nav__search-text {
      font-size: var(--ngxsmk-text-body-sm-size);
      font-weight: 500;
      flex: 1;
    }

    .nav__search-kbd {
      font-family: inherit;
      font-size: var(--ngxsmk-text-body-xs-size);
      opacity: 0.6;
      border: 1px solid var(--ngxsmk-color-outline);
      padding: 0.1rem 0.35rem;
      border-radius: var(--ngxsmk-radius-sm);
      line-height: 1;
    }

    .nav__icon-btn {
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

    .nav__icon-btn:hover {
      color: var(--ngxsmk-color-on-surface, #09090b);
      background: color-mix(in srgb, var(--ngxsmk-color-on-surface, #09090b) 4%, transparent);
    }

    /* Command Palette Overlay */
    .cmd-overlay {
      position: fixed;
      inset: 0;
      z-index: var(--ngxsmk-z-modal, 1400);
      background: rgba(9, 9, 11, 0.4);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding: 10vh 1rem 1rem;
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
      max-width: 560px;
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
      border: none !important;
      outline: none !important;
      background: transparent !important;
      padding: 0 !important;
      border-radius: 0 !important;
      box-shadow: none !important;
      font-size: var(--ngxsmk-text-body-md-size);
      font-family: inherit;
      color: var(--ngxsmk-color-on-surface, #09090b);
    }

    .cmd-input:focus {
      border: none !important;
      outline: none !important;
      box-shadow: none !important;
    }

    .cmd-input::placeholder {
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
    }

    .cmd-esc {
      font-size: var(--ngxsmk-text-body-xs-size);
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
      font-size: var(--ngxsmk-text-body-md-size);
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
      font-size: var(--ngxsmk-text-body-sm-size);
      opacity: 0.7;
    }

    .cmd-item-name {
      font-weight: 500;
    }

    .cmd-item-cat {
      font-size: var(--ngxsmk-text-body-sm-size);
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
      font-size: var(--ngxsmk-text-body-md-size);
    }

    .nav__menu-btn {
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

    .nav__menu-btn:hover {
      color: var(--ngxsmk-color-on-surface, #09090b);
      background: color-mix(in srgb, var(--ngxsmk-color-on-surface, #09090b) 4%, transparent);
    }

    .nav__mobile {
      position: absolute;
      top: 3.5rem;
      left: 0;
      right: 0;
      display: flex;
      flex-direction: column;
      gap: 0.125rem;
      padding: var(--ngxsmk-space-2, 0.5rem);
      max-height: calc(100dvh - 3.5rem);
      overflow-y: auto;
      background: var(--ngxsmk-color-surface, #ffffff);
      border-bottom: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
      box-shadow: var(--ngxsmk-shadow-lg, 0 20px 25px -5px rgba(0, 0, 0, 0.1));
      z-index: var(--ngxsmk-z-sticky, 1100);
    }

    .nav__mobile-link {
      padding: var(--ngxsmk-space-3, 0.75rem);
      border-radius: var(--ngxsmk-radius-md, 0.375rem);
      font-size: var(--ngxsmk-text-body-md-size);
      font-weight: 500;
      text-decoration: none;
      color: var(--ngxsmk-color-on-surface, #09090b);
    }

    .nav__mobile-link:hover {
      background: color-mix(in srgb, var(--ngxsmk-color-on-surface, #09090b) 4%, transparent);
    }

    @media (max-width: 768px) {
      .nav__links {
        display: none;
      }
      .nav__menu-btn {
        display: inline-flex;
      }
    }

    @media (max-width: 640px) {
      .nav__inner {
        padding: 0 var(--ngxsmk-space-4, 1rem);
        gap: var(--ngxsmk-space-3, 0.75rem);
      }
      .nav__search {
        min-width: 0;
        padding: 0;
        justify-content: center;
        width: 2rem;
        border: none;
        background: transparent;
      }
      .nav__search:hover {
        background: color-mix(in srgb, var(--ngxsmk-color-on-surface, #09090b) 4%, transparent);
      }
      .nav__search-text,
      .nav__search-kbd {
        display: none;
      }
    }

    @media (max-width: 480px) {
      a.nav__icon-btn {
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
  protected readonly isRtl = signal(false);

  toggleRtl(): void {
    this.isRtl.update((v) => !v);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('dir', this.isRtl() ? 'rtl' : 'ltr');
    }
  }

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
