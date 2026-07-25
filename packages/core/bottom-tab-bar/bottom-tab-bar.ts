import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, booleanAttribute, input, output } from '@angular/core';

/**
 * Fixed bottom navigation bar for mobile layouts.
 *
 * Pads itself by `--ngxsmk-safe-area-bottom`, so it clears the home indicator
 * on devices that report an inset and sits flush everywhere else. In an Ionic
 * app `provideNgxsmkIonic()` points that token at Ionic's own inset values.
 *
 * ```html
 * <ngxsmk-bottom-tab-bar ariaLabel="Main">
 *   <ngxsmk-bottom-tab href="/" active>
 *     <span slot="icon">🏠</span>
 *     Home
 *   </ngxsmk-bottom-tab>
 *   <ngxsmk-bottom-tab href="/inbox" badge="3">
 *     <span slot="icon">✉</span>
 *     Inbox
 *   </ngxsmk-bottom-tab>
 * </ngxsmk-bottom-tab-bar>
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-bottom-tab-bar',
  template: `<ng-content />`,
  host: {
    class: 'ngxsmk-bottom-tab-bar',
    role: 'navigation',
    '[attr.aria-label]': 'ariaLabel()',
    '[attr.data-position]': 'fixed() ? "fixed" : "static"',
  },
  styles: `
    :host {
      display: flex;
      align-items: stretch;
      justify-content: space-around;
      inline-size: 100%;
      background: var(--ngxsmk-color-surface);
      border-top: 1px solid var(--ngxsmk-color-outline);
      font-family: var(--ngxsmk-font-sans);
      /* Clears the home indicator; 0px where the browser reports no inset. */
      padding-bottom: var(--ngxsmk-safe-area-bottom);
      padding-left: var(--ngxsmk-safe-area-left);
      padding-right: var(--ngxsmk-safe-area-right);
    }

    :host([data-position='fixed']) {
      position: fixed;
      inset-inline: 0;
      bottom: 0;
      z-index: var(--ngxsmk-z-sticky, 1100);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkBottomTabBar {
  /** Names the landmark, so it is distinguishable from other navigation. */
  readonly ariaLabel = input('Bottom navigation');

  /** Pinned to the viewport bottom by default; `false` renders it in flow. */
  readonly fixed = input(true, { transform: booleanAttribute });
}

/**
 * A single destination in an {@link NgxsmkBottomTabBar}.
 *
 * Renders an `<a>` when `href` is set and a `<button>` otherwise, so keyboard
 * and screen-reader semantics match what the tab actually does.
 *
 * ```html
 * <ngxsmk-bottom-tab href="/inbox" badge="3">
 *   <span slot="icon">✉</span>
 *   Inbox
 * </ngxsmk-bottom-tab>
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-bottom-tab',
  // The body markup is shared by the <a> and <button> branches through a
  // template outlet — duplicating it would mean two <ng-content> elements with
  // the same selector, and projection is resolved at compile time, so only the
  // first would ever receive content.
  imports: [NgTemplateOutlet],
  template: `
    @if (href()) {
      <a
        class="ngxsmk-bottom-tab__target"
        [attr.href]="disabled() ? null : href()"
        [attr.aria-current]="active() ? 'page' : null"
        [attr.aria-disabled]="disabled() ? 'true' : null"
        (click)="onClick($event)"
      >
        <ng-container [ngTemplateOutlet]="body" />
      </a>
    } @else {
      <button
        type="button"
        class="ngxsmk-bottom-tab__target"
        [attr.aria-current]="active() ? 'page' : null"
        [disabled]="disabled()"
        (click)="onClick($event)"
      >
        <ng-container [ngTemplateOutlet]="body" />
      </button>
    }

    <ng-template #body>
      <span class="ngxsmk-bottom-tab__icon">
        <ng-content select="[slot=icon]" />
        @if (badge()) {
          <span class="ngxsmk-bottom-tab__badge">{{ badge() }}</span>
        }
      </span>
      <span class="ngxsmk-bottom-tab__label"><ng-content /></span>
    </ng-template>
  `,
  host: {
    class: 'ngxsmk-bottom-tab',
    '[attr.data-active]': 'active() ? "" : null',
  },
  styles: `
    :host {
      display: flex;
      flex: 1 1 0;
      min-inline-size: 0;
    }
    .ngxsmk-bottom-tab__target {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--ngxsmk-space-1);
      inline-size: 100%;
      /* Comfortably above the 44px minimum touch target. */
      min-block-size: 3.25rem;
      padding: var(--ngxsmk-space-1) var(--ngxsmk-space-2);
      border: 0;
      background: none;
      color: var(--ngxsmk-color-on-surface-variant);
      font: inherit;
      text-decoration: none;
      cursor: pointer;
      transition: color var(--ngxsmk-motion-duration) var(--ngxsmk-motion-ease);
    }
    .ngxsmk-bottom-tab__target:focus-visible {
      outline: none;
      box-shadow: var(--ngxsmk-focus-ring);
      border-radius: var(--ngxsmk-radius-md);
    }
    :host([data-active]) .ngxsmk-bottom-tab__target {
      color: var(--ngxsmk-color-primary);
    }
    .ngxsmk-bottom-tab__target[aria-disabled='true'],
    .ngxsmk-bottom-tab__target:disabled {
      opacity: var(--ngxsmk-opacity-disabled, 0.5);
      pointer-events: none;
    }
    .ngxsmk-bottom-tab__icon {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: var(--ngxsmk-icon-md);
      line-height: 1;
    }
    .ngxsmk-bottom-tab__badge {
      position: absolute;
      inset-block-start: -0.35rem;
      inset-inline-start: 60%;
      min-inline-size: 1rem;
      padding: 0 0.25rem;
      border-radius: var(--ngxsmk-radius-full);
      background: var(--ngxsmk-color-error);
      color: var(--ngxsmk-color-on-error);
      font-size: var(--ngxsmk-text-body-xs-size);
      line-height: 1rem;
      text-align: center;
    }
    .ngxsmk-bottom-tab__label {
      max-inline-size: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: var(--ngxsmk-text-label-sm-size);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkBottomTab {
  readonly href = input('');
  readonly active = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  /** Small count rendered over the icon. */
  readonly badge = input('');

  readonly selected = output<void>();

  protected onClick(event: Event): void {
    if (this.disabled()) {
      event.preventDefault();
      return;
    }
    this.selected.emit();
  }
}
