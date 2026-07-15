import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'ngxsmk-center',
  template: `<ng-content />`,
  host: { class: 'ngxsmk-center' },
  styles: `
    :host {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkCenter {}
