/**
 * Animation helpers backed by Motion (`motion` package, WAAPI-based).
 *
 * `motion` is imported lazily at runtime (and only when an animation actually
 * runs) so the library's type-check never pulls Motion's type graph. `motion`
 * is an optional peer dependency.
 *
 * Every animation parameter is exposed through the type system so consumers
 * can fully customise motion from template signal inputs or via the
 * `NgxsmkMotionState` composite object.
 */

// ---------------------------------------------------------------------------
// Transition types – covers tween, spring, and inertia
// ---------------------------------------------------------------------------

/** Tween transition (duration-based with easing). */
export interface NgxsmkTweenTransition {
  type?: 'tween';
  /** Duration in seconds. Default `0.3`. */
  duration?: number;
  /** Delay in seconds. Default `0`. */
  delay?: number;
  /** Easing name (`'easeOut'`, `'circInOut'`, …), cubic-bezier array, or custom fn. */
  ease?: string | number[] | ((t: number) => number);
  /** Alias for `ease`. */
  easing?: string | number[] | ((t: number) => number);
  /** Keyframe positions (0–1). Only for multi-keyframe animations. */
  times?: number[];
}

/** Spring transition (physics-based). */
export interface NgxsmkSpringTransition {
  type: 'spring';
  /** Spring stiffness. Default `1`. */
  stiffness?: number;
  /** Damping strength. Default `10`. */
  damping?: number;
  /** Moving object mass. Default `1`. */
  mass?: number;
  /** Initial velocity. */
  velocity?: number;
  /** Speed threshold to consider settled. Default `0.1`. */
  restSpeed?: number;
  /** Distance threshold to consider settled. Default `0.01`. */
  restDelta?: number;
  /** Bounciness 0–1 (duration-based spring). */
  bounce?: number;
  /** Duration in ms — only used with `bounce`. */
  duration?: number;
  /** Visual duration in seconds — overrides `duration`. */
  visualDuration?: number;
}

/** Inertia transition (deceleration-based). */
export interface NgxsmkInertiaTransition {
  type: 'inertia';
  /** Initial velocity. */
  velocity?: number;
  /** Power factor. Default `0.3`. */
  power?: number;
  /** Time constant in ms. Default `750`. */
  timeConstant?: number;
  /** Distance threshold to settle. */
  restDelta?: number;
  /** Upper bound. */
  max?: number;
  /** Lower bound. */
  min?: number;
  /** Bounce ratio 0–1. */
  bounceStop?: number;
  /** Bounce ratio when hitting bounds. */
  bouncePower?: number;
}

/** Union of all supported transition types. */
export type NgxsmkTransition =
  NgxsmkTweenTransition | NgxsmkSpringTransition | NgxsmkInertiaTransition;

// ---------------------------------------------------------------------------
// Stagger config
// ---------------------------------------------------------------------------

/** Controls stagger timing across multiple elements. */
export interface NgxsmkStagger {
  /** Delay interval between each element in seconds. */
  interval: number;
  /** Initial delay offset in seconds. Default `0`. */
  startDelay?: number;
  /** Which element to stagger from. Default `'first'`. */
  from?: 'first' | 'center' | 'last' | number;
  /** Easing applied to the stagger distribution. */
  ease?: string | number[] | ((t: number) => number);
}

// ---------------------------------------------------------------------------
// Per-property transition overrides
// ---------------------------------------------------------------------------

/** Map of CSS property name → individual transition config. */
export type NgxsmkPerPropertyTransition = Record<string, NgxsmkTransition>;

// ---------------------------------------------------------------------------
// Composite motion state
// ---------------------------------------------------------------------------

/**
 * Declarative animation state. This is the primary API for configuring
 * motion across all NGXSMK animation directives and components.
 */
export interface NgxsmkMotionState {
  /** Starting styles applied before the animation begins. */
  initial?: Record<string, string | number>;
  /** Target styles to animate toward on enter. */
  animate?: Record<string, string | number>;
  /** Target styles to animate toward on leave / exit. */
  exit?: Record<string, string | number>;
  /** Transition configuration (tween, spring, or inertia). */
  transition?: NgxsmkTransition;
  /** Stagger config for multi-element animations. */
  stagger?: NgxsmkStagger;
  /** Per-property transition overrides. */
  perProperty?: NgxsmkPerPropertyTransition;
}

// ---------------------------------------------------------------------------
// Motion module type (lazy-loaded)
// ---------------------------------------------------------------------------

interface MotionModule {
  animate: (
    el: Element,
    keyframes: Record<string, string | number>,
    options?: Record<string, unknown>,
  ) => { finished: Promise<void>; stop: () => void; cancel: () => void };
  style: (el: Element, props: Record<string, string | number>) => void;
  stagger: (num: number, options?: Record<string, unknown>) => number;
  hover: (
    el: Element | string,
    callback: (el: Element, e: PointerEvent) => (() => void) | void,
    options?: Record<string, unknown>,
  ) => () => void;
  press: (
    el: Element | string,
    callback: (el: Element, e: PointerEvent) => (() => void) | void,
    options?: Record<string, unknown>,
  ) => () => void;
  inView: (
    el: Element | string,
    callback: (el: Element, info: IntersectionObserverEntry) => (() => void) | void,
    options?: Record<string, unknown>,
  ) => () => void;
  scroll: (
    fnOrAnimation: ((progress: number) => void) | { stop: () => void },
    options?: Record<string, unknown>,
  ) => () => void;
}

// ---------------------------------------------------------------------------
// Lazy loader
// ---------------------------------------------------------------------------

let motionModule: MotionModule | null = null;

/**
 * Lazily import and cache the `motion` package.
 * Returns `null` when motion is not installed (graceful degradation).
 */
export async function loadMotion(): Promise<MotionModule | null> {
  if (motionModule) {
    return motionModule;
  }
  try {
    motionModule = (await import('motion' as never)) as MotionModule;
    return motionModule;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

export const prefersReducedMotion = (): boolean =>
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

/**
 * Convert a `NgxsmkTransition` (our type) into the plain options object
 * that `motion.animate()` accepts.
 */
export function toMotionOptions(
  transition?: NgxsmkTransition,
): Record<string, unknown> | undefined {
  if (!transition) return undefined;

  const opts: Record<string, unknown> = {};

  if (!transition.type || transition.type === 'tween') {
    const t = transition as NgxsmkTweenTransition;
    if (t.duration != null) opts['duration'] = t.duration;
    if (t.delay != null) opts['delay'] = t.delay;
    if (t.ease != null) opts['ease'] = t.ease;
    else if (t.easing != null) opts['ease'] = t.easing;
    if (t.times != null) opts['times'] = t.times;
  } else if (transition.type === 'spring') {
    const s = transition as NgxsmkSpringTransition;
    opts['type'] = 'spring';
    if (s.stiffness != null) opts['stiffness'] = s.stiffness;
    if (s.damping != null) opts['damping'] = s.damping;
    if (s.mass != null) opts['mass'] = s.mass;
    if (s.velocity != null) opts['velocity'] = s.velocity;
    if (s.restSpeed != null) opts['restSpeed'] = s.restSpeed;
    if (s.restDelta != null) opts['restDelta'] = s.restDelta;
    if (s.bounce != null) opts['bounce'] = s.bounce;
    if (s.duration != null) opts['duration'] = s.duration;
    if (s.visualDuration != null) opts['visualDuration'] = s.visualDuration;
  } else if (transition.type === 'inertia') {
    const i = transition as NgxsmkInertiaTransition;
    opts['type'] = 'inertia';
    if (i.velocity != null) opts['velocity'] = i.velocity;
    if (i.power != null) opts['power'] = i.power;
    if (i.timeConstant != null) opts['timeConstant'] = i.timeConstant;
    if (i.restDelta != null) opts['restDelta'] = i.restDelta;
    if (i.max != null) opts['max'] = i.max;
    if (i.min != null) opts['min'] = i.min;
  }

  return opts;
}

/**
 * Convert a `NgxsmkStagger` config into motion.dev's `delay: stagger(...)`.
 */
function toStaggerDelay(motion: MotionModule, stagger: NgxsmkStagger): number {
  const opts: Record<string, unknown> = {};
  if (stagger.startDelay != null) opts['startDelay'] = stagger.startDelay;
  if (stagger.from != null) opts['from'] = stagger.from;
  if (stagger.ease != null) opts['ease'] = stagger.ease;
  return motion.stagger(stagger.interval, opts);
}

/**
 * Merge per-property transition overrides into the base options object.
 * Each property key in `perProperty` gets its own transition options.
 */
function mergePerProperty(
  base: Record<string, unknown>,
  perProperty?: NgxsmkPerPropertyTransition,
): Record<string, unknown> {
  if (!perProperty) return base;
  const merged = { ...base };
  for (const [prop, trans] of Object.entries(perProperty)) {
    const propOpts = toMotionOptions(trans);
    if (propOpts) {
      merged[prop] = propOpts;
    }
  }
  return merged;
}

// ---------------------------------------------------------------------------
// Core animation functions
// ---------------------------------------------------------------------------

/** Animate an element in (enter). Resolves when the animation finishes. */
export async function playEnter(el: HTMLElement, state?: NgxsmkMotionState): Promise<void> {
  if (!state?.animate) return;

  if (prefersReducedMotion()) {
    applyStyles(el, state.animate);
    return;
  }

  const motion = await loadMotion();
  if (!motion) {
    applyStyles(el, state.animate);
    return;
  }

  if (state.initial) {
    motion.style(el, state.initial);
  }

  let options = toMotionOptions(state.transition) ?? {};

  if (state.stagger) {
    options['delay'] = toStaggerDelay(motion, state.stagger);
  }

  options = mergePerProperty(options, state.perProperty);

  await motion.animate(el, state.animate, options).finished;
}

/** Animate an element out (exit). Resolves when the animation finishes. */
export async function playExit(el: HTMLElement, state?: NgxsmkMotionState): Promise<void> {
  if (!state?.exit || prefersReducedMotion()) return;

  const motion = await loadMotion();
  if (!motion) return;

  const options = toMotionOptions(state.transition) ?? {};
  await motion.animate(el, state.exit, options).finished;
}

/**
 * Animate a numeric value from `from` to `to`, calling `onUpdate` with each
 * intermediate value. Returns a stop function.
 */
export async function animateValue(
  from: number,
  to: number,
  options: Record<string, unknown>,
  onUpdate: (value: number) => void,
): Promise<void> {
  const motion = await loadMotion();
  if (!motion) {
    onUpdate(to);
    return;
  }
  // Create a temporary element to animate a CSS custom property
  const el = document.createElement('div');
  el.style.cssText = 'position:fixed;pointer-events:none;width:0;height:0;opacity:0';
  el.style.setProperty('--v', String(from));
  document.body.appendChild(el);

  try {
    await motion.animate(
      el,
      { '--v': `${to}px` },
      {
        ...options,
        onUpdate: (latest: Record<string, string>) => {
          const v = parseFloat(latest['--v'] as string) || 0;
          onUpdate(v);
        },
      },
    ).finished;
  } finally {
    el.remove();
  }
  onUpdate(to);
}
