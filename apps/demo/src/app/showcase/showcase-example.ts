import { Component, computed, input, signal } from '@angular/core';
import { NgxsmkButton } from '@ngxsmk/core/button';

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
        @if (code()) {
          <button
            ngxsmk-button
            size="sm"
            variant="ghost"
            (click)="showCode.set(!showCode())"
          >
            {{ showCode() ? 'Hide code' : 'Show code' }}
          </button>
        }
      </div>

      <div class="ngxsmk-sc-ex__preview">
        <ng-content />
      </div>

      @if (showCode() && code()) {
        <pre class="ngxsmk-sc-ex__code"><code>{{ code() }}</code></pre>
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
  `,
})
export class ShowcaseExample {
  readonly title = input.required<string>();
  readonly description = input<string>('');
  /** Optional source snippet shown in a collapsible panel. */
  readonly code = input<string>('');

  protected readonly showCode = signal(false);

  protected readonly elementId = computed(() => {
    return this.title().toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
  });
}
