import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type NgxsmkEmptyStateVariant = 'default' | 'error' | 'success';

@Component({
  standalone: true,
  selector: 'ngxsmk-empty-state',
  template: `
    <div class="ngxsmk-empty-state__wrapper">
      <div class="ngxsmk-empty-state__icon-container" [attr.data-variant]="variant()">
        <ng-content select="[ngxsmkEmptyIcon], svg" />
        @if (icon()) {
          <div [innerHTML]="icon()"></div>
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
  readonly icon = input('');
  readonly title = input('');
  readonly description = input('');
  readonly variant = input<NgxsmkEmptyStateVariant>('default');
}
