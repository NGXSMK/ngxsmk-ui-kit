import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { NgxsmkPlatformAdapter } from '@ngxsmk/cdk/platform';

/**
 * Platform adapter for apps running inside Ionic.
 *
 * Ionic breaks the two assumptions NGXSMK overlays make on the plain web:
 *
 *  - **Scrolling** does not happen on the body. Each `ion-content` scrolls an
 *    element inside its own shadow root, so `body { overflow: hidden }` is a
 *    no-op and the page keeps scrolling behind an open dialog.
 *  - **Stacking** is owned by `ion-app`. Overlays appended to the body sit
 *    outside that context and render beneath `ion-modal`.
 *
 * Both lookups are done live rather than cached: Ionic swaps the active page on
 * every route change, so the element that scrolls is not stable for the
 * lifetime of the app.
 */
@Injectable({ providedIn: 'root' })
export class NgxsmkIonicPlatformAdapter implements NgxsmkPlatformAdapter {
  private readonly document = inject(DOCUMENT);

  scrollContainer(): HTMLElement | null {
    const content = this.activeContent();
    if (!content) {
      return null;
    }
    // `ion-content` renders its scroller as `.inner-scroll` inside its shadow
    // root. Ionic's own `getScrollElement()` is async, which the synchronous
    // scroll lock cannot await, so read it directly.
    const inner = content.shadowRoot?.querySelector<HTMLElement>('.inner-scroll');
    return inner ?? null;
  }

  overlayContainer(): HTMLElement {
    return this.document.querySelector<HTMLElement>('ion-app') ?? this.document.body;
  }

  /**
   * The `ion-content` of the page currently on screen. Ionic keeps previous
   * pages in the DOM and marks them `.ion-page-hidden`, so scoping to the
   * visible page avoids locking a stale, off-screen scroller.
   */
  private activeContent(): (HTMLElement & { shadowRoot: ShadowRoot | null }) | null {
    const page = this.document.querySelector<HTMLElement>('.ion-page:not(.ion-page-hidden)');
    const scope: ParentNode = page ?? this.document;
    return scope.querySelector<HTMLElement>('ion-content') ?? null;
  }
}
