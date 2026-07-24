import { Component, inject, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
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
  imports: [AppNav, NgxsmkButton],
  template: `
    <app-nav />

    <div class="rm">
      <!-- ═══════════════ HERO ═══════════════ -->
      <header class="rm-hero">
        <div class="rm-hero__inner">
          <span class="rm-hero__pill">Roadmap</span>
          <h1 class="rm-hero__title">What we're building next</h1>
          <p class="rm-hero__sub">
            A living preview of the features, tools, and infrastructure coming to NGXSMK. Milestones
            are reviewed quarterly.
          </p>
          <div class="rm-hero__stats">
            <div class="rm-hero__stat">
              <span class="rm-hero__stat-val" style="color: #22c55e">{{ shippedCount }}</span>
              <span class="rm-hero__stat-label">Shipped</span>
            </div>
            <div class="rm-hero__stat">
              <span class="rm-hero__stat-val" style="color: #f59e0b">{{ inProgressCount }}</span>
              <span class="rm-hero__stat-label">In Progress</span>
            </div>
            <div class="rm-hero__stat">
              <span class="rm-hero__stat-val" style="color: #7c3aed">{{ plannedCount }}</span>
              <span class="rm-hero__stat-label">Planned</span>
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
                      ? 'In Progress'
                      : m.status === 'shipped'
                        ? 'Shipped'
                        : 'Planned'
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
          <h3 class="rm-footer__title">Have a feature request?</h3>
          <p class="rm-footer__sub">
            We ship based on community feedback. Open an issue or start a discussion on GitHub.
          </p>
          <div class="rm-footer__actions">
            <a
              ngxsmk-button
              variant="outline"
              href="https://github.com/ngxsmk/ngxsmk-ui-kit/issues"
              target="_blank"
              rel="noopener"
            >
              Request a feature
            </a>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: `
    :host {
      --rm-max: 760px;
      display: block;
      font-family: 'Inter', var(--ngxsmk-font-sans);
      color: var(--ngxsmk-color-on-background);
    }

    /* ═══════════════ HERO ═══════════════ */
    .rm-hero {
      position: relative;
      overflow: hidden;
      padding: clamp(4rem, 8vw, 6rem) var(--ngxsmk-space-6, 1.5rem) clamp(2.5rem, 5vw, 4rem);
      text-align: center;
      background-image: radial-gradient(var(--ngxsmk-color-outline, #e4e4e7) 1px, transparent 1px);
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
        color-mix(in srgb, var(--ngxsmk-color-primary) 12%, transparent),
        transparent 70%
      );
    }
    .rm-hero__inner {
      position: relative;
      z-index: 1;
      max-width: 38rem;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .rm-hero__pill {
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
    .rm-hero__title {
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
    .rm-hero__sub {
      font-size: var(--ngxsmk-text-body-lg-size, 1.0625rem);
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
      line-height: 1.65;
      margin: 0 0 var(--ngxsmk-space-6, 1.5rem);
      max-width: 34rem;
    }
    .rm-hero__stats {
      display: flex;
      gap: var(--ngxsmk-space-10, 2.5rem);
    }
    .rm-hero__stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.15rem;
    }
    .rm-hero__stat-val {
      font-family: 'Outfit', var(--ngxsmk-font-sans), system-ui, sans-serif;
      font-size: 1.5rem;
      font-weight: 800;
      letter-spacing: -0.02em;
    }
    .rm-hero__stat-label {
      font-size: var(--ngxsmk-text-body-xs-size, 0.75rem);
      font-weight: 500;
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    /* ═══════════════ LEGEND ═══════════════ */
    .rm-legend {
      max-width: var(--rm-max);
      margin: 0 auto;
      padding: var(--ngxsmk-space-6, 1.5rem) var(--ngxsmk-space-6, 1.5rem) 0;
      display: flex;
      gap: 1.25rem;
      flex-wrap: wrap;
    }
    .rm-legend__item {
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }
    .rm-legend__dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }
    .rm-legend__label {
      font-size: var(--ngxsmk-text-body-sm-size, 0.8125rem);
      font-weight: 500;
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
    }

    /* ═══════════════ TIMELINE ═══════════════ */
    .rm-timeline {
      max-width: var(--rm-max);
      margin: 0 auto;
      padding: var(--ngxsmk-space-8, 2rem) var(--ngxsmk-space-6, 1.5rem);
      position: relative;
    }
    .rm-timeline__line {
      position: absolute;
      left: calc(var(--ngxsmk-space-6, 1.5rem) + 5px);
      top: var(--ngxsmk-space-8, 2rem);
      bottom: 0;
      width: 2px;
      background: linear-gradient(
        180deg,
        var(--ngxsmk-color-outline, #e4e4e7),
        color-mix(in srgb, var(--ngxsmk-color-outline, #e4e4e7) 30%, transparent)
      );
    }

    /* ═══════════════ CARD ═══════════════ */
    .rm-card {
      position: relative;
      padding-left: 2rem;
      padding-bottom: var(--ngxsmk-space-10, 2.5rem);
    }
    .rm-card:last-child {
      padding-bottom: 0;
    }
    .rm-card--current .rm-card__head {
      background: color-mix(in srgb, #f59e0b 6%, var(--ngxsmk-color-surface, #fff));
      border-color: color-mix(in srgb, #f59e0b 25%, var(--ngxsmk-color-outline));
    }
    .rm-card__dot {
      position: absolute;
      left: 0;
      top: 0.55rem;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      z-index: 1;
    }

    .rm-card__head {
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-lg);
      padding: var(--ngxsmk-space-5, 1.25rem);
      background: var(--ngxsmk-color-surface, #fff);
      margin-bottom: 0.75rem;
      transition:
        border-color 0.2s,
        background 0.2s;
    }
    .rm-card__head-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
      flex-wrap: wrap;
      margin-bottom: 0.35rem;
    }
    .rm-card__quarter {
      font-family: 'Outfit', var(--ngxsmk-font-sans), system-ui, sans-serif;
      font-size: var(--ngxsmk-text-body-sm-size, 0.8125rem);
      font-weight: 700;
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }
    .rm-card__status {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      padding: 0.2rem 0.6rem;
      border-radius: var(--ngxsmk-radius-full, 999px);
      font-size: var(--ngxsmk-text-body-xs-size, 0.75rem);
      font-weight: 700;
      letter-spacing: 0.03em;
    }
    .rm-card__title {
      font-family: 'Outfit', var(--ngxsmk-font-sans), system-ui, sans-serif;
      font-size: var(--ngxsmk-text-headline-sm-size, 1.25rem);
      font-weight: 700;
      letter-spacing: -0.02em;
      margin: 0 0 0.25rem;
      color: var(--ngxsmk-color-on-surface);
    }
    .rm-card__desc {
      font-size: var(--ngxsmk-text-body-sm-size, 0.8125rem);
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
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
      gap: 0.35rem;
    }
    .rm-item {
      display: flex;
      align-items: flex-start;
      gap: 0.6rem;
      padding: 0.45rem 0.65rem;
      border-radius: var(--ngxsmk-radius-md);
      transition: background 0.15s;
    }
    .rm-item:hover {
      background: color-mix(in srgb, var(--ngxsmk-color-on-surface) 4%, transparent);
    }
    .rm-item--done .rm-item__name {
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
    }
    .rm-item__check {
      flex-shrink: 0;
      width: 18px;
      height: 18px;
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
      gap: 0.1rem;
    }
    .rm-item__name {
      font-size: var(--ngxsmk-text-body-sm-size, 0.8125rem);
      font-weight: 500;
      color: var(--ngxsmk-color-on-surface);
      line-height: 1.4;
    }
    .rm-item__detail {
      font-size: var(--ngxsmk-text-body-xs-size, 0.75rem);
      color: var(--ngxsmk-color-on-surface-variant, #a1a1aa);
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
