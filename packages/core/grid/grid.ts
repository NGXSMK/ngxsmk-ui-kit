import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';

@Component({
  selector: 'ngxsmk-grid',
  template: `<ng-content />`,
  host: {
    class: 'ngxsmk-grid',
    '[style.grid-template-columns]': 'cols() ? "repeat(" + cols() + ", minmax(0, 1fr))" : null',
    '[style.gap]': 'gap()',
  },
    styles: `:host { display: grid; }
    @media (max-width: 768px) {
      :host { grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr)) !important; }
    }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkGrid {
  readonly cols = input<number | undefined>(undefined);
  readonly gap = input('var(--ngxsmk-space-4)');
}
