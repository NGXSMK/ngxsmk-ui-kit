import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type NgxsmkTextVariant = 'body' | 'caption' | 'overline' | 'inherit';
export type NgxsmkTextColor = 'default' | 'secondary' | 'disabled' | 'brand' | 'inherit';

@Component({
  selector: 'ngxsmk-text',
  template: `<ng-content />`,
  host: {
    class: 'ngxsmk-text',
    '[attr.data-variant]': 'variant()',
    '[attr.data-color]': 'color()',
  },
  styles: `
    :host {
      display: block;
      margin: 0;
      font-family: var(--ngxsmk-font-sans);
    }

    :host([data-variant='body']) { font-size: var(--ngxsmk-text-body-md-size); line-height: var(--ngxsmk-text-body-md-line); }
    :host([data-variant='caption']) { font-size: var(--ngxsmk-text-body-sm-size); line-height: var(--ngxsmk-text-body-sm-line); }
    :host([data-variant='overline']) { font-size: var(--ngxsmk-text-label-sm-size); line-height: var(--ngxsmk-text-label-sm-line); text-transform: uppercase; letter-spacing: 0.05em; }

    :host([data-color='default']) { color: var(--ngxsmk-color-on-surface); }
    :host([data-color='secondary']) { color: var(--ngxsmk-color-on-surface-variant); }
    :host([data-color='disabled']) { color: var(--ngxsmk-color-disabled); }
    :host([data-color='brand']) { color: var(--ngxsmk-color-primary); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkText {
  readonly variant = input<NgxsmkTextVariant>('body');
  readonly color = input<NgxsmkTextColor>('default');
  readonly as = input<'p' | 'span' | 'div'>('p');
}
