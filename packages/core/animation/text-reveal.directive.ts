import { Directive, ElementRef, afterNextRender, inject, input } from '@angular/core';
import {
  NgxsmkMotionState,
  NgxsmkTransition,
  NgxsmkTweenTransition,
  NgxsmkSpringTransition,
  loadMotion,
  prefersReducedMotion,
} from './animate';

/**
 * Splits the host element's text content into words or letters and staggers
 * an animation on each unit. Replaces the element's text content, so the
 * host should contain only a text node.
 *
 * ```html
 * <p ngxsmkTextReveal="letter" [textRevealStagger]="0.04" [textRevealDuration]="0.4">
 *   Hello World
 * </p>
 *
 * <!-- Spring-based reveal -->
 * <p
 *   ngxsmkTextReveal="word"
 *   textRevealType="spring"
 *   [textRevealStagger]="0.06"
 *   [textRevealStiffness]="300"
 *   [textRevealDamping]="20"
 * >
 *   Spring animated text
 * </p>
 * ```
 */
@Directive({
  standalone: true,
  selector: '[ngxsmkTextReveal]',
})
export class NgxsmkTextReveal {
  private readonly el = inject(ElementRef<HTMLElement>);

  // ---- State API ----------------------------------------------------------

  /** Full motion state. Takes precedence over individual params. */
  readonly ngxsmkTextReveal = input<NgxsmkMotionState | 'word' | 'letter'>('word');

  // ---- Individual param inputs --------------------------------------------

  /** Split mode when using param API: `'word'` or `'letter'`. Default `'word'`. */
  readonly textRevealMode = input<'word' | 'letter'>('word');

  /** Stagger delay between each unit in seconds. */
  readonly textRevealStagger = input<number>(0.05);

  /** Duration of each unit's animation in seconds. Default `0.4`. */
  readonly textRevealDuration = input<number>(0.4);

  /** Starting CSS styles for each unit before animation. */
  readonly textRevealInitial = input<Record<string, string | number>>({
    opacity: 0,
    y: 8,
  });

  /** Target CSS styles for each unit after animation. */
  readonly textRevealAnimate = input<Record<string, string | number>>({
    opacity: 1,
    y: 0,
  });

  // Transition params
  /** Animation type. Default `'tween'`. */
  readonly textRevealType = input<'tween' | 'spring' | 'inertia'>('tween');

  // Spring params
  /** Spring stiffness. Default `1`. */
  readonly textRevealStiffness = input<number>();
  /** Spring damping. Default `10`. */
  readonly textRevealDamping = input<number>();
  /** Spring mass. Default `1`. */
  readonly textRevealMass = input<number>();

  /** Easing name for tween transitions. Default `'cubic-bezier(0.2, 0, 0, 1)'`. */
  readonly textRevealEase = input<string | number[]>('cubic-bezier(0.2, 0, 0, 1)');

  constructor() {
    afterNextRender(() => this.reveal());
  }

  // ---- Composed state -----------------------------------------------------

  private _getState(): { motion: NgxsmkMotionState; mode: 'word' | 'letter' } {
    const input = this.ngxsmkTextReveal();

    // Legacy string API: 'word' | 'letter'
    if (input === 'word' || input === 'letter') {
      return {
        mode: input,
        motion: this._buildMotionState(),
      };
    }

    // Full state API
    return {
      mode: this.textRevealMode(),
      motion: input,
    };
  }

  private _buildMotionState(): NgxsmkMotionState {
    const initial = this.textRevealInitial();
    const animate = this.textRevealAnimate();
    const type = this.textRevealType();

    let transition: NgxsmkTransition;

    if (type === 'spring') {
      const spring: NgxsmkSpringTransition = { type: 'spring' };
      const stiffness = this.textRevealStiffness();
      const damping = this.textRevealDamping();
      const mass = this.textRevealMass();
      if (stiffness != null) spring.stiffness = stiffness;
      if (damping != null) spring.damping = damping;
      if (mass != null) spring.mass = mass;
      transition = spring;
    } else {
      const tween: NgxsmkTweenTransition = {
        duration: this.textRevealDuration(),
        ease: this.textRevealEase(),
      };
      transition = tween;
    }

    return { initial, animate, transition };
  }

  private async reveal(): Promise<void> {
    const nativeEl = this.el.nativeElement;
    const text = nativeEl.textContent?.trim() ?? '';
    if (!text) return;

    const { motion: state, mode } = this._getState();
    const staggerDelay = this.textRevealStagger();
    const units = mode === 'letter' ? text.split('') : text.split(/\s+/);

    if (prefersReducedMotion()) {
      nativeEl.textContent = units.join(mode === 'letter' ? '' : ' ');
      return;
    }

    nativeEl.textContent = '';
    nativeEl.setAttribute('aria-label', text);

    const spans = units.map((unit: string, i: number) => {
      const span = document.createElement('span');
      span.textContent = unit;
      span.style.display = 'inline-block';
      span.style.willChange = 'opacity, transform';
      if (mode === 'word') {
        span.style.whiteSpace = 'nowrap';
      }
      span.setAttribute('aria-hidden', 'true');
      nativeEl.appendChild(span);
      if (i < units.length - 1) {
        nativeEl.appendChild(document.createTextNode(mode === 'letter' ? '' : ' '));
      }
      return span;
    });

    const motion = await loadMotion();
    if (!motion) {
      // Graceful degradation: just show the text
      nativeEl.textContent = units.join(mode === 'letter' ? '' : ' ');
      return;
    }

    const options: Record<string, unknown> = {};

    if (state.transition) {
      if (!state.transition.type || state.transition.type === 'tween') {
        const t = state.transition as NgxsmkTweenTransition;
        if (t.duration != null) options['duration'] = t.duration;
        if (t.ease != null) options['ease'] = t.ease;
      } else if (state.transition.type === 'spring') {
        const s = state.transition as NgxsmkSpringTransition;
        options['type'] = 'spring';
        if (s.stiffness != null) options['stiffness'] = s.stiffness;
        if (s.damping != null) options['damping'] = s.damping;
        if (s.mass != null) options['mass'] = s.mass;
      }
    }

    // Use motion.dev's stagger() for delay distribution
    const staggerFn = motion.stagger(units.length, {
      each: staggerDelay,
    });

    await Promise.all(
      spans.map((span: HTMLSpanElement, i: number) => {
        if (state.initial) {
          motion.style(span, state.initial);
        }
        const delay = typeof staggerFn === 'number' ? staggerFn * i : i * staggerDelay;
        return motion.animate(span, state.animate ?? {}, {
          ...options,
          delay,
        }).finished;
      }),
    );
  }
}
