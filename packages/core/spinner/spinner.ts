import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';

export type NgxsmkSpinnerSize = 'sm' | 'md' | 'lg';

/**
 * Indeterminate loading indicator.
 *
 * ```html
 * <ngxsmk-spinner />
 * <ngxsmk-spinner size="lg" label="Loading results" />
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-spinner',
  template: '',
  host: {
    class: 'ngxsmk-spinner',
    role: 'status',
    '[attr.aria-label]': 'label()',
    '[attr.data-size]': 'size()',
  },
  styles: `
    :host {
      display: inline-block;
      border: 2px solid var(--ngxsmk-color-outline);
      border-top-color: var(--ngxsmk-color-primary);
      border-radius: var(--ngxsmk-radius-full);
      animation: ngxsmk-spin 0.7s linear infinite;
    }

    :host([data-size='sm']) { width: 1rem; height: 1rem; }
    :host([data-size='md']) { width: 1.5rem; height: 1.5rem; border-width: 3px; }
    :host([data-size='lg']) { width: 2.25rem; height: 2.25rem; border-width: 3px; }

    @keyframes ngxsmk-spin {
      to { transform: rotate(360deg); }
    }

    @media (prefers-reduced-motion: reduce) {
      :host { animation-duration: 1.6s; }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkSpinner {
  readonly size = input<NgxsmkSpinnerSize>('md');
  readonly label = input('Loading');
}
