import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'ngxsmk-aspect-ratio',
  template: `<ng-content />`,
  host: {
    class: 'ngxsmk-aspect-ratio',
    '[style.padding-top]': 'padding()',
  },
  styles: `
    :host {
      display: block;
      position: relative;
      width: 100%;
      overflow: hidden;
    }
    ::ng-deep > * {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkAspectRatio {
  readonly ratio = input('16/9');

  protected readonly padding = computed(() => {
    const parts = this.ratio().split('/');
    const w = parseFloat(parts[0]);
    const h = parseFloat(parts[1]);
    return isNaN(w) || isNaN(h) || w === 0 ? '56.25%' : `${(h / w) * 100}%`;
  });
}
