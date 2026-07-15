import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Loading placeholder that mirrors the shape of upcoming content.
 *
 * ```html
 * <ngxsmk-skeleton width="12rem" height="1rem" />
 * <ngxsmk-skeleton width="3rem" height="3rem" shape="circle" />
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-skeleton',
  template: '',
  host: {
    class: 'ngxsmk-skeleton',
    'aria-hidden': 'true',
    '[style.width]': 'width()',
    '[style.height]': 'height()',
    '[attr.data-shape]': 'shape()',
  },
  styles: `
    :host {
      display: block;
      background: linear-gradient(
        90deg,
        var(--ngxsmk-color-surface-variant) 25%,
        var(--ngxsmk-color-outline) 50%,
        var(--ngxsmk-color-surface-variant) 75%
      );
      background-size: 200% 100%;
      border-radius: var(--ngxsmk-radius-md);
      animation: ngxsmk-skeleton-shimmer 1.4s ease-in-out infinite;
    }

    :host([data-shape='circle']) {
      border-radius: var(--ngxsmk-radius-full);
    }
    :host([data-shape='rect']) {
      border-radius: 0;
    }

    @keyframes ngxsmk-skeleton-shimmer {
      from {
        background-position: 200% 0;
      }
      to {
        background-position: -200% 0;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      :host {
        animation: none;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkSkeleton {
  readonly width = input('100%');
  readonly height = input('1rem');
  readonly shape = input<'rounded' | 'circle' | 'rect'>('rounded');
}
