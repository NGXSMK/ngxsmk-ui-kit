import { ChangeDetectionStrategy, Component, model, output } from '@angular/core';

@Component({
  standalone: true,
  selector: 'ngxsmk-toggle-button-group',
  template: `<ng-content />`,
  host: { class: 'ngxsmk-toggle-button-group' },
  styles: `
    :host {
      display: inline-flex;
      gap: var(--ngxsmk-space-1);
    }
    ::ng-deep ngxsmk-toggle-button:first-child {
      border-radius: var(--ngxsmk-radius-md) 0 0 var(--ngxsmk-radius-md);
    }
    ::ng-deep ngxsmk-toggle-button:last-child {
      border-radius: 0 var(--ngxsmk-radius-md) var(--ngxsmk-radius-md) 0;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkToggleButtonGroup {
  readonly value = model('');
  readonly changed = output<string>();
}
