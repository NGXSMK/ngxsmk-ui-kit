import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  input,
  signal,
} from '@angular/core';
import { loadMotion, prefersReducedMotion } from '@ngxsmk/core/animation';

/**
 * An accent-tile button that expands into a dotted-arrow trail on hover
 * or focus. The accent area grows from a small square to fill the width,
 * revealing a trail of chevron dots that fade in with staggered delay.
 *
 * When `motion` is installed, uses `motion.animate()` with `stagger()` for
 * the dot reveal. Falls back to CSS transitions when motion is not installed.
 *
 * ```html
 * <button ngxsmkExpandingArrowButton>
 *   Book a demo
 * </button>
 *
 * <!-- Custom animation params -->
 * <button
 *   ngxsmkExpandingArrowButton
 *   [eabDuration]="0.35"
 *   eabType="spring"
 *   [eabStiffness]="300"
 *   [eabDamping]="20"
 * >
 *   Custom animation
 * </button>
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-expanding-arrow-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.position]': '"relative"',
    '[style.display]': '"inline-flex"',
    '[style.align-items]': '"center"',
    '[style.overflow]': '"hidden"',
    '[style.border-radius]': '"22px"',
    '[style.padding]': '"6px"',
    '[style.cursor]': '"pointer"',
    '[style.user-select]': '"none"',
    '[style.outline]': '"none"',
    '[style.border]': '"none"',
    '[style.background]': 'accentBg()',
    '[style.color]': 'accentColor()',
    '[class.ngxsmk-eab--expanded]': 'active()',
    '[class.ngxsmk-eab--disabled]': 'disabled()',
    '[attr.tabindex]': 'disabled() ? -1 : 0',
    '(mouseenter)': 'onHover(true)',
    '(mouseleave)': 'onHover(false)',
    '(focus)': 'onFocus(true)',
    '(blur)': 'onFocus(false)',
  },
  styles: `
    :host {
      transition: transform var(--ngxsmk-duration-normal, 180ms) cubic-bezier(0.2, 0, 0, 1);
    }
    :host:active:not(.ngxsmk-eab--disabled) {
      transform: scale(0.97);
    }
    :host.ngxsmk-eab--disabled {
      opacity: 0.5;
      pointer-events: none;
    }

    .ngxsmk-eab__accent {
      position: absolute;
      inset-block: 6px;
      left: 6px;
      z-index: 10;
      overflow: hidden;
      border-radius: 16px;
      transition: width var(--ngxsmk-duration-slow, 320ms) cubic-bezier(0.36, 0, 0.66, -0.56);
    }

    .ngxsmk-eab__dots {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: space-around;
      padding-inline: 12px;
    }

    .ngxsmk-eab__dot {
      display: inline-grid;
      place-items: center;
      transition:
        opacity var(--ngxsmk-duration-normal, 180ms) ease-out,
        transform var(--ngxsmk-duration-normal, 180ms) ease-out;
    }

    .ngxsmk-eab__idle-icon {
      position: absolute;
      inset: 0;
      display: grid;
      place-items: center;
      transition: opacity var(--ngxsmk-duration-fast, 100ms) ease-out;
    }

    .ngxsmk-eab__label {
      position: relative;
      z-index: 0;
      white-space: nowrap;
      font-size: 18px;
      font-weight: var(--ngxsmk-font-weight-medium, 500);
      letter-spacing: -0.02em;
      transition:
        opacity 120ms ease-out,
        transform 120ms ease-out;
    }

    .ngxsmk-eab__idle-icon svg,
    .ngxsmk-eab__dot svg {
      width: 28px;
      height: 20px;
    }
  `,
  template: `
    <span class="ngxsmk-eab__accent" [style.width]="accentWidth()">
      <span class="ngxsmk-eab__idle-icon" [style.opacity]="active() ? 0 : 1">
        <svg viewBox="0 0 20 28" fill="none" aria-hidden="true">
          <circle cx="4" cy="4" r="2" fill="currentColor" />
          <circle cx="10" cy="9" r="2" fill="currentColor" />
          <circle cx="16" cy="14" r="2" fill="currentColor" />
          <circle cx="10" cy="19" r="2" fill="currentColor" />
          <circle cx="4" cy="24" r="2" fill="currentColor" />
        </svg>
      </span>
      <span class="ngxsmk-eab__dots">
        @for (opacity of ARROW_OPACITY; track opacity; let idx = $index) {
          <span
            class="ngxsmk-eab__dot"
            [style.opacity]="active() ? 1 : 0"
            [style.transform]="active() && !reducedMotion ? 'translateX(0px)' : 'translateX(-6px)'"
            [style.transition-delay]="active() && !reducedMotion ? 40 + idx * 25 + 'ms' : '0ms'"
            [style.color]="'rgb(10 10 10 / ' + opacity + ')'"
          >
            <svg viewBox="0 0 20 28" fill="none" aria-hidden="true">
              <circle cx="4" cy="4" r="2" fill="currentColor" />
              <circle cx="10" cy="9" r="2" fill="currentColor" />
              <circle cx="16" cy="14" r="2" fill="currentColor" />
              <circle cx="10" cy="19" r="2" fill="currentColor" />
              <circle cx="4" cy="24" r="2" fill="currentColor" />
            </svg>
          </span>
        }
      </span>
    </span>

    <span
      class="ngxsmk-eab__label"
      [style.opacity]="active() ? 0 : 1"
      [style.transform]="active() && !reducedMotion ? 'translateX(6px)' : 'translateX(0px)'"
    >
      <ng-content />
    </span>
  `,
})
export class NgxsmkExpandingArrowButton {
  private readonly destroyRef = inject(DestroyRef);
  private readonly el = inject(ElementRef<HTMLElement>);

  readonly ARROW_OPACITY = [1, 0.78, 0.54, 0.32, 0.16] as const;

  /** Disable the button. */
  readonly disabled = input<boolean>(false);

  /** Background color of the accent tile. */
  readonly accentBg = input<string>('var(--ngxsmk-color-primary, #18181b)');

  /** Text color of the accent tile. */
  readonly accentColor = input<string>('var(--ngxsmk-color-on-primary, #fafafa)');

  /** Animation mode: `'css'` (default) or `'motion'` (motion.dev stagger). */
  readonly eabAnimation = input<'css' | 'motion'>('css');

  /** Accent expand duration in seconds. Default `0.32`. */
  readonly eabDuration = input<number>(0.32);

  /** Easing name or cubic-bezier array. Default `'cubic-bezier(0.36, 0, 0.66, -0.56)'`. */
  readonly eabEase = input<string | number[]>('cubic-bezier(0.36, 0, 0.66, -0.56)');

  /** Animation type: `'tween'` or `'spring'`. Default `'tween'`. */
  readonly eabType = input<'tween' | 'spring'>('tween');

  /** Spring stiffness (when type is 'spring'). */
  readonly eabStiffness = input<number>();

  /** Spring damping (when type is 'spring'). */
  readonly eabDamping = input<number>();

  readonly hovered = signal(false);
  readonly focused = signal(false);
  readonly active = signal(false);
  readonly reducedMotion = prefersReducedMotion();

  readonly accentWidth = signal<string | number>(52);

  constructor() {
    afterNextRender(async () => {
      if (this.eabAnimation() !== 'motion') return;
      if (this.reducedMotion) return;

      const motion = await loadMotion();
      if (!motion) return;

      const hostEl = this.el.nativeElement;
      const dotEls = Array.from(hostEl.querySelectorAll('.ngxsmk-eab__dot')) as HTMLElement[];
      const labelEl = hostEl.querySelector('.ngxsmk-eab__label') as HTMLElement | null;

      if (dotEls.length === 0) return;

      // Pre-apply initial styles for motion animation
      for (const dot of dotEls) {
        dot.style.transition = 'none';
      }
      if (labelEl) {
        labelEl.style.transition = 'none';
      }
    });
  }

  onHover(state: boolean): void {
    this.hovered.set(state);
    this.updateActive();
    this.accentWidth.set(state ? 'calc(100% - 12px)' : 52);

    if (this.eabAnimation() === 'motion' && !this.reducedMotion) {
      void this.animateDots(state);
    }
  }

  onFocus(state: boolean): void {
    this.focused.set(state);
    this.updateActive();
    this.accentWidth.set(state ? 'calc(100% - 12px)' : 52);

    if (this.eabAnimation() === 'motion' && !this.reducedMotion) {
      void this.animateDots(state);
    }
  }

  private updateActive(): void {
    this.active.set(this.hovered() || this.focused());
  }

  private async animateDots(show: boolean): Promise<void> {
    const motion = await loadMotion();
    if (!motion) return;

    const hostEl = this.el.nativeElement;
    const dotEls = Array.from(hostEl.querySelectorAll('.ngxsmk-eab__dot')) as HTMLElement[];
    const labelEl = hostEl.querySelector('.ngxsmk-eab__label') as HTMLElement | null;

    const duration = this.eabDuration();
    const ease = this.eabEase();
    const type = this.eabType();

    const options: Record<string, unknown> = {};
    if (type === 'spring') {
      options['type'] = 'spring';
      const stiffness = this.eabStiffness();
      const damping = this.eabDamping();
      if (stiffness != null) options['stiffness'] = stiffness;
      if (damping != null) options['damping'] = damping;
    } else {
      options['duration'] = duration;
      options['ease'] = ease;
    }

    if (show) {
      // Stagger dots in
      for (let i = 0; i < dotEls.length; i++) {
        const delay = i * 0.025 + 0.04;
        motion.animate(dotEls[i], { opacity: 1, x: 0 }, { ...options, delay });
      }
      // Fade label
      if (labelEl) {
        motion.animate(labelEl, { opacity: 0, x: 6 }, options);
      }
    } else {
      // Hide all dots immediately
      for (const dot of dotEls) {
        motion.animate(dot, { opacity: 0, x: -6 }, { duration: 0.1 });
      }
      // Show label
      if (labelEl) {
        motion.animate(labelEl, { opacity: 1, x: 0 }, { duration: 0.1 });
      }
    }
  }
}
