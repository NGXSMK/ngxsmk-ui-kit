import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type NgxsmkAvatarStatusDotVariant = 'online' | 'away' | 'busy' | 'offline';

@Component({
  standalone: true,
  selector: 'ngxsmk-avatar-status-dot',
  template: '',
  host: {
    class: 'ngxsmk-avatar-status-dot',
    '[attr.data-variant]': 'variant()',
    '[attr.aria-label]': 'variant()',
    role: 'status',
  },
  styles: `
    :host {
      position: absolute;
      bottom: 0;
      right: 0;
      display: block;
      width: 0.625rem;
      height: 0.625rem;
      border-radius: var(--ngxsmk-radius-full);
      border: 2px solid var(--ngxsmk-color-surface);
    }
    :host([data-variant='online']) {
      background: var(--ngxsmk-color-success);
    }
    :host([data-variant='away']) {
      background: var(--ngxsmk-color-warning);
    }
    :host([data-variant='busy']) {
      background: var(--ngxsmk-color-error);
    }
    :host([data-variant='offline']) {
      background: var(--ngxsmk-color-outline);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkAvatarStatusDot {
  readonly variant = input<NgxsmkAvatarStatusDotVariant>('online');
}
