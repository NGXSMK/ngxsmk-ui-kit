import { Component, inject, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { AppNav } from '../../nav/nav';
import { NgxsmkButton } from '@ngxsmk/core/button';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'community-page',
  standalone: true,
  imports: [AppNav, NgxsmkButton, TranslatePipe],
  template: `
    <app-nav />

    <div class="co">
      <!-- ═══════════════ HERO ═══════════════ -->
      <header class="co-hero">
        <div class="co-hero__inner">
          <span class="co-hero__pill">{{ 'community.pill' | translate }}</span>
          <h1 class="co-hero__title">{{ 'community.title' | translate }}</h1>
          <p class="co-hero__sub">
            {{ 'community.subtitle' | translate }}
          </p>
          <div class="co-hero__stats">
            <div class="co-hero__stat">
              <span class="co-hero__stat-val">{{ 'community.statOpen' | translate }}</span>
              <span class="co-hero__stat-label">{{ 'community.statSource' | translate }}</span>
            </div>
            <div class="co-hero__stat">
              <span class="co-hero__stat-val">{{ 'community.statMit' | translate }}</span>
              <span class="co-hero__stat-label">{{ 'community.statLicense' | translate }}</span>
            </div>
            <div class="co-hero__stat">
              <span class="co-hero__stat-val">200+</span>
              <span class="co-hero__stat-label">{{ 'community.statComponents' | translate }}</span>
            </div>
          </div>
        </div>
      </header>

      <!-- ═══════════════ CHANNELS ═══════════════ -->
      <section class="co-section">
        <h2 class="co-section__title">{{ 'community.channelTitle' | translate }}</h2>
        <p class="co-section__sub">
          {{ 'community.channelSub' | translate }}
        </p>

        <div class="co-channels">
          @for (ch of channels; track ch.titleKey) {
            <a class="co-channel" [href]="ch.href" target="_blank" rel="noopener">
              <div class="co-channel__icon" [innerHTML]="ch.icon"></div>
              <h3 class="co-channel__title">{{ ch.titleKey | translate }}</h3>
              <p class="co-channel__desc">{{ ch.descKey | translate }}</p>
              <span class="co-channel__link">
                {{ ch.ctaKey | translate }}
                <svg viewBox="0 0 16 16" fill="none" width="12" height="12">
                  <path
                    d="M4.5 11.5l7-7M5 4.5h7v7"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
            </a>
          }
        </div>
      </section>

      <!-- ═══════════════ GUIDELINES ═══════════════ -->
      <section class="co-section">
        <h2 class="co-section__title">{{ 'community.guidelinesTitle' | translate }}</h2>
        <p class="co-section__sub">
          {{ 'community.guidelinesSub' | translate }}
        </p>

        <div class="co-rules">
          @for (rule of rules; track rule.titleKey) {
            <div class="co-rule">
              <span class="co-rule__num">{{ rule.num }}</span>
              <div class="co-rule__body">
                <h4 class="co-rule__title">{{ rule.titleKey | translate }}</h4>
                <p class="co-rule__desc">{{ rule.descKey | translate }}</p>
              </div>
            </div>
          }
        </div>
      </section>

      <!-- ═══════════════ CODE OF CONDUCT ═══════════════ -->
      <section class="co-section">
        <div class="co-coc">
          <div class="co-coc__icon">
            <svg viewBox="0 0 24 24" fill="none" width="28" height="28">
              <path
                d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"
                stroke="currentColor"
                stroke-width="1.5"
              />
              <path
                d="M8 12l3 3 5-6"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <div class="co-coc__text">
            <h3 class="co-coc__title">{{ 'community.cocTitle' | translate }}</h3>
            <p class="co-coc__desc">
              {{ 'community.cocDesc' | translate }}
            </p>
          </div>
        </div>
      </section>

      <!-- ═══════════════ FOOTER CTA ═══════════════ -->
      <section class="co-footer">
        <div class="co-footer__card">
          <div class="co-footer__icon">
            <svg viewBox="0 0 24 24" fill="none" width="28" height="28">
              <path
                d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.607.069-.607 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.03-2.683-.103-.253-.447-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.748-1.025 2.748-1.025.546 1.377.203 2.394.1 2.647.64.699 1.026 1.592 1.026 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"
                fill="currentColor"
              />
            </svg>
          </div>
          <h3 class="co-footer__title">{{ 'community.footerTitle' | translate }}</h3>
          <p class="co-footer__sub">
            {{ 'community.footerSub' | translate }}
            <strong>{{ 'community.footerGoodFirst' | translate }}</strong>
            {{ 'community.footerSub2' | translate }}
          </p>
          <div class="co-footer__actions">
            <a
              ngxsmk-button
              href="https://github.com/ngxsmk/ngxsmk-ui-kit"
              target="_blank"
              rel="noopener"
            >
              {{ 'community.footerCta' | translate }}
            </a>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: `
    :host {
      --co-max: 820px;
      display: block;
      font-family: 'Inter', var(--ngxsmk-font-sans);
      color: var(--ngxsmk-color-on-background);
    }

    /* ═══════════════ HERO ═══════════════ */
    .co-hero {
      position: relative;
      overflow: hidden;
      padding: clamp(4rem, 8vw, 6rem) var(--ngxsmk-space-6, 1.5rem) clamp(2.5rem, 5vw, 4rem);
      text-align: center;
      background-image: radial-gradient(var(--ngxsmk-color-outline, #e4e4e7) 1px, transparent 1px);
      background-size: 24px 24px;
    }
    .co-hero::before {
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
    .co-hero__inner {
      position: relative;
      z-index: 1;
      max-width: 38rem;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .co-hero__pill {
      display: inline-flex;
      align-items: center;
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
    .co-hero__title {
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
    .co-hero__sub {
      font-size: var(--ngxsmk-text-body-lg-size, 1.0625rem);
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
      line-height: 1.65;
      margin: 0 0 var(--ngxsmk-space-6, 1.5rem);
      max-width: 34rem;
    }
    .co-hero__stats {
      display: flex;
      gap: var(--ngxsmk-space-10, 2.5rem);
    }
    .co-hero__stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.15rem;
    }
    .co-hero__stat-val {
      font-family: 'Outfit', var(--ngxsmk-font-sans), system-ui, sans-serif;
      font-size: 1.5rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: var(--ngxsmk-color-on-surface);
    }
    .co-hero__stat-label {
      font-size: var(--ngxsmk-text-body-xs-size, 0.75rem);
      font-weight: 500;
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    /* ═══════════════ SECTIONS ═══════════════ */
    .co-section {
      max-width: var(--co-max);
      margin: 0 auto;
      padding: var(--ngxsmk-space-10, 2.5rem) var(--ngxsmk-space-6, 1.5rem);
    }
    .co-section__title {
      font-family: 'Outfit', var(--ngxsmk-font-sans), system-ui, sans-serif;
      font-size: var(--ngxsmk-text-headline-sm-size, 1.25rem);
      font-weight: 700;
      letter-spacing: -0.02em;
      margin: 0 0 0.35rem;
      color: var(--ngxsmk-color-on-surface);
    }
    .co-section__sub {
      font-size: var(--ngxsmk-text-body-md-size, 0.9375rem);
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
      line-height: 1.6;
      margin: 0 0 var(--ngxsmk-space-6, 1.5rem);
    }

    /* ═══════════════ CHANNELS ═══════════════ */
    .co-channels {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(16rem, 100%), 1fr));
      gap: var(--ngxsmk-space-4, 1rem);
    }
    .co-channel {
      display: flex;
      flex-direction: column;
      padding: var(--ngxsmk-space-5, 1.25rem);
      background: var(--ngxsmk-color-surface, #fff);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-lg);
      text-decoration: none;
      color: inherit;
      transition:
        box-shadow 0.2s,
        transform 0.2s,
        border-color 0.2s;
    }
    .co-channel:hover {
      box-shadow: var(--ngxsmk-shadow-md);
      transform: translateY(-2px);
      border-color: var(--ngxsmk-color-primary);
    }
    .co-channel__icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      border-radius: var(--ngxsmk-radius-md);
      background: color-mix(in srgb, var(--ngxsmk-color-primary) 10%, transparent);
      color: var(--ngxsmk-color-primary);
      margin-bottom: var(--ngxsmk-space-3, 0.75rem);
      font-size: 1.25rem;
    }
    .co-channel__title {
      font-size: var(--ngxsmk-text-body-md-size, 0.9375rem);
      font-weight: 700;
      margin: 0 0 0.25rem;
      color: var(--ngxsmk-color-on-surface);
    }
    .co-channel__desc {
      font-size: var(--ngxsmk-text-body-sm-size, 0.8125rem);
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
      line-height: 1.55;
      margin: 0 0 auto;
      flex: 1;
    }
    .co-channel__link {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      margin-top: var(--ngxsmk-space-3, 0.75rem);
      font-size: var(--ngxsmk-text-body-sm-size, 0.8125rem);
      font-weight: 600;
      color: var(--ngxsmk-color-primary);
    }

    /* ═══════════════ RULES ═══════════════ */
    .co-rules {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .co-rule {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 0.75rem;
      border-radius: var(--ngxsmk-radius-md);
      transition: background 0.15s;
    }
    .co-rule:hover {
      background: color-mix(in srgb, var(--ngxsmk-color-on-surface) 3%, transparent);
    }
    .co-rule__num {
      flex-shrink: 0;
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: color-mix(in srgb, var(--ngxsmk-color-primary) 10%, transparent);
      color: var(--ngxsmk-color-primary);
      font-size: var(--ngxsmk-text-body-xs-size, 0.75rem);
      font-weight: 700;
    }
    .co-rule__body {
      flex: 1;
    }
    .co-rule__title {
      font-size: var(--ngxsmk-text-body-sm-size, 0.8125rem);
      font-weight: 700;
      margin: 0 0 0.15rem;
      color: var(--ngxsmk-color-on-surface);
    }
    .co-rule__desc {
      font-size: var(--ngxsmk-text-body-sm-size, 0.8125rem);
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
      line-height: 1.5;
      margin: 0;
    }

    /* ═══════════════ CODE OF CONDUCT ═══════════════ */
    .co-coc {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: var(--ngxsmk-space-5, 1.25rem);
      background: color-mix(in srgb, #22c55e 6%, var(--ngxsmk-color-surface, #fff));
      border: 1px solid color-mix(in srgb, #22c55e 20%, var(--ngxsmk-color-outline));
      border-radius: var(--ngxsmk-radius-lg);
    }
    .co-coc__icon {
      flex-shrink: 0;
      color: #22c55e;
      margin-top: 0.1rem;
    }
    .co-coc__title {
      font-size: var(--ngxsmk-text-body-md-size, 0.9375rem);
      font-weight: 700;
      margin: 0 0 0.25rem;
      color: var(--ngxsmk-color-on-surface);
    }
    .co-coc__desc {
      font-size: var(--ngxsmk-text-body-sm-size, 0.8125rem);
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
      line-height: 1.6;
      margin: 0;
    }

    /* ═══════════════ FOOTER CTA ═══════════════ */
    .co-footer {
      max-width: var(--co-max);
      margin: 0 auto;
      padding: var(--ngxsmk-space-6, 1.5rem);
      padding-bottom: var(--ngxsmk-space-16, 4rem);
    }
    .co-footer__card {
      text-align: center;
      padding: var(--ngxsmk-space-10, 2.5rem);
      background: var(--ngxsmk-color-surface, #fff);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-xl, 1rem);
    }
    .co-footer__icon {
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
    .co-footer__title {
      font-family: 'Outfit', var(--ngxsmk-font-sans), system-ui, sans-serif;
      font-size: var(--ngxsmk-text-headline-sm-size, 1.25rem);
      font-weight: 700;
      letter-spacing: -0.02em;
      margin: 0 0 0.5rem;
      color: var(--ngxsmk-color-on-surface);
    }
    .co-footer__sub {
      font-size: var(--ngxsmk-text-body-md-size, 0.9375rem);
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
      line-height: 1.6;
      margin: 0 0 var(--ngxsmk-space-5, 1.25rem);
      max-width: 28rem;
      margin-left: auto;
      margin-right: auto;
    }
    .co-footer__sub strong {
      color: var(--ngxsmk-color-on-surface);
      font-weight: 700;
    }

    /* ═══════════════ RESPONSIVE ═══════════════ */
    @media (max-width: 640px) {
      .co-hero {
        padding: var(--ngxsmk-space-10, 2.5rem) var(--ngxsmk-space-4, 1rem)
          var(--ngxsmk-space-8, 2rem);
      }
      .co-section {
        padding-left: var(--ngxsmk-space-4, 1rem);
        padding-right: var(--ngxsmk-space-4, 1rem);
      }
      .co-footer {
        padding-left: var(--ngxsmk-space-4, 1rem);
        padding-right: var(--ngxsmk-space-4, 1rem);
      }
      .co-hero__stats {
        gap: var(--ngxsmk-space-6, 1.5rem);
      }
    }
  `,
})
export class CommunityPage implements OnInit {
  private readonly titleService = inject(Title);
  private readonly meta = inject(Meta);

  protected readonly channels = [
    {
      titleKey: 'community.channelGithubTitle',
      descKey: 'community.channelGithubDesc',
      ctaKey: 'community.channelGithubCta',
      href: 'https://github.com/ngxsmk/ngxsmk-ui-kit/issues',
      icon: '<svg viewBox="0 0 24 24" fill="none" width="22" height="22"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.607.069-.607 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.03-2.683-.103-.253-.447-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.748-1.025 2.748-1.025.546 1.377.203 2.394.1 2.647.64.699 1.026 1.592 1.026 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" fill="currentColor"/></svg>',
    },
    {
      titleKey: 'community.channelPrTitle',
      descKey: 'community.channelPrDesc',
      ctaKey: 'community.channelPrCta',
      href: 'https://github.com/ngxsmk/ngxsmk-ui-kit/pulls',
      icon: '<svg viewBox="0 0 24 24" fill="none" width="22" height="22"><circle cx="18" cy="18" r="3" stroke="currentColor" stroke-width="1.5"/><circle cx="6" cy="6" r="3" stroke="currentColor" stroke-width="1.5"/><circle cx="6" cy="18" r="3" stroke="currentColor" stroke-width="1.5"/><path d="M6 9v6M18 9c0 6-12 6-12 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    },
    {
      titleKey: 'community.channelEmailTitle',
      descKey: 'community.channelEmailDesc',
      ctaKey: 'community.channelEmailCta',
      href: 'mailto:ngxsmk@gmail.com?subject=NGXSMK%20feedback',
      icon: '<svg viewBox="0 0 24 24" fill="none" width="22" height="22"><rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M2 7l10 6 10-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    },
    {
      titleKey: 'community.channelWhatsappTitle',
      descKey: 'community.channelWhatsappDesc',
      ctaKey: 'community.channelWhatsappCta',
      href: 'https://whatsapp.com/channel/0029Vb8PWpz1XquUOnGPUM2p',
      icon: '<svg viewBox="0 0 24 24" fill="none" width="22" height="22"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z" fill="currentColor"/><path d="M12 2C6.477 2 2 6.477 2 12c0 2.159.685 4.158 1.854 5.8L2.5 21.5l3.826-1.312A9.954 9.954 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.782 0-3.435-.468-4.869-1.284l-.349-.2-.228.078-2.259.775.789-2.203.084-.236-.217-.358A7.954 7.954 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" fill="currentColor"/></svg>',
    },
    {
      titleKey: 'community.channelDocsTitle',
      descKey: 'community.channelDocsDesc',
      ctaKey: 'community.channelDocsCta',
      href: 'https://github.com/ngxsmk/ngxsmk-ui-kit/tree/main/docs',
      icon: '<svg viewBox="0 0 24 24" fill="none" width="22" height="22"><path d="M4 4h16v16H4z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M8 8h8M8 12h6M8 16h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    },
  ];

  protected readonly rules = [
    {
      num: '01',
      titleKey: 'community.rule1Title',
      descKey: 'community.rule1Desc',
    },
    {
      num: '02',
      titleKey: 'community.rule2Title',
      descKey: 'community.rule2Desc',
    },
    {
      num: '03',
      titleKey: 'community.rule3Title',
      descKey: 'community.rule3Desc',
    },
    {
      num: '04',
      titleKey: 'community.rule4Title',
      descKey: 'community.rule4Desc',
    },
    {
      num: '05',
      titleKey: 'community.rule5Title',
      descKey: 'community.rule5Desc',
    },
    {
      num: '06',
      titleKey: 'community.rule6Title',
      descKey: 'community.rule6Desc',
    },
  ];

  ngOnInit(): void {
    this.titleService.setTitle('Community & Contributing — NGXSMK');
    this.meta.updateTag({
      name: 'description',
      content:
        'Join the NGXSMK community. Suggest features, report issues, and share feedback with the maintainers.',
    });
    this.meta.updateTag({ property: 'og:title', content: 'Community & Contributing — NGXSMK' });
    this.meta.updateTag({
      property: 'og:description',
      content:
        'Join the NGXSMK community. Suggest features, report issues, and share feedback with the maintainers.',
    });
  }
}
