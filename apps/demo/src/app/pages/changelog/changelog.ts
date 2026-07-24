import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { AppNav } from '../../nav/nav';
import { NgxsmkButton } from '@ngxsmk/core/button';
import { APP_VERSION } from '../../core/version';

interface Change {
  type: 'added' | 'fixed' | 'changed' | 'removed';
  text: string;
}

interface Release {
  version: string;
  date: string;
  summary: string;
  changes: Change[];
}

const TYPE_COLORS: Record<string, string> = {
  added: '#22c55e',
  fixed: '#f59e0b',
  changed: '#7c3aed',
  removed: '#ef4444',
};

@Component({
  selector: 'changelog-page',
  standalone: true,
  imports: [TitleCasePipe, AppNav, NgxsmkButton],
  template: `
    <app-nav />

    <div class="cl">
      <!-- ═══════════════ HERO ═══════════════ -->
      <header class="cl-hero">
        <div class="cl-hero__inner">
          <span class="cl-hero__pill">Changelog</span>
          <h1 class="cl-hero__title">What's new in NGXSMK</h1>
          <p class="cl-hero__sub">
            Every release, every breaking change, every fix — documented here. Currently at
            <strong>{{ currentVersion }}</strong
            >.
          </p>
          <div class="cl-hero__stats">
            <div class="cl-hero__stat">
              <span class="cl-hero__stat-val">{{ releases.length }}</span>
              <span class="cl-hero__stat-label">Releases</span>
            </div>
            <div class="cl-hero__stat">
              <span class="cl-hero__stat-val">{{ totalChanges }}</span>
              <span class="cl-hero__stat-label">Changes</span>
            </div>
            <div class="cl-hero__stat">
              <span class="cl-hero__stat-val">Apr '26</span>
              <span class="cl-hero__stat-label">Since</span>
            </div>
          </div>
        </div>
      </header>

      <!-- ═══════════════ FILTERS ═══════════════ -->
      <section class="cl-filters">
        <button
          class="cl-filter"
          [class.cl-filter--active]="activeFilter() === 'all'"
          (click)="activeFilter.set('all')"
        >
          All
        </button>
        @for (t of types; track t) {
          <button
            class="cl-filter"
            [class.cl-filter--active]="activeFilter() === t"
            (click)="activeFilter.set(t)"
          >
            <span class="cl-filter__dot" [style.background]="TYPE_COLORS[t]"></span>
            {{ t | titlecase }}
          </button>
        }
      </section>

      <!-- ═══════════════ TIMELINE ═══════════════ -->
      <section class="cl-timeline">
        <div class="cl-timeline__line"></div>

        @for (release of filteredReleases(); track release.version; let i = $index) {
          <article class="cl-release" [class.cl-release--first]="i === 0">
            <div class="cl-release__dot" [class.cl-release__dot--first]="i === 0"></div>

            <div class="cl-release__head">
              <div class="cl-release__version-row">
                <span class="cl-release__version">{{ release.version }}</span>
                @if (i === 0) {
                  <span class="cl-release__latest">Latest</span>
                }
              </div>
              <time class="cl-release__date">{{ formatDate(release.date) }}</time>
            </div>

            <p class="cl-release__summary">{{ release.summary }}</p>

            <ul class="cl-release__changes">
              @for (change of release.changes; track change.text) {
                <li class="cl-change">
                  <span
                    class="cl-change__type"
                    [style.background]="TYPE_COLORS[change.type] + '18'"
                    [style.color]="TYPE_COLORS[change.type]"
                  >
                    {{ change.type | titlecase }}
                  </span>
                  <span class="cl-change__text">{{ change.text }}</span>
                </li>
              }
            </ul>
          </article>
        }
      </section>

      <!-- ═══════════════ FOOTER CTA ═══════════════ -->
      <section class="cl-footer">
        <div class="cl-footer__card">
          <div class="cl-footer__icon">
            <svg viewBox="0 0 24 24" fill="none" width="28" height="28">
              <path
                d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.607.069-.607 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.03-2.683-.103-.253-.447-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.748-1.025 2.748-1.025.546 1.377.203 2.394.1 2.647.64.699 1.026 1.592 1.026 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"
                fill="currentColor"
              />
            </svg>
          </div>
          <h3 class="cl-footer__title">Follow along on GitHub</h3>
          <p class="cl-footer__sub">
            Open issues, contribute, or track upcoming releases in the public repository.
          </p>
          <a
            ngxsmk-button
            variant="outline"
            href="https://github.com/ngxsmk/ngxsmk-ui-kit"
            target="_blank"
            rel="noopener"
          >
            ngxsmk/ngxsmk-ui-kit
          </a>
        </div>
      </section>
    </div>
  `,
  styles: `
    :host {
      --cl-max: 760px;
      display: block;
      font-family: 'Inter', var(--ngxsmk-font-sans);
      color: var(--ngxsmk-color-on-background);
    }

    /* ═══════════════ HERO ═══════════════ */
    .cl-hero {
      position: relative;
      overflow: hidden;
      padding: clamp(4rem, 8vw, 6rem) var(--ngxsmk-space-6, 1.5rem) clamp(2.5rem, 5vw, 4rem);
      text-align: center;
      background-image: radial-gradient(var(--ngxsmk-color-outline, #e4e4e7) 1px, transparent 1px);
      background-size: 24px 24px;
    }
    .cl-hero::before {
      content: '';
      position: absolute;
      inset: 0;
      z-index: 0;
      pointer-events: none;
      background: radial-gradient(
        55% 55% at 50% 0%,
        color-mix(in srgb, var(--ngxsmk-color-primary) 12%, transparent),
        transparent 70%
      );
    }
    .cl-hero__inner {
      position: relative;
      z-index: 1;
      max-width: 38rem;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .cl-hero__pill {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.25rem 0.75rem;
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-full, 999px);
      background: color-mix(in srgb, var(--ngxsmk-color-surface) 60%, transparent);
      backdrop-filter: blur(6px);
      font-size: var(--ngxsmk-text-body-sm-size, 0.8125rem);
      font-weight: 600;
      color: var(--ngxsmk-color-on-surface);
      margin-bottom: var(--ngxsmk-space-4, 1rem);
      letter-spacing: 0.04em;
    }
    .cl-hero__title {
      font-family: 'Outfit', var(--ngxsmk-font-sans), system-ui, sans-serif;
      font-size: clamp(2rem, 5vw, 3rem);
      font-weight: 800;
      letter-spacing: -0.035em;
      line-height: 1.1;
      margin: 0 0 var(--ngxsmk-space-4, 1rem);
      background: linear-gradient(
        135deg,
        var(--ngxsmk-color-on-surface),
        var(--ngxsmk-color-on-surface-variant, #71717a)
      );
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .cl-hero__sub {
      font-size: var(--ngxsmk-text-body-lg-size, 1.0625rem);
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
      line-height: 1.65;
      margin: 0 0 var(--ngxsmk-space-6, 1.5rem);
      max-width: 34rem;
    }
    .cl-hero__sub strong {
      color: var(--ngxsmk-color-primary);
      font-weight: 700;
    }
    .cl-hero__stats {
      display: flex;
      gap: var(--ngxsmk-space-10, 2.5rem);
    }
    .cl-hero__stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.15rem;
    }
    .cl-hero__stat-val {
      font-family: 'Outfit', var(--ngxsmk-font-sans), system-ui, sans-serif;
      font-size: 1.5rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: var(--ngxsmk-color-on-surface);
    }
    .cl-hero__stat-label {
      font-size: var(--ngxsmk-text-body-xs-size, 0.75rem);
      font-weight: 500;
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    /* ═══════════════ FILTERS ═══════════════ */
    .cl-filters {
      max-width: var(--cl-max);
      margin: 0 auto;
      padding: var(--ngxsmk-space-6, 1.5rem) var(--ngxsmk-space-6, 1.5rem)
        var(--ngxsmk-space-6, 1.5rem);
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }
    .cl-filter {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.3rem 0.7rem;
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-full, 999px);
      background: var(--ngxsmk-color-surface, #fff);
      font-size: var(--ngxsmk-text-body-sm-size, 0.8125rem);
      font-weight: 500;
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .cl-filter:hover {
      border-color: var(--ngxsmk-color-primary);
      color: var(--ngxsmk-color-primary);
    }
    .cl-filter--active {
      background: var(--ngxsmk-color-primary);
      color: #fff;
      border-color: var(--ngxsmk-color-primary);
    }
    .cl-filter--active .cl-filter__dot {
      background: #fff !important;
    }
    .cl-filter__dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
    }

    /* ═══════════════ TIMELINE ═══════════════ */
    .cl-timeline {
      max-width: var(--cl-max);
      margin: 0 auto;
      padding: var(--ngxsmk-space-8, 2rem) var(--ngxsmk-space-6, 1.5rem);
      position: relative;
    }
    .cl-timeline__line {
      position: absolute;
      left: calc(var(--ngxsmk-space-6, 1.5rem) + 5px);
      top: var(--ngxsmk-space-8, 2rem);
      bottom: 0;
      width: 2px;
      background: var(--ngxsmk-color-outline, #e4e4e7);
    }

    /* ═══════════════ RELEASE CARD ═══════════════ */
    .cl-release {
      position: relative;
      padding-left: 2rem;
      padding-bottom: var(--ngxsmk-space-8, 2rem);
    }
    .cl-release:last-child {
      padding-bottom: 0;
    }
    .cl-release__dot {
      position: absolute;
      left: 0;
      top: 0.45rem;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: var(--ngxsmk-color-surface, #fff);
      border: 2px solid var(--ngxsmk-color-outline, #a1a1aa);
      z-index: 1;
    }
    .cl-release__dot--first {
      border-color: var(--ngxsmk-color-primary);
      background: var(--ngxsmk-color-primary);
      box-shadow: 0 0 0 4px color-mix(in srgb, var(--ngxsmk-color-primary) 20%, transparent);
    }

    .cl-release__head {
      display: flex;
      align-items: baseline;
      gap: 0.75rem;
      flex-wrap: wrap;
      margin-bottom: 0.35rem;
    }
    .cl-release__version-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .cl-release__version {
      font-family: 'Outfit', var(--ngxsmk-font-sans), system-ui, sans-serif;
      font-size: var(--ngxsmk-text-title-lg-size, 1.25rem);
      font-weight: 700;
      letter-spacing: -0.02em;
      color: var(--ngxsmk-color-on-surface);
    }
    .cl-release__latest {
      padding: 0.15rem 0.55rem;
      border-radius: var(--ngxsmk-radius-full, 999px);
      background: color-mix(in srgb, var(--ngxsmk-color-primary) 14%, transparent);
      color: var(--ngxsmk-color-primary);
      font-size: var(--ngxsmk-text-body-xs-size, 0.75rem);
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }
    .cl-release__date {
      font-size: var(--ngxsmk-text-body-sm-size, 0.8125rem);
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
    }

    .cl-release__summary {
      font-size: var(--ngxsmk-text-body-md-size, 0.9375rem);
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
      line-height: 1.6;
      margin: 0 0 var(--ngxsmk-space-3, 0.75rem);
    }

    .cl-release__changes {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 0.45rem;
    }

    /* ═══════════════ CHANGE ROW ═══════════════ */
    .cl-change {
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
      font-size: var(--ngxsmk-text-body-sm-size, 0.8125rem);
      color: var(--ngxsmk-color-on-surface);
      line-height: 1.55;
    }
    .cl-change__type {
      flex-shrink: 0;
      padding: 0.1rem 0.45rem;
      border-radius: var(--ngxsmk-radius-sm, 0.25rem);
      font-size: var(--ngxsmk-text-body-xs-size, 0.75rem);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      margin-top: 0.05rem;
    }
    .cl-change__text {
      color: var(--ngxsmk-color-on-surface-variant, #52525b);
    }

    /* ═══════════════ FOOTER CTA ═══════════════ */
    .cl-footer {
      max-width: var(--cl-max);
      margin: 0 auto;
      padding: var(--ngxsmk-space-6, 1.5rem);
      padding-bottom: var(--ngxsmk-space-16, 4rem);
    }
    .cl-footer__card {
      text-align: center;
      padding: var(--ngxsmk-space-10, 2.5rem);
      background: var(--ngxsmk-color-surface, #fff);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-xl, 1rem);
    }
    .cl-footer__icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 56px;
      height: 56px;
      border-radius: var(--ngxsmk-radius-lg);
      background: color-mix(in srgb, var(--ngxsmk-color-primary) 10%, transparent);
      color: var(--ngxsmk-color-primary);
      margin-bottom: var(--ngxsmk-space-4, 1rem);
    }
    .cl-footer__title {
      font-family: 'Outfit', var(--ngxsmk-font-sans), system-ui, sans-serif;
      font-size: var(--ngxsmk-text-headline-sm-size, 1.25rem);
      font-weight: 700;
      letter-spacing: -0.02em;
      margin: 0 0 0.5rem;
      color: var(--ngxsmk-color-on-surface);
    }
    .cl-footer__sub {
      font-size: var(--ngxsmk-text-body-md-size, 0.9375rem);
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
      line-height: 1.6;
      margin: 0 0 var(--ngxsmk-space-5, 1.25rem);
      max-width: 28rem;
      margin-left: auto;
      margin-right: auto;
    }

    /* ═══════════════ RESPONSIVE ═══════════════ */
    @media (max-width: 640px) {
      .cl-hero {
        padding: var(--ngxsmk-space-10, 2.5rem) var(--ngxsmk-space-4, 1rem)
          var(--ngxsmk-space-8, 2rem);
      }
      .cl-filters {
        padding-left: var(--ngxsmk-space-4, 1rem);
      }
      .cl-timeline {
        padding-left: var(--ngxsmk-space-4, 1rem);
      }
      .cl-timeline__line {
        left: calc(var(--ngxsmk-space-4, 1rem) + 5px);
      }
      .cl-footer {
        padding-left: var(--ngxsmk-space-4, 1rem);
        padding-right: var(--ngxsmk-space-4, 1rem);
      }
      .cl-hero__stats {
        gap: var(--ngxsmk-space-6, 1.5rem);
      }
    }
  `,
})
export class ChangelogPage implements OnInit {
  private readonly titleService = inject(Title);
  private readonly meta = inject(Meta);

  protected readonly TYPE_COLORS = TYPE_COLORS;
  protected readonly currentVersion = APP_VERSION;
  protected readonly types = ['added', 'changed', 'fixed', 'removed'] as const;
  protected readonly activeFilter = signal<string>('all');

  protected readonly totalChanges: number;
  protected readonly releases: Release[] = [
    {
      version: 'v2.0.0',
      date: '2026-07-24',
      summary:
        'Major release: motion.dev animation system, full UI/UX redesign, Tailwind CSS support, and AI-first tooling.',
      changes: [
        {
          type: 'added',
          text: 'motion.dev animation system with NgxsmkMotionDirective and NgxsmkAnimateDirective for declarative enter/exit/scroll animations.',
        },
        {
          type: 'added',
          text: 'Four gesture directives: NgxsmkHoverDirective, NgxsmkFocusDirective, NgxsmkDragDirective, and NgxsmkPressDirective.',
        },
        {
          type: 'added',
          text: 'Tailwind CSS v3 preset and v4 CSS theme in @ngxsmk/theme for zero-config Tailwind integration.',
        },
        {
          type: 'added',
          text: 'Component showcase page with sidebar navigation, category grouping, and StackBlitz live playground.',
        },
        {
          type: 'changed',
          text: 'Complete UI/UX redesign of the demo app: home, docs, themes, blog, and changelog pages.',
        },
        {
          type: 'changed',
          text: 'Design token replacement across 70+ components for consistent visual language.',
        },
        {
          type: 'removed',
          text: 'Deprecated @Input/@Output decorators — all APIs are now signal-only.',
        },
        {
          type: 'added',
          text: 'Extracted CvaBase<T> abstract class into @ngxsmk/cdk/cva-base, eliminating ~80 lines of duplicated ControlValueAccessor boilerplate across 8 form components.',
        },
        {
          type: 'added',
          text: 'Extracted ListboxKeyboard class into @ngxsmk/cdk/listbox-keyboard, unifying arrow-key, Home/End, Enter, and Escape navigation.',
        },
        {
          type: 'changed',
          text: 'Merged SearchService into ComponentRegistry, eliminating the double MiniSearch index.',
        },
        {
          type: 'changed',
          text: 'Extracted NgxThemeInjectorService for CSS injection, decoupling it from dark-mode switching.',
        },
        {
          type: 'changed',
          text: 'Extracted component token defaults from css.ts staticVars() into a COMPONENT_TOKEN_DEFAULTS registry.',
        },
        {
          type: 'removed',
          text: 'Deleted 6 orphaned renderer tokens and implementations, the CDK overlay strategy, and the unused base-typeahead skeleton.',
        },
      ],
    },
    {
      version: 'v1.3.2',
      date: '2026-07-17',
      summary: 'AI-friendly tooling: MCP component database, llms.txt, and agent docs.',
      changes: [
        {
          type: 'added',
          text: 'The MCP server is now backed by an auto-generated database of all 214 components, powering search, API lookup, and layout tools for AI coding agents.',
        },
        {
          type: 'added',
          text: 'Generated llms.txt and llms-full.txt API references served at the site root, plus a Claude Code skill for consumer apps.',
        },
        {
          type: 'added',
          text: 'AGENTS.md and CLAUDE.md guidance for AI coding agents working in the repository.',
        },
      ],
    },
    {
      version: 'v1.3.1',
      date: '2026-07-16',
      summary: 'Keyboard navigation, unified focus rings, and dark-mode fixes.',
      changes: [
        {
          type: 'added',
          text: 'Keyboard navigation for autocomplete, combobox, multi-select, and multi-selector.',
        },
        {
          type: 'changed',
          text: 'Every component now draws its focus ring from the --ngxsmk-focus-ring token.',
        },
        {
          type: 'fixed',
          text: 'prefers-reduced-motion now stops all token-driven motion, not just the shared motion duration.',
        },
        {
          type: 'fixed',
          text: 'Fixed dark-mode colors in 14 components that fell back to light-only values.',
        },
      ],
    },
    {
      version: 'v1.3.0',
      date: '2026-07-16',
      summary: 'SEO utilities, emerald default preset, and documentation improvements.',
      changes: [
        {
          type: 'added',
          text: 'SEO service: @ngxsmk/core/seo with NgxsmkSeoService and provideSeo() for title, description, canonical, Open Graph, Twitter Card, and JSON-LD.',
        },
        {
          type: 'changed',
          text: 'emerald is now the default preset; the astryx preset was removed.',
        },
        {
          type: 'changed',
          text: 'Richer package READMEs and top-level docs with a component catalog, CLI & schematics, and accessibility guidance.',
        },
      ],
    },
    {
      version: 'v1.2.0',
      date: '2026-07-15',
      summary: 'Partial-Ivy build fix (resolves NG0203) and expanded component surface.',
      changes: [
        {
          type: 'fixed',
          text: 'Libraries now compile in partial Ivy mode so DI factories run inside the injection context (NG0203).',
        },
        {
          type: 'added',
          text: 'Select family: @ngxsmk/core/select, multi-select, selector, multi-selector.',
        },
        { type: 'added', text: 'Structural directives @ngxsmk/core/let and @ngxsmk/core/rx-let.' },
        {
          type: 'added',
          text: 'i18n entry point with NgxsmkI18nPipe, createI18n, provideI18n, useDirection.',
        },
      ],
    },
    {
      version: 'v1.1.0',
      date: '2026-07-15',
      summary: 'Stable release with updated toolchain, command palette, and prompt carousel.',
      changes: [
        {
          type: 'added',
          text: 'Command palette component (@ngxsmk/core/command-palette) for quick search and actions.',
        },
        {
          type: 'added',
          text: 'Prompt carousel component (@ngxsmk/core/prompt-carousel) for AI-focused templates.',
        },
        { type: 'changed', text: 'Standardized workspace configuration and builder options.' },
        { type: 'changed', text: 'Verified Angular compatibility across versions 17 through 22.' },
      ],
    },
    {
      version: 'v1.0.0',
      date: '2026-07-15',
      summary: 'First stable release of the NGXSMK ecosystem.',
      changes: [
        { type: 'added', text: '@ngxsmk/core, @ngxsmk/cdk, and @ngxsmk/theme published at 1.0.0.' },
        {
          type: 'added',
          text: 'Angular 17.3+ support verified across 17, 18, 19, 20, 21, and 22.',
        },
        { type: 'added', text: '200+ components across forms, AI, enterprise, charts, and more.' },
        { type: 'added', text: 'Universal token engine with runtime theme switching.' },
        {
          type: 'changed',
          text: 'Peer dependencies widened to >=17.3.0 (was pinned to Angular 22).',
        },
      ],
    },
    {
      version: 'v0.0.0-beta.1',
      date: '2026-07-13',
      summary: 'Initial beta release of the NGXSMK ecosystem.',
      changes: [
        { type: 'added', text: '@ngxsmk/core, @ngxsmk/cdk, and @ngxsmk/theme packages.' },
        { type: 'added', text: '200+ components across forms, AI, enterprise, charts, and more.' },
        { type: 'added', text: 'Universal token engine with runtime theme switching.' },
        { type: 'fixed', text: 'Zoneless change detection compatibility.' },
      ],
    },
    {
      version: 'v0.0.0-alpha.3',
      date: '2026-06-02',
      summary: 'Preview of the showcase application and documentation site.',
      changes: [
        { type: 'added', text: 'Interactive component explorer.' },
        { type: 'changed', text: 'Migrated all components to signal inputs.' },
      ],
    },
    {
      version: 'v0.0.0-alpha.1',
      date: '2026-04-15',
      summary: 'First internal alpha of the core component library.',
      changes: [{ type: 'added', text: 'Foundational primitives: button, card, input, dialog.' }],
    },
  ];

  constructor() {
    this.totalChanges = this.releases.reduce((sum, r) => sum + r.changes.length, 0);
  }

  ngOnInit(): void {
    this.titleService.setTitle('Changelog — NGXSMK');
    this.meta.updateTag({
      name: 'description',
      content:
        'Full release history and changelog for NGXSMK. Track every added feature, change, and fix across all versions.',
    });
    this.meta.updateTag({ property: 'og:title', content: 'Changelog — NGXSMK' });
    this.meta.updateTag({
      property: 'og:description',
      content:
        'Full release history and changelog for NGXSMK. Track every added feature, change, and fix across all versions.',
    });
  }

  protected readonly filteredReleases = computed(() => {
    const filter = this.activeFilter();
    if (filter === 'all') return this.releases;
    return this.releases
      .map((r) => ({
        ...r,
        changes: r.changes.filter((c) => c.type === filter),
      }))
      .filter((r) => r.changes.length > 0);
  });

  protected formatDate(dateStr: string): string {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }
}
