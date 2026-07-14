import { DOCUMENT } from '@angular/common';
import {
  DestroyRef,
  Signal,
  inject,
  signal,
} from '@angular/core';

/**
 * Reactive media query. Must be called in an injection context.
 *
 * ```ts
 * private readonly isMobile = injectMediaQuery('(max-width: 767px)');
 * ```
 */
export function injectMediaQuery(query: string): Signal<boolean> {
  const window = inject(DOCUMENT).defaultView;
  const matches = signal(false);

  const media = window?.matchMedia?.(query);
  if (media) {
    matches.set(media.matches);
    const listener = (event: MediaQueryListEvent) => matches.set(event.matches);
    media.addEventListener('change', listener);
    inject(DestroyRef).onDestroy(() =>
      media.removeEventListener('change', listener),
    );
  }

  return matches.asReadonly();
}
