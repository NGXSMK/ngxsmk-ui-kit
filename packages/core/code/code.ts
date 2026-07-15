import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  standalone: true,
  /* eslint-disable-next-line @angular-eslint/component-selector */
  selector: 'code[ngxsmk-code]',
  template: `<ng-content />`,
  host: {
    class: 'ngxsmk-code',
    '[attr.data-size]': 'size()',
  },
  styles: `
    :host {
      font-family: var(--ngxsmk-font-mono);
      background: var(--ngxsmk-color-surface-variant);
      color: var(--ngxsmk-color-on-surface);
      padding: 0.125rem 0.375rem;
      border-radius: var(--ngxsmk-radius-sm);
      font-size: var(--ngxsmk-text-body-sm-size);
      border: 1px solid var(--ngxsmk-color-outline);
      white-space: nowrap;
    }
    :host([data-size='lg']) { font-size: var(--ngxsmk-text-body-md-size); padding: 0.25rem 0.5rem; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkCode {
  readonly size = input<'sm' | 'lg'>('sm');
}
