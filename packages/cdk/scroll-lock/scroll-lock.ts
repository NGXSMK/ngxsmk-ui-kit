import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NGXSMK_PLATFORM_ADAPTER } from '@ngxsmk/cdk/platform';

/**
 * Locks scrolling (for dialogs, drawers, sheets). Reference-counted so nested
 * overlays can lock independently; compensates for scrollbar width to prevent
 * layout shift.
 *
 * The element that gets locked comes from `NGXSMK_PLATFORM_ADAPTER`, which is
 * the document body on the plain web. Shells that scroll somewhere else — Ionic
 * scrolls inside `ion-content`, not the body — provide their own adapter so the
 * lock lands on the element that actually scrolls.
 */
@Injectable({ providedIn: 'root' })
export class NgxsmkScrollLock {
  private readonly document = inject(DOCUMENT);
  private readonly platform = inject(NGXSMK_PLATFORM_ADAPTER);

  private locks = 0;
  /** Held across lock/unlock so we restore the element we actually froze. */
  private locked: HTMLElement | null = null;
  private previousOverflow = '';
  private previousPaddingRight = '';

  lock(): void {
    if (this.locks++ > 0) {
      return;
    }
    const target = this.platform.scrollContainer() ?? this.document.body;

    this.locked = target;
    this.previousOverflow = target.style.overflow;
    this.previousPaddingRight = target.style.paddingRight;

    const scrollbar = this.scrollbarWidth(target);
    target.style.overflow = 'hidden';
    if (scrollbar > 0) {
      target.style.paddingRight = `${scrollbar}px`;
    }
  }

  unlock(): void {
    if (this.locks === 0 || --this.locks > 0) {
      return;
    }
    const target = this.locked;
    if (!target) {
      return;
    }
    target.style.overflow = this.previousOverflow;
    target.style.paddingRight = this.previousPaddingRight;
    this.locked = null;
  }

  /**
   * The body scrolls the viewport, so its scrollbar is the gap between the
   * window and the document element. Any other container scrolls itself, so the
   * gap is between its border box and its content box.
   */
  private scrollbarWidth(target: HTMLElement): number {
    if (target === this.document.body) {
      const view = this.document.defaultView;
      return view ? view.innerWidth - this.document.documentElement.clientWidth : 0;
    }
    return target.offsetWidth - target.clientWidth;
  }
}
