import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'ngxsmk-button-group, [ngxsmkButtonGroup]',
  template: `<ng-content />`,
  host: {
    class: 'ngxsmk-button-group',
    '[style.flex-direction]': 'direction() === "vertical" ? "column" : "row"',
  },
  styles: `
    :host { display: inline-flex; gap: var(--ngxsmk-space-1); }
    ::ng-deep [ngxsmk-button] { border-radius: 0; }
    ::ng-deep [ngxsmk-button]:first-child { border-radius: var(--ngxsmk-radius-md) 0 0 var(--ngxsmk-radius-md); }
    ::ng-deep [ngxsmk-button]:last-child { border-radius: 0 var(--ngxsmk-radius-md) var(--ngxsmk-radius-md) 0; }
    ::ng-deep [ngxsmk-button]:only-child { border-radius: var(--ngxsmk-radius-md); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkButtonGroup {
  readonly direction = input<'horizontal' | 'vertical'>('horizontal');
}
