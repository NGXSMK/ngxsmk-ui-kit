import { ChangeDetectionStrategy, Component, Directive, input } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[ngxsmkStackItem]',
  host: { class: 'ngxsmk-stack-item' },
})
export class NgxsmkStackItem {}

@Component({
  standalone: true,
  selector: 'ngxsmk-h-stack',
  template: `<ng-content />`,
  host: {
    class: 'ngxsmk-h-stack',
    '[style.gap]': 'gap()',
    '[style.align-items]': 'align()',
    '[style.justify-content]': 'justify()',
    '[style.flex-wrap]': 'wrap() ? "wrap" : null',
  },
  styles: `
    :host {
      display: flex;
      flex-direction: row;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkHStack {
  readonly gap = input('var(--ngxsmk-space-4)');
  readonly align = input('center');
  readonly justify = input('flex-start');
  readonly wrap = input(false);
}

@Component({
  standalone: true,
  selector: 'ngxsmk-v-stack',
  template: `<ng-content />`,
  host: {
    class: 'ngxsmk-v-stack',
    '[style.gap]': 'gap()',
    '[style.align-items]': 'align()',
    '[style.justify-content]': 'justify()',
  },
  styles: `
    :host {
      display: flex;
      flex-direction: column;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkVStack {
  readonly gap = input('var(--ngxsmk-space-4)');
  readonly align = input('stretch');
  readonly justify = input('flex-start');
}
