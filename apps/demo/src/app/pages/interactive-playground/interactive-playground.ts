import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import {
  ComponentRegistry,
  ComponentMetadata,
  CATEGORY_LABELS,
} from '../../core/component-registry';
import { NgxsmkPropPanel, type PropDescriptor } from '../../playground/prop-panel';
import { PlaygroundDemoHost } from './playground-demo-host';
import { AppNav } from '../../nav/nav';
import { NgxsmkHeading } from '@ngxsmk/core/heading';

function sel(name: string, opts: string[], def: string, description?: string): PropDescriptor {
  return {
    name,
    label: name,
    control: 'select',
    default: def,
    description,
    options: opts.map((v) => ({ value: v, label: v })),
  };
}

function bool(name: string, def = false, description?: string): PropDescriptor {
  return { name, label: name, control: 'boolean', default: def, description };
}

function num(name: string, def: number, description?: string): PropDescriptor {
  return { name, label: name, control: 'number', default: def, description };
}

function txt(name: string, def = '', description?: string): PropDescriptor {
  return { name, label: name, control: 'text', default: def, description };
}

/** Curated prop schema for every component with a live preview host. */
export const CURATED_PROPS: Record<string, PropDescriptor[]> = {
  NgxsmkButton: [
    sel('variant', ['primary', 'secondary', 'outline', 'ghost', 'destructive', 'link'], 'primary'),
    sel('size', ['sm', 'md', 'lg'], 'md'),
    bool('loading'),
    bool('disabled'),
    bool('iconOnly'),
    txt('label', 'Button'),
  ],
  NgxsmkBadge: [
    sel(
      'variant',
      ['primary', 'secondary', 'outline', 'success', 'warning', 'error', 'info'],
      'primary',
    ),
    txt('label', 'Badge'),
  ],
  NgxsmkCard: [bool('interactive')],
  NgxsmkAvatar: [
    txt('name', 'Jane Doe'),
    txt('src', '', 'Image url; falls back to initials from name'),
    sel('size', ['sm', 'md', 'lg', 'xl'], 'md'),
    sel('shape', ['circle', 'square'], 'circle'),
  ],
  NgxsmkAlert: [
    sel('variant', ['info', 'success', 'warning', 'error'], 'info'),
    txt('title', 'Heads up'),
    txt('label', 'This is an alert message.'),
  ],
  NgxsmkSwitch: [bool('checked', true), bool('disabled'), txt('label', 'Enable notifications')],
  NgxsmkCheckbox: [
    bool('checked', true),
    bool('disabled'),
    bool('indeterminate'),
    txt('label', 'Accept terms'),
  ],
  NgxsmkInput: [
    sel('type', ['text', 'email', 'password', 'number', 'search'], 'text'),
    txt('value', ''),
    txt('placeholder', 'Enter text…'),
    bool('disabled'),
  ],
  NgxsmkSelect: [txt('value', ''), txt('placeholder', 'Choose an option…'), bool('disabled')],
  NgxsmkSlider: [
    num('value', 50),
    num('min', 0),
    num('max', 100),
    num('step', 1),
    bool('disabled'),
  ],
  NgxsmkProgress: [num('value', 60), txt('label', 'Loading…')],
  NgxsmkSpinner: [
    sel('size', ['sm', 'md', 'lg'], 'md'),
    txt('label', '', 'Text shown beside the spinner'),
  ],
  NgxsmkSkeleton: [
    sel('shape', ['rounded', 'circle', 'rect'], 'rounded'),
    txt('width', '160px'),
    txt('height', '16px'),
  ],
  NgxsmkStat: [
    txt('value', '$12,400'),
    txt('label', 'Revenue'),
    sel('trend', ['up', 'down', 'flat'], 'up'),
    txt('icon', ''),
  ],
  NgxsmkTag: [
    sel('variant', ['neutral', 'primary', 'success', 'warning', 'error', 'info'], 'primary'),
    txt('label', 'Tag'),
  ],
  NgxsmkHeading: [
    sel('level', ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'], 'h2'),
    sel('weight', ['light', 'regular', 'medium', 'semibold', 'bold'], 'semibold'),
    txt('label', 'Heading'),
  ],
  NgxsmkText: [
    sel('variant', ['body', 'caption', 'overline', 'inherit'], 'body'),
    sel('color', ['default', 'secondary', 'disabled', 'brand', 'inherit'], 'default'),
    txt('label', 'The quick brown fox jumps over the lazy dog.'),
  ],
  NgxsmkDivider: [sel('orientation', ['horizontal', 'vertical'], 'horizontal')],
  NgxsmkKbd: [txt('label', 'Ctrl K')],
  NgxsmkCode: [txt('label', 'npm install @ngxsmk/core')],
  NgxsmkBlockquote: [txt('cite', 'Steve Jobs'), txt('label', 'Design is how it works.')],
  NgxsmkLink: [
    sel('variant', ['default', 'muted'], 'default'),
    bool('underline', true),
    txt('label', 'Link text'),
  ],
  NgxsmkStatusDot: [sel('variant', ['online', 'away', 'busy', 'offline'], 'online')],
  NgxsmkRating: [
    num('value', 4),
    num('max', 5),
    bool('readonly'),
    sel('size', ['sm', 'md', 'lg'], 'md'),
    bool('allowHalf', true),
  ],
  NgxsmkEmptyState: [
    txt('title', 'No results'),
    txt('description', 'Try adjusting your search or filters.'),
    txt('icon', '🔍'),
  ],
  NgxsmkProgressCircle: [
    num('value', 72),
    num('max', 100),
    sel('size', ['sm', 'md', 'lg'], 'md'),
    sel('variant', ['default', 'primary', 'success', 'warning', 'error'], 'primary'),
    bool('showValue', true),
  ],
  NgxsmkThumbnail: [
    txt('src', ''),
    txt('alt', 'Thumbnail'),
    sel('size', ['sm', 'md', 'lg', 'xl'], 'md'),
    sel('shape', ['square', 'circle'], 'square'),
  ],
  NgxsmkHStack: [
    sel('justify', ['flex-start', 'center', 'flex-end', 'space-between', 'space-around'], 'center'),
    sel('align', ['flex-start', 'center', 'flex-end', 'stretch'], 'center'),
    sel(
      'gap',
      [
        'var(--ngxsmk-space-2)',
        'var(--ngxsmk-space-4)',
        'var(--ngxsmk-space-6)',
        'var(--ngxsmk-space-8)',
      ],
      'var(--ngxsmk-space-4)',
    ),
  ],
  NgxsmkVStack: [
    sel('justify', ['flex-start', 'center', 'flex-end', 'space-between', 'space-around'], 'center'),
    sel('align', ['flex-start', 'center', 'flex-end', 'stretch'], 'center'),
    sel(
      'gap',
      [
        'var(--ngxsmk-space-2)',
        'var(--ngxsmk-space-4)',
        'var(--ngxsmk-space-6)',
        'var(--ngxsmk-space-8)',
      ],
      'var(--ngxsmk-space-4)',
    ),
  ],
  NgxsmkCenter: [],
  NgxsmkContainer: [],
  NgxsmkGrid: [
    num('cols', 3),
    sel(
      'gap',
      [
        'var(--ngxsmk-space-2)',
        'var(--ngxsmk-space-4)',
        'var(--ngxsmk-space-6)',
        'var(--ngxsmk-space-8)',
      ],
      'var(--ngxsmk-space-4)',
    ),
  ],
  NgxsmkFlex: [
    sel('direction', ['row', 'row-reverse', 'column', 'column-reverse'], 'row'),
    sel(
      'gap',
      [
        'var(--ngxsmk-space-2)',
        'var(--ngxsmk-space-4)',
        'var(--ngxsmk-space-6)',
        'var(--ngxsmk-space-8)',
      ],
      'var(--ngxsmk-space-4)',
    ),
  ],
  NgxsmkRadio: [txt('value', 'option'), bool('disabled'), txt('label', 'Option')],
};

const CODE_TAG: Record<string, string> = {
  NgxsmkButton: 'button ngxsmk-button',
  NgxsmkBadge: 'ngxsmk-badge',
  NgxsmkCard: 'ngxsmk-card',
  NgxsmkAvatar: 'ngxsmk-avatar',
  NgxsmkAlert: 'ngxsmk-alert',
  NgxsmkSwitch: 'ngxsmk-switch',
  NgxsmkCheckbox: 'ngxsmk-checkbox',
  NgxsmkInput: 'ngxsmk-input',
  NgxsmkSelect: 'ngxsmk-select',
  NgxsmkSlider: 'ngxsmk-slider',
  NgxsmkProgress: 'ngxsmk-progress',
  NgxsmkSpinner: 'ngxsmk-spinner',
  NgxsmkSkeleton: 'ngxsmk-skeleton',
  NgxsmkStat: 'ngxsmk-stat',
  NgxsmkTag: 'ngxsmk-tag',
  NgxsmkHeading: 'ngxsmk-heading',
  NgxsmkText: 'ngxsmk-text',
  NgxsmkDivider: 'ngxsmk-divider',
  NgxsmkKbd: 'ngxsmk-kbd',
  NgxsmkCode: 'code ngxsmk-code',
  NgxsmkBlockquote: 'ngxsmk-blockquote',
  NgxsmkLink: 'a ngxsmk-link',
  NgxsmkStatusDot: 'ngxsmk-status-dot',
  NgxsmkRating: 'ngxsmk-rating',
  NgxsmkEmptyState: 'ngxsmk-empty-state',
  NgxsmkProgressCircle: 'ngxsmk-progress-circle',
  NgxsmkThumbnail: 'ngxsmk-thumbnail',
  NgxsmkHStack: 'ngxsmk-h-stack',
  NgxsmkVStack: 'ngxsmk-v-stack',
  NgxsmkCenter: 'ngxsmk-center',
  NgxsmkContainer: 'ngxsmk-container',
  NgxsmkGrid: 'ngxsmk-grid',
  NgxsmkFlex: 'ngxsmk-flex',
  NgxsmkRadio: 'ngxsmk-radio',
};

const CONTENT_PROP: Record<string, string> = {
  NgxsmkButton: 'label',
  NgxsmkBadge: 'label',
  NgxsmkAlert: 'label',
  NgxsmkSwitch: 'label',
  NgxsmkCheckbox: 'label',
  NgxsmkTag: 'label',
  NgxsmkHeading: 'label',
  NgxsmkText: 'label',
  NgxsmkKbd: 'label',
  NgxsmkCode: 'label',
  NgxsmkBlockquote: 'label',
  NgxsmkLink: 'label',
  NgxsmkRadio: 'label',
};

function defaultsFor(name: string): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const d of CURATED_PROPS[name] ?? []) {
    if (d.default !== undefined) out[d.name] = d.default;
  }
  return out;
}

function buildCode(name: string, values: Record<string, unknown>): string {
  const tag = CODE_TAG[name] ?? 'ngxsmk-component';
  const tagName = tag.split(' ')[0];
  const contentProp = CONTENT_PROP[name];
  const attrs: string[] = [];
  let content = '';
  for (const [k, v] of Object.entries(values)) {
    if (v === undefined || v === null || v === '') continue;
    if (k === contentProp) {
      content = String(v);
      continue;
    }
    if (typeof v === 'boolean') {
      if (v) attrs.push(k);
      continue;
    }
    if (typeof v === 'number') {
      attrs.push(`[${k}]="${v}"`);
    } else {
      attrs.push(`${k}="${v}"`);
    }
  }
  const attrStr = attrs.length ? ' ' + attrs.join(' ') : '';
  return content ? `<${tag}${attrStr}>${content}</${tagName}>` : `<${tag}${attrStr}></${tagName}>`;
}

@Component({
  selector: 'app-interactive-playground',
  standalone: true,
  imports: [RouterLink, NgxsmkPropPanel, PlaygroundDemoHost, TranslatePipe, AppNav, NgxsmkHeading],
  template: `
    <app-nav />
    <div class="pg">
      <header class="pg-header">
        <div class="pg-breadcrumb">
          <span class="pg-breadcrumb-mark">//</span>
          <a routerLink="/showcase/explorer">{{ 'iplayground.explorer' | translate }}</a>
          <span class="pg-breadcrumb-sep">/</span>
          <span>{{ 'nav.componentPlayground' | translate }}</span>
        </div>
        <ngxsmk-heading level="h1" class="pg-title">{{ 'nav.componentPlayground' | translate }}</ngxsmk-heading>
        <p class="pg-subtitle">
          {{ 'iplayground.subtitle' | translate }}
        </p>
      </header>

      <div class="pg-shell">
        <aside class="pg-sidebar">
          <div class="pg-search">
            <svg
              class="pg-search-icon"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              class="pg-search-input"
              [attr.placeholder]="'iplayground.filterPlaceholder' | translate"
              [value]="filterQuery()"
              (input)="filterQuery.set($any($event.target).value)"
            />
          </div>
          <nav class="pg-groups">
            @for (group of filteredGroups(); track group.category) {
              <div class="pg-group">
                <div class="pg-group-label">{{ group.label | translate }}</div>
                @for (comp of group.comps; track comp.name) {
                  <button
                    class="pg-item"
                    [class.active]="selectedKey() === comp.name"
                    (click)="selectComponent(comp.name)"
                  >
                    <span class="pg-item-name">{{ displayName(comp.name) }}</span>
                  </button>
                }
              </div>
            } @empty {
              <p class="pg-empty-hint">
                {{ 'iplayground.noMatch' | translate: { query: filterQuery() } }}
              </p>
            }
          </nav>
        </aside>

        <main class="pg-main">
          @if (selectedMeta(); as comp) {
            <section class="pg-stage">
              <div class="pg-stage-bar">
                <span class="pg-stage-dot"></span>
                <span class="pg-stage-name">{{ comp.name }}</span>
                <span class="pg-stage-badge">{{ 'iplayground.live' | translate }}</span>
                <button class="pg-stage-copy" (click)="copyCode()">
                  @if (copied()) {
                    {{ 'iplayground.copied' | translate }}
                  } @else {
                    {{ 'iplayground.copyCode' | translate }}
                  }
                </button>
              </div>
              <div class="pg-stage-canvas">
                <playground-demo-host [demoId]="selectedKey()" [props]="propValues()" />
              </div>
            </section>

            <div class="pg-panels">
              <section class="pg-card">
                <ngxsmk-heading level="h3" class="pg-card-title">
                  {{ 'iplayground.properties' | translate }}
                  <span class="pg-card-hint">{{ propDescriptors().length }}</span>
                </ngxsmk-heading>
                <div class="pg-card-body">
                  @if (propDescriptors().length > 0) {
                    <ngxsmk-prop-panel
                      [descriptors]="propDescriptors()"
                      [values]="propValues()"
                      (valuesChange)="propValues.set($event)"
                    />
                  } @else {
                    <p class="pg-muted">{{ 'iplayground.noConfigurableInputs' | translate }}</p>
                  }
                </div>
              </section>

              <section class="pg-card">
                <ngxsmk-heading level="h3" class="pg-card-title">{{ 'iplayground.generatedCode' | translate }}</ngxsmk-heading>
                <div class="pg-card-body">
                  <pre class="pg-code"><code>{{ generatedCode() }}</code></pre>
                </div>
              </section>
            </div>

            <section class="pg-api">
              @if (comp.inputs.length > 0) {
                <div class="pg-detail-section">
                    <ngxsmk-heading level="h3" class="pg-detail-section-title">{{ 'iplayground.inputs' | translate }}</ngxsmk-heading>
                  <div class="pg-table-wrap">
                    <table class="pg-table">
                      <thead>
                        <tr>
                          <th>{{ 'iplayground.thName' | translate }}</th>
                          <th>{{ 'iplayground.thType' | translate }}</th>
                          <th>{{ 'iplayground.thDefault' | translate }}</th>
                          <th>{{ 'iplayground.thRequired' | translate }}</th>
                          <th>{{ 'iplayground.thDescription' | translate }}</th>
                        </tr>
                      </thead>
                      <tbody>
                        @for (input of comp.inputs; track input.name) {
                          <tr>
                            <td>
                              <code>{{ input.name }}</code>
                            </td>
                            <td>
                              <code>{{ input.type }}</code>
                            </td>
                            <td>
                              <code>{{ input.defaultValue || '-' }}</code>
                            </td>
                            <td>
                              {{
                                input.required
                                  ? ('iplayground.yes' | translate)
                                  : ('iplayground.no' | translate)
                              }}
                            </td>
                            <td>{{ input.description }}</td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
              }

              @if (comp.outputs.length > 0) {
                <div class="pg-detail-section">
                    <ngxsmk-heading level="h3" class="pg-detail-section-title">{{ 'iplayground.outputs' | translate }}</ngxsmk-heading>
                  <div class="pg-table-wrap">
                    <table class="pg-table">
                      <thead>
                        <tr>
                          <th>{{ 'iplayground.thName' | translate }}</th>
                          <th>{{ 'iplayground.thType' | translate }}</th>
                          <th>{{ 'iplayground.thDescription' | translate }}</th>
                        </tr>
                      </thead>
                      <tbody>
                        @for (output of comp.outputs; track output.name) {
                          <tr>
                            <td>
                              <code>{{ output.name }}</code>
                            </td>
                            <td>
                              <code>{{ output.type }}</code>
                            </td>
                            <td>{{ output.description }}</td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
              }

              @if (comp.signals.length > 0) {
                <div class="pg-detail-section">
                    <ngxsmk-heading level="h3" class="pg-detail-section-title">{{ 'iplayground.signals' | translate }}</ngxsmk-heading>
                  <div class="pg-table-wrap">
                    <table class="pg-table">
                      <thead>
                        <tr>
                          <th>{{ 'iplayground.thName' | translate }}</th>
                          <th>{{ 'iplayground.thType' | translate }}</th>
                          <th>{{ 'iplayground.thReadonly' | translate }}</th>
                          <th>{{ 'iplayground.thDescription' | translate }}</th>
                        </tr>
                      </thead>
                      <tbody>
                        @for (sig of comp.signals; track sig.name) {
                          <tr>
                            <td>
                              <code>{{ sig.name }}</code>
                            </td>
                            <td>
                              <code>{{ sig.type }}</code>
                            </td>
                            <td>
                              {{
                                sig.readonly
                                  ? ('iplayground.yes' | translate)
                                  : ('iplayground.no' | translate)
                              }}
                            </td>
                            <td>{{ sig.description }}</td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
              }

              @if (comp.methods.length > 0) {
                <div class="pg-detail-section">
                    <ngxsmk-heading level="h3" class="pg-detail-section-title">{{ 'iplayground.methods' | translate }}</ngxsmk-heading>
                  <div class="pg-table-wrap">
                    <table class="pg-table">
                      <thead>
                        <tr>
                          <th>{{ 'iplayground.thName' | translate }}</th>
                          <th>{{ 'iplayground.thParameters' | translate }}</th>
                          <th>{{ 'iplayground.thReturns' | translate }}</th>
                          <th>{{ 'iplayground.thDescription' | translate }}</th>
                        </tr>
                      </thead>
                      <tbody>
                        @for (method of comp.methods; track method.name) {
                          <tr>
                            <td>
                              <code>{{ method.name }}</code>
                            </td>
                            <td>
                              <code>{{ method.parameters.join(', ') || '-' }}</code>
                            </td>
                            <td>
                              <code>{{ method.returnType }}</code>
                            </td>
                            <td>{{ method.description }}</td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
              }
            </section>
          } @else {
            <div class="pg-empty">
              <div class="pg-empty-icon">◈</div>
              <ngxsmk-heading level="h2">{{ 'iplayground.selectComponent' | translate }}</ngxsmk-heading>
              <p>{{ 'iplayground.pickComponent' | translate }}</p>
            </div>
          }
        </main>
      </div>
    </div>
  `,
  styles: `
    /* Workbench sibling of the Templates register: same mono-annotation
       voice, same token discipline. Everything derives from --ngxsmk-*
       so presets, dark mode, and reduced motion come for free. */
    :host {
      display: block;
      background-color: var(--ngxsmk-color-background, #fafafa);
      background-image: radial-gradient(var(--ngxsmk-color-outline, #e4e4e7) 1px, transparent 1px);
      background-size: 24px 24px;
      min-height: 100vh;
    }
    .pg {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem 1.5rem 4rem;
      color: var(--ngxsmk-color-on-surface);
    }

    .pg-breadcrumb {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      font-family: var(--ngxsmk-font-mono);
      font-size: 0.75rem;
      font-weight: 500;
      letter-spacing: 0.04em;
      color: var(--ngxsmk-color-on-surface-variant);
      margin-bottom: 0.625rem;
    }
    .pg-breadcrumb-mark {
      color: var(--ngxsmk-color-primary);
    }
    .pg-breadcrumb a {
      color: var(--ngxsmk-color-on-surface-variant);
      text-decoration: none;
    }
    .pg-breadcrumb a:hover {
      color: var(--ngxsmk-color-primary);
    }
    .pg-breadcrumb a:focus-visible {
      outline: none;
      box-shadow: var(--ngxsmk-focus-ring, var(--ngxsmk-shadow-focus));
      border-radius: var(--ngxsmk-radius-sm);
    }

    ngxsmk-heading.pg-title {
      font-size: clamp(1.75rem, 3.5vw, 2.25rem);
      font-weight: 800;
      margin: 0 0 0.375rem;
      font-family: 'Plus Jakarta Sans', var(--ngxsmk-font-sans, system-ui), sans-serif;
      letter-spacing: -0.03em;
      line-height: 1.1;
    }
    .pg-subtitle {
      font-size: 0.9375rem;
      color: var(--ngxsmk-color-on-surface-variant);
      margin: 0 0 1.75rem;
      max-width: 34rem;
      line-height: 1.6;
    }

    .pg-shell {
      display: grid;
      grid-template-columns: 240px minmax(0, 1fr);
      gap: 1.5rem;
      align-items: start;
    }

    /* Sidebar */
    .pg-sidebar {
      position: sticky;
      top: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .pg-search {
      position: relative;
    }
    .pg-search-icon {
      position: absolute;
      left: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--ngxsmk-color-on-surface-variant);
      pointer-events: none;
    }
    .pg-search-input {
      width: 100%;
      padding: 0.5rem 0.75rem 0.5rem 2.25rem;
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-md);
      background: var(--ngxsmk-color-surface);
      font-size: 0.8125rem;
      font-family: inherit;
      color: var(--ngxsmk-color-on-surface);
      outline: none;
      box-sizing: border-box;
      transition:
        border-color var(--ngxsmk-duration-fast, 150ms) var(--ngxsmk-ease-out),
        box-shadow var(--ngxsmk-duration-fast, 150ms) var(--ngxsmk-ease-out);
    }
    .pg-search-input:focus {
      border-color: var(--ngxsmk-color-ring);
      box-shadow: var(--ngxsmk-focus-ring, var(--ngxsmk-shadow-focus));
    }

    .pg-groups {
      max-height: calc(100vh - 220px);
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 0.875rem;
      padding-right: 0.25rem;
    }
    .pg-groups::-webkit-scrollbar {
      width: 4px;
    }
    .pg-groups::-webkit-scrollbar-thumb {
      background: var(--ngxsmk-color-outline);
      border-radius: 2px;
    }
    .pg-group-label {
      font-family: var(--ngxsmk-font-mono);
      font-size: 0.625rem;
      font-weight: 500;
      letter-spacing: var(--ngxsmk-tracking-wide, 0.08em);
      text-transform: uppercase;
      color: var(--ngxsmk-color-on-surface-variant);
      margin-bottom: 0.375rem;
    }
    .pg-item {
      display: block;
      width: 100%;
      text-align: start;
      padding: 0.4rem 0.625rem;
      border: none;
      border-radius: var(--ngxsmk-radius-md);
      background: transparent;
      cursor: pointer;
      font-family: inherit;
      font-size: 0.8125rem;
      color: var(--ngxsmk-color-on-surface);
      transition:
        background var(--ngxsmk-duration-fast, 120ms) var(--ngxsmk-ease-out),
        color var(--ngxsmk-duration-fast, 120ms) var(--ngxsmk-ease-out);
    }
    .pg-item:hover {
      background: var(--ngxsmk-color-surface-hover);
    }
    .pg-item:focus-visible {
      outline: none;
      box-shadow: var(--ngxsmk-focus-ring, var(--ngxsmk-shadow-focus));
    }
    /* Inked stamp — same active treatment as the register's filter tabs. */
    .pg-item.active {
      background: var(--ngxsmk-color-on-surface);
      color: var(--ngxsmk-color-surface);
      font-weight: 600;
    }
    .pg-empty-hint {
      font-size: 0.8125rem;
      color: var(--ngxsmk-color-on-surface-variant);
    }

    /* Main */
    .pg-main {
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    /* The stage: bench top with a title-block bar. */
    .pg-stage {
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-lg);
      overflow: hidden;
      background: var(--ngxsmk-color-surface);
    }
    .pg-stage-bar {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.75rem;
      border-bottom: 1px solid var(--ngxsmk-color-outline);
      background: var(--ngxsmk-color-surface);
    }
    .pg-stage-dot {
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 50%;
      background: var(--ngxsmk-color-success);
    }
    .pg-stage-name {
      font-family: var(--ngxsmk-font-mono);
      font-size: 0.75rem;
      font-weight: 500;
      color: var(--ngxsmk-color-on-surface);
    }
    .pg-stage-badge {
      font-family: var(--ngxsmk-font-mono);
      font-size: 0.625rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: var(--ngxsmk-tracking-wide, 0.08em);
      color: var(--ngxsmk-color-on-success-container);
      background: var(--ngxsmk-color-success-container);
      padding: 0.1rem 0.4rem;
      border-radius: var(--ngxsmk-radius-sm);
    }
    .pg-stage-copy {
      margin-inline-start: auto;
      padding: 0.25rem 0.625rem;
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-sm);
      background: var(--ngxsmk-color-surface);
      color: var(--ngxsmk-color-on-surface-variant);
      font-size: 0.6875rem;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
      transition:
        border-color var(--ngxsmk-duration-fast, 120ms) var(--ngxsmk-ease-out),
        color var(--ngxsmk-duration-fast, 120ms) var(--ngxsmk-ease-out);
    }
    .pg-stage-copy:hover {
      border-color: var(--ngxsmk-color-primary);
      color: var(--ngxsmk-color-primary);
    }
    .pg-stage-copy:focus-visible {
      outline: none;
      box-shadow: var(--ngxsmk-focus-ring, var(--ngxsmk-shadow-focus));
    }
    .pg-stage-canvas {
      min-height: 220px;
      padding: 2.5rem 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--ngxsmk-color-surface);
      background-image: radial-gradient(var(--ngxsmk-color-outline) 1px, transparent 1px);
      background-size: 16px 16px;
    }

    .pg-panels {
      display: grid;
      grid-template-columns: minmax(260px, 340px) 1fr;
      gap: 1.25rem;
    }
    .pg-card {
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-lg);
      background: var(--ngxsmk-color-surface);
      overflow: hidden;
    }
    /* Panel titles are mono annotations — the title-block voice. */
    ngxsmk-heading.pg-card-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0;
      padding: 0.75rem 1rem;
      font-family: var(--ngxsmk-font-mono);
      font-size: 0.6875rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: var(--ngxsmk-tracking-wide, 0.08em);
      color: var(--ngxsmk-color-on-surface-variant);
      border-bottom: 1px solid var(--ngxsmk-color-outline);
    }
    .pg-card-hint {
      font-family: var(--ngxsmk-font-mono);
      font-size: 0.6875rem;
      font-weight: 500;
      color: var(--ngxsmk-color-on-surface);
      background: var(--ngxsmk-color-surface-variant);
      border-radius: var(--ngxsmk-radius-sm);
      padding: 0.1rem 0.45rem;
    }
    .pg-card-body {
      padding: 1rem;
    }
    .pg-muted {
      font-size: 0.8125rem;
      color: var(--ngxsmk-color-on-surface-variant);
      margin: 0;
    }
    .pg-code {
      margin: 0;
      padding: 0.875rem;
      background: var(--ngxsmk-color-surface-variant);
      border-radius: var(--ngxsmk-radius-md);
      font-family: var(--ngxsmk-font-mono);
      font-size: 0.75rem;
      line-height: 1.6;
      overflow-x: auto;
      white-space: pre-wrap;
      word-break: break-word;
      color: var(--ngxsmk-color-on-surface);
    }

    /* API tables */
    .pg-api {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .pg-detail-section {
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-lg);
      background: var(--ngxsmk-color-surface);
      overflow: hidden;
    }
    ngxsmk-heading.pg-detail-section-title {
      margin: 0;
      padding: 0.75rem 1rem;
      font-family: var(--ngxsmk-font-mono);
      font-size: 0.6875rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: var(--ngxsmk-tracking-wide, 0.08em);
      color: var(--ngxsmk-color-on-surface-variant);
      border-bottom: 1px solid var(--ngxsmk-color-outline);
      background: var(--ngxsmk-color-surface);
    }
    .pg-table-wrap {
      overflow-x: auto;
    }
    .pg-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.75rem;
    }
    .pg-table th,
    .pg-table td {
      text-align: start;
      padding: 0.5rem 1rem;
      border-bottom: 1px solid var(--ngxsmk-color-outline);
      color: var(--ngxsmk-color-on-surface);
      vertical-align: top;
    }
    .pg-table th {
      font-family: var(--ngxsmk-font-mono);
      font-weight: 500;
      color: var(--ngxsmk-color-on-surface-variant);
      font-size: 0.625rem;
      text-transform: uppercase;
      letter-spacing: var(--ngxsmk-tracking-wide, 0.08em);
      background: var(--ngxsmk-color-surface-variant);
    }
    .pg-table tr:last-child td {
      border-bottom: none;
    }
    .pg-table code {
      font-family: var(--ngxsmk-font-mono);
      font-size: 0.72rem;
      background: var(--ngxsmk-color-surface-variant);
      padding: 0.125rem 0.25rem;
      border-radius: var(--ngxsmk-radius-sm);
    }

    /* Blank sheet — matches the register's empty state. */
    .pg-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem 2rem;
      text-align: center;
      color: var(--ngxsmk-color-on-surface-variant);
      border: 1px dashed var(--ngxsmk-color-outline-strong);
      border-radius: var(--ngxsmk-radius-xl);
      background: var(--ngxsmk-color-surface);
    }
    .pg-empty-icon {
      font-size: 2.5rem;
      opacity: var(--ngxsmk-opacity-faint, 0.3);
      margin-bottom: 0.75rem;
    }
    .pg-empty ngxsmk-heading {
      margin: 0 0 0.25rem;
      font-family: 'Plus Jakarta Sans', var(--ngxsmk-font-sans, system-ui), sans-serif;
      font-size: 1.125rem;
      letter-spacing: -0.015em;
      color: var(--ngxsmk-color-on-surface);
    }
    .pg-empty p {
      margin: 0;
      font-size: 0.875rem;
      max-width: 320px;
    }

    @media (max-width: 920px) {
      .pg-shell {
        grid-template-columns: minmax(0, 1fr);
      }
      .pg-sidebar {
        position: static;
      }
      .pg-groups {
        max-height: 240px;
      }
      .pg-panels {
        grid-template-columns: minmax(0, 1fr);
      }
    }

    @media (max-width: 640px) {
      .pg {
        padding: 1.25rem 1rem 3rem;
      }
    }
  `,
})
export class InteractivePlayground {
  protected readonly CATEGORY_LABELS = CATEGORY_LABELS;

  protected readonly registry = inject(ComponentRegistry);

  protected readonly filterQuery = signal('');
  protected readonly selectedKey = signal<string>('NgxsmkButton');
  protected readonly propValues = signal<Record<string, unknown>>(defaultsFor('NgxsmkButton'));
  protected readonly copied = signal(false);

  protected readonly selectedMeta = computed<ComponentMetadata | null>(() => {
    const key = this.selectedKey();
    return this.registry.allComponents().find((c) => c.name === key) ?? null;
  });

  protected readonly propDescriptors = computed<PropDescriptor[]>(() => {
    return CURATED_PROPS[this.selectedKey()] ?? [];
  });

  protected readonly generatedCode = computed(() => {
    return buildCode(this.selectedKey(), this.propValues());
  });

  protected readonly filteredGroups = computed(() => {
    const q = this.filterQuery().toLowerCase().trim();
    const all = this.registry.allComponents();
    const map = new Map<string, ComponentMetadata[]>();
    for (const c of all) {
      if (!(c.name in CURATED_PROPS)) continue;
      if (
        q &&
        !c.name.toLowerCase().includes(q) &&
        !(c.description ?? '').toLowerCase().includes(q)
      ) {
        continue;
      }
      const arr = map.get(c.category) ?? [];
      arr.push(c);
      map.set(c.category, arr);
    }
    return [...map.entries()]
      .map(([category, comps]) => ({
        category,
        label: this.catLabelKey(category),
        comps: comps.sort((a, b) => a.name.localeCompare(b.name)),
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  });

  protected displayName(name: string): string {
    return name.replace(/^Ngxsmk/i, '');
  }

  protected readonly CATEGORY_LABEL_KEY: Record<string, string> = {
    form: 'explorer.cat.form',
    layout: 'explorer.cat.layout',
    navigation: 'explorer.cat.navigation',
    'data-display': 'explorer.cat.dataDisplay',
    feedback: 'explorer.cat.feedback',
    overlay: 'explorer.cat.overlay',
    chart: 'explorer.cat.chart',
    ai: 'explorer.cat.ai',
    utility: 'explorer.cat.utility',
    other: 'explorer.cat.other',
  };

  catLabelKey(category: string): string {
    return this.CATEGORY_LABEL_KEY[category] ?? category;
  }

  protected selectComponent(name: string): void {
    this.selectedKey.set(name);
    this.propValues.set(defaultsFor(name));
  }

  protected copyCode(): void {
    navigator.clipboard?.writeText(this.generatedCode());
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
  }
}
