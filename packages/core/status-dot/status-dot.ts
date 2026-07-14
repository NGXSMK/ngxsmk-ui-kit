import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type NgxsmkStatusDotVariant = 'online' | 'away' | 'busy' | 'offline';

const VARIANT_COLORS: Record<NgxsmkStatusDotVariant, string> = {
  online: 'var(--ngxsmk-color-success)',
  away: 'var(--ngxsmk-color-warning)',
  busy: 'var(--ngxsmk-color-error)',
  offline: 'var(--ngxsmk-color-outline-strong)',
};

@Component({
  standalone: true,
  selector: 'ngxsmk-status-dot',
  template: '',
  host: {
    class: 'ngxsmk-status-dot',
    '[attr.data-variant]': 'variant()',
    '[style.background]': 'variantColor()',
    '[attr.aria-label]': 'variant()',
  },
  styles: `
    :host {
      display: inline-block;
      width: 0.625rem;
      height: 0.625rem;
      border-radius: var(--ngxsmk-radius-full);
      flex-shrink: 0;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkStatusDot {
  readonly variant = input<NgxsmkStatusDotVariant>('online');

  protected readonly variantColor = () => VARIANT_COLORS[this.variant()] || VARIANT_COLORS.online;
}
