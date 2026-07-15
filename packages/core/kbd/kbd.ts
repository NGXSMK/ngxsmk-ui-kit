import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'kbd[ngxsmk-kbd], ngxsmk-kbd',
  template: `<ng-content />`,
  host: {
    class: 'ngxsmk-kbd',
    '[attr.data-size]': 'size()',
  },
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 1.5rem;
      height: 1.5rem;
      padding: 0 0.375rem;
      font-family: var(--ngxsmk-font-mono);
      font-size: var(--ngxsmk-text-body-sm-size);
      font-weight: 500;
      color: var(--ngxsmk-color-on-surface);
      background: var(--ngxsmk-color-surface);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-sm);
      box-shadow: 0 1px 0 var(--ngxsmk-color-outline);
      line-height: 1;
    }
    :host([data-size='lg']) {
      height: 2rem;
      min-width: 2rem;
      padding: 0 0.5rem;
      font-size: var(--ngxsmk-text-body-md-size);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkKbd {
  readonly size = input<'sm' | 'lg'>('sm');
}
