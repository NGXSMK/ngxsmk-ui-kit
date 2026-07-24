import { Directive, ElementRef, computed, afterNextRender, inject, input } from '@angular/core';
import {
  NgxsmkMotionState,
  NgxsmkTransition,
  NgxsmkTweenTransition,
  NgxsmkSpringTransition,
  NgxsmkInertiaTransition,
  playEnter,
} from './animate';

/**
 * Plays an enter animation on the host element once it is rendered.
 *
 * Supports two APIs:
 * 1. **State API** — pass a full `NgxsmkMotionState` via `ngxsmkAnimate`.
 * 2. **Param API** — pass individual signal inputs (`animateDuration`,
 *    `animateType`, etc.). These compose into a `NgxsmkMotionState` internally.
 *
 * When both are provided the state object takes precedence.
 *
 * ```html
 * <!-- State API -->
 * <div [ngxsmkAnimate]="{ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.3 } }">
 *   Hello
 * </div>
 *
 * <!-- Param API -->
 * <div
 *   [ngxsmkAnimate]="null"
 *   [animateInitial]="{ opacity: 0 }"
 *   [animateTarget]="{ opacity: 1 }"
 *   animateType="spring"
 *   [animateStiffness]="300"
 *   [animateDamping]="20"
 * >
 *   Hello
 * </div>
 * ```
 */
@Directive({
  standalone: true,
  selector: '[ngxsmkAnimate]',
})
export class NgxsmkAnimate {
  private readonly el = inject(ElementRef<HTMLElement>);

  // ---- State API ----------------------------------------------------------

  /** Full motion state object. Takes precedence over individual params. */
  readonly ngxsmkAnimate = input<NgxsmkMotionState>();

  // ---- Individual param inputs --------------------------------------------

  /** Starting styles (e.g. `{ opacity: 0, y: 8 }`). */
  readonly animateInitial = input<Record<string, string | number>>();

  /** Target styles to animate toward on enter. */
  readonly animateTarget = input<Record<string, string | number>>();

  /** Target styles on exit (not used by this directive, but stored for consumers). */
  readonly animateExit = input<Record<string, string | number>>();

  // Transition params
  /** Animation type. Default `'tween'`. */
  readonly animateType = input<'tween' | 'spring' | 'inertia'>('tween');
  /** Duration in seconds. Default `0.3`. Only applies to tween. */
  readonly animateDuration = input<number>(0.3);
  /** Delay in seconds. Default `0`. */
  readonly animateDelay = input<number>(0);
  /** Easing name, cubic-bezier array, or custom function. */
  readonly animateEase = input<string | number[]>('ease-out');

  // Spring params
  /** Spring stiffness. Default `1`. */
  readonly animateStiffness = input<number>();
  /** Spring damping. Default `10`. */
  readonly animateDamping = input<number>();
  /** Spring mass. Default `1`. */
  readonly animateMass = input<number>();
  /** Spring bounce 0–1 (duration-based spring). */
  readonly animateBounce = input<number>();
  /** Visual duration in seconds (duration-based spring). */
  readonly animateVisualDuration = input<number>();

  // Inertia params
  /** Inertia power. Default `0.3`. */
  readonly animatePower = input<number>();
  /** Inertia time constant in ms. Default `750`. */
  readonly animateTimeConstant = input<number>();

  // Derived state — compose individual inputs into NgxsmkMotionState
  private readonly _composedState = computed<NgxsmkMotionState>(() => {
    const stateInput = this.ngxsmkAnimate();
    if (stateInput) return stateInput;

    const initial = this.animateInitial();
    const target = this.animateTarget();
    if (!target) return {};

    const type = this.animateType();
    let transition: NgxsmkTransition;

    if (type === 'spring') {
      const spring: NgxsmkSpringTransition = { type: 'spring' };
      const stiffness = this.animateStiffness();
      const damping = this.animateDamping();
      const mass = this.animateMass();
      const bounce = this.animateBounce();
      const visualDuration = this.animateVisualDuration();
      if (stiffness != null) spring.stiffness = stiffness;
      if (damping != null) spring.damping = damping;
      if (mass != null) spring.mass = mass;
      if (bounce != null) spring.bounce = bounce;
      if (visualDuration != null) spring.visualDuration = visualDuration;
      transition = spring;
    } else if (type === 'inertia') {
      const inertia: NgxsmkInertiaTransition = { type: 'inertia' };
      const power = this.animatePower();
      const timeConstant = this.animateTimeConstant();
      if (power != null) inertia.power = power;
      if (timeConstant != null) inertia.timeConstant = timeConstant;
      transition = inertia;
    } else {
      const tween: NgxsmkTweenTransition = {
        duration: this.animateDuration(),
        delay: this.animateDelay(),
        ease: this.animateEase(),
      };
      transition = tween;
    }

    const result: NgxsmkMotionState = { transition };
    if (initial) result.initial = initial;
    result.animate = target;
    return result;
  });

  constructor() {
    afterNextRender(() => {
      void playEnter(this.el.nativeElement, this._composedState());
    });
  }
}
