import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  computed,
  input,
  model,
  signal,
} from '@angular/core';

/**
 * Interactive before/after split drag-slider image comparison component.
 *
 * ```html
 * <ngxsmk-compare-image before="assets/before.jpg" after="assets/after.jpg" beforeLabel="Original" afterLabel="Processed" />
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-compare-image',
  template: `
    <div
      #container
      class="ngxsmk-compare-img"
      (mousedown)="onDragStart($event)"
      (touchstart)="onTouchStart($event)"
    >
      <!-- AFTER IMAGE (FULL BASE) -->
      <img [src]="after()" [alt]="afterLabel()" class="ngxsmk-compare-img__full" />
      @if (afterLabel()) {
        <span class="ngxsmk-compare-img__badge ngxsmk-compare-img__badge--after">{{
          afterLabel()
        }}</span>
      }

      <!-- BEFORE IMAGE (CLIPPED OVERLAY) -->
      <div class="ngxsmk-compare-img__clip" [style.clip-path]="clipPath()">
        <img [src]="before()" [alt]="beforeLabel()" class="ngxsmk-compare-img__full" />
        @if (beforeLabel()) {
          <span class="ngxsmk-compare-img__badge ngxsmk-compare-img__badge--before">{{
            beforeLabel()
          }}</span>
        }
      </div>

      <!-- SPLIT DRAG HANDLE -->
      <div class="ngxsmk-compare-img__divider" [style.left]="position() + '%'">
        <div class="ngxsmk-compare-img__handle">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </div>
      </div>
    </div>
  `,
  host: {
    class: 'ngxsmk-compare-image',
  },
  styles: `
    :host {
      display: block;
      width: 100%;
    }

    .ngxsmk-compare-img {
      position: relative;
      width: 100%;
      overflow: hidden;
      border-radius: var(--ngxsmk-radius-lg, 0.5rem);
      user-select: none;
      -webkit-user-select: none;
      cursor: ew-resize;
      background: var(--ngxsmk-color-surface-variant, #f4f4f5);
    }

    .ngxsmk-compare-img__full {
      display: block;
      width: 100%;
      height: auto;
      object-fit: cover;
    }

    .ngxsmk-compare-img__clip {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    .ngxsmk-compare-img__badge {
      position: absolute;
      top: 0.75rem;
      padding: 0.2rem 0.5rem;
      border-radius: var(--ngxsmk-radius-sm, 0.25rem);
      background: rgba(9, 9, 11, 0.65);
      backdrop-filter: blur(4px);
      color: #ffffff;
      font-size: 0.7rem;
      font-weight: 600;
      letter-spacing: 0.02em;
      pointer-events: none;
    }

    .ngxsmk-compare-img__badge--before {
      left: 0.75rem;
    }

    .ngxsmk-compare-img__badge--after {
      right: 0.75rem;
    }

    .ngxsmk-compare-img__divider {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 2px;
      background: #ffffff;
      transform: translateX(-50%);
      box-shadow: 0 0 8px rgba(0, 0, 0, 0.4);
      z-index: 5;
    }

    .ngxsmk-compare-img__handle {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 2.25rem;
      height: 2.25rem;
      border-radius: var(--ngxsmk-radius-full, 9999px);
      background: var(--ngxsmk-color-surface, #ffffff);
      color: var(--ngxsmk-color-on-surface, #09090b);
      border: 2px solid var(--ngxsmk-color-outline, #e4e4e7);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkCompareImage {
  @ViewChild('container') containerRef!: ElementRef<HTMLDivElement>;

  /** Source URL for before/original image. */
  readonly before = input<string>('');

  /** Source URL for after/edited image. */
  readonly after = input<string>('');

  /** Label text overlay for before state. Default: 'Before'. */
  readonly beforeLabel = input<string>('Before');

  /** Label text overlay for after state. Default: 'After'. */
  readonly afterLabel = input<string>('After');

  /** Two-way signal model for slider percentage position (0–100). Default: 50. */
  readonly position = model<number>(50);

  protected readonly isDragging = signal(false);

  protected readonly clipPath = computed(() => {
    const pos = Math.min(100, Math.max(0, this.position()));
    return `inset(0 ${100 - pos}% 0 0)`;
  });

  protected onDragStart(event: MouseEvent): void {
    this.isDragging.set(true);
    this.updatePosition(event.clientX);

    const onMouseMove = (e: MouseEvent) => {
      if (this.isDragging()) {
        this.updatePosition(e.clientX);
      }
    };

    const onMouseUp = () => {
      this.isDragging.set(false);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }

  protected onTouchStart(event: TouchEvent): void {
    if (!event.touches.length) return;
    this.isDragging.set(true);
    this.updatePosition(event.touches[0].clientX);

    const onTouchMove = (e: TouchEvent) => {
      if (this.isDragging() && e.touches.length) {
        this.updatePosition(e.touches[0].clientX);
      }
    };

    const onTouchEnd = () => {
      this.isDragging.set(false);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };

    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);
  }

  private updatePosition(clientX: number): void {
    if (!this.containerRef) return;
    const rect = this.containerRef.nativeElement.getBoundingClientRect();
    const offsetX = clientX - rect.left;
    const pct = (offsetX / rect.width) * 100;
    this.position.set(Math.min(100, Math.max(0, Math.round(pct))));
  }
}
