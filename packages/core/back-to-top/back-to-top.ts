import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  booleanAttribute,
  inject,
  input,
  numberAttribute,
  output,
  signal,
} from '@angular/core';
import { NGXSMK_PLATFORM_ADAPTER } from '@ngxsmk/cdk/platform';

/**
 * Button that appears once the user has scrolled past a threshold and returns
 * them to the top.
 *
 * Listens to whichever element the platform adapter says actually scrolls, so
 * it works inside an Ionic `ion-content` as well as on a plain document — the
 * same seam the scroll lock uses.
 *
 * ```html
 * <ngxsmk-back-to-top />
 * <ngxsmk-back-to-top [threshold]="800" label="Back to top" />
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-back-to-top',
  template: `
    <button
      type="button"
      class="ngxsmk-back-to-top__button"
      [attr.aria-label]="label()"
      [attr.tabindex]="visible() ? null : -1"
      (click)="scrollToTop()"
    >
      <!-- The default glyph comes from CSS rather than ng-content fallback
           content, which Angular only supports from v18 and would break our
           17.3 floor. The button carries the accessible name, so the glyph is
           decorative either way. -->
      <span class="ngxsmk-back-to-top__icon" aria-hidden="true"><ng-content /></span>
    </button>
  `,
  host: {
    class: 'ngxsmk-back-to-top',
    // Hidden from assistive tech as well as sight while below the threshold,
    // so it never becomes an unreachable tab stop.
    '[attr.aria-hidden]': 'visible() ? null : "true"',
    '[attr.data-visible]': 'visible() ? "" : null',
  },
  styles: `
    :host {
      position: fixed;
      inset-inline-end: calc(var(--ngxsmk-space-4) + var(--ngxsmk-safe-area-right));
      inset-block-end: calc(var(--ngxsmk-space-4) + var(--ngxsmk-safe-area-bottom));
      z-index: var(--ngxsmk-z-sticky, 1100);
      opacity: 0;
      visibility: hidden;
      transform: translateY(0.5rem);
      transition:
        opacity var(--ngxsmk-motion-duration) var(--ngxsmk-motion-ease),
        transform var(--ngxsmk-motion-duration) var(--ngxsmk-motion-ease),
        visibility var(--ngxsmk-motion-duration);
    }
    :host([data-visible]) {
      opacity: 1;
      visibility: visible;
      transform: none;
    }
    .ngxsmk-back-to-top__button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      inline-size: var(--ngxsmk-control-height);
      block-size: var(--ngxsmk-control-height);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-full);
      background: var(--ngxsmk-color-surface);
      color: var(--ngxsmk-color-on-surface);
      box-shadow: var(--ngxsmk-shadow-lg);
      font: inherit;
      cursor: pointer;
    }
    .ngxsmk-back-to-top__button:hover {
      background: var(--ngxsmk-color-surface-hover);
    }
    .ngxsmk-back-to-top__button:focus-visible {
      outline: none;
      box-shadow: var(--ngxsmk-focus-ring);
    }
    /* Fallback glyph when the caller projects no icon. */
    .ngxsmk-back-to-top__icon:empty::after {
      content: '↑';
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkBackToTop {
  /** Scroll distance, in pixels, before the button appears. */
  readonly threshold = input(400, { transform: numberAttribute });

  readonly label = input('Back to top');

  /** Jump instantly instead of smooth-scrolling. */
  readonly instant = input(false, { transform: booleanAttribute });

  readonly activated = output<void>();

  protected readonly visible = signal(false);

  private readonly platform = inject(NGXSMK_PLATFORM_ADAPTER);
  private readonly document = inject(DOCUMENT);

  constructor() {
    const view = this.document.defaultView;
    if (!view) return;

    const onScroll = () => this.visible.set(this.scrollTop() > this.threshold());

    // The scroll container may not exist yet (Ionic swaps pages), so listen on
    // the document too and read the container lazily on each event.
    const target = this.scrollTarget();
    target.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    inject(DestroyRef).onDestroy(() => target.removeEventListener('scroll', onScroll));
  }

  protected scrollToTop(): void {
    const container = this.platform.scrollContainer();
    const behavior: ScrollBehavior = this.instant() ? 'auto' : 'smooth';

    if (container && container !== this.document.body) {
      container.scrollTo({ top: 0, behavior });
    } else {
      this.document.defaultView?.scrollTo({ top: 0, behavior });
    }

    this.visible.set(false);
    this.activated.emit();
  }

  private scrollTarget(): EventTarget {
    const container = this.platform.scrollContainer();
    // The body does not emit scroll events itself — the document does.
    return container && container !== this.document.body ? container : this.document;
  }

  private scrollTop(): number {
    const container = this.platform.scrollContainer();
    if (container && container !== this.document.body) return container.scrollTop;
    return this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;
  }
}
