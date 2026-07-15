import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Visual separator.
 *
 * ```html
 * <ngxsmk-divider />
 * <ngxsmk-divider orientation="vertical" />
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-divider',
  template: '',
  host: {
    class: 'ngxsmk-divider',
    role: 'separator',
    '[attr.aria-orientation]': 'orientation()',
    '[attr.data-orientation]': 'orientation()',
  },
  styles: `
    :host {
      display: block;
      background: var(--ngxsmk-color-outline);
      flex-shrink: 0;
    }
    :host([data-orientation='horizontal']) {
      width: 100%;
      height: 1px;
    }
    :host([data-orientation='vertical']) {
      width: 1px;
      align-self: stretch;
      min-height: 1rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkDivider {
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
}
