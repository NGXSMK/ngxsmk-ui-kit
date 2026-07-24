import { DestroyRef, Directive, ElementRef, afterNextRender, inject, input } from '@angular/core';
import { loadMotion, prefersReducedMotion } from './animate';

/**
 * Links animation progress to scroll position using `motion.scroll()`.
 *
 * The element's style properties are driven by scroll progress (0→1).
 * When `motion` is not installed, this directive is a no-op.
 *
 * ```html
 * <!-- Fade in as user scrolls down -->
 * <div
 *   ngxsmkScrollLinked
 *   [scrollLinkedKeyframes]="{ opacity: [0, 1] }"
 * >
 *   Fades in on scroll
 * </div>
 *
 * <!-- Parallax effect -->
 * <div
 *   ngxsmkScrollLinked
 *   [scrollLinkedKeyframes]="{ y: [-50, 50] }"
 *   [scrollLinkedOffset]="['start end', 'end start']"
 * >
 *   Parallax
 * </div>
 *
 * <!-- Custom target element -->
 * <div
 *   ngxsmkScrollLinked
 *   [scrollLinkedKeyframes]="{ scale: [0.8, 1] }"
 *   [scrollLinkedTarget]="heroRef"
 * >
 *   Scale tied to hero scroll
 * </div>
 * ```
 */
@Directive({
  standalone: true,
  selector: '[ngxsmkScrollLinked]',
})
export class NgxsmkScrollLinked {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);

  // ---- Inputs ------------------------------------------------------------

  /**
   * Keyframes map: `{ cssProp: [from, to] }` or `{ cssProp: value }`.
   * Values are interpolated from 0→1 scroll progress.
   */
  readonly ngxsmkScrollLinked =
    input.required<Record<string, [string | number, string | number] | string | number>>();

  /**
   * Scroll offsets: `[target, container]` intersection strings.
   * Default `['start end', 'end start']` (element enters from bottom, leaves at top).
   */
  readonly scrollLinkedOffset = input<[string, string]>(['start end', 'end start']);

  /** Scroll axis. Default `'y'`. */
  readonly scrollLinkedAxis = input<'x' | 'y'>('y');

  /**
   * Target element to track. Default `undefined` (tracks the element itself within viewport).
   * Pass a `Ref<HTMLElement>` signal to track a different element.
   */
  readonly scrollLinkedTarget = input<HTMLElement>();

  /** Container element for scroll tracking. Default `window`. */
  readonly scrollLinkedContainer = input<HTMLElement>();

  constructor() {
    afterNextRender(async () => {
      if (prefersReducedMotion()) return;

      const motion = await loadMotion();
      if (!motion) return;

      const nativeEl = this.el.nativeElement;
      const keyframes = this.ngxsmkScrollLinked();
      const offset = this.scrollLinkedOffset();
      const axis = this.scrollLinkedAxis();
      const target = this.scrollLinkedTarget();
      const container = this.scrollLinkedContainer();

      // Build the animate call with the keyframes
      const animatableProps: Record<string, string | number> = {};
      const perPropOptions: Record<string, unknown> = {};

      for (const [prop, value] of Object.entries(keyframes)) {
        if (Array.isArray(value)) {
          animatableProps[prop] = value[0];
          // Store the keyframe range
          perPropOptions[prop] = value;
        } else {
          animatableProps[prop] = value;
        }
      }

      // Create the animation
      const animation = motion.animate(nativeEl, animatableProps, {
        ease: 'linear',
      });

      // Link it to scroll
      const scrollOptions: Record<string, unknown> = { axis };
      if (target) {
        scrollOptions['target'] = target;
      }
      if (container) {
        scrollOptions['container'] = container;
      }
      if (offset) {
        scrollOptions['offset'] = offset;
      }

      const cancelScroll = motion.scroll(animation, scrollOptions);

      this.destroyRef.onDestroy(() => {
        cancelScroll();
        animation.stop();
      });
    });
  }
}
