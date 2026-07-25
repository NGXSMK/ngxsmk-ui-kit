import { DOCUMENT } from '@angular/common';
import { InjectionToken, inject } from '@angular/core';

/**
 * Host-environment seam for the two DOM assumptions overlays make: which
 * element actually scrolls, and where an overlay should be attached.
 *
 * On the plain web both are the document body. Inside a shell that owns its own
 * scrolling and stacking — Ionic being the motivating case — neither is: Ionic
 * scrolls inside `ion-content`'s shadow `.inner-scroll`, so setting
 * `overflow: hidden` on the body silently does nothing, and body-attached
 * overlays land outside `ion-app`'s stacking context.
 */
export interface NgxsmkPlatformAdapter {
  /**
   * The element whose scrolling should be frozen while an overlay is open.
   * Return `null` when nothing is scrollable yet; callers fall back to the body.
   */
  scrollContainer(): HTMLElement | null;

  /** The element overlays should be attached to. */
  overlayContainer(): HTMLElement;
}

/**
 * The active platform adapter. Defaults to the plain-web behavior, so nothing
 * needs configuring outside a host shell.
 *
 * ```ts
 * // Ionic apps:
 * providers: [provideNgxsmkIonicPlatform()]
 * ```
 */
export const NGXSMK_PLATFORM_ADAPTER = new InjectionToken<NgxsmkPlatformAdapter>(
  'NGXSMK_PLATFORM_ADAPTER',
  {
    providedIn: 'root',
    factory: () => {
      const document = inject(DOCUMENT);
      return {
        scrollContainer: () => document.body,
        overlayContainer: () => document.body,
      };
    },
  },
);
