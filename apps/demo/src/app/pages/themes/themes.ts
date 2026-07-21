import {
  NgxsmkCardContent,
  NgxsmkCardHeader,
  NgxsmkCardTitle,
  NgxsmkCard,
} from '@ngxsmk/core/card';
import { NgxsmkButton } from '@ngxsmk/core/button';
import { NgxsmkHeading } from '@ngxsmk/core/heading';
import { NgxsmkText } from '@ngxsmk/core/text';
import { Component, signal, inject } from '@angular/core';
import { NgxsmkThemeService, presets } from '@ngxsmk/theme';
import { NgxsmkThemeBuilder } from '@ngxsmk/core/theme-builder';
import { TranslatePipe } from '@ngx-translate/core';
import { AppNav } from '../../nav/nav';
import { ShowcaseExample } from '../../showcase/showcase-example';

@Component({
  selector: 'themes-page',
  standalone: true,
  imports: [
    NgxsmkCard,
    NgxsmkCardContent,
    NgxsmkCardHeader,
    NgxsmkCardTitle,
    NgxsmkButton,
    NgxsmkHeading,
    NgxsmkText,
    NgxsmkThemeBuilder,
    ShowcaseExample,
    TranslatePipe,
    AppNav,
  ],
  template: `
    <app-nav />
    <div class="ngxsmk-page">
      <header class="ngxsmk-page__header">
        <ngxsmk-heading level="h1">{{ 'themes.title' | translate }}</ngxsmk-heading>
        <ngxsmk-text variant="body" class="ngxsmk-page__sub">{{
          'themes.subtitle' | translate
        }}</ngxsmk-text>
      </header>

      <div class="ngxsmk-themes-grid">
        <ngxsmk-card class="ngxsmk-theme-card">
          <div ngxsmkCardHeader>
            <ngxsmk-heading level="h3" ngxsmkCardTitle>{{
              'themes.presetColors' | translate
            }}</ngxsmk-heading>
          </div>
          <div ngxsmkCardContent>
            <ngxsmk-text variant="body" class="ngxsmk-theme-desc">{{
              'themes.presetColorsDesc' | translate
            }}</ngxsmk-text>
            <div class="ngxsmk-color-options">
              <button
                class="ngxsmk-color-btn ngxsmk-violet"
                (click)="theme.applyTheme(presets['violet'])"
                [title]="'themes.color.violet' | translate"
              ></button>
              <button
                class="ngxsmk-color-btn ngxsmk-emerald"
                (click)="theme.applyTheme(presets['emerald'])"
                [title]="'themes.color.emerald' | translate"
              ></button>
              <button
                class="ngxsmk-color-btn ngxsmk-rose"
                (click)="theme.applyTheme(presets['rose'])"
                [title]="'themes.color.rose' | translate"
              ></button>
              <button
                class="ngxsmk-color-btn ngxsmk-neutral"
                (click)="theme.applyTheme(presets['neutral'])"
                [title]="'themes.color.neutral' | translate"
              ></button>
            </div>
          </div>
        </ngxsmk-card>

        <ngxsmk-card class="ngxsmk-theme-card">
          <div ngxsmkCardHeader>
            <ngxsmk-heading level="h3" ngxsmkCardTitle>{{
              'themes.modeSwitching' | translate
            }}</ngxsmk-heading>
          </div>
          <div ngxsmkCardContent>
            <ngxsmk-text variant="body" class="ngxsmk-theme-desc">{{
              'themes.modeSwitchingDesc' | translate
            }}</ngxsmk-text>
            <div class="ngxsmk-theme-actions">
              <button ngxsmk-button size="sm" (click)="theme.setMode('light')">
                {{ 'themes.light' | translate }}
              </button>
              <button ngxsmk-button size="sm" (click)="theme.setMode('dark')">
                {{ 'themes.dark' | translate }}
              </button>
              <button ngxsmk-button size="sm" variant="outline" (click)="theme.setMode('system')">
                {{ 'themes.system' | translate }}
              </button>
            </div>
          </div>
        </ngxsmk-card>
      </div>

      <showcase-example
        title="Ionic Theme Adapter"
        [description]="'themes.ionicAdapterDesc' | translate"
        [code]="codeIonicAdapter"
      >
        <div class="ngxsmk-sc-surface">
          <p
            style="margin:0 0 1rem; font-size:var(--ngxsmk-text-body-md-size); color:var(--ngxsmk-color-on-surface-variant, #71717a);"
          >
            {{ 'themes.ionicAdapterHint' | translate }}
          </p>
          <div class="ngxsmk-theme-actions">
            <button ngxsmk-button size="sm" (click)="applyIonic()">
              {{ 'themes.applyIonic' | translate }}
            </button>
            <button ngxsmk-button size="sm" variant="outline" (click)="clearIonic()">
              {{ 'themes.clearIonic' | translate }}
            </button>
          </div>
          @if (ionicApplied()) {
            <p
              style="margin:0.75rem 0 0; font-size:var(--ngxsmk-text-body-sm-size); color:var(--ngxsmk-color-success, #16a34a);"
            >
              {{ 'themes.ionicActive' | translate }}
            </p>
          }
        </div>
      </showcase-example>

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
      min-height: 100vh;
    }
    .ngxsmk-page {
      max-width: 1400px;
      margin: 0 auto;
      padding: var(--ngxsmk-space-12, 3rem) var(--ngxsmk-space-6, 1.5rem);
    }
    .ngxsmk-page__header {
      margin-bottom: var(--ngxsmk-space-12, 3rem);
    }
    .ngxsmk-page__header h1,
    .ngxsmk-page__header ngxsmk-heading {
      font-size: var(--ngxsmk-text-headline-lg-size);
      font-weight: 700;
      margin: 0 0 var(--ngxsmk-space-2, 0.5rem);
      color: var(--ngxsmk-color-on-surface, #09090b);
    }
    .ngxsmk-page__sub {
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
      margin: 0;
      font-size: var(--ngxsmk-text-body-lg-size);
    }
    .ngxsmk-themes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(22rem, 100%), 1fr));
      gap: var(--ngxsmk-space-6, 1.5rem);
    }
    .ngxsmk-theme-card {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .ngxsmk-theme-desc {
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
      font-size: var(--ngxsmk-text-body-md-size);
      line-height: 1.6;
      margin: 0 0 var(--ngxsmk-space-4, 1rem);
    }
    .ngxsmk-color-options {
      display: flex;
      gap: var(--ngxsmk-space-3, 0.75rem);
    }
    .ngxsmk-color-btn {
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      border: 2px solid var(--ngxsmk-color-outline, #e4e4e7);
      cursor: pointer;
      transition: transform 0.15s;
    }
    .ngxsmk-color-btn:hover {
      transform: scale(1.1);
    }
    .ngxsmk-color-btn.ngxsmk-violet {
      background-color: #7c3aed;
    }
    .ngxsmk-color-btn.ngxsmk-emerald {
      background-color: #10b981;
    }
    .ngxsmk-color-btn.ngxsmk-rose {
      background-color: #f43f5e;
    }
    .ngxsmk-color-btn.ngxsmk-neutral {
      background-color: #71717a;
    }
    .ngxsmk-theme-actions {
      display: flex;
      gap: var(--ngxsmk-space-2, 0.5rem);
    }
    showcase-example {
      margin-top: var(--ngxsmk-space-6, 1.5rem);
    }
    .ngxsmk-theme-builder-wrapper {
      margin-top: var(--ngxsmk-space-8, 2rem);
    }
  `,
})
export class ThemesPage {
  protected readonly theme = inject(NgxsmkThemeService);
  protected readonly presets = presets;
  protected readonly ionicApplied = signal(false);

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
