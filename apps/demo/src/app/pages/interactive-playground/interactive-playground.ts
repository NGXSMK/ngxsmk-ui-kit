import { Component, computed, inject, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import {
  ComponentRegistry,
  ComponentMetadata,
  CATEGORY_LABELS,
} from '../../core/component-registry';
import { NgxsmkPropPanel, type PropDescriptor } from '../../playground/prop-panel';
import { PlaygroundDemoHost } from './playground-demo-host';
import { AppNav } from '../../nav/nav';

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
  imports: [NgxsmkPropPanel, PlaygroundDemoHost, TranslatePipe, AppNav],
  template: `
    <app-nav />
    <div class="pg">
      <header class="pg-header">
        <div class="version-badge">
          <span class="pulse-dot"></span>
          <span class="badge-tag">PLAYGROUND</span>
          <span class="badge-divider">/</span>
          <span class="badge-text">Interactive Workbench</span>
        </div>
        <h1 class="pg-title">
          Component <span class="highlight">Playground</span>
        </h1>
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
                <div class="traffic-lights">
                  <span class="light red"></span>
                  <span class="light yellow"></span>
                  <span class="light green"></span>
                </div>
                <span class="pg-stage-name">{{ comp.name }}</span>
                <span class="pg-stage-badge">
                  <span class="pulse-dot"></span>
                  {{ 'iplayground.live' | translate }}
                </span>
                <button class="pg-stage-copy" (click)="copyCode()">
                  @if (copied()) {
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                    {{ 'iplayground.copied' | translate }}
                  } @else {
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
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
                <div class="pg-card-header">
                  <div class="traffic-lights">
                    <span class="light red"></span>
                    <span class="light yellow"></span>
                    <span class="light green"></span>
                  </div>
                  <h3 class="pg-card-title">
                    {{ 'iplayground.properties' | translate }}
                    <span class="pg-card-hint">{{ propDescriptors().length }}</span>
                  </h3>
                </div>
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
                <div class="pg-card-header">
                  <div class="traffic-lights">
                    <span class="light red"></span>
                    <span class="light yellow"></span>
                    <span class="light green"></span>
                  </div>
                  <h3 class="pg-card-title">{{
                    'iplayground.generatedCode' | translate
                  }}</h3>
                </div>
                <div class="pg-card-body">
                  <pre class="pg-code"><code>{{ generatedCode() }}</code></pre>
                </div>
              </section>
            </div>

            <section class="pg-api">
              @if (comp.inputs.length > 0) {
                <div class="pg-detail-section">
                  <div class="pg-card-header">
                    <div class="traffic-lights">
                      <span class="light red"></span>
                      <span class="light yellow"></span>
                      <span class="light green"></span>
                    </div>
                    <h3 class="pg-detail-section-title">{{
                      'iplayground.inputs' | translate
                    }}</h3>
                  </div>
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
                  <div class="pg-card-header">
                    <div class="traffic-lights">
                      <span class="light red"></span>
                      <span class="light yellow"></span>
                      <span class="light green"></span>
                    </div>
                    <h3 class="pg-detail-section-title">{{
                      'iplayground.outputs' | translate
                    }}</h3>
                  </div>
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
                  <div class="pg-card-header">
                    <div class="traffic-lights">
                      <span class="light red"></span>
                      <span class="light yellow"></span>
                      <span class="light green"></span>
                    </div>
                    <h3 class="pg-detail-section-title">{{
                      'iplayground.signals' | translate
                    }}</h3>
                  </div>
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
                  <div class="pg-card-header">
                    <div class="traffic-lights">
                      <span class="light red"></span>
                      <span class="light yellow"></span>
                      <span class="light green"></span>
                    </div>
                    <h3 class="pg-detail-section-title">{{
                      'iplayground.methods' | translate
                    }}</h3>
                  </div>
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
              <h2 class="pg-empty-title">{{
                'iplayground.selectComponent' | translate
              }}</h2>
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
      min-height: calc(100vh - 3.5rem);
    }
    .pg {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2.5rem 1.5rem 5rem;
      color: var(--ngxsmk-color-on-surface);
    }

    .pg-header {
      margin-bottom: 2rem;
    }

    .pg-title {
      font-size: clamp(2rem, 4vw, 2.75rem);
      font-weight: 800;
      margin: 0.75rem 0 0.5rem;
      font-family: var(--font-display, 'Plus Jakarta Sans', system-ui, sans-serif);
      letter-spacing: -0.035em;
      line-height: 1.15;
      color: var(--ngxsmk-color-on-surface);
    }
    .pg-title .highlight {
      background: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #f59e0b 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .pg-subtitle {
      font-size: 1.0625rem;
      color: var(--ngxsmk-color-on-surface-variant);
      margin: 0;
      max-width: 38rem;
      line-height: 1.6;
    }

    .pg-shell {
      display: grid;
      grid-template-columns: 260px minmax(0, 1fr);
      gap: 1.75rem;
      align-items: start;
    }

    /* Sidebar */
    .pg-sidebar {
      position: sticky;
      top: 5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      background: var(--ngxsmk-color-surface);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--radius-xl, 22px);
      padding: 1.25rem;
      box-shadow: 0 4px 20px -5px rgba(0, 0, 0, 0.04);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    :root.dark .pg-sidebar {
      border-color: rgba(255, 255, 255, 0.08);
      background: #0f172a;
    }
    .pg-search {
      position: relative;
    }
    .pg-search-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--ngxsmk-color-on-surface-variant);
      pointer-events: none;
    }
    .pg-search-input {
      width: 100%;
      padding: 0.6rem 0.875rem 0.6rem 2.5rem;
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--radius-full, 9999px);
      background: var(--ngxsmk-color-surface-variant);
      font-size: var(--ngxsmk-text-body-sm-size);
      font-family: inherit;
      color: var(--ngxsmk-color-on-surface);
      outline: none;
      box-sizing: border-box;
      transition: all 0.2s ease;
    }
    :root.dark .pg-search-input {
      background: rgba(255, 255, 255, 0.04);
      border-color: rgba(255, 255, 255, 0.08);
    }
    .pg-search-input:focus {
      border-color: #6366f1;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
    }

    .pg-groups {
      max-height: calc(100vh - 12rem);
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 1rem;
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
      font-size: 0.6875rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--ngxsmk-color-on-surface-variant);
      margin-bottom: 0.375rem;
      padding-left: 0.5rem;
    }
    .pg-item {
      display: block;
      width: 100%;
      text-align: start;
      padding: 0.5rem 0.75rem;
      border: 1px solid transparent;
      border-radius: var(--radius-md, 10px);
      background: transparent;
      cursor: pointer;
      font-family: inherit;
      font-size: var(--ngxsmk-text-body-sm-size);
      color: var(--ngxsmk-color-on-surface);
      transition: all 0.15s ease-out;
    }
    .pg-item:hover {
      background: var(--ngxsmk-color-surface-hover);
    }
    .pg-item:focus-visible {
      outline: none;
      box-shadow: 0 0 0 2px #6366f1;
    }
    .pg-item.active {
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(99, 102, 241, 0.04));
      border: 1px solid rgba(99, 102, 241, 0.25);
      color: #6366f1;
      font-weight: 600;
    }
    :root.dark .pg-item.active {
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(99, 102, 241, 0.08));
      border-color: rgba(99, 102, 241, 0.4);
      color: #a5b4fc;
    }
    .pg-empty-hint {
      font-size: var(--ngxsmk-text-body-sm-size);
      color: var(--ngxsmk-color-on-surface-variant);
      padding: 0.5rem;
    }

    /* Main */
    .pg-main {
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    /* Stage */
    .pg-stage {
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--radius-xl, 22px);
      overflow: hidden;
      background: var(--ngxsmk-color-surface);
      box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.05);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    :root.dark .pg-stage {
      border-color: rgba(255, 255, 255, 0.08);
      background: #0f172a;
    }
    .pg-stage:hover {
      border-color: rgba(99, 102, 241, 0.35);
      box-shadow: 0 16px 36px -10px rgba(99, 102, 241, 0.12);
    }
    .pg-stage-bar {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1.25rem;
      border-bottom: 1px solid var(--ngxsmk-color-outline);
      background: var(--ngxsmk-color-surface);
    }
    :root.dark .pg-stage-bar {
      border-bottom-color: rgba(255, 255, 255, 0.08);
      background: #0b0f19;
    }
    .pg-stage-name {
      font-family: var(--font-code, 'JetBrains Mono', monospace);
      font-size: var(--ngxsmk-text-body-sm-size);
      font-weight: 600;
      color: var(--ngxsmk-color-on-surface);
    }
    .pg-stage-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      font-family: var(--font-code, 'JetBrains Mono', monospace);
      font-size: 0.6875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #10b981;
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.25);
      padding: 0.15rem 0.5rem;
      border-radius: var(--radius-full, 9999px);
    }
    .pg-stage-badge .pulse-dot {
      width: 6px;
      height: 6px;
    }
    .pg-stage-copy {
      margin-inline-start: auto;
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.35rem 0.75rem;
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--radius-full, 9999px);
      background: var(--ngxsmk-color-surface);
      color: var(--ngxsmk-color-on-surface-variant);
      font-size: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.15s ease-out;
    }
    :root.dark .pg-stage-copy {
      border-color: rgba(255, 255, 255, 0.1);
      background: rgba(255, 255, 255, 0.04);
      color: #94a3b8;
    }
    .pg-stage-copy:hover {
      border-color: #6366f1;
      color: #6366f1;
      background: rgba(99, 102, 241, 0.08);
    }
    :root.dark .pg-stage-copy:hover {
      color: #a5b4fc;
      border-color: #818cf8;
      background: rgba(99, 102, 241, 0.15);
    }
    .pg-stage-copy:focus-visible {
      outline: none;
      box-shadow: 0 0 0 2px #6366f1;
    }
    .pg-stage-canvas {
      min-height: 240px;
      padding: 3rem 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--ngxsmk-color-surface);
      background-image: radial-gradient(color-mix(in srgb, var(--ngxsmk-color-outline-strong) 40%, transparent) 1px, transparent 1px);
      background-size: 20px 20px;
    }
    :root.dark .pg-stage-canvas {
      background-color: #0d1322;
      background-image: radial-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 1px);
    }

    .pg-panels {
      display: grid;
      grid-template-columns: minmax(280px, 360px) 1fr;
      gap: 1.5rem;
    }
    .pg-card {
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--radius-xl, 22px);
      background: var(--ngxsmk-color-surface);
      overflow: hidden;
      box-shadow: 0 4px 20px -5px rgba(0, 0, 0, 0.04);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    :root.dark .pg-card {
      border-color: rgba(255, 255, 255, 0.08);
      background: #0f172a;
    }
    .pg-card:hover {
      border-color: rgba(99, 102, 241, 0.35);
      box-shadow: 0 12px 30px -10px rgba(99, 102, 241, 0.12);
    }
    .pg-card-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1.25rem;
      border-bottom: 1px solid var(--ngxsmk-color-outline);
      background: var(--ngxsmk-color-surface);
    }
    :root.dark .pg-card-header {
      border-bottom-color: rgba(255, 255, 255, 0.08);
      background: #0b0f19;
    }
    .pg-card-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex: 1;
      margin: 0;
      font-family: var(--font-code, 'JetBrains Mono', monospace);
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--ngxsmk-color-on-surface-variant);
    }
    .pg-card-hint {
      font-family: var(--font-code, 'JetBrains Mono', monospace);
      font-size: 0.6875rem;
      font-weight: 600;
      color: var(--ngxsmk-color-on-surface);
      background: var(--ngxsmk-color-surface-variant);
      border-radius: var(--radius-sm, 6px);
      padding: 0.1rem 0.45rem;
    }
    .pg-card-body {
      padding: 1.25rem;
    }
    .pg-muted {
      font-size: var(--ngxsmk-text-body-sm-size);
      color: var(--ngxsmk-color-on-surface-variant);
      margin: 0;
    }
    .pg-code {
      margin: 0;
      padding: 1rem;
      background: #0b0f19;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: var(--radius-md, 12px);
      font-family: var(--font-code, 'JetBrains Mono', monospace);
      font-size: 0.8125rem;
      line-height: 1.6;
      overflow-x: auto;
      white-space: pre-wrap;
      word-break: break-word;
      color: #e2e8f0;
    }

    /* API tables */
    .pg-api {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .pg-detail-section {
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--radius-xl, 22px);
      background: var(--ngxsmk-color-surface);
      overflow: hidden;
      box-shadow: 0 4px 20px -5px rgba(0, 0, 0, 0.04);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    :root.dark .pg-detail-section {
      border-color: rgba(255, 255, 255, 0.08);
      background: #0f172a;
    }
    .pg-detail-section:hover {
      border-color: rgba(99, 102, 241, 0.35);
      box-shadow: 0 12px 30px -10px rgba(99, 102, 241, 0.12);
    }
    .pg-detail-section-title {
      margin: 0;
      font-family: var(--font-code, 'JetBrains Mono', monospace);
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--ngxsmk-color-on-surface-variant);
    }
    .pg-table-wrap {
      overflow-x: auto;
    }
    .pg-table {
      width: 100%;
      border-collapse: collapse;
      font-size: var(--ngxsmk-text-body-sm-size);
    }
    .pg-table th,
    .pg-table td {
      text-align: start;
      padding: 0.75rem 1.25rem;
      border-bottom: 1px solid var(--ngxsmk-color-outline);
      color: var(--ngxsmk-color-on-surface);
      vertical-align: top;
    }
    :root.dark .pg-table th,
    :root.dark .pg-table td {
      border-bottom-color: rgba(255, 255, 255, 0.06);
    }
    .pg-table th {
      font-family: var(--font-code, 'JetBrains Mono', monospace);
      font-weight: 600;
      color: var(--ngxsmk-color-on-surface-variant);
      font-size: 0.6875rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      background: var(--ngxsmk-color-surface-variant);
    }
    :root.dark .pg-table th {
      background: rgba(255, 255, 255, 0.02);
    }
    .pg-table tr:last-child td {
      border-bottom: none;
    }
    .pg-table code {
      font-family: var(--font-code, 'JetBrains Mono', monospace);
      font-size: 0.8125rem;
      background: var(--ngxsmk-color-surface-variant);
      padding: 0.15rem 0.375rem;
      border-radius: var(--radius-sm, 6px);
      border: 1px solid var(--ngxsmk-color-outline);
    }
    :root.dark .pg-table code {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.08);
      color: #38bdf8;
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
      border: 1px dashed rgba(99, 102, 241, 0.3);
      border-radius: var(--radius-xl, 22px);
      background: var(--ngxsmk-color-surface);
    }
    .pg-empty-icon {
      font-size: 2.5rem;
      opacity: 0.4;
      margin-bottom: 0.75rem;
      color: #6366f1;
    }
    .pg-empty-title {
      margin: 0 0 0.5rem;
      font-family: var(--font-display, 'Plus Jakarta Sans', system-ui, sans-serif);
      font-size: 1.35rem;
      font-weight: 700;
      letter-spacing: -0.015em;
      color: var(--ngxsmk-color-on-surface);
    }
    .pg-empty p {
      margin: 0;
      font-size: var(--ngxsmk-text-body-md-size);
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
        padding: 1.5rem 1rem 3.5rem;
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
        comps: comps.sort((a: ComponentMetadata, b: ComponentMetadata) =>
          a.name.localeCompare(b.name),
        ),
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
