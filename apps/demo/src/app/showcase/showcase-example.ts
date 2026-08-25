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
        <div class="ngxsmk-sc-ex__heading">
          <h3 class="ngxsmk-sc-ex__title">{{ title() }}</h3>
          @if (description()) {
            <p class="ngxsmk-sc-ex__desc">{{ description() }}</p>
          }
        </div>
      </div>

      <div class="ngxsmk-sc-ex__preview">
        <div class="ngxsmk-sc-ex__preview-content">
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
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {{ 'showcaseExample.copied' | translate }}
            } @else {
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
                stroke-width="2"
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
          <pre class="ngxsmk-sc-ex__code"><code>{{ code() }}</code></pre>
        </div>
      }

      @if (panel() === 'api' && component()) {
        <div class="ngxsmk-sc-ex__api">
          @if (inputs().length) {
            <h4 class="ngxsmk-sc-ex__api-title">
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
              {{ 'showcaseExample.outputsEvents' | translate }}
            </h4>
            <div class="ngxsmk-sc-ex__table-wrap">
              <table class="ngxsmk-sc-ex__table">
                <thead>
                  <tr>
                    <th>{{ 'showcaseExample.thProperty' | translate }}</th>
                    <th>{{ 'showcaseExample.thEvent' | translate }}</th>
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
        <pre class="ngxsmk-sc-ex__code"><code>{{ customize() }}</code></pre>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
      scroll-margin-top: 5rem;
    }

    .ngxsmk-sc-ex {
      width: 100%;
      border: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
      border-radius: var(--ngxsmk-radius-lg, 0.5rem);
      background: var(--ngxsmk-color-surface, #ffffff);
      margin-block-end: var(--ngxsmk-space-6, 1.5rem);
      overflow: visible;
      transition: box-shadow 0.2s ease;
    }

    .ngxsmk-sc-ex:hover {
      box-shadow:
        0 2px 8px -2px rgba(0, 0, 0, 0.06),
        0 1px 2px -1px rgba(0, 0, 0, 0.04);
    }

    .ngxsmk-sc-ex__head {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      justify-content: space-between;
      gap: var(--ngxsmk-space-3, 0.75rem) var(--ngxsmk-space-4, 1rem);
      padding: var(--ngxsmk-space-4, 1rem) var(--ngxsmk-space-5, 1.25rem);
      border-bottom: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
      border-top-left-radius: var(--ngxsmk-radius-lg, 0.5rem);
      border-top-right-radius: var(--ngxsmk-radius-lg, 0.5rem);
    }

    .ngxsmk-sc-ex__heading {
      min-width: 0;
    }

    .ngxsmk-sc-ex__title {
      margin: 0;
      font-family: 'Outfit', var(--ngxsmk-font-sans, system-ui), sans-serif;
      font-size: var(--ngxsmk-text-body-md-size);
      font-weight: 600;
      letter-spacing: -0.01em;
      color: var(--ngxsmk-color-on-surface, #09090b);
    }

    .ngxsmk-sc-ex__desc {
      margin: 0.25rem 0 0;
      font-size: var(--ngxsmk-text-body-sm-size);
      line-height: 1.5;
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
    }

    .ngxsmk-sc-ex__preview {
      position: relative;
      z-index: 10;
      padding: var(--ngxsmk-space-8, 2rem);
      display: flex;
      flex-wrap: wrap;
      gap: var(--ngxsmk-space-4, 1rem);
      align-items: center;
      background-image: radial-gradient(
        circle,
        var(--ngxsmk-color-outline, #e4e4e7) 1px,
        transparent 1px
      );
      background-size: 16px 16px;
    }

    .ngxsmk-sc-ex__preview-content {
      display: contents;
    }

    .ngxsmk-sc-ex__copy-btn {
      position: absolute;
      top: var(--ngxsmk-space-3, 0.75rem);
      right: var(--ngxsmk-space-3, 0.75rem);
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.3rem 0.6rem;
      border: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
      border-radius: var(--ngxsmk-radius-md, 0.375rem);
      background: var(--ngxsmk-color-surface, #ffffff);
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
      font-family: inherit;
      font-size: 0.7rem;
      font-weight: 500;
      cursor: pointer;
      opacity: 0;
      transition:
        opacity 0.15s,
        background 0.15s,
        color 0.15s;
      z-index: 1;
    }

    .ngxsmk-sc-ex:hover .ngxsmk-sc-ex__copy-btn {
      opacity: 1;
    }

    .ngxsmk-sc-ex__copy-btn:hover {
      background: var(--ngxsmk-color-surface-variant, #f4f4f5);
      color: var(--ngxsmk-color-on-surface, #09090b);
    }

    .ngxsmk-sc-ex__actions {
      display: flex;
      flex-wrap: wrap;
      gap: 2px;
      padding: var(--ngxsmk-space-2, 0.5rem) var(--ngxsmk-space-3, 0.75rem);
      border-top: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
      background: var(--ngxsmk-color-surface, #ffffff);
    }

    .ngxsmk-sc-ex__tab {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: var(--ngxsmk-space-1-5, 0.375rem) var(--ngxsmk-space-2, 0.5rem);
      border: none;
      border-radius: var(--ngxsmk-radius-md, 0.375rem);
      background: none;
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
      font-family: inherit;
      font-size: var(--ngxsmk-text-body-sm-size);
      font-weight: 500;
      cursor: pointer;
      transition:
        background 0.15s,
        color 0.15s;
      white-space: nowrap;
    }

    .ngxsmk-sc-ex__tab:hover {
      background: color-mix(in srgb, var(--ngxsmk-color-on-surface, #09090b) 4%, transparent);
      color: var(--ngxsmk-color-on-surface, #09090b);
    }

    .ngxsmk-sc-ex__tab--active {
      background: var(--ngxsmk-color-primary-container, #ede9fe);
      color: var(--ngxsmk-color-on-primary-container, #4c1d95);
    }

    .ngxsmk-sc-ex__tab--active:hover {
      background: var(--ngxsmk-color-primary-container, #ede9fe);
      color: var(--ngxsmk-color-on-primary-container, #4c1d95);
    }

    .ngxsmk-sc-ex__tab--stackblitz {
      margin-left: auto;
      color: var(--ngxsmk-color-primary, #7c3aed);
    }

    .ngxsmk-sc-ex__tab--stackblitz:hover {
      background: color-mix(in srgb, var(--ngxsmk-color-primary, #7c3aed) 8%, transparent);
      color: var(--ngxsmk-color-primary, #7c3aed);
    }

    .ngxsmk-sc-ex__code-wrap {
      position: relative;
      border-top: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
    }

    .ngxsmk-sc-ex__code-copy {
      position: absolute;
      top: var(--ngxsmk-space-2, 0.5rem);
      right: var(--ngxsmk-space-3, 0.75rem);
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      padding: 0.25rem 0.5rem;
      border: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
      border-radius: var(--ngxsmk-radius-md, 0.375rem);
      background: var(--ngxsmk-color-surface, #ffffff);
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
      font-family: inherit;
      font-size: 0.7rem;
      font-weight: 500;
      cursor: pointer;
      z-index: 1;
      transition:
        background 0.15s,
        color 0.15s;
    }

    .ngxsmk-sc-ex__code-copy:hover {
      background: var(--ngxsmk-color-surface-variant, #f4f4f5);
      color: var(--ngxsmk-color-on-surface, #09090b);
    }

    .ngxsmk-sc-ex__code {
      margin: 0;
      padding: var(--ngxsmk-space-4, 1rem) var(--ngxsmk-space-5, 1.25rem);
      background: var(--ngxsmk-color-surface-variant, #f4f4f5);
      color: var(--ngxsmk-color-on-surface, #09090b);
      font-family: var(--ngxsmk-font-mono);
      font-size: var(--ngxsmk-text-body-sm-size);
      line-height: 1.6;
      overflow-x: auto;
      white-space: pre;
    }

    .ngxsmk-sc-ex__api {
      padding: var(--ngxsmk-space-4, 1rem) var(--ngxsmk-space-5, 1.25rem);
      border-top: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
    }

    .ngxsmk-sc-ex__api-title {
      margin: 0 0 var(--ngxsmk-space-2, 0.5rem);
      font-family: 'Outfit', var(--ngxsmk-font-sans, system-ui), sans-serif;
      font-size: var(--ngxsmk-text-body-sm-size);
      font-weight: 600;
      color: var(--ngxsmk-color-on-surface, #09090b);
    }

    .ngxsmk-sc-ex__api-title + .ngxsmk-sc-ex__api-title {
      margin-top: var(--ngxsmk-space-4, 1rem);
    }

    .ngxsmk-sc-ex__table-wrap {
      overflow-x: auto;
    }

    .ngxsmk-sc-ex__table {
      width: 100%;
      border-collapse: collapse;
      font-size: var(--ngxsmk-text-body-sm-size);
    }

    .ngxsmk-sc-ex__table th,
    .ngxsmk-sc-ex__table td {
      text-align: left;
      padding: 0.4rem 0.75rem;
      border-bottom: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
      color: var(--ngxsmk-color-on-surface, #09090b);
      white-space: nowrap;
    }

    .ngxsmk-sc-ex__table th {
      font-weight: 600;
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
      background: var(--ngxsmk-color-surface-variant, #f4f4f5);
    }

    .ngxsmk-sc-ex__table code {
      font-family: var(--ngxsmk-font-mono);
      font-size: 0.8em;
    }

    .ngxsmk-sc-ex__badge {
      display: inline-flex;
      align-items: center;
      padding: 0.1rem 0.45rem;
      border-radius: 9999px;
      font-size: 0.7rem;
      font-weight: 500;
      line-height: 1.4;
      background: var(--ngxsmk-color-surface-variant, #f4f4f5);
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
    }

    .ngxsmk-sc-ex__badge--model {
      background: color-mix(in srgb, var(--ngxsmk-color-primary, #7c3aed) 12%, transparent);
      color: var(--ngxsmk-color-primary, #7c3aed);
    }

    .ngxsmk-sc-ex__badge--signal {
      background: color-mix(in srgb, var(--ngxsmk-color-success, #16a34a) 12%, transparent);
      color: var(--ngxsmk-color-success, #16a34a);
    }

    .ngxsmk-sc-ex__api-note {
      margin: var(--ngxsmk-space-4, 1rem) 0 0;
      font-size: var(--ngxsmk-text-body-sm-size);
      line-height: 1.55;
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
    }

    .ngxsmk-sc-ex__api-note code {
      font-family: var(--ngxsmk-font-mono);
      font-size: var(--ngxsmk-text-body-sm-size);
    }

    @media (max-width: 480px) {
      .ngxsmk-sc-ex__head {
        padding: var(--ngxsmk-space-3, 0.75rem) var(--ngxsmk-space-4, 1rem);
      }

      .ngxsmk-sc-ex__preview {
        padding: var(--ngxsmk-space-5, 1.25rem);
      }

      .ngxsmk-sc-ex__actions {
        padding: var(--ngxsmk-space-1-5, 0.375rem) var(--ngxsmk-space-2, 0.5rem);
      }

      .ngxsmk-sc-ex__code,
      .ngxsmk-sc-ex__api {
        padding: var(--ngxsmk-space-3, 0.75rem) var(--ngxsmk-space-4, 1rem);
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
  protected readonly copiedCode = signal(false);
  protected readonly copiedPreview = signal(false);

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
