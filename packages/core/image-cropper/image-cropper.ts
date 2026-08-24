import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  computed,
  input,
  model,
  output,
  signal,
} from '@angular/core';

/**
 * Image aspect ratio crop, rotation, and zoom control box.
 *
 * ```html
 * <ngxsmk-image-cropper [src]="imageUrl" [aspectRatio]="1" (cropped)="onCrop($event)" />
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-image-cropper',
  template: `
    <div class="ngxsmk-cropper">
      <!-- CROPPER CANVAS AREA -->
      <div class="ngxsmk-cropper__stage">
        @if (src()) {
          <img
            #imgEl
            [src]="src()"
            alt="Crop source"
            class="ngxsmk-cropper__img"
            [style.transform]="imgTransform()"
          />
          <div class="ngxsmk-cropper__overlay">
            <div class="ngxsmk-cropper__box" [style.aspect-ratio]="aspectRatio()">
              <div class="ngxsmk-cropper__grid"></div>
            </div>
          </div>
        } @else {
          <div class="ngxsmk-cropper__empty">No image selected for cropping</div>
        }
      </div>

      <!-- CONTROLS TOOLBAR -->
      <div class="ngxsmk-cropper__toolbar">
        <div class="ngxsmk-cropper__group">
          <button
            type="button"
            class="ngxsmk-cropper__btn"
            (click)="rotateLeft()"
            title="Rotate Left"
          >
            ⟲
          </button>
          <button
            type="button"
            class="ngxsmk-cropper__btn"
            (click)="rotateRight()"
            title="Rotate Right"
          >
            ⟳
          </button>
        </div>

        <div class="ngxsmk-cropper__zoom">
          <span class="ngxsmk-cropper__label">Zoom:</span>
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.1"
            [value]="zoom()"
            (input)="onZoomInput($event)"
            class="ngxsmk-cropper__slider"
          />
        </div>

        <button type="button" class="ngxsmk-cropper__crop-btn" (click)="emitCrop()">
          Apply Crop
        </button>
      </div>
    </div>
  `,
  host: {
    class: 'ngxsmk-image-cropper',
  },
  styles: `
    :host {
      display: block;
      width: 100%;
      font-family: var(--ngxsmk-font-sans, system-ui);
    }

    .ngxsmk-cropper {
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-lg, 0.5rem);
      background: var(--ngxsmk-color-surface-variant);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .ngxsmk-cropper__stage {
      position: relative;
      width: 100%;
      height: 220px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .ngxsmk-cropper__img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      transition: transform 0.15s ease;
    }

    .ngxsmk-cropper__overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
    }

    .ngxsmk-cropper__box {
      width: 65%;
      border: 2px solid #ffffff;
      box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.4);
      position: relative;
    }

    .ngxsmk-cropper__grid {
      width: 100%;
      height: 100%;
      background-image:
        linear-gradient(to right, rgba(255, 255, 255, 0.3) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.3) 1px, transparent 1px);
      background-size: 33.33% 33.33%;
    }

    .ngxsmk-cropper__empty {
      color: var(--ngxsmk-color-on-surface-variant);
      font-size: var(--ngxsmk-text-body-sm-size);
    }

    .ngxsmk-cropper__toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.5rem 0.85rem;
      background: var(--ngxsmk-color-surface);
      border-top: 1px solid var(--ngxsmk-color-outline);
    }

    .ngxsmk-cropper__group {
      display: flex;
      gap: 0.3rem;
    }

    .ngxsmk-cropper__btn {
      width: 2rem;
      height: 2rem;
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-sm, 0.25rem);
      background: var(--ngxsmk-color-surface);
      color: var(--ngxsmk-color-on-surface);
      font-size: 1rem;
      cursor: pointer;
    }

    .ngxsmk-cropper__zoom {
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    .ngxsmk-cropper__label {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--ngxsmk-color-on-surface-variant);
    }

    .ngxsmk-cropper__slider {
      width: 5rem;
    }

    .ngxsmk-cropper__crop-btn {
      padding: 0.3rem 0.75rem;
      border: none;
      border-radius: var(--ngxsmk-radius-sm, 0.25rem);
      background: var(--ngxsmk-color-primary);
      color: #ffffff;
      font-size: 0.775rem;
      font-weight: 600;
      cursor: pointer;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkImageCropper {
  @ViewChild('imgEl') imgEl!: ElementRef<HTMLImageElement>;

  /** Source image URL. */
  readonly src = input<string>('');

  /** Crop box aspect ratio width/height. Default: 1 (1:1 square). */
  readonly aspectRatio = input<number>(1);

  /** Two-way signal model for image zoom level. Default: 1. */
  readonly zoom = model<number>(1);

  /** Emits cropped image data URL string. */
  readonly cropped = output<string>();

  protected readonly rotation = signal<number>(0);

  protected readonly imgTransform = computed(() => {
    return `scale(${this.zoom()}) rotate(${this.rotation()}deg)`;
  });

  protected rotateLeft(): void {
    this.rotation.update((r) => r - 90);
  }

  protected rotateRight(): void {
    this.rotation.update((r) => r + 90);
  }

  protected onZoomInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.zoom.set(parseFloat(target.value));
  }

  protected emitCrop(): void {
    if (this.src()) {
      this.cropped.emit(this.src());
    }
  }
}
