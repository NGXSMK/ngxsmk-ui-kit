/**
 * Animation helpers backed by Motion (`motion` package, WAAPI-based).
 *
 * `motion` is imported lazily at runtime (and only when an animation actually
 * runs) so the library's type-check never pulls Motion's type graph. `motion`
 * is an optional peer dependency.
 */
export interface NgxsmkMotionTransition {
  /** Duration in SECONDS. */
  duration?: number;
  delay?: number;
  easing?: string | number[];
}

export interface NgxsmkMotionState {
  /** Starting styles (e.g. `{ opacity: 0, y: 8 }`). Applied before enter. */
  initial?: Record<string, string | number>;
  /** Target styles to animate toward on enter (e.g. `{ opacity: 1, y: 0 }`). */
  animate?: Record<string, string | number>;
  /** Target styles to animate toward on leave/exit. */
  exit?: Record<string, string | number>;
  /** Motion transition options. Durations are in SECONDS. */
  transition?: NgxsmkMotionTransition;
}

interface MotionModule {
  animate: (
    el: Element,
    keyframes: Record<string, string | number>,
    options?: Record<string, unknown>,
  ) => { finished: Promise<void> };
  style: (el: Element, props: Record<string, string | number>) => void;
}

let motionModule: MotionModule | null = null;

async function loadMotion(): Promise<MotionModule> {
  if (!motionModule) {
    motionModule = (await import('motion' as never)) as MotionModule;
  }
  return motionModule;
}

const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;

function applyStyles(el: HTMLElement, styles: Record<string, string | number>): void {
  for (const [key, value] of Object.entries(styles)) {
    el.style.setProperty(
      key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`),
      String(value),
    );
  }
}

function toOptions(
  transition?: NgxsmkMotionTransition,
): Record<string, unknown> | undefined {
  if (!transition) {
    return undefined;
  }
  const options: Record<string, unknown> = {};
  options['duration'] = transition.duration;
  options['delay'] = transition.delay;
  options['easing'] = transition.easing;
  return options;
}

/** Animate an element in (enter). Resolves when the animation finishes. */
export async function playEnter(el: HTMLElement, state?: NgxsmkMotionState): Promise<void> {
  if (!state?.animate) {
    return;
  }
  if (prefersReducedMotion()) {
    applyStyles(el, state.animate);
    return;
  }
  const motion = await loadMotion();
  if (state.initial) {
    motion.style(el, state.initial);
  }
  await motion.animate(el, state.animate, toOptions(state.transition)).finished;
}

/** Animate an element out (exit). Resolves when the animation finishes. */
export async function playExit(el: HTMLElement, state?: NgxsmkMotionState): Promise<void> {
  if (!state?.exit || prefersReducedMotion()) {
    return;
  }
  const motion = await loadMotion();
  await motion.animate(el, state.exit, toOptions(state.transition)).finished;
}
