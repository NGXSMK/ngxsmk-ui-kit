import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type NgxsmkFieldStatusVariant = 'error' | 'warning' | 'success' | 'info';

@Component({
  standalone: true,
  selector: 'ngxsmk-field-status, [ngxsmkFieldStatus]',
  template: `{{ message() }}`,
  host: {
    class: 'ngxsmk-field-status',
    '[attr.data-variant]': 'variant()',
    role: 'status',
    '[attr.aria-live]': '"polite"',
  },
  styles: `
    :host { display: block; font-family: var(--ngxsmk-font-sans); font-size: var(--ngxsmk-text-body-xs-size); }
    :host([data-variant='error']) { color: var(--ngxsmk-color-error); }
    :host([data-variant='warning']) { color: var(--ngxsmk-color-warning); }
    :host([data-variant='success']) { color: var(--ngxsmk-color-success); }
    :host([data-variant='info']) { color: var(--ngxsmk-color-on-surface-variant); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkFieldStatus {
  readonly message = input('');
  readonly variant = input<NgxsmkFieldStatusVariant>('info');
}
