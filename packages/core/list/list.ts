import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  input,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  standalone: true,
  selector: 'ngxsmk-list',
  template: `<ng-content />`,
  host: {
    class: 'ngxsmk-list',
    '[attr.data-divided]': 'divided() ? "" : null',
  },
  encapsulation: ViewEncapsulation.None,
  styles: `
    .ngxsmk-list {
      display: flex;
      flex-direction: column;
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-lg);
      background: var(--ngxsmk-color-surface);
      font-family: var(--ngxsmk-font-sans);
      overflow: hidden;
    }

    .ngxsmk-list[data-divided] > :not(:last-child) {
      border-bottom: 1px solid var(--ngxsmk-color-outline);
    }

    /* Edge-to-edge list item styles inside standard list */
    .ngxsmk-list > .ngxsmk-list-item {
      border-radius: 0;
    }
    .ngxsmk-list > .ngxsmk-list-item:first-child,
    .ngxsmk-list > .ngxsmk-list-item:first-child > .ngxsmk-list-item__link {
      border-top-left-radius: inherit;
      border-top-right-radius: inherit;
    }
    .ngxsmk-list > .ngxsmk-list-item:last-child,
    .ngxsmk-list > .ngxsmk-list-item:last-child > .ngxsmk-list-item__link {
      border-bottom-left-radius: inherit;
      border-bottom-right-radius: inherit;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkList {
  readonly divided = input(false, { transform: booleanAttribute });
}
