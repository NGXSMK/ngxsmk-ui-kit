import {
  ChangeDetectionStrategy,
  Component,
  InjectionToken,
  Signal,
  inject,
  input,
} from '@angular/core';

/**
 * The separator supplied by an enclosing {@link NgxsmkBreadcrumb}, so items do
 * not each have to declare it. Absent when an item is used on its own.
 */
export const NGXSMK_BREADCRUMB_SEPARATOR = new InjectionToken<Signal<string>>(
  'NGXSMK_BREADCRUMB_SEPARATOR',
);

/** How a trail behaves when it is wider than its container. */
export type NgxsmkBreadcrumbOverflow = 'wrap' | 'scroll';

/**
 * Navigation landmark wrapping a trail of `ngxsmk-breadcrumb-item`s.
 *
 * Supplies the three things an item cannot provide for itself: the
 * `navigation` landmark that lets screen-reader users jump to the trail, the
 * list semantics that announce its length, and a single `separator` shared by
 * every item instead of repeated on each one.
 *
 * ```html
 * <ngxsmk-breadcrumb>
 *   <ngxsmk-breadcrumb-item href="/">Home</ngxsmk-breadcrumb-item>
 *   <ngxsmk-breadcrumb-item href="/docs">Docs</ngxsmk-breadcrumb-item>
 *   <ngxsmk-breadcrumb-item>Breadcrumb</ngxsmk-breadcrumb-item>
 * </ngxsmk-breadcrumb>
 *
 * <ngxsmk-breadcrumb separator="›" ariaLabel="You are here" overflow="scroll" />
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-breadcrumb',
  template: `
    <!-- role="list" is explicit: the projected items are custom elements, not
         <li>, so the implicit list role would be dropped by assistive tech. -->
    <ol class="ngxsmk-breadcrumb__list" role="list">
      <ng-content />
    </ol>
  `,
  host: {
    class: 'ngxsmk-breadcrumb',
    role: 'navigation',
    '[attr.aria-label]': 'ariaLabel()',
    '[attr.data-overflow]': 'overflow()',
  },
  providers: [
    {
      provide: NGXSMK_BREADCRUMB_SEPARATOR,
      useFactory: () => inject(NgxsmkBreadcrumb).separator,
    },
  ],
  styles: `
    :host {
      display: block;
      font-family: var(--ngxsmk-font-sans);
    }
    .ngxsmk-breadcrumb__list {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      margin: 0;
      padding: 0;
      list-style: none;
    }
    /* A trail that outgrows its container scrolls rather than wrapping onto a
       second line, which reads as a separate trail on narrow screens. */
    :host([data-overflow='scroll']) .ngxsmk-breadcrumb__list {
      flex-wrap: nowrap;
      overflow-x: auto;
      scrollbar-width: thin;
      -webkit-overflow-scrolling: touch;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkBreadcrumb {
  /**
   * Names the landmark. Two breadcrumbs on one page (a page trail and a
   * file-tree trail, say) need distinct names to be told apart.
   */
  readonly ariaLabel = input('Breadcrumb');

  /** Separator rendered between items. Set once here rather than per item. */
  readonly separator = input('/');

  /** `wrap` (default) or `scroll` when the trail exceeds its container. */
  readonly overflow = input<NgxsmkBreadcrumbOverflow>('wrap');
}
