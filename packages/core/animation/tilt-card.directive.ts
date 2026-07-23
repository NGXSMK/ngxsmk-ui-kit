import {
  DestroyRef,
  Directive,
  ElementRef,
  afterNextRender,
  inject,
  input,
  untracked,
} from '@angular/core';
import { loadMotion, prefersReducedMotion } from './animate';

/**
 * Applies a 3D tilt transform to the host element based on the pointer
 * position. The tilt angle is clamped by `maxTilt` and scales down when
 * the pointer moves away from the center.
 *
 * When `motion` is installed, uses `motion.hover()` for gesture detection
 * (filters touch emulation) and `motion.animate()` for smooth transitions.
 * Falls back to manual pointermove/pointerleave when motion is not installed.
 *
 * ```html
 * <div ngxsmkTiltCard [tiltCardMax]="15" [tiltCardScale]="1.02" class="card">
 *   Tilted content
 * </div>
 *
 * <!-- Spring-based tilt -->
 * <div
 *   ngxsmkTiltCard
 *   [tiltCardMax]="20"
 *   tiltCardType="spring"
 *   [tiltCardStiffness]="300"
 *   [tiltCardDamping]="20"
 * >
 *   Spring tilt
 * </div>
 * ```
 */
@Directive({
  standalone: true,
  selector: '[ngxsmkTiltCard]',
})
export class NgxsmkTiltCard {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);

  /** Maximum tilt angle in degrees. Default `15`. */
  readonly ngxsmkTiltCard = input<number>(15);

  /** Scale applied on hover. Default `1.02`. */
  readonly tiltCardScale = input<number>(1.02);

  /** CSS perspective value in pixels. Default `1000`. */
  readonly tiltCardPerspective = input<number>(1000);

  // Transition params
  /** Animation type. Default `'tween'`. */
  readonly tiltCardType = input<'tween' | 'spring'>('tween');
  /** Transition duration in ms for the tilt reset on mouse leave. Default `400`. */
  readonly tiltCardTransition = input<number>(400);

  // Spring params
  /** Spring stiffness. Default `1`. */
  readonly tiltCardStiffness = input<number>();
  /** Spring damping. Default `10`. */
  readonly tiltCardDamping = input<number>();
  /** Spring mass. Default `1`. */
  readonly tiltCardMass = input<number>();

  constructor() {
    afterNextRender(async () => {
      if (prefersReducedMotion()) return;

      const nativeEl = this.el.nativeElement;
      nativeEl.style.transformStyle = 'preserve-3d';

      const motion = await loadMotion();
      if (motion) {
        this.setupMotionHover(motion, nativeEl);
      } else {
        this.setupFallbackHover(nativeEl);
      }
    });
  }

  private _buildMotionOptions(): Record<string, unknown> {
    const type = this.tiltCardType();
    if (type === 'spring') {
      const opts: Record<string, unknown> = { type: 'spring' };
      const stiffness = this.tiltCardStiffness();
      const damping = this.tiltCardDamping();
      const mass = this.tiltCardMass();
      if (stiffness != null) opts['stiffness'] = stiffness;
      if (damping != null) opts['damping'] = damping;
      if (mass != null) opts['mass'] = mass;
      return opts;
    }
    return { duration: this.tiltCardTransition() / 1000, ease: 'easeOut' };
  }

  private setupMotionHover(
    motion: NonNullable<Awaited<ReturnType<typeof loadMotion>>>,
    nativeEl: HTMLElement,
  ): void {
    const cancelHover = motion.hover(
      nativeEl,
      (_el) => {
        const onMove = (e: PointerEvent): void => {
          const rect = nativeEl.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;

          const maxTilt = untracked(() => this.ngxsmkTiltCard());
          const scale = untracked(() => this.tiltCardScale());
          const perspective = untracked(() => this.tiltCardPerspective());

          const rotateX = ((y - centerY) / centerY) * -maxTilt;
          const rotateY = ((x - centerX) / centerX) * maxTilt;

          const opts = this._buildMotionOptions();
          motion.animate(
            nativeEl,
            {
              transform: `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, 1)`,
            },
            opts,
          );
        };

        nativeEl.addEventListener('pointermove', onMove);

        // Return cleanup function
        return () => {
          nativeEl.removeEventListener('pointermove', onMove);
          // Animate back to neutral
          const perspective = untracked(() => this.tiltCardPerspective());
          const opts = this._buildMotionOptions();
          motion.animate(
            nativeEl,
            {
              transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
            },
            opts,
          );
        };
      },
    );

    this.destroyRef.onDestroy(() => cancelHover());
  }

  private setupFallbackHover(nativeEl: HTMLElement): void {
    nativeEl.style.transition = `transform ${this.tiltCardTransition()}ms cubic-bezier(0.2, 0, 0, 1)`;

    const onMove = (e: MouseEvent): void => {
      const rect = nativeEl.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const maxTilt = untracked(() => this.ngxsmkTiltCard());
      const scale = untracked(() => this.tiltCardScale());
      const perspective = untracked(() => this.tiltCardPerspective());

      const rotateX = ((y - centerY) / centerY) * -maxTilt;
      const rotateY = ((x - centerX) / centerX) * maxTilt;

      nativeEl.style.transform = `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, 1)`;
    };

    const onLeave = (): void => {
      nativeEl.style.transform = `perspective(${untracked(() => this.tiltCardPerspective())}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    };

    nativeEl.addEventListener('pointermove', onMove);
    nativeEl.addEventListener('pointerleave', onLeave);

    this.destroyRef.onDestroy(() => {
      nativeEl.removeEventListener('pointermove', onMove);
      nativeEl.removeEventListener('pointerleave', onLeave);
    });
  }
}
