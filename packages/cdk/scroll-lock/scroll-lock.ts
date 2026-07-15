import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

/**
 * Locks body scrolling (for dialogs, drawers, sheets). Reference-counted so
 * nested overlays can lock independently; compensates for scrollbar width to
 * prevent layout shift.
 */
@Injectable({ providedIn: 'root' })
export class NgxsmkScrollLock {
  private readonly document = inject(DOCUMENT);
  private locks = 0;
  private previousOverflow = '';
  private previousPaddingRight = '';

  lock(): void {
    if (this.locks++ > 0) {
      return;
    }
    const body = this.document.body;
    const window = this.document.defaultView;
    const scrollbar = window ? window.innerWidth - this.document.documentElement.clientWidth : 0;

    this.previousOverflow = body.style.overflow;
    this.previousPaddingRight = body.style.paddingRight;
    body.style.overflow = 'hidden';
    if (scrollbar > 0) {
      body.style.paddingRight = `${scrollbar}px`;
    }
  }

  unlock(): void {
    if (this.locks === 0 || --this.locks > 0) {
      return;
    }
    const body = this.document.body;
    body.style.overflow = this.previousOverflow;
    body.style.paddingRight = this.previousPaddingRight;
  }
}
