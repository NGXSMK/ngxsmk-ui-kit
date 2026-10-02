import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { TranslatePipe } from '@ngx-translate/core';
import { AppNav } from '../../nav/nav';
import { NgxsmkButton } from '@ngxsmk/core/button';
import { APP_VERSION } from '../../core/version';

interface Change {
  type: 'added' | 'fixed' | 'changed' | 'removed';
  i18nKey: string;
}

interface Release {
  version: string;
  date: string;
  i18nKey: string;
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
  imports: [TitleCasePipe, TranslatePipe, AppNav, NgxsmkButton],
  template: `
    <app-nav />

    <div class="cl">
      <!-- ═══════════════ HERO ═══════════════ -->
      <header class="cl-hero">
        <div class="cl-hero__inner">
          <div class="version-badge">
            <span class="pulse-dot"></span>
            <span class="badge-tag">Changelog</span>
            <span class="badge-divider"></span>
            <span class="badge-text"
              >{{ 'changelog.pill' | translate }} • v{{ currentVersion }}</span
            >
          </div>
          <h1 class="cl-hero__title">Release <span class="highlight">Notes</span></h1>
          <p class="cl-hero__sub">
            {{ 'changelog.subtitle' | translate }}
            <strong>{{ currentVersion }}</strong
            >.
          </p>
          <div class="cl-hero__stats">
            <div class="cl-hero__stat">
              <span class="cl-hero__stat-val">{{ releases.length }}</span>
              <span class="cl-hero__stat-label">{{ 'changelog.statReleases' | translate }}</span>
            </div>
            <div class="cl-hero__stat">
              <span class="cl-hero__stat-val">{{ totalChanges }}</span>
              <span class="cl-hero__stat-label">{{ 'changelog.statChanges' | translate }}</span>
            </div>
            <div class="cl-hero__stat">
              <span class="cl-hero__stat-val">Apr '26</span>
              <span class="cl-hero__stat-label">{{ 'changelog.statSince' | translate }}</span>
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
          {{ 'changelog.all' | translate }}
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

            <div class="cl-release__card">
              <div class="traffic-lights">
                <span class="light red"></span>
                <span class="light yellow"></span>
                <span class="light green"></span>
              </div>
              <div class="cl-release__head">
                <div class="cl-release__version-row">
                  <span class="cl-release__version">{{ release.version }}</span>
                  @if (i === 0) {
                    <span class="cl-release__latest">{{ 'changelog.latest' | translate }}</span>
                  }
                </div>
                <time class="cl-release__date">{{ formatDate(release.date) }}</time>
              </div>

              <p class="cl-release__summary">{{ release.i18nKey + '.summary' | translate }}</p>

              <ul class="cl-release__changes">
                @for (change of release.changes; track change.i18nKey) {
                  <li class="cl-change">
                    <span
                      class="cl-change__type"
                      [style.background]="TYPE_COLORS[change.type] + '18'"
                      [style.color]="TYPE_COLORS[change.type]"
                    >
                      {{ change.type | titlecase }}
                    </span>
                    <span class="cl-change__text">{{ change.i18nKey | translate }}</span>
                  </li>
                }
              </ul>
            </div>
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
          <h3 class="cl-footer__title">{{ 'changelog.footerTitle' | translate }}</h3>
          <p class="cl-footer__sub">
            {{ 'changelog.footerSub' | translate }}
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
      --cl-max: 880px;
      display: block;
      font-family: var(--font-body, 'Inter', system-ui, sans-serif);
      color: var(--color-text-main, #0f172a);
    }

    /* ═══════════════ HERO ═══════════════ */
    .cl-hero {
      position: relative;
      overflow: hidden;
      padding: clamp(3.5rem, 7vw, 5.5rem) 1.5rem clamp(2.5rem, 5vw, 3.5rem);
      text-align: center;
      background-color: var(--color-bg-canvas, #f8fafc);
      background-image: radial-gradient(
        var(--color-border-card, rgba(148, 163, 184, 0.25)) 1px,
        transparent 1px
      );
      background-size: 24px 24px;
    }
    .cl-hero::before {
      content: '';
      position: absolute;
      inset: 0;
      z-index: 0;
      pointer-events: none;
      background: radial-gradient(55% 55% at 50% 0%, rgba(99, 102, 241, 0.12), transparent 70%);
    }
    .cl-hero__inner {
      position: relative;
      z-index: 1;
      max-width: 44rem;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .cl-hero__title {
      font-family: var(--font-display, 'Plus Jakarta Sans', system-ui, sans-serif);
      font-size: clamp(2.25rem, 5vw, 3.25rem);
      font-weight: 800;
      letter-spacing: -0.035em;
      line-height: 1.15;
      margin: 0.75rem 0 1rem;
      color: var(--color-text-main, #0f172a);
    }
    .highlight {
      background: linear-gradient(135deg, #6366f1 0%, #f59e0b 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .cl-hero__sub {
      font-size: 1.0625rem;
      color: var(--color-text-secondary, #64748b);
      line-height: 1.65;
      margin: 0 0 2rem;
      max-width: 36rem;
    }
    .cl-hero__sub strong {
      color: #6366f1;
      font-weight: 700;
    }
    .cl-hero__stats {
      display: flex;
      gap: 3rem;
    }
    .cl-hero__stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.2rem;
    }
    .cl-hero__stat-val {
      font-family: var(--font-display, 'Plus Jakarta Sans', system-ui, sans-serif);
      font-size: 1.75rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: var(--color-text-main, #0f172a);
    }
    .cl-hero__stat-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--color-text-muted, #94a3b8);
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    /* ═══════════════ FILTERS ═══════════════ */
    .cl-filters {
      max-width: var(--cl-max);
      margin: 0 auto;
      padding: 1.5rem 1.5rem;
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }
    .cl-filter {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.45rem 1rem;
      border: 1px solid var(--color-border-card, rgba(148, 163, 184, 0.25));
      border-radius: 9999px;
      background: var(--color-bg-card, #ffffff);
      font-size: 0.85rem;
      font-weight: 500;
      color: var(--color-text-secondary, #64748b);
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      font-family: inherit;
    }
    .cl-filter:hover {
      border-color: rgba(99, 102, 241, 0.4);
      color: #6366f1;
      transform: translateY(-1px);
    }
    .cl-filter--active {
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(245, 158, 11, 0.08));
      color: #6366f1;
      border-color: rgba(99, 102, 241, 0.45);
      font-weight: 600;
      box-shadow: 0 4px 12px -2px rgba(99, 102, 241, 0.15);
    }
    .cl-filter__dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    /* ═══════════════ TIMELINE ═══════════════ */
    .cl-timeline {
      max-width: var(--cl-max);
      margin: 0 auto;
      padding: 2rem 1.5rem 4rem;
      position: relative;
    }
    .cl-timeline__line {
      position: absolute;
      left: calc(1.5rem + 5px);
      top: 2rem;
      bottom: 4rem;
      width: 2px;
      background: linear-gradient(180deg, rgba(99, 102, 241, 0.4), rgba(148, 163, 184, 0.2));
    }

    /* ═══════════════ RELEASE CARD ═══════════════ */
    .cl-release {
      position: relative;
      padding-left: 2.25rem;
      padding-bottom: 2.5rem;
    }
    .cl-release:last-child {
      padding-bottom: 0;
    }
    .cl-release__dot {
      position: absolute;
      left: 0;
      top: 1rem;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: var(--color-bg-card, #ffffff);
      border: 2px solid var(--color-border-card, #94a3b8);
      z-index: 1;
    }
    .cl-release__dot--first {
      border-color: #6366f1;
      background: #6366f1;
      box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.2);
    }

    .cl-release__card {
      background: var(--color-bg-card, #ffffff);
      border: 1px solid var(--color-border-card, rgba(148, 163, 184, 0.2));
      border-radius: var(--radius-xl, 22px);
      padding: 1.5rem;
      box-shadow: 0 4px 14px -4px rgba(0, 0, 0, 0.04);
      transition:
        border-color 0.22s,
        box-shadow 0.22s,
        transform 0.22s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .cl-release__card:hover {
      border-color: rgba(99, 102, 241, 0.45);
      box-shadow: 0 16px 32px -12px rgba(99, 102, 241, 0.18);
      transform: translateY(-2px);
    }
    .cl-release__card .traffic-lights {
      margin-bottom: 0.75rem;
    }

    .cl-release__head {
      display: flex;
      align-items: baseline;
      gap: 0.75rem;
      flex-wrap: wrap;
      margin-bottom: 0.5rem;
    }
    .cl-release__version-row {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }
    .cl-release__version {
      font-family: var(--font-display, 'Plus Jakarta Sans', system-ui, sans-serif);
      font-size: 1.35rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: var(--color-text-main, #0f172a);
    }
    .cl-release__latest {
      padding: 0.2rem 0.6rem;
      border-radius: 9999px;
      background: rgba(99, 102, 241, 0.12);
      color: #6366f1;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }
    .cl-release__date {
      font-size: 0.85rem;
      color: var(--color-text-secondary, #64748b);
    }

    .cl-release__summary {
      font-size: 0.95rem;
      color: var(--color-text-secondary, #64748b);
      line-height: 1.6;
      margin: 0 0 1rem;
    }

    .cl-release__changes {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    /* ═══════════════ CHANGE ROW ═══════════════ */
    .cl-change {
      display: flex;
      align-items: flex-start;
      gap: 0.625rem;
      font-size: 0.875rem;
      color: var(--color-text-main, #0f172a);
      line-height: 1.55;
    }
    .cl-change__type {
      flex-shrink: 0;
      padding: 0.15rem 0.5rem;
      border-radius: 9999px;
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      margin-top: 0.05rem;
    }
    .cl-change__text {
      color: var(--color-text-secondary, #475569);
    }

    /* ═══════════════ FOOTER CTA ═══════════════ */
    .cl-footer {
      max-width: var(--cl-max);
      margin: 0 auto;
      padding: 1.5rem;
      padding-bottom: 4rem;
    }
    .cl-footer__card {
      text-align: center;
      padding: 2.5rem;
      background: var(--color-bg-card, #ffffff);
      border: 1px solid var(--color-border-card, rgba(148, 163, 184, 0.2));
      border-radius: var(--radius-xl, 22px);
    }
    .cl-footer__icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 56px;
      height: 56px;
      border-radius: 16px;
      background: rgba(99, 102, 241, 0.1);
      color: #6366f1;
      margin-bottom: 1rem;
    }
    .cl-footer__title {
      font-family: var(--font-display, 'Plus Jakarta Sans', system-ui, sans-serif);
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
      version: 'v3.1.0',
      date: '2026-10-02',
      i18nKey: 'changelog.release.v310',
      changes: [
        { type: 'added', i18nKey: 'changelog.release.v310.changes.0' },
        { type: 'added', i18nKey: 'changelog.release.v310.changes.1' },
        { type: 'fixed', i18nKey: 'changelog.release.v310.changes.2' },
        { type: 'fixed', i18nKey: 'changelog.release.v310.changes.3' },
        { type: 'fixed', i18nKey: 'changelog.release.v310.changes.4' },
      ],
    },
    {
      version: 'v3.0.0',
      date: '2026-08-25',
      i18nKey: 'changelog.release.v200',
      changes: [
        { type: 'added', i18nKey: 'changelog.release.v200.changes.0' },
        { type: 'added', i18nKey: 'changelog.release.v200.changes.1' },
        { type: 'added', i18nKey: 'changelog.release.v200.changes.2' },
        { type: 'changed', i18nKey: 'changelog.release.v200.changes.4' },
        { type: 'fixed', i18nKey: 'changelog.release.v200.changes.5' },
      ],
    },
    {
      version: 'v2.0.0',
      date: '2026-07-24',
      i18nKey: 'changelog.release.v200',
      changes: [
        { type: 'added', i18nKey: 'changelog.release.v200.changes.0' },
        { type: 'added', i18nKey: 'changelog.release.v200.changes.1' },
        { type: 'added', i18nKey: 'changelog.release.v200.changes.2' },
        { type: 'added', i18nKey: 'changelog.release.v200.changes.3' },
        { type: 'changed', i18nKey: 'changelog.release.v200.changes.4' },
        { type: 'changed', i18nKey: 'changelog.release.v200.changes.5' },
        { type: 'removed', i18nKey: 'changelog.release.v200.changes.6' },
        { type: 'added', i18nKey: 'changelog.release.v200.changes.7' },
        { type: 'added', i18nKey: 'changelog.release.v200.changes.8' },
        { type: 'changed', i18nKey: 'changelog.release.v200.changes.9' },
        { type: 'changed', i18nKey: 'changelog.release.v200.changes.10' },
        { type: 'changed', i18nKey: 'changelog.release.v200.changes.11' },
        { type: 'removed', i18nKey: 'changelog.release.v200.changes.12' },
      ],
    },
    {
      version: 'v1.3.2',
      date: '2026-07-17',
      i18nKey: 'changelog.release.v132',
      changes: [
        { type: 'added', i18nKey: 'changelog.release.v132.changes.0' },
        { type: 'added', i18nKey: 'changelog.release.v132.changes.1' },
        { type: 'added', i18nKey: 'changelog.release.v132.changes.2' },
      ],
    },
    {
      version: 'v1.3.1',
      date: '2026-07-16',
      i18nKey: 'changelog.release.v131',
      changes: [
        { type: 'added', i18nKey: 'changelog.release.v131.changes.0' },
        { type: 'changed', i18nKey: 'changelog.release.v131.changes.1' },
        { type: 'fixed', i18nKey: 'changelog.release.v131.changes.2' },
        { type: 'fixed', i18nKey: 'changelog.release.v131.changes.3' },
      ],
    },
    {
      version: 'v1.3.0',
      date: '2026-07-16',
      i18nKey: 'changelog.release.v130',
      changes: [
        { type: 'added', i18nKey: 'changelog.release.v130.changes.0' },
        { type: 'changed', i18nKey: 'changelog.release.v130.changes.1' },
        { type: 'changed', i18nKey: 'changelog.release.v130.changes.2' },
      ],
    },
    {
      version: 'v1.2.0',
      date: '2026-07-15',
      i18nKey: 'changelog.release.v120',
      changes: [
        { type: 'fixed', i18nKey: 'changelog.release.v120.changes.0' },
        { type: 'added', i18nKey: 'changelog.release.v120.changes.1' },
        { type: 'added', i18nKey: 'changelog.release.v120.changes.2' },
        { type: 'added', i18nKey: 'changelog.release.v120.changes.3' },
      ],
    },
    {
      version: 'v1.1.0',
      date: '2026-07-15',
      i18nKey: 'changelog.release.v110',
      changes: [
        { type: 'added', i18nKey: 'changelog.release.v110.changes.0' },
        { type: 'added', i18nKey: 'changelog.release.v110.changes.1' },
        { type: 'changed', i18nKey: 'changelog.release.v110.changes.2' },
        { type: 'changed', i18nKey: 'changelog.release.v110.changes.3' },
      ],
    },
    {
      version: 'v1.0.0',
      date: '2026-07-15',
      i18nKey: 'changelog.release.v100',
      changes: [
        { type: 'added', i18nKey: 'changelog.release.v100.changes.0' },
        { type: 'added', i18nKey: 'changelog.release.v100.changes.1' },
        { type: 'added', i18nKey: 'changelog.release.v100.changes.2' },
        { type: 'added', i18nKey: 'changelog.release.v100.changes.3' },
        { type: 'changed', i18nKey: 'changelog.release.v100.changes.4' },
      ],
    },
    {
      version: 'v0.0.0-beta.1',
      date: '2026-07-13',
      i18nKey: 'changelog.release.v0beta1',
      changes: [
        { type: 'added', i18nKey: 'changelog.release.v0beta1.changes.0' },
        { type: 'added', i18nKey: 'changelog.release.v0beta1.changes.1' },
        { type: 'added', i18nKey: 'changelog.release.v0beta1.changes.2' },
        { type: 'fixed', i18nKey: 'changelog.release.v0beta1.changes.3' },
      ],
    },
    {
      version: 'v0.0.0-alpha.3',
      date: '2026-06-02',
      i18nKey: 'changelog.release.v0alpha3',
      changes: [
        { type: 'added', i18nKey: 'changelog.release.v0alpha3.changes.0' },
        { type: 'changed', i18nKey: 'changelog.release.v0alpha3.changes.1' },
      ],
    },
    {
      version: 'v0.0.0-alpha.1',
      date: '2026-04-15',
      i18nKey: 'changelog.release.v0alpha1',
      changes: [{ type: 'added', i18nKey: 'changelog.release.v0alpha1.changes.0' }],
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
