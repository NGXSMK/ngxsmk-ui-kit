import {
  Directive,
  ElementRef,
  afterNextRender,
  effect,
  inject,
  input,
  untracked,
} from '@angular/core';
import {
  animateValue,
  loadMotion,
  prefersReducedMotion,
} from './animate';

/**
 * Animates the host element's text content from a start number to a target
 * number. Uses `motion.animate()` when available for smooth easing and spring
 * physics; falls back to `requestAnimationFrame`.
 *
 * ```html
 * <span [ngxsmkNumberTicker]="1200" [numberTickerPrefix]="'$'" [numberTickerDuration]="1.5">
 *   $0
 * </span>
 *
 * <!-- Spring-based counter -->
 * <span
 *   [ngxsmkNumberTicker]="100"
 *   numberTickerType="spring"
 *   [numberTickerStiffness]="200"
 *   [numberTickerDamping]="30"
 * >
 *   0
 * </span>
 * ```
 */
@Directive({
  standalone: true,
  selector: '[ngxsmkNumberTicker]',
})
export class NgxsmkNumberTicker {
  private readonly el = inject(ElementRef<HTMLElement>);

  // ---- State API ----------------------------------------------------------

  /** Full transition config. Takes precedence over individual params. */
  readonly ngxsmkNumberTicker = input.required<number>();

  // ---- Individual param inputs --------------------------------------------

  /** Starting number. Default `0`. */
  readonly numberTickerFrom = input<number>(0);

  // Transition params
  /** Animation type. Default `'tween'`. */
  readonly numberTickerType = input<'tween' | 'spring' | 'inertia'>('tween');
  /** Duration of the animation in seconds. Default `1`. */
  readonly numberTickerDuration = input<number>(1);
  /** Delay before the animation starts in seconds. Default `0`. */
  readonly numberTickerDelay = input<number>(0);

  // Spring params
  /** Spring stiffness. Default `1`. */
  readonly numberTickerStiffness = input<number>();
  /** Spring damping. Default `10`. */
  readonly numberTickerDamping = input<number>();
  /** Spring mass. Default `1`. */
  readonly numberTickerMass = input<number>();
  /** Spring bounce 0–1. */
  readonly numberTickerBounce = input<number>();
  /** Visual duration in seconds (spring). */
  readonly numberTickerVisualDuration = input<number>();

  // Easing
  /** Easing name or cubic-bezier array. Default `'easeOut'`. */
  readonly numberTickerEase = input<string | number[]>('easeOut');

  // Formatting
  /** `Intl.NumberFormat` options. */
  readonly numberTickerFormat = input<Intl.NumberFormatOptions>({});
  /** Text prepended to the formatted number. */
  readonly numberTickerPrefix = input<string>('');
  /** Text appended to the formatted number. */
  readonly numberTickerSuffix = input<string>('');

  private animationFrame: number | null = null;

  constructor() {
    afterNextRender(() => {
      effect(() => {
        const to = this.ngxsmkNumberTicker();
        const from = this.numberTickerFrom();
        const format = this.numberTickerFormat();
        const prefix = this.numberTickerPrefix();
        const suffix = this.numberTickerSuffix();

        untracked(() => {
          this.cancelAnimation();
          this.animateNumber(from, to, format, prefix, suffix);
        });
      });
    });
  }

  private _buildMotionOptions(): Record<string, unknown> {
    const type = this.numberTickerType();

    if (type === 'spring') {
      const opts: Record<string, unknown> = { type: 'spring' };
      const stiffness = this.numberTickerStiffness();
      const damping = this.numberTickerDamping();
      const mass = this.numberTickerMass();
      const bounce = this.numberTickerBounce();
      const visualDuration = this.numberTickerVisualDuration();
      if (stiffness != null) opts['stiffness'] = stiffness;
      if (damping != null) opts['damping'] = damping;
      if (mass != null) opts['mass'] = mass;
      if (bounce != null) opts['bounce'] = bounce;
      if (visualDuration != null) opts['visualDuration'] = visualDuration;
      return opts;
    }

    if (type === 'inertia') {
      return { type: 'inertia' };
    }

    // Tween
    const opts: Record<string, unknown> = {};
    opts['duration'] = this.numberTickerDuration();
    opts['delay'] = this.numberTickerDelay();
    opts['ease'] = this.numberTickerEase();
    return opts;
  }

  private async animateNumber(
    from: number,
    to: number,
    format: Intl.NumberFormatOptions,
    prefix: string,
    suffix: string,
  ): Promise<void> {
    const el = this.el.nativeElement;
    const formatter = new Intl.NumberFormat(undefined, format);

    if (prefersReducedMotion()) {
      el.textContent = `${prefix}${formatter.format(to)}${suffix}`;
      return;
    }

    const options = this._buildMotionOptions();
    const motion = await loadMotion();

    if (motion) {
      // Use motion.dev for smooth animation with spring/easing support
      await animateValue(from, to, options, (value: number) => {
        el.textContent = `${prefix}${formatter.format(Math.round(value))}${suffix}`;
      });
      el.textContent = `${prefix}${formatter.format(to)}${suffix}`;
    } else {
      // Fallback: requestAnimationFrame with cubic ease-out
      this.animateNumberFallback(from, to, el, formatter, prefix, suffix);
    }
  }

  private animateNumberFallback(
    from: number,
    to: number,
    el: HTMLElement,
    formatter: Intl.NumberFormat,
    prefix: string,
    suffix: string,
  ): void {
    const duration = this.numberTickerDuration() * 1000;
    const delay = this.numberTickerDelay() * 1000;
    const range = to - from;
    const startTime = performance.now() + delay;
    const nf = formatter;

    const tick = (): void => {
      const elapsed = performance.now() - startTime;
      if (elapsed < 0) {
        this.animationFrame = requestAnimationFrame(tick);
        return;
      }
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = `${prefix}${nf.format(Math.round(from + range * eased))}${suffix}`;
      if (progress < 1) {
        this.animationFrame = requestAnimationFrame(tick);
      }
    };

    this.animationFrame = requestAnimationFrame(tick);
  }

  private cancelAnimation(): void {
    if (this.animationFrame !== null) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }
}
