import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type NgxsmkHeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

@Component({
  standalone: true,
  selector: 'ngxsmk-heading',
  template: `<ng-content />`,
  host: {
    '[attr.data-level]': 'level()',
    '[attr.data-size]': 'size()',
    '[attr.data-weight]': 'weight()',
    '[attr.role]': '"heading"',
    '[attr.aria-level]': 'level().replace("h", "")',
  },
  styles: `
    :host {
      display: block;
      margin: 0;
      font-family: var(--ngxsmk-font-sans);
      color: var(--ngxsmk-color-on-surface);
    }

    :host([data-level='h1']) { font-size: var(--ngxsmk-text-display-md-size); line-height: var(--ngxsmk-text-display-md-line); }
    :host([data-level='h2']) { font-size: var(--ngxsmk-text-headline-lg-size); line-height: var(--ngxsmk-text-headline-lg-line); }
    :host([data-level='h3']) { font-size: var(--ngxsmk-text-headline-md-size); line-height: var(--ngxsmk-text-headline-md-line); }
    :host([data-level='h4']) { font-size: var(--ngxsmk-text-headline-sm-size); line-height: var(--ngxsmk-text-headline-sm-line); }
    :host([data-level='h5']) { font-size: var(--ngxsmk-text-title-lg-size); line-height: var(--ngxsmk-text-title-lg-line); }
    :host([data-level='h6']) { font-size: var(--ngxsmk-text-title-md-size); line-height: var(--ngxsmk-text-title-md-line); }

    :host([data-weight='light']) { font-weight: 300; }
    :host([data-weight='regular']) { font-weight: 400; }
    :host([data-weight='medium']) { font-weight: 500; }
    :host([data-weight='semibold']) { font-weight: 600; }
    :host([data-weight='bold']) { font-weight: 700; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkHeading {
  readonly level = input<NgxsmkHeadingLevel>('h2');
  readonly size = input<'inherit' | 'level'>('level');
  readonly weight = input<'light' | 'regular' | 'medium' | 'semibold' | 'bold'>('semibold');
}
