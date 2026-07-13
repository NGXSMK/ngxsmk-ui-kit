import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ngxsmk-spacer',
  template: '',
  host: {
    class: 'ngxsmk-spacer',
    '[style.flex]': '"1 1 " + size()',
    '[style.width]': 'orientation() === "vertical" ? size() : null',
    '[style.height]': 'orientation() === "horizontal" ? size() : null',
    '[style.min-width]': 'orientation() === "vertical" ? size() : null',
    '[style.min-height]': 'orientation() === "horizontal" ? size() : null',
  },
  styles: `
    :host { display: block; flex-shrink: 0; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkSpacer {
  readonly size = input('var(--ngxsmk-space-4)');
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
}
