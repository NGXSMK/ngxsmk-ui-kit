import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type NgxsmkStackDirection = 'horizontal' | 'vertical';
export type NgxsmkStackAlign = 'start' | 'end' | 'center' | 'baseline' | 'stretch';

const DIRECTION_MAP: Record<NgxsmkStackDirection, string> = {
  horizontal: 'row',
  vertical: 'column',
};

const ALIGN_MAP: Record<string, string> = {
  start: 'flex-start',
  end: 'flex-end',
  center: 'center',
  baseline: 'baseline',
  stretch: 'stretch',
};

@Component({
  standalone: true,
  selector: 'ngxsmk-stack',
  template: `<ng-content />`,
  host: {
    class: 'ngxsmk-stack',
    '[style.flex-direction]': 'directionMap()',
    '[style.align-items]': 'alignMap()',
    '[style.gap]': 'gap()',
  },
  styles: `
    :host {
      display: flex;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkStack {
  readonly direction = input<NgxsmkStackDirection>('vertical');
  readonly gap = input('var(--ngxsmk-space-4)');
  readonly align = input<NgxsmkStackAlign>('stretch');

  protected readonly directionMap = computed(() => DIRECTION_MAP[this.direction()]);
  protected readonly alignMap = computed(() => ALIGN_MAP[this.align()] || this.align());
}
