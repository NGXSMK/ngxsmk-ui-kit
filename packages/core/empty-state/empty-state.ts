import { ChangeDetectionStrategy, Component, booleanAttribute, input } from '@angular/core';

export type NgxsmkEmptyStateVariant = 'default' | 'error' | 'success';

/**
 * Centered empty / error / success placeholder with optional projected icon and actions.
 * Prefer projecting SVG via `[ngxsmkEmptyIcon]` over the deprecated `icon` HTML string.
 *
 * ```html
 * <ngxsmk-empty-state title="No results" description="Try a different filter.">
 *   <svg ngxsmkEmptyIcon …></svg>
 *   <button ngxsmk-button>Clear filters</button>
 * </ngxsmk-empty-state>
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-empty-state',
  template: `
    <div class="ngxsmk-empty-state__wrapper">
      <div class="ngxsmk-empty-state__icon-container" [attr.data-variant]="variant()">
        <ng-content select="[ngxsmkEmptyIcon], svg" />
        @if (icon() && !hideLegacyIcon()) {
          <span class="ngxsmk-empty-state__legacy-icon" aria-hidden="true">{{ icon() }}</span>
        }
      </div>
      @if (title()) {
        <h3 class="ngxsmk-empty-state__title">{{ title() }}</h3>
      }
      @if (description()) {
        <p class="ngxsmk-empty-state__description">{{ description() }}</p>
      }
      <div class="ngxsmk-empty-state__actions"><ng-content /></div>
    </div>
  `,
  host: { class: 'ngxsmk-empty-state' },
  styles: `
    :host {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--ngxsmk-space-12) var(--ngxsmk-space-6);
      font-family: var(--ngxsmk-font-sans);
    }

    .ngxsmk-empty-state__wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      max-width: 26rem;
    }

    .ngxsmk-empty-state__icon-container {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 3.5rem;
      height: 3.5rem;
      margin-bottom: var(--ngxsmk-space-4);
      border-radius: var(--ngxsmk-radius-full);
      background: var(--ngxsmk-color-surface-variant);
      border: 1px solid var(--ngxsmk-color-outline);
      color: var(--ngxsmk-color-on-surface-variant);
    }

    .ngxsmk-empty-state__icon-container:empty {
      display: none;
    }

    .ngxsmk-empty-state__icon-container[data-variant='error'] {
      background: var(--ngxsmk-color-error-container);
      color: var(--ngxsmk-color-error);
      border-color: color-mix(in srgb, var(--ngxsmk-color-error) 25%, transparent);
    }

    .ngxsmk-empty-state__icon-container[data-variant='success'] {
      background: var(--ngxsmk-color-success-container);
      color: var(--ngxsmk-color-success);
      border-color: color-mix(in srgb, var(--ngxsmk-color-success) 25%, transparent);
    }

    .ngxsmk-empty-state__legacy-icon {
      font-size: 1.5rem;
      line-height: 1;
    }

    .ngxsmk-empty-state__title {
      margin: 0 0 var(--ngxsmk-space-2);
      font-family: var(--ngxsmk-font-sans);
      font-size: var(--ngxsmk-text-title-lg-size);
      font-weight: var(--ngxsmk-font-weight-semibold, 600);
      line-height: var(--ngxsmk-text-title-lg-line);
      color: var(--ngxsmk-color-on-surface);
    }

    .ngxsmk-empty-state__description {
      margin: 0 0 var(--ngxsmk-space-5);
      font-size: var(--ngxsmk-text-body-md-size);
      line-height: var(--ngxsmk-text-body-md-line);
      color: var(--ngxsmk-color-on-surface-variant);
    }

    .ngxsmk-empty-state__actions {
      display: flex;
      align-items: center;
      gap: var(--ngxsmk-space-3);
      flex-wrap: wrap;
      justify-content: center;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkEmptyState {
  /**
   * @deprecated Prefer projected SVG/`[ngxsmkEmptyIcon]`. Plain text emoji is OK;
   * raw HTML strings are no longer injected.
   */
  readonly icon = input('');
  readonly title = input('');
  readonly description = input('');
  readonly variant = input<NgxsmkEmptyStateVariant>('default');
  /** Hide the legacy `icon` text slot when projecting custom media. */
  readonly hideLegacyIcon = input(false, { transform: booleanAttribute });
}
