import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

/**
 * Locks body scrolling (for dialogs, drawers, sheets). Reference-counted so
 * nested overlays can lock independently; compensates for scrollbar width to
 * prevent layout shift.
 */
@Injectable({ providedIn: 'root' })
export class NgxsmkScrollLock {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private locks = 0;
  private previousOverflow = '';
  private previousPaddingRight = '';
  private previousOverscroll = '';

  lock(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    if (this.locks++ > 0) {
      return;
    }
    const body = this.document?.body;
    if (!body) {
      return;
    }
    const window = this.document.defaultView;
    const scrollbar = window ? window.innerWidth - this.document.documentElement.clientWidth : 0;

    this.previousOverflow = body.style.overflow;
    this.previousPaddingRight = body.style.paddingRight;
    this.previousOverscroll = body.style.overscrollBehavior;

    body.style.overflow = 'hidden';
    body.style.overscrollBehavior = 'none';
    if (scrollbar > 0) {
      body.style.paddingRight = `${scrollbar}px`;
    }
  }

  unlock(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    if (this.locks === 0 || --this.locks > 0) {
      return;
    }
    const body = this.document?.body;
    if (!body) {
      return;
    }
    body.style.overflow = this.previousOverflow;
    body.style.paddingRight = this.previousPaddingRight;
    body.style.overscrollBehavior = this.previousOverscroll;
  }
}
