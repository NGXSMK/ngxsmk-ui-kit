import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';

export type NgxsmkContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

@Component({
  standalone: true,
  selector: 'ngxsmk-container',
  template: `<ng-content />`,
  host: {
    class: 'ngxsmk-container',
    '[attr.data-size]': 'size()',
  },
  styles: `
    :host {
      display: block;
      width: 100%;
      margin-inline: auto;
      padding-inline: var(--ngxsmk-space-4);
    }
    :host([data-size='sm']) { max-width: 40rem; }
    :host([data-size='md']) { max-width: 48rem; }
    :host([data-size='lg']) { max-width: 64rem; }
    :host([data-size='xl']) { max-width: 80rem; }
    :host([data-size='full']) { max-width: 100%; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkContainer {
  readonly size = input<NgxsmkContainerSize>('lg');
}
