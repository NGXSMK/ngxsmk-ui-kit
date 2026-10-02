import { Component, inject, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { TranslatePipe } from '@ngx-translate/core';
import { AppNav } from '../../nav/nav';
import { NgxsmkButton } from '@ngxsmk/core/button';

interface MilestoneItem {
  text: string;
  detail: string;
}

interface Milestone {
  quarter: string;
  title: string;
  status: 'shipped' | 'in-progress' | 'planned';
  description: string;
  items: MilestoneItem[];
}

const STATUS_META: Record<string, { color: string; bg: string; icon: string }> = {
  shipped: { color: '#22c55e', bg: '#22c55e18', icon: '✓' },
  'in-progress': { color: '#f59e0b', bg: '#f59e0b18', icon: '●' },
  planned: { color: '#7c3aed', bg: '#7c3aed18', icon: '○' },
};

@Component({
  selector: 'roadmap-page',
  standalone: true,
  imports: [AppNav, NgxsmkButton, TranslatePipe],
  template: `
    <app-nav />

    <div class="rm">
      <!-- ═══════════════ HERO ═══════════════ -->
      <header class="rm-hero">
        <div class="rm-hero__inner">
          <div class="version-badge">
            <span class="pulse-dot"></span>
            <span class="badge-tag">Roadmap</span>
            <span class="badge-divider"></span>
            <span class="badge-text">{{ 'roadmap.pill' | translate }}</span>
          </div>
          <h1 class="rm-hero__title">Product <span class="highlight">Roadmap</span></h1>
          <p class="rm-hero__sub">
            {{ 'roadmap.subtitle' | translate }}
          </p>
          <div class="rm-hero__stats">
            <div class="rm-hero__stat">
              <span class="rm-hero__stat-val" style="color: #22c55e">{{ shippedCount }}</span>
              <span class="rm-hero__stat-label">{{ 'roadmap.statShipped' | translate }}</span>
            </div>
            <div class="rm-hero__stat">
              <span class="rm-hero__stat-val" style="color: #f59e0b">{{ inProgressCount }}</span>
              <span class="rm-hero__stat-label">{{ 'roadmap.statInProgress' | translate }}</span>
            </div>
            <div class="rm-hero__stat">
              <span class="rm-hero__stat-val" style="color: #6366f1">{{ plannedCount }}</span>
              <span class="rm-hero__stat-label">{{ 'roadmap.statPlanned' | translate }}</span>
            </div>
          </div>
        </div>
      </header>

      <!-- ═══════════════ LEGEND ═══════════════ -->
      <section class="rm-legend">
        @for (entry of statusEntries; track entry[0]) {
          <div class="rm-legend__item">
            <span
              class="rm-legend__dot"
              [style.background]="entry[1].color"
              [style.box-shadow]="'0 0 6px ' + entry[1].color + '40'"
            ></span>
            <span class="rm-legend__label">{{ entry[0] }}</span>
          </div>
        }
      </section>

      <!-- ═══════════════ TIMELINE ═══════════════ -->
      <section class="rm-timeline">
        <div class="rm-timeline__line"></div>

        @for (m of milestones; track m.quarter; let i = $index) {
          <article class="rm-card" [class.rm-card--current]="m.status === 'in-progress'">
            <div
              class="rm-card__dot"
              [style.background]="STATUS_META[m.status].color"
              [style.box-shadow]="'0 0 0 4px ' + STATUS_META[m.status].color + '25'"
            ></div>

            <div class="rm-card__head">
              <div class="traffic-lights">
                <span class="light red"></span>
                <span class="light yellow"></span>
                <span class="light green"></span>
              </div>
              <div class="rm-card__head-top">
                <span class="rm-card__quarter">{{ m.quarter }}</span>
                <span
                  class="rm-card__status"
                  [style.background]="STATUS_META[m.status].bg"
                  [style.color]="STATUS_META[m.status].color"
                >
                  {{ STATUS_META[m.status].icon }}
                  {{
                    m.status === 'in-progress'
                      ? ('roadmap.status.inProgress' | translate)
                      : m.status === 'shipped'
                        ? ('roadmap.status.shipped' | translate)
                        : ('roadmap.status.planned' | translate)
                  }}
                </span>
              </div>
              <h2 class="rm-card__title">{{ m.title }}</h2>
              <p class="rm-card__desc">{{ m.description }}</p>
            </div>

            <ul class="rm-card__items">
              @for (item of m.items; track item.text) {
                <li class="rm-item" [class.rm-item--done]="m.status === 'shipped'">
                  <span
                    class="rm-item__check"
                    [style.border-color]="
                      m.status === 'shipped' ? '#22c55e' : 'var(--ngxsmk-color-outline)'
                    "
                    [style.background]="m.status === 'shipped' ? '#22c55e' : 'transparent'"
                  >
                    @if (m.status === 'shipped') {
                      <svg viewBox="0 0 12 12" fill="none" width="10" height="10">
                        <path
                          d="M2.5 6l2.5 2.5 4.5-5"
                          stroke="#fff"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    }
                  </span>
                  <div class="rm-item__text">
                    <span class="rm-item__name">{{ item.text }}</span>
                    <span class="rm-item__detail">{{ item.detail }}</span>
                  </div>
                </li>
              }
            </ul>
          </article>
        }
      </section>

      <!-- ═══════════════ FOOTER CTA ═══════════════ -->
      <section class="rm-footer">
        <div class="rm-footer__card">
          <div class="rm-footer__icon">
            <svg viewBox="0 0 24 24" fill="none" width="28" height="28">
              <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                fill="currentColor"
              />
            </svg>
          </div>
          <h3 class="rm-footer__title">{{ 'roadmap.footerTitle' | translate }}</h3>
          <p class="rm-footer__sub">
            {{ 'roadmap.footerSub' | translate }}
          </p>
          <div class="rm-footer__actions">
            <a
              ngxsmk-button
              variant="outline"
              href="https://github.com/ngxsmk/ngxsmk-ui-kit/issues"
              target="_blank"
              rel="noopener"
            >
              {{ 'roadmap.footerCta' | translate }}
            </a>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: `
    :host {
      --rm-max: 880px;
      display: block;
      font-family: var(--font-body, 'Inter', system-ui, sans-serif);
      color: var(--color-text-main, #0f172a);
    }

    /* ═══════════════ HERO ═══════════════ */
    .rm-hero {
      position: relative;
      overflow: hidden;
      padding: clamp(3.5rem, 7vw, 5.5rem) 1.5rem clamp(2.5rem, 5vw, 3.5rem);
      text-align: center;
      background-color: var(--color-bg-canvas, #f8fafc);
      background-image: radial-gradient(var(--color-border-card, rgba(148, 163, 184, 0.25)) 1px, transparent 1px);
      background-size: 24px 24px;
    }
    .rm-hero::before {
      content: '';
      position: absolute;
      inset: 0;
      z-index: 0;
      pointer-events: none;
      background: radial-gradient(
        55% 55% at 50% 0%,
        rgba(99, 102, 241, 0.12),
        transparent 70%
      );
    }
    .rm-hero__inner {
      position: relative;
      z-index: 1;
      max-width: 44rem;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .rm-hero__title {
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
    .rm-hero__sub {
      font-size: 1.0625rem;
      color: var(--color-text-secondary, #64748b);
      line-height: 1.65;
      margin: 0 0 2rem;
      max-width: 36rem;
    }
    .rm-hero__stats {
      display: flex;
      gap: 3rem;
    }
    .rm-hero__stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.2rem;
    }
    .rm-hero__stat-val {
      font-family: var(--font-display, 'Plus Jakarta Sans', system-ui, sans-serif);
      font-size: 1.75rem;
      font-weight: 800;
      letter-spacing: -0.02em;
    }
    .rm-hero__stat-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--color-text-muted, #94a3b8);
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    /* ═══════════════ LEGEND ═══════════════ */
    .rm-legend {
      max-width: var(--rm-max);
      margin: 0 auto;
      padding: 1.5rem 1.5rem 0;
      display: flex;
      gap: 1.5rem;
      flex-wrap: wrap;
    }
    .rm-legend__item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .rm-legend__dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }
    .rm-legend__label {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--color-text-secondary, #64748b);
      text-transform: capitalize;
    }

    /* ═══════════════ TIMELINE ═══════════════ */
    .rm-timeline {
      max-width: var(--rm-max);
      margin: 0 auto;
      padding: 2.5rem 1.5rem;
      position: relative;
    }
    .rm-timeline__line {
      position: absolute;
      left: calc(1.5rem + 5px);
      top: 2.5rem;
      bottom: 2.5rem;
      width: 2px;
      background: linear-gradient(
        180deg,
        rgba(99, 102, 241, 0.4),
        rgba(148, 163, 184, 0.2)
      );
    }

    /* ═══════════════ CARD ═══════════════ */
    .rm-card {
      position: relative;
      padding-left: 2.25rem;
      padding-bottom: 2.5rem;
    }
    .rm-card:last-child {
      padding-bottom: 0;
    }
    .rm-card--current .rm-card__head {
      border-color: rgba(245, 158, 11, 0.45);
      box-shadow: 0 8px 24px -6px rgba(245, 158, 11, 0.15);
    }
    .rm-card__dot {
      position: absolute;
      left: 0;
      top: 1rem;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      z-index: 1;
    }

    .rm-card__head {
      border: 1px solid var(--color-border-card, rgba(148, 163, 184, 0.2));
      border-radius: var(--radius-xl, 22px);
      padding: 1.5rem;
      background: var(--color-bg-card, #ffffff);
      margin-bottom: 0.85rem;
      box-shadow: 0 4px 14px -4px rgba(0, 0, 0, 0.04);
      transition:
        border-color 0.22s,
        box-shadow 0.22s,
        transform 0.22s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .rm-card__head:hover {
      border-color: rgba(99, 102, 241, 0.45);
      box-shadow: 0 16px 32px -12px rgba(99, 102, 241, 0.18);
      transform: translateY(-2px);
    }
    .rm-card__head .traffic-lights {
      margin-bottom: 0.75rem;
    }
    .rm-card__head-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
      flex-wrap: wrap;
      margin-bottom: 0.5rem;
    }
    .rm-card__quarter {
      font-family: var(--font-display, 'Plus Jakarta Sans', system-ui, sans-serif);
      font-size: 0.825rem;
      font-weight: 700;
      color: var(--color-text-secondary, #64748b);
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
    .rm-card__status {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.03em;
    }
    .rm-card__title {
      font-family: var(--font-display, 'Plus Jakarta Sans', system-ui, sans-serif);
      font-size: 1.25rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      margin: 0 0 0.35rem;
      color: var(--color-text-main, #0f172a);
    }
    .rm-card__desc {
      font-size: 0.9rem;
      color: var(--color-text-secondary, #64748b);
      line-height: 1.6;
      margin: 0;
    }

    /* ═══════════════ ITEMS ═══════════════ */
    .rm-card__items {
      list-style: none;
      margin: 0;
      padding: 0 0 0 0.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }
    .rm-item {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 0.5rem 0.75rem;
      border-radius: var(--radius-md, 8px);
      transition: background 0.15s;
    }
    .rm-item:hover {
      background: rgba(99, 102, 241, 0.04);
    }
    .rm-item--done .rm-item__name {
      color: var(--color-text-secondary, #64748b);
    }
    .rm-item__check {
      flex-shrink: 0;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 1.5px solid;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 0.1rem;
    }
    .rm-item__text {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
    }
    .rm-item__name {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--color-text-main, #0f172a);
      line-height: 1.4;
    }
    .rm-item__detail {
      font-size: 0.775rem;
      color: var(--color-text-muted, #94a3b8);
      line-height: 1.5;
    }

    /* ═══════════════ FOOTER CTA ═══════════════ */
    .rm-footer {
      max-width: var(--rm-max);
      margin: 0 auto;
      padding: var(--ngxsmk-space-6, 1.5rem);
      padding-bottom: var(--ngxsmk-space-16, 4rem);
    }
    .rm-footer__card {
      text-align: center;
      padding: var(--ngxsmk-space-10, 2.5rem);
      background: var(--ngxsmk-color-surface, #fff);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-xl, 1rem);
    }
    .rm-footer__icon {
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
    .rm-footer__title {
      font-family: 'Outfit', var(--ngxsmk-font-sans), system-ui, sans-serif;
      font-size: var(--ngxsmk-text-headline-sm-size, 1.25rem);
      font-weight: 700;
      letter-spacing: -0.02em;
      margin: 0 0 0.5rem;
      color: var(--ngxsmk-color-on-surface);
    }
    .rm-footer__sub {
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
      .rm-hero {
        padding: var(--ngxsmk-space-10, 2.5rem) var(--ngxsmk-space-4, 1rem)
          var(--ngxsmk-space-8, 2rem);
      }
      .rm-legend {
        padding-left: var(--ngxsmk-space-4, 1rem);
      }
      .rm-timeline {
        padding-left: var(--ngxsmk-space-4, 1rem);
      }
      .rm-timeline__line {
        left: calc(var(--ngxsmk-space-4, 1rem) + 5px);
      }
      .rm-footer {
        padding-left: var(--ngxsmk-space-4, 1rem);
        padding-right: var(--ngxsmk-space-4, 1rem);
      }
      .rm-hero__stats {
        gap: var(--ngxsmk-space-6, 1.5rem);
      }
    }
  `,
})
export class RoadmapPage implements OnInit {
  private readonly titleService = inject(Title);
  private readonly meta = inject(Meta);

  protected readonly STATUS_META = STATUS_META;

  protected readonly shippedCount = 3;
  protected readonly inProgressCount = 1;
  protected readonly plannedCount = 2;

  protected readonly statusEntries = Object.entries(STATUS_META) as [
    string,
    { color: string; bg: string; icon: string },
  ][];

  protected readonly milestones: Milestone[] = [
    {
      quarter: 'Q2 2026',
      title: 'Foundations',
      status: 'shipped',
      description:
        'Core infrastructure and component library shipped. The token engine, 200+ components, and zoneless runtime are live.',
      items: [
        {
          text: 'Universal token engine',
          detail:
            'Runtime HSL theme switching with dark mode, token override hooks, and 60+ design tokens.',
        },
        {
          text: '200+ components shipped',
          detail:
            'Forms, AI interfaces, enterprise grids, charts, overlays, navigation, layout primitives.',
        },
        {
          text: 'Zoneless runtime support',
          detail:
            'Full signal-based reactivity. No Zone.js dependency. Compatible with Angular 17.3–22.',
        },
      ],
    },
    {
      quarter: 'Q3 2026',
      title: 'CLI Tools & Schematics',
      status: 'in-progress',
      description:
        'Developer experience improvements: CLI scaffolding, copy-paste templates, and automated theme setup.',
      items: [
        {
          text: 'Schematic generators for add/update',
          detail:
            'ng add @ngxsmk/core and ng generate ngxsmk:component for scaffolding with theme tokens wired.',
        },
        {
          text: 'Copy-paste installer scripts',
          detail:
            'One-line shell scripts to copy component source directly into your project without a dependency.',
        },
        {
          text: 'Theme preset scaffolding',
          detail:
            'ngxsmk theme init to generate a custom preset file from emerald, sapphire, or custom palettes.',
        },
      ],
    },
    {
      quarter: 'Q4 2026',
      title: 'AI Toolkit Expansion',
      status: 'planned',
      description:
        'Deeper AI integration: guardrails, evaluation tooling, and real-time streaming diffs.',
      items: [
        {
          text: 'MCP server for coding assistants',
          detail:
            'Already shipped in v1.3.2. Will expand with component generation tools and theme-aware prompts.',
        },
        {
          text: 'Agent guardrails & evaluations',
          detail:
            'Built-in guardrail directives and evaluation harnesses for testing AI-generated UI code.',
        },
        {
          text: 'Streaming token diff viewer',
          detail:
            'Component for rendering LLM streaming output with syntax-highlighted diffs and auto-scroll.',
        },
      ],
    },
    {
      quarter: 'Q1 2027',
      title: 'Enterprise Suite',
      status: 'planned',
      description:
        'Advanced enterprise widgets: virtualized grids, formula engines, and collaborative editing.',
      items: [
        {
          text: 'Data-grid virtualization',
          detail:
            'Windowed rendering for 100k+ rows with sticky headers, column resize, and cell editing.',
        },
        {
          text: 'Spreadsheet formula engine',
          detail: 'Excel-compatible formula parser and evaluator for the spreadsheet component.',
        },
        {
          text: 'Collaborative canvas',
          detail: 'Real-time multiplayer canvas with presence indicators and conflict resolution.',
        },
      ],
    },
  ];

  ngOnInit(): void {
    this.titleService.setTitle('Roadmap — NGXSMK');
    this.meta.updateTag({
      name: 'description',
      content:
        'View the product roadmap for NGXSMK. Explore upcoming components, enterprise tool enhancements, and AI integration plans.',
    });
    this.meta.updateTag({ property: 'og:title', content: 'Roadmap — NGXSMK' });
    this.meta.updateTag({
      property: 'og:description',
      content:
        'View the product roadmap for NGXSMK. Explore upcoming components, enterprise tool enhancements, and AI integration plans.',
    });
  }
}
