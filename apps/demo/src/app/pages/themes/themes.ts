import { NgxsmkCardContent, NgxsmkCardHeader, NgxsmkCardTitle, NgxsmkCard } from '@ngxsmk/core/card';
import { NgxsmkButton } from '@ngxsmk/core/button';
import { NgxsmkHeading } from '@ngxsmk/core/heading';
import { NgxsmkText } from '@ngxsmk/core/text';
import { Component, inject } from '@angular/core';
import { NgxsmkThemeService, presets } from '@ngxsmk/theme';
import { AppNav } from '../../nav/nav';

@Component({
  selector: 'themes-page',
  standalone: true,
  imports: [NgxsmkCard, NgxsmkCardContent, NgxsmkCardHeader, NgxsmkCardTitle, NgxsmkButton, NgxsmkHeading, NgxsmkText, AppNav],
  template: `
    <app-nav />
    <div class="ngxsmk-page">
      <header class="ngxsmk-page__header">
        <ngxsmk-heading level="h1">Theming</ngxsmk-heading>
        <ngxsmk-text variant="body" class="ngxsmk-page__sub">Customize the look and feel of your app at runtime using our robust theme and token system.</ngxsmk-text>
      </header>

      <div class="ngxsmk-themes-grid">
        <ngxsmk-card class="ngxsmk-theme-card">
          <div ngxsmkCardHeader>
            <ngxsmk-heading level="h3" ngxsmkCardTitle>Preset Colors</ngxsmk-heading>
          </div>
          <div ngxsmkCardContent>
            <ngxsmk-text variant="body" class="ngxsmk-theme-desc">Select one of our carefully curated, premium built-in color palettes to instantly change the vibe.</ngxsmk-text>
            <div class="ngxsmk-color-options">
              <button class="ngxsmk-color-btn ngxsmk-violet" (click)="theme.applyTheme(presets['violet'])" title="Violet"></button>
              <button class="ngxsmk-color-btn ngxsmk-emerald" (click)="theme.applyTheme(presets['emerald'])" title="Emerald"></button>
              <button class="ngxsmk-color-btn ngxsmk-rose" (click)="theme.applyTheme(presets['rose'])" title="Rose"></button>
              <button class="ngxsmk-color-btn ngxsmk-neutral" (click)="theme.applyTheme(presets['neutral'])" title="Neutral"></button>
            </div>
          </div>
        </ngxsmk-card>

        <ngxsmk-card class="ngxsmk-theme-card">
          <div ngxsmkCardHeader>
            <ngxsmk-heading level="h3" ngxsmkCardTitle>Mode Switching</ngxsmk-heading>
          </div>
          <div ngxsmkCardContent>
            <ngxsmk-text variant="body" class="ngxsmk-theme-desc">Toggle between Light, Dark, or System mode to test your application's appearance across different modes.</ngxsmk-text>
            <div class="ngxsmk-theme-actions">
              <button ngxsmk-button size="sm" (click)="theme.setMode('light')">Light</button>
              <button ngxsmk-button size="sm" (click)="theme.setMode('dark')">Dark</button>
              <button ngxsmk-button size="sm" variant="outline" (click)="theme.setMode('system')">System</button>
            </div>
          </div>
        </ngxsmk-card>
      </div>
    </div>
  `,
  styles: `
    .ngxsmk-page { max-width: 1400px; margin: 0 auto; padding: var(--ngxsmk-space-12,3rem) var(--ngxsmk-space-6,1.5rem); }
    .ngxsmk-page__header { margin-bottom: var(--ngxsmk-space-12,3rem); }
    .ngxsmk-page__header h1 { font-size: 2rem; font-weight: 700; margin: 0 0 var(--ngxsmk-space-2,0.5rem); color: var(--ngxsmk-color-on-surface,#09090b); }
    .ngxsmk-page__sub { color: var(--ngxsmk-color-on-surface-variant,#71717a); margin: 0; font-size: 1rem; }
    .ngxsmk-themes-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(min(22rem,100%),1fr)); gap: var(--ngxsmk-space-6,1.5rem); }
    .ngxsmk-theme-card { display: flex; flex-direction: column; height: 100%; }
    .ngxsmk-theme-desc { color: var(--ngxsmk-color-on-surface-variant,#71717a); font-size: 0.875rem; line-height: 1.6; margin: 0 0 var(--ngxsmk-space-4,1rem); }
    .ngxsmk-color-options { display: flex; gap: var(--ngxsmk-space-3,0.75rem); }
    .ngxsmk-color-btn { width: 2rem; height: 2rem; border-radius: 50%; border: 2px solid var(--ngxsmk-color-outline,#e4e4e7); cursor: pointer; transition: transform 0.15s; }
    .ngxsmk-color-btn:hover { transform: scale(1.1); }
    .ngxsmk-color-btn.ngxsmk-violet { background-color: #7c3aed; }
    .ngxsmk-color-btn.ngxsmk-emerald { background-color: #10b981; }
    .ngxsmk-color-btn.ngxsmk-rose { background-color: #f43f5e; }
    .ngxsmk-color-btn.ngxsmk-neutral { background-color: #71717a; }
    .ngxsmk-theme-actions { display: flex; gap: var(--ngxsmk-space-2,0.5rem); }
  `,
})
export class ThemesPage {
  protected readonly theme = inject(NgxsmkThemeService);
  protected readonly presets = presets;
}
