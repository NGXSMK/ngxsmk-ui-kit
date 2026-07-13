import { DOCUMENT, Injectable, OnDestroy, inject } from '@angular/core';

export type AnnouncerPoliteness = 'polite' | 'assertive';

/**
 * Announces messages to screen readers through a visually hidden
 * `aria-live` region appended to the document body.
 */
@Injectable({ providedIn: 'root' })
export class NgxsmkLiveAnnouncer implements OnDestroy {
  private readonly document = inject(DOCUMENT);
  private region: HTMLElement | null = null;
  private clearTimer: ReturnType<typeof setTimeout> | null = null;

  announce(message: string, politeness: AnnouncerPoliteness = 'polite'): void {
    const region = this.ensureRegion();
    region.setAttribute('aria-live', politeness);

    // Clear first so repeating the same message is re-announced.
    region.textContent = '';
    setTimeout(() => (region.textContent = message));

    if (this.clearTimer) {
      clearTimeout(this.clearTimer);
    }
    this.clearTimer = setTimeout(() => (region.textContent = ''), 10_000);
  }

  ngOnDestroy(): void {
    if (this.clearTimer) {
      clearTimeout(this.clearTimer);
    }
    this.region?.remove();
  }

  private ensureRegion(): HTMLElement {
    if (!this.region) {
      const region = this.document.createElement('div');
      region.setAttribute('aria-atomic', 'true');
      region.className = 'ngxsmk-live-announcer';
      Object.assign(region.style, {
        position: 'absolute',
        width: '1px',
        height: '1px',
        margin: '-1px',
        padding: '0',
        border: '0',
        overflow: 'hidden',
        clipPath: 'inset(100%)',
        whiteSpace: 'nowrap',
      });
      this.document.body.appendChild(region);
      this.region = region;
    }
    return this.region;
  }
}
