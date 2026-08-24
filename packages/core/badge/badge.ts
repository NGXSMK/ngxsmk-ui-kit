import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type NgxsmkBadgeVariant =
  'primary' | 'secondary' | 'outline' | 'success' | 'warning' | 'error' | 'info';

/**
 * Small status descriptor for counts and labels.
 *
 * ```html
 * <ngxsmk-badge>New</ngxsmk-badge>
 * <ngxsmk-badge variant="error">3</ngxsmk-badge>
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-badge',
  template: `<ng-content />`,
  host: {
    class: 'ngxsmk-badge',
    '[attr.data-variant]': 'variant()',
  },
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      gap: var(--ngxsmk-space-1);
      padding: var(--ngxsmk-space-0-5) var(--ngxsmk-space-2);
      border: 1px solid transparent;
      border-radius: var(--ngxsmk-radius-full);
      font-family: var(--ngxsmk-font-sans);
      font-size: var(--ngxsmk-text-label-sm-size);
      font-weight: var(--ngxsmk-text-label-sm-weight);
      line-height: var(--ngxsmk-text-label-sm-line);
      white-space: nowrap;
    }

    :host([data-variant='primary']) {
      background: var(--ngxsmk-color-primary);
      color: var(--ngxsmk-color-on-primary);
    }
    :host([data-variant='secondary']) {
      background: var(--ngxsmk-color-surface-variant);
      color: var(--ngxsmk-color-on-surface);
      border-color: var(--ngxsmk-color-outline);
    }
    :host([data-variant='outline']) {
      border-color: var(--ngxsmk-color-outline-strong);
      color: var(--ngxsmk-color-on-surface);
    }
    :host([data-variant='success']) {
      background: var(--ngxsmk-color-success-container);
      color: var(--ngxsmk-color-on-success-container);
      border-color: color-mix(in srgb, var(--ngxsmk-color-success) 20%, transparent);
    }
    :host([data-variant='warning']) {
      background: var(--ngxsmk-color-warning-container);
      color: var(--ngxsmk-color-on-warning-container);
      border-color: color-mix(in srgb, var(--ngxsmk-color-warning) 20%, transparent);
    }
    :host([data-variant='error']) {
      background: var(--ngxsmk-color-error-container);
      color: var(--ngxsmk-color-on-error-container);
      border-color: color-mix(in srgb, var(--ngxsmk-color-error) 20%, transparent);
    }
    :host([data-variant='info']) {
      background: var(--ngxsmk-color-info-container);
      color: var(--ngxsmk-color-on-info-container);
      border-color: color-mix(in srgb, var(--ngxsmk-color-info) 20%, transparent);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkBadge {
  readonly variant = input<NgxsmkBadgeVariant>('primary');
}
