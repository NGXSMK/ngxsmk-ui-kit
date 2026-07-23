import {
  DestroyRef,
  Directive,
  ElementRef,
  afterNextRender,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { loadMotion, prefersReducedMotion } from './animate';

/**
 * Enables drag gestures on the host element using `motion`'s drag system.
 *
 * When `motion` is not installed, this directive is a no-op.
 *
 * ```html
 * <!-- Free drag -->
 * <div ngxsmkDrag>Drag me</div>
 *
 * <!-- Horizontal only -->
 * <div ngxsmkDrag [dragAxis]="'x'">Horizontal only</div>
 *
 * <!-- With constraints and snap-back -->
 * <div
 *   ngxsmkDrag
 *   [dragSnapToOrigin]="true"
 *   [dragAxis]="'x'"
 *   [dragElastic]="0.1"
 *   (dragEnded)="onDragEnd($event)"
 * >
 *   Snap back
 * </div>
 *
 * <!-- With constraints -->
 * <div
 *   ngxsmkDrag
 *   [dragConstraints]="{ top: -100, left: -200, right: 200, bottom: 100 }"
 *   [dragMomentum]="true"
 *   (dragging)="onDragging($event)"
 * >
 *   Constrained
 * </div>
 * ```
 */
@Directive({
  standalone: true,
  selector: '[ngxsmkDrag]',
})
export class NgxsmkDrag {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);

  // ---- Inputs ------------------------------------------------------------

  /** Enable/disable drag. Default `true`. */
  readonly ngxsmkDrag = input<boolean>(true);

  /** Lock drag to an axis: `'x'`, `'y'`, or `'both'`. Default `'both'`. */
  readonly dragAxis = input<'x' | 'y' | 'both'>('both');

  /** Elastic resistance when dragged beyond constraints. Default `0.2`. */
  readonly dragElastic = input<number>(0.2);

  /** Enable momentum after release. Default `true`. */
  readonly dragMomentum = input<boolean>(true);

  /** Snap back to origin on release. Default `false`. */
  readonly dragSnapToOrigin = input<boolean>(false);

  /** Bounce back ratio when hitting constraints 0–1. Default `0`. */
  readonly dragBounce = input<number>(0);

  /** Drag constraints (offset from origin). */
  readonly dragConstraints = input<{
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
  }>();

  /** Duration in seconds for snap-to-origin animation. Default `0.3`. */
  readonly dragSnapDuration = input<number>(0.3);

  // ---- Outputs -----------------------------------------------------------

  /** Emits when drag starts. */
  readonly dragStarted = output<void>();

  /** Emits continuously during drag with current offset. */
  readonly dragging = output<{ x: number; y: number }>();

  /** Emits when drag ends with final offset. */
  readonly dragEnded = output<{ x: number; y: number }>();

  // ---- Internal state ----------------------------------------------------

  readonly isDragging = signal(false);

  constructor() {
    afterNextRender(async () => {
      if (prefersReducedMotion()) return;
      if (!this.ngxsmkDrag()) return;

      const nativeEl = this.el.nativeElement;
      const motion = await loadMotion();
      if (!motion) return;

      nativeEl.style.cursor = 'grab';
      nativeEl.style.touchAction = 'none';

      let startX = 0;
      let startY = 0;

      const onPointerDown = (e: PointerEvent): void => {
        if (!this.ngxsmkDrag()) return;
        if (e.button !== 0) return; // left click only

        startX = e.clientX;
        startY = e.clientY;
        this.isDragging.set(true);
        this.dragStarted.emit();
        nativeEl.style.cursor = 'grabbing';

        const axis = this.dragAxis();
        const constraints = this.dragConstraints();
        const elastic = this.dragElastic();
        const snapToOrigin = this.dragSnapToOrigin();
        const momentum = this.dragMomentum();

        const onPointerMove = (moveEvent: PointerEvent): void => {
          let dx = moveEvent.clientX - startX;
          let dy = moveEvent.clientY - startY;

          // Lock axis
          if (axis === 'x') dy = 0;
          if (axis === 'y') dx = 0;

          // Apply elastic resistance at constraints
          if (constraints) {
            if (constraints.left != null && dx < constraints.left) {
              dx = constraints.left + (dx - constraints.left) * elastic;
            }
            if (constraints.right != null && dx > constraints.right) {
              dx = constraints.right + (dx - constraints.right) * elastic;
            }
            if (constraints.top != null && dy < constraints.top) {
              dy = constraints.top + (dy - constraints.top) * elastic;
            }
            if (constraints.bottom != null && dy > constraints.bottom) {
              dy = constraints.bottom + (dy - constraints.bottom) * elastic;
            }
          }

          nativeEl.style.transform = `translate(${dx}px, ${dy}px)`;
          this.dragging.emit({ x: dx, y: dy });
        };

        const onPointerUp = (upEvent: PointerEvent): void => {
          nativeEl.removeEventListener('pointermove', onPointerMove);
          nativeEl.removeEventListener('pointerup', onPointerUp);
          nativeEl.style.cursor = 'grab';
          this.isDragging.set(false);

          let finalX = upEvent.clientX - startX;
          let finalY = upEvent.clientY - startY;
          if (axis === 'x') finalY = 0;
          if (axis === 'y') finalX = 0;

          this.dragEnded.emit({ x: finalX, y: finalY });

          if (snapToOrigin) {
            motion.animate(
              nativeEl,
              { transform: 'translate(0px, 0px)' },
              { duration: this.dragSnapDuration(), type: 'spring', bounce: this.dragBounce() },
            );
          } else if (!momentum) {
            // Clamp to constraints
            let clampedX = finalX;
            let clampedY = finalY;
            if (constraints) {
              if (constraints.left != null) clampedX = Math.max(constraints.left, clampedX);
              if (constraints.right != null) clampedX = Math.min(constraints.right, clampedX);
              if (constraints.top != null) clampedY = Math.max(constraints.top, clampedY);
              if (constraints.bottom != null) clampedY = Math.min(constraints.bottom, clampedY);
            }
            motion.animate(
              nativeEl,
              { transform: `translate(${clampedX}px, ${clampedY}px)` },
              { duration: 0.3, type: 'spring', bounce: this.dragBounce() },
            );
          }
        };

        nativeEl.addEventListener('pointermove', onPointerMove);
        nativeEl.addEventListener('pointerup', onPointerUp, { once: true });
      };

      nativeEl.addEventListener('pointerdown', onPointerDown);

      this.destroyRef.onDestroy(() => {
        nativeEl.removeEventListener('pointerdown', onPointerDown);
      });
    });
  }
}
