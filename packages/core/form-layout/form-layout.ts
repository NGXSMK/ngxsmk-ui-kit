import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type NgxsmkFormLayoutColumns = 1 | 2 | 3 | 4;

@Component({
  selector: 'ngxsmk-form-layout',
  template: `<ng-content />`,
  host: {
    class: 'ngxsmk-form-layout',
    '[style.grid-template-columns]': 'columns() > 1 ? "repeat(" + columns() + ", 1fr)" : null',
  },
  styles: `
    :host { display: grid; grid-template-columns: 1fr; gap: var(--ngxsmk-space-4) var(--ngxsmk-space-6); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkFormLayout {
  readonly columns = input<NgxsmkFormLayoutColumns>(1);
}
