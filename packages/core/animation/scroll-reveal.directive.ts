import {
  DestroyRef,
  Directive,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import {
  NgxsmkMotionState,
  NgxsmkTransition,
  NgxsmkTweenTransition,
  NgxsmkSpringTransition,
  NgxsmkInertiaTransition,
  loadMotion,
  playEnter,
  playExit,
  prefersReducedMotion,
} from './animate';

/**
 * Animates an element when it enters the viewport.
 *
 * When `motion` is installed, uses `motion.inView()` for detection and
 * `motion.animate()` for the animation. Falls back to IntersectionObserver
 * when motion is not installed.
 *
 * ```html
 * <div
 *   ngxsmkScrollReveal
 *   [scrollRevealInitial]="{ opacity: 0, y: 24 }"
 *   [scrollRevealAnimate]="{ opacity: 1, y: 0 }"
 *   [scrollRevealDuration]="0.6"
 *   scrollRevealType="spring"
 *   [scrollRevealStiffness]="200"
 *   [scrollRevealDamping]="20"
 *   [scrollRevealOnce]="true"
 * >
 *   Revealed on scroll
 * </div>
 * ```
 */
@Directive({
  standalone: true,
  selector: '[ngxsmkScrollReveal]',
})
export class NgxsmkScrollReveal {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);

  // ---- State API ----------------------------------------------------------

  /** Full motion state applied when the element enters the viewport. */
  readonly ngxsmkScrollReveal = input<NgxsmkMotionState>();

  // ---- Individual param inputs --------------------------------------------

  /** Starting styles for the reveal animation. */
  readonly scrollRevealInitial = input<Record<string, string | number>>({
    opacity: 0,
    y: 24,
  });

  /** Target styles for the reveal animation. */
  readonly scrollRevealAnimate = input<Record<string, string | number>>({
    opacity: 1,
    y: 0,
  });

  /** Target styles for the exit animation (when scrolling out). */
  readonly scrollRevealExit = input<Record<string, string | number>>();

  // Transition params
  /** Animation type. Default `'tween'`. */
  readonly scrollRevealType = input<'tween' | 'spring' | 'inertia'>('tween');
  /** Duration in seconds. Default `0.6`. */
  readonly scrollRevealDuration = input<number>(0.6);
  /** Delay in seconds. Default `0`. */
  readonly scrollRevealDelay = input<number>(0);
  /** Easing name, cubic-bezier array, or custom function. */
  readonly scrollRevealEase = input<string | number[]>('ease-out');

  // Spring params
  /** Spring stiffness. Default `1`. */
  readonly scrollRevealStiffness = input<number>();
  /** Spring damping. Default `10`. */
  readonly scrollRevealDamping = input<number>();
  /** Spring mass. Default `1`. */
  readonly scrollRevealMass = input<number>();
  /** Spring bounce 0–1. */
  readonly scrollRevealBounce = input<number>();
  /** Visual duration in seconds (spring). */
  readonly scrollRevealVisualDuration = input<number>();

  // Viewport detection
  /** inView margin / IntersectionObserver rootMargin. Default `'0px'`. */
  readonly scrollRevealMargin = input<string>('0px');
  /** inView amount / IntersectionObserver threshold. `'some'` | `'all'` | number 0–1. Default `'some'`. */
  readonly scrollRevealAmount = input<'some' | 'all' | number>('some');
  /** When true, the element only animates once. Default `true`. */
  readonly scrollRevealOnce = input<boolean>(true);
  /** Direction: `'enter'` (default) or `'exit'`. */
  readonly scrollRevealDirection = input<'enter' | 'exit'>('enter');

  readonly scrolled = output<boolean>();

  // ---- Composed state -----------------------------------------------------

  private readonly _composedState = computed<NgxsmkMotionState>(() => {
    const stateInput = this.ngxsmkScrollReveal();
    if (stateInput) return stateInput;

    const initial = this.scrollRevealInitial();
    const animate = this.scrollRevealAnimate();
    const exit = this.scrollRevealExit();

    const type = this.scrollRevealType();
    let transition: NgxsmkTransition;

    if (type === 'spring') {
      const spring: NgxsmkSpringTransition = { type: 'spring' };
      const stiffness = this.scrollRevealStiffness();
      const damping = this.scrollRevealDamping();
      const mass = this.scrollRevealMass();
      const bounce = this.scrollRevealBounce();
      const visualDuration = this.scrollRevealVisualDuration();
      if (stiffness != null) spring.stiffness = stiffness;
      if (damping != null) spring.damping = damping;
      if (mass != null) spring.mass = mass;
      if (bounce != null) spring.bounce = bounce;
      if (visualDuration != null) spring.visualDuration = visualDuration;
      transition = spring;
    } else if (type === 'inertia') {
      const inertia: NgxsmkInertiaTransition = { type: 'inertia' };
      transition = inertia;
    } else {
      const tween: NgxsmkTweenTransition = {
        duration: this.scrollRevealDuration(),
        delay: this.scrollRevealDelay(),
        ease: this.scrollRevealEase(),
      };
      transition = tween;
    }

    const result: NgxsmkMotionState = { transition };
    if (initial) result.initial = initial;
    result.animate = animate;
    if (exit) result.exit = exit;
    return result;
  });

  private revealed = false;

  constructor() {
    afterNextRender(async () => {
      const el = this.el.nativeElement;
      const state = this._composedState();
      if (!state.animate) return;

      const motion = await loadMotion();

      if (motion && !prefersReducedMotion()) {
        this.setupInViewMotion(motion, el, state);
      } else {
        this.setupFallbackObserver(el, state);
      }
    });
  }

  /**
   * Use motion.dev's `inView()` for viewport detection with hardware-accelerated
   * ScrollTimeline where supported.
   */
  private setupInViewMotion(
    motion: NonNullable<Awaited<ReturnType<typeof loadMotion>>>,
    el: HTMLElement,
    state: NgxsmkMotionState,
  ): void {
    const margin = this.scrollRevealMargin();
    const amount = this.scrollRevealAmount();
    const once = this.scrollRevealOnce();
    const direction = this.scrollRevealDirection();

    const stopInView = motion.inView(
      el,
      () => {
        if (!this.revealed) {
          this.revealed = true;
          this.scrolled.emit(true);
          void playEnter(el, state);
          if (once) return undefined;
        }

        // Return leave handler for exit animations
        if (direction === 'exit' && state.exit) {
          return () => {
            this.revealed = false;
            this.scrolled.emit(false);
            void playExit(el, state);
          };
        }

        return undefined;
      },
      { margin, amount },
    );

    this.destroyRef.onDestroy(() => stopInView());
  }

  /**
   * Fallback: manual IntersectionObserver when motion is not installed.
   */
  private setupFallbackObserver(el: HTMLElement, state: NgxsmkMotionState): void {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          this.scrolled.emit(entry.isIntersecting);

          if (entry.isIntersecting && !this.revealed) {
            this.revealed = true;
            void playEnter(el, state);
            if (this.scrollRevealOnce()) {
              io.disconnect();
            }
          } else if (
            !entry.isIntersecting &&
            this.revealed &&
            this.scrollRevealDirection() === 'exit'
          ) {
            this.revealed = false;
            void playExit(el, state);
          }
        }
      },
      {
        rootMargin: this.scrollRevealMargin(),
        threshold: this.scrollRevealAmount() === 'some' ? 0.1 :
          this.scrollRevealAmount() === 'all' ? 1 :
          (this.scrollRevealAmount() as number),
      },
    );

    io.observe(el);
    this.destroyRef.onDestroy(() => io.disconnect());
  }
}
