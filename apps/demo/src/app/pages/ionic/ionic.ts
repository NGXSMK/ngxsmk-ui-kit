import { Component, computed, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ionicVarsAdapter, resolveTheme } from '@ngxsmk/theme';
import { AppNav } from '../../nav/nav';

interface Swatch {
  role: string;
  base: string;
  contrast: string;
  shade: string;
  tint: string;
}

const ROLES = [
  'primary',
  'secondary',
  'tertiary',
  'success',
  'warning',
  'danger',
  'medium',
  'light',
  'dark',
];

const SETUP_SNIPPET = `import { bootstrapApplication } from '@angular/platform-browser';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { provideNgxsmkIonic } from '@ngxsmk/core/ionic';

bootstrapApplication(AppComponent, {
  providers: [provideIonicAngular(), provideNgxsmkIonic()],
});`;

const THEME_SNIPPET = `import { inject } from '@angular/core';
import { NgxThemeInjectorService } from '@ngxsmk/theme';

const themes = inject(NgxThemeInjectorService);
themes.applyIonicTheme({ brand: { primary: '#7C3AED' } });`;

/**
 * Documents the Ionic integration and renders the `--ion-*` variables the token
 * adapter actually produces, computed live from a brand color. Nothing here
 * requires Ionic to be installed — the adapter is pure token math.
 */
@Component({
  selector: 'ionic-page',
  standalone: true,
  imports: [AppNav, TranslatePipe],
  template: `
    <app-nav />

    <div class="ion-page-wrap">
      <header class="ion-hero">
        <span class="ion-hero__pill">{{ 'ionic.pill' | translate }}</span>
        <h1 class="ion-hero__title">{{ 'ionic.title' | translate }}</h1>
        <p class="ion-hero__sub">{{ 'ionic.subtitle' | translate }}</p>
      </header>

      <section class="ion-section">
        <h2>{{ 'ionic.setupTitle' | translate }}</h2>
        <p class="ion-lede">{{ 'ionic.setupBody' | translate }}</p>
        <pre class="ion-code"><code>{{ setupSnippet }}</code></pre>

        <ul class="ion-list">
          <li>{{ 'ionic.setupScroll' | translate }}</li>
          <li>{{ 'ionic.setupOverlay' | translate }}</li>
          <li>{{ 'ionic.setupSpinner' | translate }}</li>
          <li>{{ 'ionic.setupSafeArea' | translate }}</li>
        </ul>
      </section>

      <section class="ion-section">
        <h2>{{ 'ionic.themeTitle' | translate }}</h2>
        <p class="ion-lede">{{ 'ionic.themeBody' | translate }}</p>
        <pre class="ion-code"><code>{{ themeSnippet }}</code></pre>

        <label class="ion-brand">
          <span>{{ 'ionic.brandLabel' | translate }}</span>
          <input type="color" [value]="brand()" (input)="onBrand($event)" />
          <code>{{ brand() }}</code>
        </label>
      </section>

      <section class="ion-section">
        <h2>{{ 'ionic.rolesTitle' | translate }}</h2>
        <p class="ion-lede">{{ 'ionic.rolesBody' | translate }}</p>

        <div class="ion-roles">
          @for (s of swatches(); track s.role) {
            <div class="ion-role">
              <div class="ion-role__bar" [style.background]="s.base" [style.color]="s.contrast">
                {{ s.role }}
              </div>
              <div class="ion-role__ramp">
                <span [style.background]="s.shade" [title]="s.shade"></span>
                <span [style.background]="s.base" [title]="s.base"></span>
                <span [style.background]="s.tint" [title]="s.tint"></span>
              </div>
              <code class="ion-role__hex">{{ s.base }}</code>
            </div>
          }
        </div>
      </section>

      <section class="ion-section">
        <h2>{{ 'ionic.stepsTitle' | translate }}</h2>
        <p class="ion-lede">{{ 'ionic.stepsBody' | translate }}</p>

        <div class="ion-steps">
          @for (mode of ['light', 'dark']; track mode) {
            <div class="ion-steps__row">
              <span class="ion-steps__label">{{ mode }}</span>
              <div class="ion-steps__ladder">
                @for (step of steps(mode); track step.stop) {
                  <span
                    class="ion-steps__cell"
                    [style.background]="step.hex"
                    [title]="'--ion-color-step-' + step.stop + ': ' + step.hex"
                  ></span>
                }
              </div>
            </div>
          }
        </div>
      </section>
    </div>
  `,
  styles: `
    .ion-page-wrap {
      max-width: 68rem;
      margin: 0 auto;
      padding: var(--ngxsmk-space-8) var(--ngxsmk-space-6) var(--ngxsmk-space-12);
      font-family: var(--ngxsmk-font-sans);
      color: var(--ngxsmk-color-on-background);
    }
    .ion-hero {
      padding: var(--ngxsmk-space-10) 0 var(--ngxsmk-space-8);
    }
    .ion-hero__pill {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: var(--ngxsmk-radius-full, 999px);
      background: var(--ngxsmk-color-primary-container);
      color: var(--ngxsmk-color-on-primary-container);
      font-size: var(--ngxsmk-text-label-sm-size);
    }
    .ion-hero__title {
      margin: var(--ngxsmk-space-4) 0 var(--ngxsmk-space-3);
      font-size: var(--ngxsmk-text-display-sm-size);
      line-height: var(--ngxsmk-text-display-sm-line);
    }
    .ion-hero__sub,
    .ion-lede {
      color: var(--ngxsmk-color-on-surface-variant);
      max-width: 46rem;
    }
    .ion-section {
      margin-top: var(--ngxsmk-space-10);
    }
    .ion-section h2 {
      font-size: var(--ngxsmk-text-headline-sm-size);
      margin-bottom: var(--ngxsmk-space-2);
    }
    .ion-code {
      margin-top: var(--ngxsmk-space-4);
      padding: var(--ngxsmk-space-4);
      border-radius: var(--ngxsmk-radius-lg);
      background: var(--ngxsmk-color-surface-container);
      border: 1px solid var(--ngxsmk-color-outline);
      overflow-x: auto;
      font-family: var(--ngxsmk-font-mono);
      font-size: var(--ngxsmk-text-body-sm-size);
    }
    .ion-list {
      margin-top: var(--ngxsmk-space-4);
      padding-left: var(--ngxsmk-space-5);
      color: var(--ngxsmk-color-on-surface-variant);
      display: grid;
      gap: var(--ngxsmk-space-2);
    }
    .ion-brand {
      display: flex;
      align-items: center;
      gap: var(--ngxsmk-space-3);
      margin-top: var(--ngxsmk-space-5);
      font-size: var(--ngxsmk-text-label-md-size);
    }
    .ion-brand input {
      inline-size: 3rem;
      block-size: 2rem;
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-md);
      background: none;
    }
    .ion-roles {
      margin-top: var(--ngxsmk-space-5);
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(11rem, 100%), 1fr));
      gap: var(--ngxsmk-space-4);
    }
    .ion-role {
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-lg);
      overflow: hidden;
    }
    .ion-role__bar {
      padding: var(--ngxsmk-space-3);
      font-size: var(--ngxsmk-text-label-md-size);
      font-weight: 600;
    }
    .ion-role__ramp {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      block-size: 1.25rem;
    }
    .ion-role__hex {
      display: block;
      padding: var(--ngxsmk-space-2) var(--ngxsmk-space-3);
      font-family: var(--ngxsmk-font-mono);
      font-size: var(--ngxsmk-text-body-xs-size);
      color: var(--ngxsmk-color-on-surface-variant);
    }
    .ion-steps {
      margin-top: var(--ngxsmk-space-5);
      display: grid;
      gap: var(--ngxsmk-space-4);
    }
    .ion-steps__row {
      display: grid;
      gap: var(--ngxsmk-space-2);
    }
    .ion-steps__label {
      font-size: var(--ngxsmk-text-label-sm-size);
      color: var(--ngxsmk-color-on-surface-variant);
      text-transform: uppercase;
      letter-spacing: var(--ngxsmk-tracking-wide);
    }
    .ion-steps__ladder {
      display: grid;
      grid-template-columns: repeat(19, minmax(0, 1fr));
      block-size: 2.5rem;
      border-radius: var(--ngxsmk-radius-md);
      overflow: hidden;
      border: 1px solid var(--ngxsmk-color-outline);
    }
  `,
})
export class IonicPage {
  readonly setupSnippet = SETUP_SNIPPET;
  readonly themeSnippet = THEME_SNIPPET;

  readonly brand = signal('#7C3AED');

  private readonly light = computed(() =>
    ionicVarsAdapter.vars(resolveTheme({ brand: { primary: this.brand() } })),
  );
  private readonly dark = computed(() =>
    ionicVarsAdapter.varsDark!(resolveTheme({ brand: { primary: this.brand() } })),
  );

  readonly swatches = computed<Swatch[]>(() => {
    const vars = this.light();
    return ROLES.map((role) => ({
      role,
      base: vars[`--ion-color-${role}`],
      contrast: vars[`--ion-color-${role}-contrast`],
      shade: vars[`--ion-color-${role}-shade`],
      tint: vars[`--ion-color-${role}-tint`],
    }));
  });

  steps(mode: string): { stop: number; hex: string }[] {
    const vars = mode === 'dark' ? this.dark() : this.light();
    return Array.from({ length: 19 }, (_, i) => {
      const stop = (i + 1) * 50;
      return { stop, hex: vars[`--ion-color-step-${stop}`] };
    });
  }

  onBrand(event: Event): void {
    this.brand.set((event.target as HTMLInputElement).value);
  }
}
