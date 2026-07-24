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
  loadMotion,
  prefersReducedMotion,
} from './animate';

/**
 * Animates the host element on hover using `motion.hover()`.
 *
 * When `motion` is not installed, this directive is a no-op.
 *
 * ```html
 * <div ngxsmkHover [hoverScale]="1.05" [hoverDuration]="0.2">
 *   Hover me
 * </div>
 *
 * <!-- Spring-based hover -->
 * <div
 *   ngxsmkHover
 *   hoverType="spring"
 *   [hoverStiffness]="400"
 *   [hoverDamping]="10"
 * >
 *   Spring hover
 * </div>
 *
 * <!-- Full state API -->
 * <div
 *   ngxsmkHover
 *   [ngxsmkHover]="{ animate: { scale: 1.08, rotate: 5 }, transition: { type: 'spring', stiffness: 400 } }"
 * >
 *   Custom hover
 * </div>
 * ```
 */
@Directive({
  standalone: true,
  selector: '[ngxsmkHover]',
})
export class NgxsmkHover {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);

  // ---- State API ----------------------------------------------------------

  /** Full motion state. Takes precedence over individual params. */
  readonly ngxsmkHover = input<NgxsmkMotionState>();

  // ---- Individual param inputs --------------------------------------------

  /** Scale applied on hover. Default `1.05`. */
  readonly hoverScale = input<number>(1.05);

  /** Opacity applied on hover. Default `1`. */
  readonly hoverOpacity = input<number>(1);

  /** Rotation in degrees on hover. Default `0`. */
  readonly hoverRotate = input<number>(0);

  // Transition params
  /** Animation type. Default `'tween'`. */
  readonly hoverType = input<'tween' | 'spring'>('tween');
  /** Duration in seconds. Default `0.2`. */
  readonly hoverDuration = input<number>(0.2);
  /** Easing name, cubic-bezier array, or custom function. */
  readonly hoverEase = input<string | number[]>('ease-out');

  // Spring params
  /** Spring stiffness. Default `1`. */
  readonly hoverStiffness = input<number>();
  /** Spring damping. Default `10`. */
  readonly hoverDamping = input<number>();
  /** Spring mass. Default `1`. */
  readonly hoverMass = input<number>();

  // ---- Outputs -----------------------------------------------------------

  readonly hovered = output<boolean>();

  // ---- Composed state -----------------------------------------------------

  private readonly _enterState = computed(() => {
    const stateInput = this.ngxsmkHover();
    if (stateInput) return stateInput;

    const scale = this.hoverScale();
    const opacity = this.hoverOpacity();
    const rotate = this.hoverRotate();

    const target: Record<string, string | number> = {};
    if (scale !== 1) target['scale'] = scale;
    if (opacity !== 1) target['opacity'] = opacity;
    if (rotate !== 0) target['rotate'] = `${rotate}deg`;

    if (Object.keys(target).length === 0) {
      target['scale'] = this.hoverScale();
    }

    const type = this.hoverType();
    let transition: NgxsmkTransition;

    if (type === 'spring') {
      const spring: NgxsmkSpringTransition = { type: 'spring' };
      const stiffness = this.hoverStiffness();
      const damping = this.hoverDamping();
      const mass = this.hoverMass();
      if (stiffness != null) spring.stiffness = stiffness;
      if (damping != null) spring.damping = damping;
      if (mass != null) spring.mass = mass;
      transition = spring;
    } else {
      transition = {
        duration: this.hoverDuration(),
        ease: this.hoverEase(),
      };
    }

    return {
      initial: { scale: 1, opacity: 1, rotate: '0deg' },
      animate: target,
      transition,
    } satisfies NgxsmkMotionState;
  });

  private readonly _leaveState = computed(() => {
    const stateInput = this.ngxsmkHover();
    if (stateInput) {
      return {
        animate: stateInput.initial ?? { scale: 1, opacity: 1, rotate: '0deg' },
        transition: stateInput.transition,
      } satisfies NgxsmkMotionState;
    }
    return {
      animate: { scale: 1, opacity: 1, rotate: '0deg' },
      transition: {
        duration: this.hoverDuration(),
        ease: this.hoverEase(),
      },
    } satisfies NgxsmkMotionState;
  });

  constructor() {
    afterNextRender(async () => {
      if (prefersReducedMotion()) return;

      const nativeEl = this.el.nativeElement;
      const motion = await loadMotion();
      if (!motion) return;

      const enterState = this._enterState();
      const leaveState = this._leaveState();

      const cancelHover = motion.hover(nativeEl, () => {
        this.hovered.emit(true);
        const opts: Record<string, unknown> = {};
        if (enterState.transition) {
          if (!enterState.transition.type || enterState.transition.type === 'tween') {
            const t = enterState.transition as NgxsmkTweenTransition;
            if (t.duration != null) opts['duration'] = t.duration;
            if (t.ease != null) opts['ease'] = t.ease;
          } else if (enterState.transition.type === 'spring') {
            const s = enterState.transition as NgxsmkSpringTransition;
            opts['type'] = 'spring';
            if (s.stiffness != null) opts['stiffness'] = s.stiffness;
            if (s.damping != null) opts['damping'] = s.damping;
            if (s.mass != null) opts['mass'] = s.mass;
          }
        }
        motion.animate(nativeEl, enterState.animate ?? {}, opts);

        return () => {
          this.hovered.emit(false);
          const leaveOpts: Record<string, unknown> = {};
          if (leaveState.transition) {
            if (!leaveState.transition.type || leaveState.transition.type === 'tween') {
              const t = leaveState.transition as NgxsmkTweenTransition;
              if (t.duration != null) leaveOpts['duration'] = t.duration;
              if (t.ease != null) leaveOpts['ease'] = t.ease;
            } else if (leaveState.transition.type === 'spring') {
              const s = leaveState.transition as NgxsmkSpringTransition;
              leaveOpts['type'] = 'spring';
              if (s.stiffness != null) leaveOpts['stiffness'] = s.stiffness;
              if (s.damping != null) leaveOpts['damping'] = s.damping;
              if (s.mass != null) leaveOpts['mass'] = s.mass;
            }
          }
          motion.animate(nativeEl, leaveState.animate ?? {}, leaveOpts);
        };
      });

      this.destroyRef.onDestroy(() => cancelHover());
    });
  }
}
