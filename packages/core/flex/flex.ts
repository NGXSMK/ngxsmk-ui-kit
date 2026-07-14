import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  input,
} from '@angular/core';

export type NgxsmkFlexDirection = 'row' | 'row-reverse' | 'column' | 'column-reverse';
export type NgxsmkFlexAlign = 'start' | 'end' | 'center' | 'baseline' | 'stretch';
export type NgxsmkFlexJustify = 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';

const ALIGN_MAP: Record<string, string> = {
  start: 'flex-start',
  end: 'flex-end',
  center: 'center',
  baseline: 'baseline',
  stretch: 'stretch',
};

const JUSTIFY_MAP: Record<string, string> = {
  start: 'flex-start',
  end: 'flex-end',
  center: 'center',
  between: 'space-between',
  around: 'space-around',
  evenly: 'space-evenly',
};

@Component({
  standalone: true,
  selector: 'ngxsmk-flex',
  template: `<ng-content />`,
  host: {
    class: 'ngxsmk-flex',
    '[style.flex-direction]': 'direction()',
    '[style.align-items]': 'alignMap()',
    '[style.justify-content]': 'justifyMap()',
    '[style.gap]': 'gap()',
    '[style.flex-wrap]': 'wrap() ? "wrap" : null',
  },
  styles: `:host { display: flex; }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkFlex {
  readonly direction = input<NgxsmkFlexDirection>('row');
  readonly align = input<NgxsmkFlexAlign>('stretch');
  readonly justify = input<NgxsmkFlexJustify>('start');
  readonly gap = input('var(--ngxsmk-space-4)');
  readonly wrap = input(false, { transform: booleanAttribute });

  protected readonly alignMap = () => ALIGN_MAP[this.align()] || this.align();
  protected readonly justifyMap = () => JUSTIFY_MAP[this.justify()] || this.justify();
}
