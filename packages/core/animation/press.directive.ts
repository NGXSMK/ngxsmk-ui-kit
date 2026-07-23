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
 * Animates the host element on press (pointer down) using `motion.press()`.
 *
 * When `motion` is not installed, this directive is a no-op.
 *
 * ```html
 * <button ngxsmkPress [pressScale]="0.95" [pressDuration]="0.1">
 *   Press me
 * </button>
 *
 * <!-- Spring-based press -->
 * <button
 *   ngxsmkPress
 *   pressType="spring"
 *   [pressStiffness]="500"
 *   [pressDamping]="15"
 * >
 *   Spring press
 * </button>
 * ```
 */
@Directive({
  standalone: true,
  selector: '[ngxsmkPress]',
})
export class NgxsmkPress {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);

  // ---- State API ----------------------------------------------------------

  /** Full motion state. Takes precedence over individual params. */
  readonly ngxsmkPress = input<NgxsmkMotionState>();

  // ---- Individual param inputs --------------------------------------------

  /** Scale applied on press. Default `0.95`. */
  readonly pressScale = input<number>(0.95);

  /** Opacity applied on press. Default `0.8`. */
  readonly pressOpacity = input<number>(0.8);

  // Transition params
  /** Animation type. Default `'tween'`. */
  readonly pressType = input<'tween' | 'spring'>('tween');
  /** Duration in seconds. Default `0.1`. */
  readonly pressDuration = input<number>(0.1);
  /** Easing name, cubic-bezier array, or custom function. */
  readonly pressEase = input<string | number[]>('ease-out');

  // Spring params
  /** Spring stiffness. Default `1`. */
  readonly pressStiffness = input<number>();
  /** Spring damping. Default `10`. */
  readonly pressDamping = input<number>();
  /** Spring mass. Default `1`. */
  readonly pressMass = input<number>();

  // ---- Outputs -----------------------------------------------------------

  readonly pressed = output<boolean>();

  // ---- Composed state -----------------------------------------------------

  private readonly _pressState = computed(() => {
    const stateInput = this.ngxsmkPress();
    if (stateInput) return stateInput;

    const scale = this.pressScale();
    const opacity = this.pressOpacity();

    const target: Record<string, string | number> = {};
    if (scale !== 1) target['scale'] = scale;
    if (opacity !== 1) target['opacity'] = opacity;
    if (Object.keys(target).length === 0) target['scale'] = this.pressScale();

    const type = this.pressType();
    let transition: NgxsmkTransition;

    if (type === 'spring') {
      const spring: NgxsmkSpringTransition = { type: 'spring' };
      const stiffness = this.pressStiffness();
      const damping = this.pressDamping();
      const mass = this.pressMass();
      if (stiffness != null) spring.stiffness = stiffness;
      if (damping != null) spring.damping = damping;
      if (mass != null) spring.mass = mass;
      transition = spring;
    } else {
      transition = {
        duration: this.pressDuration(),
        ease: this.pressEase(),
      };
    }

    return {
      initial: { scale: 1, opacity: 1 },
      animate: target,
      transition,
    } satisfies NgxsmkMotionState;
  });

  private readonly _releaseState = computed(() => {
    const stateInput = this.ngxsmkPress();
    if (stateInput) {
      return {
        animate: stateInput.initial ?? { scale: 1, opacity: 1 },
        transition: stateInput.transition,
      } satisfies NgxsmkMotionState;
    }
    return {
      animate: { scale: 1, opacity: 1 },
      transition: {
        duration: this.pressDuration(),
        ease: this.pressEase(),
      },
    } satisfies NgxsmkMotionState;
  });

  constructor() {
    afterNextRender(async () => {
      if (prefersReducedMotion()) return;

      const nativeEl = this.el.nativeElement;
      const motion = await loadMotion();
      if (!motion) return;

      const pressState = this._pressState();
      const releaseState = this._releaseState();

      const cancelPress = motion.press(
        nativeEl,
        () => {
          this.pressed.emit(true);
          const opts: Record<string, unknown> = {};
          if (pressState.transition) {
            if (!pressState.transition.type || pressState.transition.type === 'tween') {
              const t = pressState.transition as NgxsmkTweenTransition;
              if (t.duration != null) opts['duration'] = t.duration;
              if (t.ease != null) opts['ease'] = t.ease;
            } else if (pressState.transition.type === 'spring') {
              const s = pressState.transition as NgxsmkSpringTransition;
              opts['type'] = 'spring';
              if (s.stiffness != null) opts['stiffness'] = s.stiffness;
              if (s.damping != null) opts['damping'] = s.damping;
              if (s.mass != null) opts['mass'] = s.mass;
            }
          }
          motion.animate(nativeEl, pressState.animate ?? {}, opts);

          return () => {
            this.pressed.emit(false);
            const releaseOpts: Record<string, unknown> = {};
            if (releaseState.transition) {
              if (!releaseState.transition.type || releaseState.transition.type === 'tween') {
                const t = releaseState.transition as NgxsmkTweenTransition;
                if (t.duration != null) releaseOpts['duration'] = t.duration;
                if (t.ease != null) releaseOpts['ease'] = t.ease;
              } else if (releaseState.transition.type === 'spring') {
                const s = releaseState.transition as NgxsmkSpringTransition;
                releaseOpts['type'] = 'spring';
                if (s.stiffness != null) releaseOpts['stiffness'] = s.stiffness;
                if (s.damping != null) releaseOpts['damping'] = s.damping;
                if (s.mass != null) releaseOpts['mass'] = s.mass;
              }
            }
            motion.animate(nativeEl, releaseState.animate ?? {}, releaseOpts);
          };
        },
      );

      this.destroyRef.onDestroy(() => cancelPress());
    });
  }
}
