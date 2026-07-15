import { Component, computed, input, signal, Type, reflectComponentType } from '@angular/core';
import { NgxsmkButton } from '@ngxsmk/core/button';

type ApiPanel = 'code' | 'api' | 'customize';

interface ApiInput {
  readonly propName: string;
  readonly templateName: string;
  readonly transform?: (value: unknown) => unknown;
  readonly isSignal: boolean;
}

interface ApiOutput {
  readonly propName: string;
  readonly templateName: string;
}

/**
 * Reusable showcase block: a titled, described live demo of a single
 * component (or small group of related components) with an optional
 * collapsible code snippet. Used by every category page so the whole
 * demo stays consistent.
 */
@Component({
  selector: 'showcase-example',
  standalone: true,
  imports: [NgxsmkButton],
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
        <div class="ngxsmk-sc-ex__actions">
          @if (code()) {
            <button
              ngxsmk-button
              size="sm"
              variant="ghost"
              [attr.aria-pressed]="panel() === 'code'"
              (click)="toggle('code')"
            >
              {{ panel() === 'code' ? 'Hide code' : 'Show code' }}
            </button>
          }
          @if (component()) {
            <button
              ngxsmk-button
              size="sm"
              variant="ghost"
              [attr.aria-pressed]="panel() === 'api'"
              (click)="toggle('api')"
            >
              API
            </button>
          }
          @if (customize()) {
            <button
              ngxsmk-button
              size="sm"
              variant="ghost"
              [attr.aria-pressed]="panel() === 'customize'"
              (click)="toggle('customize')"
            >
              Customize
            </button>
          }
        </div>
      </div>

      <div class="ngxsmk-sc-ex__preview">
        <ng-content />
      </div>

      @if (panel() === 'code' && code()) {
        <pre class="ngxsmk-sc-ex__code"><code>{{ code() }}</code></pre>
      }

      @if (panel() === 'api' && component()) {
        <div class="ngxsmk-sc-ex__api">
          @if (inputs().length) {
            <h4 class="ngxsmk-sc-ex__api-title">Inputs &amp; properties</h4>
            <div class="ngxsmk-sc-ex__table-wrap">
              <table class="ngxsmk-sc-ex__table">
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Attribute</th>
                    <th>Kind</th>
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
                        {{ isModel(i.propName) ? 'two-way' : i.isSignal ? 'signal' : 'regular' }}
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
          @if (outputs().length) {
            <h4 class="ngxsmk-sc-ex__api-title">Outputs (events)</h4>
            <div class="ngxsmk-sc-ex__table-wrap">
              <table class="ngxsmk-sc-ex__table">
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Event</th>
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
            Customize through design tokens - override the component's <code>--ngxsmk-*</code>
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
    }

    .ngxsmk-sc-ex {
      border: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
      border-radius: var(--ngxsmk-radius-lg, 0.5rem);
      background: var(--ngxsmk-color-surface, #ffffff);
      margin-block-end: var(--ngxsmk-space-6, 1.5rem);
    }

    .ngxsmk-sc-ex__head {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: var(--ngxsmk-space-4, 1rem);
      padding: var(--ngxsmk-space-4, 1rem) var(--ngxsmk-space-5, 1.25rem);
      border-bottom: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
    }

    .ngxsmk-sc-ex__heading {
      min-width: 0;
    }

    .ngxsmk-sc-ex__title {
      margin: 0;
      font-family: 'Outfit', var(--ngxsmk-font-sans, system-ui), sans-serif;
      font-size: 0.95rem;
      font-weight: 600;
      letter-spacing: -0.01em;
      color: var(--ngxsmk-color-on-surface, #09090b);
    }

    .ngxsmk-sc-ex__desc {
      margin: 0.25rem 0 0;
      font-size: 0.8125rem;
      line-height: 1.5;
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
    }

    .ngxsmk-sc-ex__actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--ngxsmk-space-2, 0.5rem);
      flex-shrink: 0;
    }

    .ngxsmk-sc-ex__preview {
      padding: var(--ngxsmk-space-6, 1.5rem);
      display: flex;
      flex-wrap: wrap;
      gap: var(--ngxsmk-space-4, 1rem);
      align-items: center;
    }

    .ngxsmk-sc-ex__code {
      margin: 0;
      padding: var(--ngxsmk-space-4, 1rem) var(--ngxsmk-space-5, 1.25rem);
      border-top: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
      background: var(--ngxsmk-color-surface-variant, #f4f4f5);
      color: var(--ngxsmk-color-on-surface, #09090b);
      font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, monospace;
      font-size: 0.75rem;
      line-height: 1.6;
      overflow-x: auto;
      white-space: pre;
      border-bottom-left-radius: calc(var(--ngxsmk-radius-lg, 0.5rem) - 1px);
      border-bottom-right-radius: calc(var(--ngxsmk-radius-lg, 0.5rem) - 1px);
    }

    .ngxsmk-sc-ex__api {
      padding: var(--ngxsmk-space-4, 1rem) var(--ngxsmk-space-5, 1.25rem);
      border-top: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
    }

    .ngxsmk-sc-ex__api-title {
      margin: 0 0 var(--ngxsmk-space-2, 0.5rem);
      font-family: 'Outfit', var(--ngxsmk-font-sans, system-ui), sans-serif;
      font-size: 0.8125rem;
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
      font-size: 0.75rem;
    }

    .ngxsmk-sc-ex__table th,
    .ngxsmk-sc-ex__table td {
      text-align: left;
      padding: 0.35rem 0.75rem;
      border-bottom: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
      color: var(--ngxsmk-color-on-surface, #09090b);
      white-space: nowrap;
    }

    .ngxsmk-sc-ex__table th {
      font-weight: 600;
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
    }

    .ngxsmk-sc-ex__table code {
      font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, monospace;
      font-size: 0.72rem;
    }

    .ngxsmk-sc-ex__api-note {
      margin: var(--ngxsmk-space-4, 1rem) 0 0;
      font-size: 0.75rem;
      line-height: 1.55;
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
    }

    .ngxsmk-sc-ex__api-note code {
      font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, monospace;
      font-size: 0.72rem;
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

  protected toggle(panel: ApiPanel): void {
    this.panel.update((current) => (current === panel ? null : panel));
  }

  protected readonly metadata = computed(() => {
    const component = this.component();
    return component ? reflectComponentType(component as Type<unknown>) : null;
  });

  protected readonly inputs = computed<readonly ApiInput[]>(() => this.metadata()?.inputs ?? []);

  protected readonly outputs = computed<readonly ApiOutput[]>(() => this.metadata()?.outputs ?? []);

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
}
