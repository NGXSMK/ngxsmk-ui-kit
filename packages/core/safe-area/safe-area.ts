import { Directive, computed, input } from '@angular/core';

/** Edges a safe-area inset can be applied to. */
export type NgxsmkSafeAreaSide = 'top' | 'right' | 'bottom' | 'left';

const ALL_SIDES: readonly NgxsmkSafeAreaSide[] = ['top', 'right', 'bottom', 'left'];

/**
 * Pads an element by the device's safe-area insets.
 *
 * The kit's own edge-anchored components (toast, sheet, mobile-nav,
 * bottom-tab-bar) already do this internally. This directive exposes the same
 * behavior for app layout — a fixed header, a custom footer, a full-bleed
 * panel — without hand-writing `env(safe-area-inset-*)` in four places.
 *
 * Resolves to `0px` wherever the browser reports no inset, so it is safe to
 * apply unconditionally. Under Ionic, `provideNgxsmkIonic()` repoints the
 * underlying tokens at Ionic's values, which are populated in a Capacitor
 * WebView where `env()` often is not.
 *
 * ```html
 * <header ngxsmkSafeArea="top">…</header>
 * <div ngxsmkSafeArea="top bottom">…</div>
 * <div ngxsmkSafeArea>…</div>            <!-- all four edges -->
 * <div [ngxsmkSafeArea]="['left','right']">…</div>
 * ```
 *
 * Use `mode="margin"` when the element has a background that should stop at the
 * safe edge rather than extend under the notch.
 */
@Directive({
  standalone: true,
  selector: '[ngxsmkSafeArea]',
  host: {
    '[style.padding-top]': "styleFor('top', 'padding')",
    '[style.padding-right]': "styleFor('right', 'padding')",
    '[style.padding-bottom]': "styleFor('bottom', 'padding')",
    '[style.padding-left]': "styleFor('left', 'padding')",
    '[style.margin-top]': "styleFor('top', 'margin')",
    '[style.margin-right]': "styleFor('right', 'margin')",
    '[style.margin-bottom]': "styleFor('bottom', 'margin')",
    '[style.margin-left]': "styleFor('left', 'margin')",
  },
})
export class NgxsmkSafeArea {
  /**
   * Which edges to pad. Accepts `'top bottom'`, an array, or an empty value for
   * all four.
   */
  readonly ngxsmkSafeArea = input<string | readonly NgxsmkSafeAreaSide[] | ''>('');

  /** Apply the inset as padding (default) or margin. */
  readonly mode = input<'padding' | 'margin'>('padding');

  private readonly sides = computed<readonly NgxsmkSafeAreaSide[]>(() => {
    const value = this.ngxsmkSafeArea();
    if (Array.isArray(value)) return value.length ? value : ALL_SIDES;

    const parsed = String(value)
      .split(/[\s,]+/)
      .filter((s): s is NgxsmkSafeAreaSide => (ALL_SIDES as readonly string[]).includes(s));
    // A bare `ngxsmkSafeArea` with no value means "every edge".
    return parsed.length ? parsed : ALL_SIDES;
  });

  protected styleFor(side: NgxsmkSafeAreaSide, mode: 'padding' | 'margin'): string | null {
    if (this.mode() !== mode || !this.sides().includes(side)) return null;
    return `var(--ngxsmk-safe-area-${side})`;
  }
}
