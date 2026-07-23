import {
  Directive,
  ElementRef,
  EmbeddedViewRef,
  TemplateRef,
  ViewContainerRef,
  computed,
  effect,
  inject,
  input,
  output,
  untracked,
} from '@angular/core';
import {
  NgxsmkMotionState,
  NgxsmkTransition,
  NgxsmkTweenTransition,
  NgxsmkSpringTransition,
  NgxsmkInertiaTransition,
  playEnter,
  playExit,
} from './animate';

/**
 * Structural directive that mounts its template and plays an enter animation,
 * then plays an exit animation before detaching when the `show` input flips to
 * `false`. Mirrors the host's presence so leave animations can complete.
 *
 * Supports two APIs:
 * 1. **State API** — pass a full `NgxsmkMotionState` via `motion`.
 * 2. **Param API** — pass individual signal inputs (`presenceDuration`, etc.).
 *
 * ```html
 * <!-- State API -->
 * <div *ngxsmkPresence="show; motion: { initial: { opacity: 0 }, animate: { opacity: 1 } }">
 *   Animated content
 * </div>
 *
 * <!-- Param API -->
 * <div
 *   *ngxsmkPresence="show"
 *   [presenceInitial]="{ opacity: 0, scale: 0.95 }"
 *   [presenceAnimate]="{ opacity: 1, scale: 1 }"
 *   [presenceExit]="{ opacity: 0, scale: 0.95 }"
 *   presenceType="spring"
 *   [presenceStiffness]="300"
 *   [presenceDamping]="24"
 * >
 *   Animated content
 * </div>
 * ```
 */
@Directive({
  standalone: true,
  selector: '[ngxsmkPresence]',
})
export class NgxsmkPresence {
  private readonly template = inject(TemplateRef<unknown>);
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly host = inject(ElementRef<HTMLElement>);

  // ---- State API ----------------------------------------------------------

  readonly show = input<boolean>(false);
  readonly motion = input<NgxsmkMotionState>();

  // ---- Individual param inputs --------------------------------------------

  /** Starting styles for enter animation. */
  readonly presenceInitial = input<Record<string, string | number>>();
  /** Target styles for enter animation. */
  readonly presenceAnimate = input<Record<string, string | number>>();
  /** Target styles for exit animation. */
  readonly presenceExit = input<Record<string, string | number>>();

  // Transition params
  /** Animation type. Default `'tween'`. */
  readonly presenceType = input<'tween' | 'spring' | 'inertia'>('tween');
  /** Duration in seconds. Default `0.2`. */
  readonly presenceDuration = input<number>(0.2);
  /** Delay in seconds. Default `0`. */
  readonly presenceDelay = input<number>(0);
  /** Easing name, cubic-bezier array, or custom function. */
  readonly presenceEase = input<string | number[]>('ease-out');

  // Spring params
  /** Spring stiffness. Default `1`. */
  readonly presenceStiffness = input<number>();
  /** Spring damping. Default `10`. */
  readonly presenceDamping = input<number>();
  /** Spring mass. Default `1`. */
  readonly presenceMass = input<number>();
  /** Spring bounce 0–1 (duration-based spring). */
  readonly presenceBounce = input<number>();
  /** Visual duration in seconds (duration-based spring). */
  readonly presenceVisualDuration = input<number>();

  // Inertia params
  /** Inertia power. Default `0.3`. */
  readonly presencePower = input<number>();
  /** Inertia time constant in ms. Default `750`. */
  readonly presenceTimeConstant = input<number>();

  readonly afterLeave = output<void>();

  // Derived state — compose individual inputs into NgxsmkMotionState
  private readonly _composedState = computed<NgxsmkMotionState>(() => {
    const stateInput = this.motion();
    if (stateInput) return stateInput;

    const initial = this.presenceInitial();
    const animate = this.presenceAnimate();
    const exit = this.presenceExit();

    const type = this.presenceType();
    let transition: NgxsmkTransition;

    if (type === 'spring') {
      const spring: NgxsmkSpringTransition = { type: 'spring' };
      const stiffness = this.presenceStiffness();
      const damping = this.presenceDamping();
      const mass = this.presenceMass();
      const bounce = this.presenceBounce();
      const visualDuration = this.presenceVisualDuration();
      if (stiffness != null) spring.stiffness = stiffness;
      if (damping != null) spring.damping = damping;
      if (mass != null) spring.mass = mass;
      if (bounce != null) spring.bounce = bounce;
      if (visualDuration != null) spring.visualDuration = visualDuration;
      transition = spring;
    } else if (type === 'inertia') {
      const inertia: NgxsmkInertiaTransition = { type: 'inertia' };
      const power = this.presencePower();
      const timeConstant = this.presenceTimeConstant();
      if (power != null) inertia.power = power;
      if (timeConstant != null) inertia.timeConstant = timeConstant;
      transition = inertia;
    } else {
      const tween: NgxsmkTweenTransition = {
        duration: this.presenceDuration(),
        delay: this.presenceDelay(),
        ease: this.presenceEase(),
      };
      transition = tween;
    }

    const result: NgxsmkMotionState = { transition };
    if (initial) result.initial = initial;
    if (animate) result.animate = animate;
    if (exit) result.exit = exit;
    return result;
  });

  constructor() {
    // Only `show()` drives reactivity; the enter/leave animation work (which
    // may read signals or perform async motion loading) runs untracked, so it
    // can't leak into the host's reactive context.
    effect(() => {
      const show = this.show();
      const state = this._composedState();
      untracked(() => {
        if (show) {
          if (this.viewContainer.length === 0) {
            const view = this.viewContainer.createEmbeddedView(this.template);
            const el = view.rootNodes.find((n): n is HTMLElement => n instanceof HTMLElement);
            if (el) {
              void playEnter(el, state);
            }
          }
        } else if (this.viewContainer.length > 0) {
          const view = this.viewContainer.get(0) as EmbeddedViewRef<unknown> | null;
          const el =
            view?.rootNodes.find((n): n is HTMLElement => n instanceof HTMLElement) ?? null;
          const target = el ?? this.host.nativeElement;
          void playExit(target, state).then(() => {
            this.viewContainer.clear();
            this.afterLeave.emit();
          });
        }
      });
    });
  }
}
