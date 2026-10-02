import { Component, computed, input, signal, Type, reflectComponentType } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

type ApiPanel = 'code' | 'api' | 'customize';

/**
 * Reusable showcase block: a titled, described live demo of a single
 * component (or small group of related components) with an optional
 * collapsible code snippet. Used by every category page so the whole
 * demo stays consistent.
 */
@Component({
  selector: 'showcase-example',
  standalone: true,
  imports: [TranslatePipe],
  host: {
    '[attr.id]': 'elementId()',
  },
  template: `
    <div class="ngxsmk-sc-ex">
      <div class="ngxsmk-sc-ex__head">
        <div class="traffic-lights" aria-hidden="true">
          <span class="light red"></span>
          <span class="light yellow"></span>
          <span class="light green"></span>
        </div>
        <div class="ngxsmk-sc-ex__heading">
          <div class="ngxsmk-sc-ex__title-row">
            <h3 class="ngxsmk-sc-ex__title">{{ title() }}</h3>
            @if (displaySelector()) {
              <button
                type="button"
                class="ngxsmk-sc-ex__selector-pill"
                (click)="copySelector()"
                [title]="
                  copiedSelector()
                    ? ('showcaseExample.copied' | translate)
                    : 'Click to copy selector'
                "
                [attr.aria-label]="'Copy selector ' + displaySelector()"
              >
                <code>{{ displaySelector() }}</code>
                @if (copiedSelector()) {
                  <span class="ngxsmk-sc-ex__selector-copied">
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="3"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {{ 'showcaseExample.copied' | translate }}
                  </span>
                } @else {
                  <svg
                    class="ngxsmk-sc-ex__selector-icon"
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <rect x="9" y="9" width="13" height="13" rx="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                }
              </button>
            }
          </div>
          @if (description()) {
            <p class="ngxsmk-sc-ex__desc">{{ description() }}</p>
          }
        </div>
        <div class="ngxsmk-sc-ex__viewports" role="group" aria-label="Preview viewport size">
          <button
            type="button"
            class="ngxsmk-sc-ex__vp-btn"
            [class.ngxsmk-sc-ex__vp-btn--active]="viewport() === 'full'"
            (click)="viewport.set('full')"
            title="Desktop (100%)"
            aria-label="Desktop viewport"
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          </button>
          <button
            type="button"
            class="ngxsmk-sc-ex__vp-btn"
            [class.ngxsmk-sc-ex__vp-btn--active]="viewport() === 'tablet'"
            (click)="viewport.set('tablet')"
            title="Tablet (768px)"
            aria-label="Tablet viewport"
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <rect x="4" y="2" width="16" height="20" rx="2" />
              <line x1="12" y1="18" x2="12.01" y2="18" />
            </svg>
          </button>
          <button
            type="button"
            class="ngxsmk-sc-ex__vp-btn"
            [class.ngxsmk-sc-ex__vp-btn--active]="viewport() === 'mobile'"
            (click)="viewport.set('mobile')"
            title="Mobile (380px)"
            aria-label="Mobile viewport"
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <rect x="6" y="2" width="12" height="20" rx="2" />
              <line x1="12" y1="18" x2="12.01" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      <div class="ngxsmk-sc-ex__preview" [attr.data-viewport]="viewport()">
        <div
          class="ngxsmk-sc-ex__preview-content"
          [class.ngxsmk-sc-ex__preview-content--tablet]="viewport() === 'tablet'"
          [class.ngxsmk-sc-ex__preview-content--mobile]="viewport() === 'mobile'"
        >
          <ng-content />
        </div>
        @if (code()) {
          <button
            class="ngxsmk-sc-ex__copy-btn"
            type="button"
            (click)="copyPreviewCode()"
            [attr.aria-label]="'showcaseExample.copy' | translate"
          >
            @if (copiedPreview()) {
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {{ 'showcaseExample.copied' | translate }}
            } @else {
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              {{ 'showcaseExample.copyCode' | translate }}
            }
          </button>
        }
      </div>

      <div class="ngxsmk-sc-ex__actions">
        @if (code()) {
          <button
            class="ngxsmk-sc-ex__tab"
            type="button"
            [class.ngxsmk-sc-ex__tab--active]="panel() === 'code'"
            (click)="toggle('code')"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
            {{ 'showcaseExample.code' | translate }}
          </button>
        }
        @if (component()) {
          <button
            class="ngxsmk-sc-ex__tab"
            type="button"
            [class.ngxsmk-sc-ex__tab--active]="panel() === 'api'"
            (click)="toggle('api')"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            {{ 'showcaseExample.api' | translate }}
          </button>
        }
        @if (customize()) {
          <button
            class="ngxsmk-sc-ex__tab"
            type="button"
            [class.ngxsmk-sc-ex__tab--active]="panel() === 'customize'"
            (click)="toggle('customize')"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="3" />
              <path
                d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
              />
            </svg>
            {{ 'showcaseExample.customize' | translate }}
          </button>
        }
        @if (code()) {
          <button
            class="ngxsmk-sc-ex__tab ngxsmk-sc-ex__tab--stackblitz"
            type="button"
            (click)="openStackBlitz()"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            StackBlitz
          </button>
        }
      </div>

      @if (panel() === 'code' && code()) {
        <div class="ngxsmk-sc-ex__code-wrap">
          <div class="ngxsmk-sc-ex__code-header">
            <div class="ngxsmk-sc-ex__code-tag">
              <span class="ngxsmk-sc-ex__code-dot"></span>
              <span>ANGULAR COMPONENT TEMPLATE</span>
            </div>
            <button
              class="ngxsmk-sc-ex__code-copy"
              type="button"
              (click)="copyCode()"
              [attr.aria-label]="'showcaseExample.copyCode' | translate"
            >
              @if (copiedCode()) {
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {{ 'showcaseExample.copied' | translate }}
              } @else {
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                {{ 'showcaseExample.copyCode' | translate }}
              }
            </button>
          </div>
          <pre class="ngxsmk-sc-ex__code"><code>{{ code() }}</code></pre>
        </div>
      }

      @if (panel() === 'api' && component()) {
        <div class="ngxsmk-sc-ex__api">
          @if (inputs().length) {
            <h4 class="ngxsmk-sc-ex__api-title">
              <span class="ngxsmk-sc-ex__api-dot"></span>
              {{ 'showcaseExample.inputsProperties' | translate }}
            </h4>
            <div class="ngxsmk-sc-ex__table-wrap">
              <table class="ngxsmk-sc-ex__table">
                <thead>
                  <tr>
                    <th>{{ 'showcaseExample.thProperty' | translate }}</th>
                    <th>{{ 'showcaseExample.thAttribute' | translate }}</th>
                    <th>{{ 'showcaseExample.thKind' | translate }}</th>
                  </tr>
                </thead>
                <tbody>
                  @for (i of inputs(); track i.propName) {
                    <tr>
                      <td>
                        <code>{{ i.propName }}</code>
                      </td>
                      <td>
                        <code>{{ i.templateName }}</code>
                      </td>
                      <td>
                        <span
                          class="ngxsmk-sc-ex__badge"
                          [class.ngxsmk-sc-ex__badge--model]="isModel(i.propName)"
                          [class.ngxsmk-sc-ex__badge--signal]="i.isSignal && !isModel(i.propName)"
                        >
                          {{
                            isModel(i.propName)
                              ? ('showcaseExample.twoWay' | translate)
                              : i.isSignal
                                ? ('showcaseExample.signal' | translate)
                                : ('showcaseExample.regular' | translate)
                          }}
                        </span>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
          @if (outputs().length) {
            <h4 class="ngxsmk-sc-ex__api-title">
              <span class="ngxsmk-sc-ex__api-dot ngxsmk-sc-ex__api-dot--amber"></span>
              {{ 'showcaseExample.outputsEvents' | translate }}
            </h4>
            <div class="ngxsmk-sc-ex__table-wrap">
              <table class="ngxsmk-sc-ex__table">
                <thead>
                  <tr>
                    <th>{{ 'showcaseExample.thProperty' | translate }}</th>
                    <th>{{ 'showcaseExample.thEvent' | translate }}</th>
                    <th>{{ 'showcaseExample.thKind' | translate }}</th>
                  </tr>
                </thead>
                <tbody>
                  @for (o of outputs(); track o.propName) {
                    <tr>
                      <td>
                        <code>{{ o.propName }}</code>
                      </td>
                      <td>
                        <code>{{ o.templateName }}</code>
                      </td>
                      <td>
                        <span class="ngxsmk-sc-ex__badge ngxsmk-sc-ex__badge--event"> event </span>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
          <p class="ngxsmk-sc-ex__api-note">
            Customize through design tokens — override the component's <code>--ngxsmk-*</code>
            variables on the host element or at the theme level. Switch to the
            <strong>Customize</strong> tab for a concrete snippet.
          </p>
        </div>
      }

      @if (panel() === 'customize' && customize()) {
        <div class="ngxsmk-sc-ex__code-wrap">
          <div class="ngxsmk-sc-ex__code-header">
            <div class="ngxsmk-sc-ex__code-tag">
              <span class="ngxsmk-sc-ex__code-dot ngxsmk-sc-ex__code-dot--amber"></span>
              <span>DESIGN TOKEN CSS OVERRIDE</span>
            </div>
          </div>
          <pre class="ngxsmk-sc-ex__code"><code>{{ customize() }}</code></pre>
        </div>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
      scroll-margin-top: 5rem;
    }

    .ngxsmk-sc-ex {
      position: relative;
      width: 100%;
      border: 1px solid var(--color-border, #e2e8f0);
      border-radius: var(--radius-xl, 20px);
      background: var(--color-bg-card, #ffffff);
      margin-block-end: 2rem;
      overflow: hidden;
      box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.05);
      transition:
        border-color 0.22s ease,
        box-shadow 0.22s ease;
      z-index: auto;
    }

    .ngxsmk-sc-ex:hover {
      border-color: rgba(99, 102, 241, 0.45);
      box-shadow: 0 16px 36px -8px rgba(99, 102, 241, 0.12);
    }

    /* Lift the active example so select/menu/popover clear the next card. */
    .ngxsmk-sc-ex:focus-within {
      z-index: 20;
    }

    .ngxsmk-sc-ex__head {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem 1rem;
      padding: 0.85rem 1.25rem;
      background: var(--color-bg-elevated, #f1f5f9);
      border-bottom: 1px solid var(--color-border, #e2e8f0);
    }

    .traffic-lights {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      margin-right: 0.25rem;
    }

    .traffic-lights .light {
      width: 9px;
      height: 9px;
      border-radius: 50%;
    }

    .traffic-lights .light.red {
      background: #ef4444;
    }
    .traffic-lights .light.yellow {
      background: #f59e0b;
    }
    .traffic-lights .light.green {
      background: #10b981;
    }

    .ngxsmk-sc-ex__heading {
      min-width: 0;
      flex: 1;
    }

    .ngxsmk-sc-ex__title-row {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.65rem;
    }

    .ngxsmk-sc-ex__title {
      margin: 0;
      font-family: var(--font-family-display, sans-serif);
      font-size: 1.08rem;
      font-weight: 750;
      letter-spacing: -0.02em;
      color: var(--color-text-main, #0f172a);
    }

    .ngxsmk-sc-ex__selector-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.2rem 0.6rem;
      border-radius: 9999px;
      background: rgba(99, 102, 241, 0.08);
      border: 1px solid rgba(99, 102, 241, 0.25);
      color: #6366f1;
      font-size: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease;
      user-select: none;
    }

    .ngxsmk-sc-ex__selector-pill:hover {
      background: rgba(99, 102, 241, 0.16);
      border-color: #6366f1;
      transform: translateY(-1px);
    }

    .ngxsmk-sc-ex__selector-pill code {
      font-family: var(--font-family-mono, monospace);
      font-size: 0.75rem;
      color: inherit;
    }

    .ngxsmk-sc-ex__selector-copied {
      display: inline-flex;
      align-items: center;
      gap: 0.2rem;
      color: #10b981;
      font-weight: 700;
    }

    .ngxsmk-sc-ex__desc {
      margin: 0.25rem 0 0;
      font-size: 0.86rem;
      line-height: 1.55;
      color: var(--color-text-muted, #334155);
    }

    .ngxsmk-sc-ex__viewports {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      padding: 3px;
      border-radius: 9999px;
      background: var(--color-bg-card, #ffffff);
      border: 1px solid var(--color-border, #e2e8f0);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
    }

    .ngxsmk-sc-ex__vp-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1.85rem;
      height: 1.85rem;
      border: none;
      border-radius: 9999px;
      background: transparent;
      color: var(--color-text-dim, #64748b);
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .ngxsmk-sc-ex__vp-btn:hover {
      color: var(--color-text-main, #0f172a);
    }

    .ngxsmk-sc-ex__vp-btn--active {
      background: linear-gradient(
        135deg,
        var(--brand-primary, #6366f1),
        var(--brand-primary-dark, #4f46e5)
      );
      color: #ffffff;
      box-shadow: 0 2px 6px rgba(99, 102, 241, 0.35);
    }

    .ngxsmk-sc-ex__preview {
      position: relative;
      z-index: 0;
      padding: 2.25rem 1.75rem;
      overflow: visible;
      background-color: var(--color-bg-card, #ffffff);
      background-image: radial-gradient(
        color-mix(in srgb, var(--brand-primary, #6366f1) 12%, transparent) 1px,
        transparent 1px
      );
      background-size: 18px 18px;
      transition: padding 0.2s ease;
    }

    .ngxsmk-sc-ex__preview-content {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      align-items: center;
      width: 100%;
      min-width: 0;
      transition:
        max-width 0.25s cubic-bezier(0.16, 1, 0.3, 1),
        box-shadow 0.25s ease;
    }

    .ngxsmk-sc-ex__preview-content--tablet {
      max-width: 768px !important;
      margin: 0 auto;
      border: 1px dashed color-mix(in srgb, var(--brand-primary, #6366f1) 40%, transparent);
      border-radius: var(--radius-md, 12px);
      padding: 1.5rem;
      background: var(--color-bg-card, #ffffff);
      box-shadow: 0 8px 24px -4px rgba(0, 0, 0, 0.08);
    }

    .ngxsmk-sc-ex__preview-content--mobile {
      max-width: 380px !important;
      margin: 0 auto;
      border: 1px dashed color-mix(in srgb, var(--brand-primary, #6366f1) 40%, transparent);
      border-radius: var(--radius-lg, 16px);
      padding: 1.5rem;
      background: var(--color-bg-card, #ffffff);
      box-shadow: 0 8px 24px -4px rgba(0, 0, 0, 0.08);
    }

    /* Full-bleed demos: tables, AI, grids — don't shrink beside siblings. */
    .ngxsmk-sc-ex__preview-content > .ngxsmk-sc-surface,
    .ngxsmk-sc-ex__preview-content > .ngxsmk-sc-grid,
    .ngxsmk-sc-ex__preview-content > .ngxsmk-sc-col,
    .ngxsmk-sc-ex__preview-content > .ngxsmk-scroll-x,
    .ngxsmk-sc-ex__preview-content > ngxsmk-data-table,
    .ngxsmk-sc-ex__preview-content > ngxsmk-table,
    .ngxsmk-sc-ex__preview-content > ngxsmk-ai-chat,
    .ngxsmk-sc-ex__preview-content > ngxsmk-spreadsheet,
    .ngxsmk-sc-ex__preview-content > ngxsmk-chat-layout,
    .ngxsmk-sc-ex__preview-content > ngxsmk-kanban-board {
      flex: 1 1 100%;
      max-width: 100%;
      min-width: 0;
    }

    .ngxsmk-sc-ex__copy-btn {
      position: absolute;
      top: 0.85rem;
      right: 0.85rem;
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.35rem 0.75rem;
      border: 1px solid var(--color-border, #e2e8f0);
      border-radius: 9999px;
      background: color-mix(in srgb, var(--color-bg-card, #ffffff) 85%, transparent);
      backdrop-filter: blur(8px);
      color: var(--color-text-muted, #334155);
      font-family: inherit;
      font-size: 0.72rem;
      font-weight: 600;
      cursor: pointer;
      opacity: 0;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
      transition: all 0.18s ease;
      z-index: 5;
    }

    .ngxsmk-sc-ex:hover .ngxsmk-sc-ex__copy-btn {
      opacity: 1;
    }

    .ngxsmk-sc-ex__copy-btn:hover {
      background: var(--color-bg-card, #ffffff);
      color: var(--brand-primary, #6366f1);
      border-color: var(--brand-primary, #6366f1);
      transform: translateY(-1px);
    }

    .ngxsmk-sc-ex__actions {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 6px;
      padding: 0.55rem 1.15rem;
      border-top: 1px solid var(--color-border, #e2e8f0);
      background: var(--color-bg-elevated, #f1f5f9);
    }

    .ngxsmk-sc-ex__tab {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0.35rem 0.85rem;
      border: none;
      border-radius: 9999px;
      background: transparent;
      color: var(--color-text-muted, #334155);
      font-family: var(--font-family-body, sans-serif);
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease;
      white-space: nowrap;
    }

    .ngxsmk-sc-ex__tab:hover {
      background: color-mix(in srgb, var(--brand-primary, #6366f1) 8%, transparent);
      color: var(--color-text-main, #0f172a);
    }

    .ngxsmk-sc-ex__tab--active {
      background: linear-gradient(
        135deg,
        var(--brand-primary, #6366f1),
        var(--brand-primary-dark, #4f46e5)
      ) !important;
      color: #ffffff !important;
      font-weight: 700;
      box-shadow: 0 2px 8px rgba(99, 102, 241, 0.35);
    }

    .ngxsmk-sc-ex__tab--active:hover {
      background: linear-gradient(
        135deg,
        var(--brand-primary-light, #818cf8),
        var(--brand-primary, #6366f1)
      ) !important;
    }

    .ngxsmk-sc-ex__tab--stackblitz {
      margin-left: auto;
      color: var(--brand-primary, #6366f1);
      font-weight: 600;
    }

    .ngxsmk-sc-ex__tab--stackblitz:hover {
      background: rgba(99, 102, 241, 0.12);
      color: var(--brand-primary, #6366f1);
    }

    .ngxsmk-sc-ex__code-wrap {
      position: relative;
      background: #0b0f19;
      border-top: 1px solid #1e293b;
    }

    .ngxsmk-sc-ex__code-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.55rem 1.25rem;
      background: #070a10;
      border-bottom: 1px solid #1e293b;
      font-size: 0.72rem;
      color: #94a3b8;
    }

    .ngxsmk-sc-ex__code-tag {
      display: flex;
      align-items: center;
      gap: 0.45rem;
      font-family: var(--font-family-mono, monospace);
      font-weight: 600;
      letter-spacing: 0.05em;
    }

    .ngxsmk-sc-ex__code-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #6366f1;
    }

    .ngxsmk-sc-ex__code-dot--amber {
      background: #f59e0b;
    }

    .ngxsmk-sc-ex__code-copy {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.25rem 0.65rem;
      border: 1px solid #334155;
      border-radius: 8px;
      background: #1e293b;
      color: #cbd5e1;
      font-family: var(--font-family-body, sans-serif);
      font-size: 0.72rem;
      font-weight: 600;
      cursor: pointer;
      z-index: 2;
      transition:
        background 0.15s,
        color 0.15s,
        border-color 0.15s;
    }

    .ngxsmk-sc-ex__code-copy:hover {
      background: #334155;
      color: #ffffff;
      border-color: #6366f1;
    }

    .ngxsmk-sc-ex__code {
      margin: 0;
      padding: 1.25rem 1.5rem;
      background: #0b0f19;
      color: #f8fafc;
      font-family: var(--font-family-mono, monospace);
      font-size: 0.82rem;
      line-height: 1.65;
      overflow-x: auto;
      white-space: pre;
    }

    .ngxsmk-sc-ex__api {
      padding: 1.25rem 1.5rem;
      border-top: 1px solid var(--color-border, #e2e8f0);
      background: var(--color-bg-card, #ffffff);
    }

    .ngxsmk-sc-ex__api-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 0 0 0.75rem;
      font-family: var(--font-family-display, sans-serif);
      font-size: 0.95rem;
      font-weight: 700;
      letter-spacing: -0.01em;
      color: var(--color-text-main, #0f172a);
    }

    .ngxsmk-sc-ex__api-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #6366f1;
    }

    .ngxsmk-sc-ex__api-dot--amber {
      background: #f59e0b;
    }

    .ngxsmk-sc-ex__api-title + .ngxsmk-sc-ex__api-title {
      margin-top: 1.5rem;
    }

    .ngxsmk-sc-ex__table-wrap {
      overflow-x: auto;
      border: 1px solid var(--color-border, #e2e8f0);
      border-radius: var(--radius-md, 12px);
      margin-bottom: 1.25rem;
    }

    .ngxsmk-sc-ex__table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.84rem;
    }

    .ngxsmk-sc-ex__table th,
    .ngxsmk-sc-ex__table td {
      text-align: left;
      padding: 0.65rem 0.95rem;
      border-bottom: 1px solid var(--color-border, #e2e8f0);
      color: var(--color-text-main, #0f172a);
      white-space: nowrap;
    }

    .ngxsmk-sc-ex__table tr:last-child td {
      border-bottom: none;
    }

    .ngxsmk-sc-ex__table th {
      font-weight: 600;
      color: var(--color-text-muted, #64748b);
      background: var(--color-bg-elevated, #f1f5f9);
      font-size: 0.78rem;
      letter-spacing: 0.02em;
      text-transform: uppercase;
    }

    .ngxsmk-sc-ex__table td code {
      font-family: var(--font-family-mono, monospace);
      font-size: 0.8rem;
      background: rgba(99, 102, 241, 0.08);
      color: #6366f1;
      padding: 0.15rem 0.45rem;
      border-radius: 6px;
    }

    .ngxsmk-sc-ex__badge {
      display: inline-flex;
      align-items: center;
      padding: 0.15rem 0.55rem;
      border-radius: 9999px;
      font-size: 0.7rem;
      font-weight: 600;
      line-height: 1.4;
      background: rgba(148, 163, 184, 0.15);
      color: #64748b;
    }

    .ngxsmk-sc-ex__badge--model {
      background: rgba(99, 102, 241, 0.12);
      color: #6366f1;
      border: 1px solid rgba(99, 102, 241, 0.25);
    }

    .ngxsmk-sc-ex__badge--signal {
      background: rgba(16, 185, 129, 0.12);
      color: #10b981;
      border: 1px solid rgba(16, 185, 129, 0.25);
    }

    .ngxsmk-sc-ex__badge--event {
      background: rgba(245, 158, 11, 0.12);
      color: #f59e0b;
      border: 1px solid rgba(245, 158, 11, 0.25);
    }

    .ngxsmk-sc-ex__api-note {
      margin: 0.75rem 0 0;
      font-size: 0.82rem;
      line-height: 1.55;
      color: var(--color-text-dim, #64748b);
    }

    .ngxsmk-sc-ex__api-note code {
      font-family: var(--font-family-mono, monospace);
      font-size: 0.8rem;
      color: var(--brand-primary, #6366f1);
    }

    @media (max-width: 480px) {
      .ngxsmk-sc-ex__head {
        padding: 0.75rem 1rem;
      }

      .ngxsmk-sc-ex__preview {
        padding: 1.25rem;
      }

      .ngxsmk-sc-ex__actions {
        padding: 0.375rem 0.5rem;
      }

      .ngxsmk-sc-ex__code,
      .ngxsmk-sc-ex__api {
        padding: 0.75rem 1rem;
      }
    }
  `,
})
export class ShowcaseExample {
  readonly title = input.required<string>();
  readonly description = input<string>('');
  /** Optional source snippet shown in a collapsible panel. */
  readonly code = input<string>('');
  /**
   * Optional component class. When provided, the "API" panel lists the
   * component's public inputs (properties + attributes) and outputs,
   * extracted at runtime via `reflectComponentType`.
   */
  readonly component = input<Type<unknown> | null>(null);
  /** Optional customization snippet shown in the "Customize" panel. */
  readonly customize = input<string>('');

  protected readonly panel = signal<ApiPanel | null>(null);
  protected readonly viewport = signal<'full' | 'tablet' | 'mobile'>('full');
  protected readonly copiedCode = signal(false);
  protected readonly copiedPreview = signal(false);
  protected readonly copiedSelector = signal(false);

  protected toggle(panel: ApiPanel): void {
    this.panel.update((current) => (current === panel ? null : panel));
  }

  protected readonly metadata = computed(() => {
    const component = this.component();
    return component ? reflectComponentType(component as Type<unknown>) : null;
  });

  protected readonly inputs = computed(() => this.metadata()?.inputs ?? []);

  protected readonly outputs = computed(() => this.metadata()?.outputs ?? []);

  /** Names of the component's outputs, used to detect two-way (`model`) inputs. */
  protected readonly outputNames = computed(() => new Set(this.outputs().map((o) => o.propName)));

  /** A `model()` input exposes a `propNameChange` output - mark it as two-way. */
  protected isModel(propName: string): boolean {
    return this.outputNames().has(`${propName}Change`);
  }

  protected readonly selector = computed(() => {
    const meta = this.metadata();
    if (!meta?.selector) return '';
    return meta.selector.split(',')[0].trim();
  });

  protected readonly displaySelector = computed(() => {
    const sel = this.selector();
    if (!sel) return '';
    if (sel.includes('[')) {
      const match = sel.match(/\[([^\]]+)\]/);
      if (match) return `[${match[1]}]`;
      return sel;
    }
    return `<${sel}>`;
  });

  protected copySelector(): void {
    const sel = this.displaySelector();
    if (!sel) return;
    navigator.clipboard.writeText(sel).then(() => {
      this.copiedSelector.set(true);
      setTimeout(() => this.copiedSelector.set(false), 1500);
    });
  }

  protected readonly elementId = computed(() => {
    return this.title()
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-');
  });

  protected copyCode(): void {
    if (!this.code()) return;
    navigator.clipboard.writeText(this.code()).then(() => {
      this.copiedCode.set(true);
      setTimeout(() => this.copiedCode.set(false), 1500);
    });
  }

  protected copyPreviewCode(): void {
    if (!this.code()) return;
    navigator.clipboard.writeText(this.code()).then(() => {
      this.copiedPreview.set(true);
      setTimeout(() => this.copiedPreview.set(false), 1500);
    });
  }

  protected openStackBlitz(): void {
    if (typeof document === 'undefined') return;
    if (!this.code()) return;

    const project = {
      title: `NGXSMK - ${this.title()}`,
      description: this.description() || 'NGXSMK Component Live Sandbox',
      template: 'node' as const,
      files: {
        'package.json': JSON.stringify(
          {
            name: 'ngxsmk-demo',
            version: '0.0.0',
            scripts: {
              start: 'ng serve',
              build: 'ng build',
            },
            dependencies: {
              '@angular/core': '^19.0.0',
              '@angular/common': '^19.0.0',
              '@angular/compiler': '^19.0.0',
              '@angular/forms': '^19.0.0',
              '@angular/platform-browser': '^19.0.0',
              '@angular/platform-browser-dynamic': '^19.0.0',
              '@angular/router': '^19.0.0',
              '@ngxsmk/core': 'latest',
              '@ngxsmk/theme': 'latest',
              rxjs: '~7.8.0',
              tslib: '^2.3.0',
              'zone.js': '~0.15.0',
            },
            devDependencies: {
              '@angular-devkit/build-angular': '^19.0.0',
              '@angular/cli': '^19.0.0',
              '@angular/compiler-cli': '^19.0.0',
              typescript: '~5.6.0',
            },
          },
          null,
          2,
        ),
        'angular.json': JSON.stringify(
          {
            $schema: './node_modules/@angular/cli/lib/config/schema.json',
            version: 1,
            newProjectRoot: 'projects',
            projects: {
              demo: {
                projectType: 'application',
                root: '',
                sourceRoot: 'src',
                architect: {
                  build: {
                    builder: '@angular-devkit/build-angular:application',
                    options: {
                      outputPath: 'dist/demo',
                      index: 'src/index.html',
                      browser: 'src/main.ts',
                      polyfills: ['zone.js'],
                      tsConfig: 'tsconfig.app.json',
                      styles: ['src/styles.css'],
                    },
                  },
                  serve: {
                    builder: '@angular-devkit/build-angular:dev-server',
                    options: { buildTarget: 'demo:build' },
                  },
                },
              },
            },
          },
          null,
          2,
        ),
        'tsconfig.json': JSON.stringify(
          {
            compileOnSave: false,
            compilerOptions: {
              outDir: './dist/out-tsc',
              forceConsistentCasingInFileNames: true,
              strict: false,
              noImplicitOverride: true,
              noPropertyAccessFromIndexSignature: false,
              noImplicitReturns: true,
              noFallthroughCasesInSwitch: true,
              sourceMap: true,
              declaration: false,
              downlevelIteration: true,
              experimentalDecorators: true,
              moduleResolution: 'node',
              importHelpers: true,
              target: 'ES2022',
              module: 'ES2022',
              useDefineForClassFields: false,
              lib: ['ES2022', 'dom'],
            },
            angularCompilerOptions: { enableI18nLegacyMessageIdFormat: false },
          },
          null,
          2,
        ),
        'tsconfig.app.json': JSON.stringify(
          {
            extends: './tsconfig.json',
            compilerOptions: {
              outDir: './out-tsc/app',
              types: [],
            },
            files: ['src/main.ts'],
            include: ['src/**/*.d.ts'],
          },
          null,
          2,
        ),
        'src/index.html':
          '<!doctype html>\n<html lang="en">\n<head><meta charset="utf-8"><title>Demo</title><base href="/"><meta name="viewport" content="width=device-width, initial-scale=1"></head>\n<body><app-root></app-root></body>\n</html>',
        'src/main.ts': [
          "import { bootstrapApplication } from '@angular/platform-browser';",
          "import { AppComponent } from './app/app.component';",
          '',
          'bootstrapApplication(AppComponent);',
        ].join('\n'),
        'src/app/app.component.ts': [
          "import { Component } from '@angular/core';",
          "import { DemoComponent } from './demo.component';",
          '',
          '@Component({',
          "  selector: 'app-root',",
          '  imports: [DemoComponent],',
          "  template: '<app-demo />',",
          '})',
          'export class AppComponent {}',
        ].join('\n'),
        'src/app/demo.component.ts': [
          "import { Component } from '@angular/core';",
          '',
          '@Component({',
          "  selector: 'app-demo',",
          '  template: `' +
            this.code().replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$') +
            '`,',
          '})',
          'export class DemoComponent {}',
        ].join('\n'),
        'src/styles.css':
          "@import '@ngxsmk/theme/css';\n\nbody { font-family: system-ui, sans-serif; padding: 2rem; }\n",
      },
    };

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@stackblitz/sdk@1/bundles/sdk.umd.js';
    script.onload = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sdk = (window as any).StackBlitzSDK as
        { openProject: (project: unknown, opts?: Record<string, unknown>) => void } | undefined;
      if (sdk) {
        sdk.openProject(project, {
          newWindow: true,
          openFile: 'src/app/demo.component.ts',
        });
      } else {
        this.fallbackFormPost(project);
      }
    };
    script.onerror = () => this.fallbackFormPost(project);
    document.body.appendChild(script);
  }

  private fallbackFormPost(project: {
    title: string;
    description: string;
    files: Record<string, string>;
  }): void {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://stackblitz.com/run';
    form.target = '_blank';
    form.style.display = 'none';

    const addField = (name: string, value: string) => {
      const field = document.createElement('input');
      field.type = 'hidden';
      field.name = name;
      field.value = value;
      form.appendChild(field);
    };

    addField('project[title]', project.title);
    addField('project[description]', project.description);
    addField('project[template]', 'angular-cli');
    addField(
      'project[dependencies]',
      JSON.stringify({
        '@angular/core': '^19.0.0',
        '@angular/common': '^19.0.0',
        '@angular/forms': '^19.0.0',
        '@ngxsmk/core': 'latest',
        '@ngxsmk/theme': 'latest',
        rxjs: '~7.8.0',
        tslib: '^2.3.0',
      }),
    );

    for (const [path, content] of Object.entries(project.files)) {
      addField(`project[files][${path}]`, content);
    }

    document.body.appendChild(form);
    form.submit();
    setTimeout(() => document.body.removeChild(form), 100);
  }
}
