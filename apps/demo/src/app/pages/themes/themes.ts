import { NgxsmkButton } from '@ngxsmk/core/button';
import { NgxsmkHeading } from '@ngxsmk/core/heading';
import { NgxsmkText } from '@ngxsmk/core/text';
import { NgxsmkBadge } from '@ngxsmk/core/badge';
import { Component, signal, inject, computed } from '@angular/core';
import { NgxsmkThemeService, presets } from '@ngxsmk/theme';
import { NgxsmkThemeBuilder } from '@ngxsmk/core/theme-builder';
import { TranslatePipe } from '@ngx-translate/core';
import { AppNav } from '../../nav/nav';
import { ShowcaseExample } from '../../showcase/showcase-example';

@Component({
  selector: 'themes-page',
  standalone: true,
  imports: [
    NgxsmkButton,
    NgxsmkHeading,
    NgxsmkText,
    NgxsmkBadge,
    NgxsmkThemeBuilder,
    ShowcaseExample,
    TranslatePipe,
    AppNav,
  ],
  template: `
    <app-nav />
    <div class="ngxsmk-page">
      <!-- HERO -->
      <header class="ngxsmk-page__hero">
        <div class="ngxsmk-page__hero-content">
          <ngxsmk-badge variant="primary">Theme Engine</ngxsmk-badge>
          <ngxsmk-heading level="h1">{{ 'themes.title' | translate }}</ngxsmk-heading>
          <ngxsmk-text variant="body" class="ngxsmk-page__sub">{{
            'themes.subtitle' | translate
          }}</ngxsmk-text>
          <div class="ngxsmk-page__hero-stats">
            <div class="ngxsmk-stat">
              <span class="ngxsmk-stat__value">150+</span>
              <span class="ngxsmk-stat__label">Design tokens</span>
            </div>
            <div class="ngxsmk-stat">
              <span class="ngxsmk-stat__value">4</span>
              <span class="ngxsmk-stat__label">Output formats</span>
            </div>
            <div class="ngxsmk-stat">
              <span class="ngxsmk-stat__value">∞</span>
              <span class="ngxsmk-stat__label">Possibilities</span>
            </div>
          </div>
        </div>
      </header>

      <!-- PRESET COLORS -->
      <section class="ngxsmk-section">
        <div class="ngxsmk-section__header">
          <ngxsmk-heading level="h2">{{ 'themes.presetColors' | translate }}</ngxsmk-heading>
          <ngxsmk-text variant="body" class="ngxsmk-section__desc">{{
            'themes.presetColorsDesc' | translate
          }}</ngxsmk-text>
        </div>
        <div class="ngxsmk-preset-grid">
          @for (preset of presetList; track preset.name) {
            <button
              class="ngxsmk-preset-card"
              [class.ngxsmk-preset-card--active]="activePreset() === preset.name"
              (click)="applyPreset(preset.name)"
            >
              <div class="ngxsmk-preset-card__swatches">
                <div class="ngxsmk-preset-card__swatch" [style.background]="preset.colors[0]"></div>
                <div class="ngxsmk-preset-card__swatch" [style.background]="preset.colors[1]"></div>
                <div class="ngxsmk-preset-card__swatch" [style.background]="preset.colors[2]"></div>
                <div class="ngxsmk-preset-card__swatch" [style.background]="preset.colors[3]"></div>
              </div>
              <span class="ngxsmk-preset-card__name">{{ preset.name }}</span>
            </button>
          }
        </div>
      </section>

      <!-- MODE SWITCHING -->
      <section class="ngxsmk-section">
        <div class="ngxsmk-section__header">
          <ngxsmk-heading level="h2">{{ 'themes.modeSwitching' | translate }}</ngxsmk-heading>
          <ngxsmk-text variant="body" class="ngxsmk-section__desc">{{
            'themes.modeSwitchingDesc' | translate
          }}</ngxsmk-text>
        </div>
        <div class="ngxsmk-mode-toggle">
          <button
            class="ngxsmk-mode-btn"
            [class.ngxsmk-mode-btn--active]="currentMode() === 'light'"
            (click)="setMode('light')"
          >
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
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
            {{ 'themes.light' | translate }}
          </button>
          <button
            class="ngxsmk-mode-btn"
            [class.ngxsmk-mode-btn--active]="currentMode() === 'dark'"
            (click)="setMode('dark')"
          >
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
            {{ 'themes.dark' | translate }}
          </button>
          <button
            class="ngxsmk-mode-btn"
            [class.ngxsmk-mode-btn--active]="currentMode() === 'system'"
            (click)="setMode('system')"
          >
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
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
            {{ 'themes.system' | translate }}
          </button>
        </div>
      </section>

      <!-- COLOR PALETTE -->
      <section class="ngxsmk-section">
        <div class="ngxsmk-section__header">
          <ngxsmk-heading level="h2">Color Palette</ngxsmk-heading>
          <ngxsmk-text variant="body" class="ngxsmk-section__desc">
            Live token visualization — see how your theme tokens compose into a full color system.
          </ngxsmk-text>
        </div>
        <div class="ngxsmk-palette-grid">
          @for (swatch of colorPalette(); track swatch.name) {
            <div class="ngxsmk-swatch">
              <div class="ngxsmk-swatch__color" [style.background]="swatch.value"></div>
              <div class="ngxsmk-swatch__info">
                <span class="ngxsmk-swatch__name">{{ swatch.name }}</span>
                <span class="ngxsmk-swatch__value">{{ swatch.value }}</span>
                <span class="ngxsmk-swatch__token">{{ swatch.token }}</span>
              </div>
            </div>
          }
        </div>
      </section>

      <!-- TYPOGRAPHY -->
      <section class="ngxsmk-section">
        <div class="ngxsmk-section__header">
          <ngxsmk-heading level="h2">Typography Scale</ngxsmk-heading>
          <ngxsmk-text variant="body" class="ngxsmk-section__desc">
            The modular type scale used across all components. Adjust the scale ratio to see how it
            affects the hierarchy.
          </ngxsmk-text>
        </div>
        <div class="ngxsmk-type-grid">
          @for (item of typeScale(); track item.name) {
            <div class="ngxsmk-type-item">
              <span class="ngxsmk-type-item__size">{{ item.raw }}</span>
              <div class="ngxsmk-type-item__preview" [style.font-size]="item.raw">
                <span class="ngxsmk-type-item__label">{{ item.name }}</span>
              </div>
              <span class="ngxsmk-type-item__token">{{ item.token }}</span>
            </div>
          }
        </div>
      </section>

      <!-- SPACING -->
      <section class="ngxsmk-section">
        <div class="ngxsmk-section__header">
          <ngxsmk-heading level="h2">Spacing System</ngxsmk-heading>
          <ngxsmk-text variant="body" class="ngxsmk-section__desc">
            Consistent spacing tokens from micro (0.125rem) to macro (4rem).
          </ngxsmk-text>
        </div>
        <div class="ngxsmk-spacing-grid">
          @for (space of spacingTokens; track space.name) {
            <div class="ngxsmk-spacing-item">
              <div class="ngxsmk-spacing-item__bar" [style.width]="space.px + 'px'"></div>
              <div class="ngxsmk-spacing-item__info">
                <span class="ngxsmk-spacing-item__name">{{ space.name }}</span>
                <span class="ngxsmk-spacing-item__value">{{ space.rem }}</span>
              </div>
            </div>
          }
        </div>
      </section>

      <!-- BORDER RADIUS -->
      <section class="ngxsmk-section">
        <div class="ngxsmk-section__header">
          <ngxsmk-heading level="h2">Border Radius</ngxsmk-heading>
          <ngxsmk-text variant="body" class="ngxsmk-section__desc">
            Corner radius tokens from sharp to pill shapes.
          </ngxsmk-text>
        </div>
        <div class="ngxsmk-radius-grid">
          @for (r of radiusTokens; track r.name) {
            <div class="ngxsmk-radius-item">
              <div class="ngxsmk-radius-item__box" [style.border-radius]="r.px + 'px'"></div>
              <span class="ngxsmk-radius-item__name">{{ r.name }}</span>
              <span class="ngxsmk-radius-item__value">{{ r.px }}px</span>
            </div>
          }
        </div>
      </section>

      <!-- TOKEN REFERENCE -->
      <section class="ngxsmk-section">
        <div class="ngxsmk-section__header">
          <ngxsmk-heading level="h2">Token Reference</ngxsmk-heading>
          <ngxsmk-text variant="body" class="ngxsmk-section__desc">
            Complete list of all active CSS custom properties driving the current theme.
          </ngxsmk-text>
        </div>
        <div class="ngxsmk-token-table-wrap">
          <table class="ngxsmk-token-table">
            <thead>
              <tr>
                <th>Token</th>
                <th>Value</th>
                <th>Preview</th>
              </tr>
            </thead>
            <tbody>
              @for (token of tokenReference(); track token.name) {
                <tr>
                  <td>
                    <code>{{ token.name }}</code>
                  </td>
                  <td>
                    <code>{{ token.value }}</code>
                  </td>
                  <td>
                    @if (token.type === 'color') {
                      <div
                        class="ngxsmk-token-preview ngxsmk-token-preview--color"
                        [style.background]="token.value"
                      ></div>
                    } @else if (token.type === 'radius') {
                      <div
                        class="ngxsmk-token-preview ngxsmk-token-preview--radius"
                        [style.border-radius]="token.value"
                      ></div>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </section>

      <!-- IONIC ADAPTER -->
      <showcase-example
        title="Ionic Theme Adapter"
        [description]="'themes.ionicAdapterDesc' | translate"
        [code]="codeIonicAdapter"
      >
        <div class="ngxsmk-sc-surface">
          <p class="ngxsmk-ionic-hint">{{ 'themes.ionicAdapterHint' | translate }}</p>
          <div class="ngxsmk-theme-actions">
            <button ngxsmk-button size="sm" (click)="applyIonic()">
              {{ 'themes.applyIonic' | translate }}
            </button>
            <button ngxsmk-button size="sm" variant="outline" (click)="clearIonic()">
              {{ 'themes.clearIonic' | translate }}
            </button>
          </div>
          @if (ionicApplied()) {
            <p class="ngxsmk-ionic-active">{{ 'themes.ionicActive' | translate }}</p>
          }
        </div>
      </showcase-example>

      <!-- THEME BUILDER -->
      <div class="ngxsmk-theme-builder-wrapper">
        <ngxsmk-theme-builder />
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      background-color: var(--ngxsmk-color-background, #fafafa);
      background-image: radial-gradient(var(--ngxsmk-color-outline, #e4e4e7) 1px, transparent 1px);
      background-size: 24px 24px;
      min-height: 100%;
    }

    .ngxsmk-page {
      max-width: 1200px;
      margin: 0 auto;
      padding: var(--ngxsmk-space-8, 2rem) var(--ngxsmk-space-6, 1.5rem);
    }

    /* HERO */
    .ngxsmk-page__hero {
      text-align: center;
      padding: var(--ngxsmk-space-12, 3rem) 0 var(--ngxsmk-space-10, 2.5rem);
    }

    .ngxsmk-page__hero-content {
      max-width: 640px;
      margin: 0 auto;
    }

    .ngxsmk-page__hero h1,
    .ngxsmk-page__hero ngxsmk-heading {
      font-size: var(--ngxsmk-text-headline-lg-size);
      font-weight: 700;
      margin: var(--ngxsmk-space-3, 0.75rem) 0 var(--ngxsmk-space-3, 0.75rem);
      color: var(--ngxsmk-color-on-surface, #09090b);
    }

    .ngxsmk-page__sub {
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
      margin: 0 0 var(--ngxsmk-space-6, 1.5rem);
      font-size: var(--ngxsmk-text-body-lg-size);
      line-height: 1.6;
    }

    .ngxsmk-page__hero-stats {
      display: flex;
      justify-content: center;
      gap: var(--ngxsmk-space-8, 2rem);
    }

    .ngxsmk-stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--ngxsmk-space-1, 0.25rem);
    }

    .ngxsmk-stat__value {
      font-family: 'Outfit', var(--ngxsmk-font-sans, system-ui), sans-serif;
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--ngxsmk-color-primary, #7c3aed);
    }

    .ngxsmk-stat__label {
      font-size: var(--ngxsmk-text-body-sm-size);
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
    }

    /* SECTIONS */
    .ngxsmk-section {
      margin-bottom: var(--ngxsmk-space-10, 2.5rem);
    }

    .ngxsmk-section__header {
      margin-bottom: var(--ngxsmk-space-5, 1.25rem);
    }

    .ngxsmk-section__header ngxsmk-heading {
      font-size: var(--ngxsmk-text-headline-sm-size);
      font-weight: 700;
      margin: 0 0 var(--ngxsmk-space-2, 0.5rem);
      color: var(--ngxsmk-color-on-surface, #09090b);
    }

    .ngxsmk-section__desc {
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
      font-size: var(--ngxsmk-text-body-md-size);
      line-height: 1.6;
      margin: 0;
    }

    /* PRESET GRID */
    .ngxsmk-preset-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(14rem, 100%), 1fr));
      gap: var(--ngxsmk-space-4, 1rem);
    }

    .ngxsmk-preset-card {
      display: flex;
      flex-direction: column;
      gap: var(--ngxsmk-space-3, 0.75rem);
      padding: var(--ngxsmk-space-4, 1rem);
      border: 2px solid var(--ngxsmk-color-outline, #e4e4e7);
      border-radius: var(--ngxsmk-radius-lg, 0.5rem);
      background: var(--ngxsmk-color-surface, #ffffff);
      cursor: pointer;
      transition:
        border-color 0.15s,
        box-shadow 0.15s;
    }

    .ngxsmk-preset-card:hover {
      border-color: var(--ngxsmk-color-on-surface-variant, #71717a);
    }

    .ngxsmk-preset-card--active {
      border-color: var(--ngxsmk-color-primary, #7c3aed);
      box-shadow: 0 0 0 3px
        color-mix(in srgb, var(--ngxsmk-color-primary, #7c3aed) 15%, transparent);
    }

    .ngxsmk-preset-card__swatches {
      display: flex;
      gap: var(--ngxsmk-space-2, 0.5rem);
    }

    .ngxsmk-preset-card__swatch {
      flex: 1;
      height: 2.5rem;
      border-radius: var(--ngxsmk-radius-md, 0.375rem);
    }

    .ngxsmk-preset-card__name {
      font-size: var(--ngxsmk-text-body-sm-size);
      font-weight: 600;
      color: var(--ngxsmk-color-on-surface, #09090b);
      text-transform: capitalize;
    }

    /* MODE TOGGLE */
    .ngxsmk-mode-toggle {
      display: flex;
      gap: var(--ngxsmk-space-2, 0.5rem);
      background: var(--ngxsmk-color-surface-variant, #f4f4f5);
      padding: var(--ngxsmk-space-1, 0.25rem);
      border-radius: var(--ngxsmk-radius-lg, 0.5rem);
      width: fit-content;
    }

    .ngxsmk-mode-btn {
      display: inline-flex;
      align-items: center;
      gap: var(--ngxsmk-space-2, 0.5rem);
      padding: var(--ngxsmk-space-2, 0.5rem) var(--ngxsmk-space-4, 1rem);
      border: none;
      border-radius: var(--ngxsmk-radius-md, 0.375rem);
      background: transparent;
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
      font-family: inherit;
      font-size: var(--ngxsmk-text-body-sm-size);
      font-weight: 600;
      cursor: pointer;
      transition:
        background 0.15s,
        color 0.15s;
    }

    .ngxsmk-mode-btn:hover {
      color: var(--ngxsmk-color-on-surface, #09090b);
    }

    .ngxsmk-mode-btn--active {
      background: var(--ngxsmk-color-surface, #ffffff);
      color: var(--ngxsmk-color-on-surface, #09090b);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
    }

    /* COLOR PALETTE */
    .ngxsmk-palette-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(10rem, 100%), 1fr));
      gap: var(--ngxsmk-space-3, 0.75rem);
    }

    .ngxsmk-swatch {
      border: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
      border-radius: var(--ngxsmk-radius-md, 0.375rem);
      overflow: hidden;
      background: var(--ngxsmk-color-surface, #ffffff);
    }

    .ngxsmk-swatch__color {
      height: 3.5rem;
    }

    .ngxsmk-swatch__info {
      padding: var(--ngxsmk-space-2, 0.5rem) var(--ngxsmk-space-3, 0.75rem);
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
    }

    .ngxsmk-swatch__name {
      font-size: var(--ngxsmk-text-body-sm-size);
      font-weight: 600;
      color: var(--ngxsmk-color-on-surface, #09090b);
    }

    .ngxsmk-swatch__value {
      font-family: var(--ngxsmk-font-mono);
      font-size: 0.7rem;
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
    }

    .ngxsmk-swatch__token {
      font-family: var(--ngxsmk-font-mono);
      font-size: 0.65rem;
      color: var(--ngxsmk-color-primary, #7c3aed);
    }

    /* TYPOGRAPHY */
    .ngxsmk-type-grid {
      display: flex;
      flex-direction: column;
      gap: var(--ngxsmk-space-3, 0.75rem);
    }

    .ngxsmk-type-item {
      display: flex;
      align-items: center;
      gap: var(--ngxsmk-space-4, 1rem);
      padding: var(--ngxsmk-space-3, 0.75rem) var(--ngxsmk-space-4, 1rem);
      border: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
      border-radius: var(--ngxsmk-radius-md, 0.375rem);
      background: var(--ngxsmk-color-surface, #ffffff);
    }

    .ngxsmk-type-item__size {
      width: 3rem;
      font-family: var(--ngxsmk-font-mono);
      font-size: var(--ngxsmk-text-body-sm-size);
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
      text-align: right;
      flex-shrink: 0;
    }

    .ngxsmk-type-item__preview {
      flex: 1;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .ngxsmk-type-item__label {
      font-family: 'Outfit', var(--ngxsmk-font-sans, system-ui), sans-serif;
      font-weight: 600;
      color: var(--ngxsmk-color-on-surface, #09090b);
    }

    .ngxsmk-type-item__token {
      font-family: var(--ngxsmk-font-mono);
      font-size: 0.7rem;
      color: var(--ngxsmk-color-primary, #7c3aed);
      flex-shrink: 0;
    }

    /* SPACING */
    .ngxsmk-spacing-grid {
      display: flex;
      flex-direction: column;
      gap: var(--ngxsmk-space-2, 0.5rem);
    }

    .ngxsmk-spacing-item {
      display: flex;
      align-items: center;
      gap: var(--ngxsmk-space-3, 0.75rem);
    }

    .ngxsmk-spacing-item__bar {
      height: 1.25rem;
      background: var(--ngxsmk-color-primary, #7c3aed);
      border-radius: var(--ngxsmk-radius-sm, 0.25rem);
      opacity: 0.7;
      min-width: 2px;
    }

    .ngxsmk-spacing-item__info {
      display: flex;
      gap: var(--ngxsmk-space-3, 0.75rem);
      align-items: baseline;
      min-width: 10rem;
    }

    .ngxsmk-spacing-item__name {
      font-size: var(--ngxsmk-text-body-sm-size);
      font-weight: 600;
      color: var(--ngxsmk-color-on-surface, #09090b);
    }

    .ngxsmk-spacing-item__value {
      font-family: var(--ngxsmk-font-mono);
      font-size: 0.75rem;
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
    }

    /* RADIUS */
    .ngxsmk-radius-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(8rem, 100%), 1fr));
      gap: var(--ngxsmk-space-4, 1rem);
    }

    .ngxsmk-radius-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--ngxsmk-space-2, 0.5rem);
    }

    .ngxsmk-radius-item__box {
      width: 4rem;
      height: 4rem;
      border: 2px solid var(--ngxsmk-color-primary, #7c3aed);
      background: color-mix(in srgb, var(--ngxsmk-color-primary, #7c3aed) 8%, transparent);
    }

    .ngxsmk-radius-item__name {
      font-size: var(--ngxsmk-text-body-sm-size);
      font-weight: 600;
      color: var(--ngxsmk-color-on-surface, #09090b);
    }

    .ngxsmk-radius-item__value {
      font-family: var(--ngxsmk-font-mono);
      font-size: 0.75rem;
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
    }

    /* TOKEN TABLE */
    .ngxsmk-token-table-wrap {
      overflow-x: auto;
      border: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
      border-radius: var(--ngxsmk-radius-lg, 0.5rem);
      background: var(--ngxsmk-color-surface, #ffffff);
    }

    .ngxsmk-token-table {
      width: 100%;
      border-collapse: collapse;
      font-size: var(--ngxsmk-text-body-sm-size);
    }

    .ngxsmk-token-table th,
    .ngxsmk-token-table td {
      text-align: left;
      padding: var(--ngxsmk-space-2, 0.5rem) var(--ngxsmk-space-3, 0.75rem);
      border-bottom: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
    }

    .ngxsmk-token-table th {
      font-weight: 600;
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
      background: var(--ngxsmk-color-surface-variant, #f4f4f5);
      position: sticky;
      top: 0;
    }

    .ngxsmk-token-table td code {
      font-family: var(--ngxsmk-font-mono);
      font-size: 0.8em;
    }

    .ngxsmk-token-preview--color {
      width: 2rem;
      height: 1.25rem;
      border-radius: var(--ngxsmk-radius-sm, 0.25rem);
      border: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
    }

    .ngxsmk-token-preview--radius {
      width: 2rem;
      height: 2rem;
      border: 2px solid var(--ngxsmk-color-primary, #7c3aed);
      background: color-mix(in srgb, var(--ngxsmk-color-primary, #7c3aed) 8%, transparent);
    }

    /* MISC */
    .ngxsmk-theme-actions {
      display: flex;
      gap: var(--ngxsmk-space-2, 0.5rem);
      margin-top: var(--ngxsmk-space-3, 0.75rem);
    }

    .ngxsmk-ionic-hint {
      margin: 0 0 var(--ngxsmk-space-3, 0.75rem);
      font-size: var(--ngxsmk-text-body-md-size);
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
    }

    .ngxsmk-ionic-active {
      margin: var(--ngxsmk-space-3, 0.75rem) 0 0;
      font-size: var(--ngxsmk-text-body-sm-size);
      color: var(--ngxsmk-color-success, #16a34a);
    }

    showcase-example {
      margin-top: var(--ngxsmk-space-6, 1.5rem);
    }

    .ngxsmk-theme-builder-wrapper {
      margin-top: var(--ngxsmk-space-8, 2rem);
    }

    @media (max-width: 640px) {
      .ngxsmk-page__hero-stats {
        flex-direction: column;
        gap: var(--ngxsmk-space-4, 1rem);
      }

      .ngxsmk-preset-grid {
        grid-template-columns: 1fr 1fr;
      }

      .ngxsmk-mode-toggle {
        width: 100%;
      }

      .ngxsmk-mode-btn {
        flex: 1;
        justify-content: center;
      }
    }
  `,
})
export class ThemesPage {
  protected readonly theme = inject(NgxsmkThemeService);
  protected readonly presets = presets;
  protected readonly ionicApplied = signal(false);
  protected readonly activePreset = signal('violet');
  protected readonly currentMode = signal<'light' | 'dark' | 'system'>('light');

  protected readonly presetList = [
    { name: 'violet', colors: ['#7c3aed', '#ede9fe', '#4c1d95', '#f5f3ff'] },
    { name: 'emerald', colors: ['#10b981', '#d1fae5', '#065f40', '#ecfdf5'] },
    { name: 'rose', colors: ['#f43f5e', '#ffe4e6', '#9f1239', '#fff1f2'] },
    { name: 'amber', colors: ['#f59e0b', '#fef3c7', '#92400e', '#fffbeb'] },
    { name: 'blue', colors: ['#3b82f6', '#dbeafe', '#1e40af', '#eff6ff'] },
    { name: 'neutral', colors: ['#71717a', '#f4f4f5', '#27272a', '#fafafa'] },
  ];

  protected readonly colorPalette = computed(() => [
    {
      name: 'Primary',
      value: this.getComputed('--ngxsmk-color-primary', '#7c3aed'),
      token: '--ngxsmk-color-primary',
      type: 'color',
    },
    {
      name: 'On Primary',
      value: this.getComputed('--ngxsmk-color-on-primary', '#ffffff'),
      token: '--ngxsmk-color-on-primary',
      type: 'color',
    },
    {
      name: 'Primary Container',
      value: this.getComputed('--ngxsmk-color-primary-container', '#ede9fe'),
      token: '--ngxsmk-color-primary-container',
      type: 'color',
    },
    {
      name: 'Surface',
      value: this.getComputed('--ngxsmk-color-surface', '#ffffff'),
      token: '--ngxsmk-color-surface',
      type: 'color',
    },
    {
      name: 'Background',
      value: this.getComputed('--ngxsmk-color-background', '#fafafa'),
      token: '--ngxsmk-color-background',
      type: 'color',
    },
    {
      name: 'On Surface',
      value: this.getComputed('--ngxsmk-color-on-surface', '#09090b'),
      token: '--ngxsmk-color-on-surface',
      type: 'color',
    },
    {
      name: 'Outline',
      value: this.getComputed('--ngxsmk-color-outline', '#e4e4e7'),
      token: '--ngxsmk-color-outline',
      type: 'color',
    },
    {
      name: 'Error',
      value: this.getComputed('--ngxsmk-color-error', '#ef4444'),
      token: '--ngxsmk-color-error',
      type: 'color',
    },
  ]);

  protected readonly typeScale = computed(() => {
    const items = [
      { name: 'Display', token: '--ngxsmk-text-display-size' },
      { name: 'Headline LG', token: '--ngxsmk-text-headline-lg-size' },
      { name: 'Headline MD', token: '--ngxsmk-text-headline-md-size' },
      { name: 'Headline SM', token: '--ngxsmk-text-headline-sm-size' },
      { name: 'Title LG', token: '--ngxsmk-text-title-lg-size' },
      { name: 'Title MD', token: '--ngxsmk-text-title-md-size' },
      { name: 'Body LG', token: '--ngxsmk-text-body-lg-size' },
      { name: 'Body MD', token: '--ngxsmk-text-body-md-size' },
      { name: 'Body SM', token: '--ngxsmk-text-body-sm-size' },
      { name: 'Body XS', token: '--ngxsmk-text-body-xs-size' },
    ];
    return items.map((item) => {
      const raw = this.getComputed(item.token, '1rem');
      const rem = parseFloat(raw) || 1;
      const px = Math.round(rem * 16);
      return { name: item.name, raw, px, token: item.token };
    });
  });

  protected readonly spacingTokens = [
    { name: 'space-0.5', rem: '0.125rem', px: 2 },
    { name: 'space-1', rem: '0.25rem', px: 4 },
    { name: 'space-1.5', rem: '0.375rem', px: 6 },
    { name: 'space-2', rem: '0.5rem', px: 8 },
    { name: 'space-3', rem: '0.75rem', px: 12 },
    { name: 'space-4', rem: '1rem', px: 16 },
    { name: 'space-5', rem: '1.25rem', px: 20 },
    { name: 'space-6', rem: '1.5rem', px: 24 },
    { name: 'space-8', rem: '2rem', px: 32 },
    { name: 'space-10', rem: '2.5rem', px: 40 },
    { name: 'space-12', rem: '3rem', px: 48 },
    { name: 'space-16', rem: '4rem', px: 64 },
  ];

  protected readonly radiusTokens = [
    { name: 'none', px: 0 },
    { name: 'sm', px: 2 },
    { name: 'base', px: 4 },
    { name: 'md', px: 6 },
    { name: 'lg', px: 8 },
    { name: 'xl', px: 12 },
    { name: '2xl', px: 16 },
    { name: 'full', px: 999 },
  ];

  protected readonly tokenReference = computed(() => {
    const tokens: { name: string; value: string; type: string }[] = [];
    if (typeof document === 'undefined') return tokens;
    const style = getComputedStyle(document.documentElement);
    const colorKeys = [
      '--ngxsmk-color-primary',
      '--ngxsmk-color-on-primary',
      '--ngxsmk-color-primary-container',
      '--ngxsmk-color-surface',
      '--ngxsmk-color-surface-variant',
      '--ngxsmk-color-background',
      '--ngxsmk-color-on-surface',
      '--ngxsmk-color-on-surface-variant',
      '--ngxsmk-color-on-background',
      '--ngxsmk-color-outline',
      '--ngxsmk-color-error',
      '--ngxsmk-color-success',
    ];
    const radiusKeys = [
      '--ngxsmk-radius-sm',
      '--ngxsmk-radius-md',
      '--ngxsmk-radius-lg',
      '--ngxsmk-radius-xl',
    ];

    for (const key of colorKeys) {
      const val = style.getPropertyValue(key).trim();
      if (val) tokens.push({ name: key, value: val, type: 'color' });
    }
    for (const key of radiusKeys) {
      const val = style.getPropertyValue(key).trim();
      if (val) tokens.push({ name: key, value: val, type: 'radius' });
    }
    return tokens;
  });

  protected getComputed(prop: string, fallback: string): string {
    if (typeof document === 'undefined') return fallback;
    return getComputedStyle(document.documentElement).getPropertyValue(prop).trim() || fallback;
  }

  protected applyPreset(name: string): void {
    this.activePreset.set(name);
    if (presets[name]) {
      this.theme.applyTheme(presets[name]);
    }
  }

  protected setMode(mode: 'light' | 'dark' | 'system'): void {
    this.currentMode.set(mode);
    this.theme.setMode(mode);
  }

  protected readonly codeIonicAdapter = `// Apply Ionic theme adapter alongside NGXSMK theme
this.theme.applyIonicTheme(presets['violet']);

// Or apply both NGXSMK + Ionic in one call
this.theme.applyTheme(presets['violet'], ionicVarsAdapter);

// Clear the Ionic adapter
this.theme.clearIonicTheme();`;

  protected applyIonic(): void {
    this.theme.applyIonicTheme(presets['violet']);
    this.ionicApplied.set(true);
  }

  protected clearIonic(): void {
    this.theme.clearIonicTheme();
    this.ionicApplied.set(false);
  }
}
