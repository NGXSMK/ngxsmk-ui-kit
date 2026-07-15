import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
  input,
  model,
  NgZone,
} from '@angular/core';

export interface NgxsmkLightboxImage {
  src: string;
  alt?: string;
}

@Component({
  standalone: true,
  selector: 'ngxsmk-lightbox',
  template: `
    <!-- eslint-disable-next-line @angular-eslint/template/click-events-have-key-events, @angular-eslint/template/interactive-supports-focus -->
    <div class="ngxsmk-lightbox__trigger" (click)="show(0)">
      <ng-content />
    </div>
    @if (open()) {
      <div class="ngxsmk-lightbox__overlay">
      <!-- eslint-disable-next-line @angular-eslint/template/click-events-have-key-events, @angular-eslint/template/interactive-supports-focus -->
      <div class="ngxsmk-lightbox__backdrop" (click)="open.set(false)"></div>
      <div class="ngxsmk-lightbox__panel">
        <button
          type="button"
          class="ngxsmk-lightbox__close"
          aria-label="Close"
          (click)="open.set(false)"
        >
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          </svg>
        </button>

        <button
          type="button"
          class="ngxsmk-lightbox__nav ngxsmk-lightbox__nav--prev"
          aria-label="Previous image"
          [disabled]="index() <= 0"
          (click)="prev()"
        >
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
            <path d="M10 2L4 8l6 6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>

        <div class="ngxsmk-lightbox__image-wrap">
          <img
            class="ngxsmk-lightbox__image"
            [src]="currentImage()?.src"
            [alt]="currentImage()?.alt ?? ''"
          />
        </div>

        <button
          type="button"
          class="ngxsmk-lightbox__nav ngxsmk-lightbox__nav--next"
          aria-label="Next image"
          [disabled]="index() >= images().length - 1"
          (click)="next()"
        >
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
            <path d="M6 2l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>

        <div class="ngxsmk-lightbox__counter">
          {{ index() + 1 }} / {{ images().length }}
        </div>
      </div>
      </div>
    }
  `,
  host: { class: 'ngxsmk-lightbox' },
  styles: `
    :host {
      display: inline-block;
      font-family: var(--ngxsmk-font-sans);
    }

    .ngxsmk-lightbox__trigger {
      display: inline-flex;
      cursor: zoom-in;
    }
    .ngxsmk-lightbox__trigger:empty { display: none; }

    .ngxsmk-lightbox__overlay {
      position: fixed;
      inset: 0;
      z-index: var(--ngxsmk-z-modal, 1400);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .ngxsmk-lightbox__backdrop {
      position: fixed;
      inset: 0;
      background: var(--ngxsmk-color-lightbox-backdrop, rgb(0 0 0 / 0.9));
    }

    .ngxsmk-lightbox__panel {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1;
      max-width: 90vw;
      max-height: 90vh;
    }

    .ngxsmk-lightbox__image-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
      max-width: 100%;
      max-height: 90vh;
    }

    .ngxsmk-lightbox__image {
      display: block;
      max-width: 100%;
      max-height: 90vh;
      object-fit: contain;
      border-radius: var(--ngxsmk-radius-md);
    }

    .ngxsmk-lightbox__close {
      position: absolute;
      top: -2.5rem;
      right: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 2rem;
      height: 2rem;
      padding: 0;
      border: none;
      border-radius: var(--ngxsmk-radius-md);
      background: transparent;
      color: white;
      cursor: pointer;
    }

    .ngxsmk-lightbox__close:hover {
      background: rgb(255 255 255 / 0.15);
    }

    .ngxsmk-lightbox__close:focus-visible {
      outline: 2px solid var(--ngxsmk-color-ring);
      outline-offset: 2px;
    }

    .ngxsmk-lightbox__nav {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 2.5rem;
      height: 2.5rem;
      padding: 0;
      border: none;
      border-radius: 50%;
      background: rgb(255 255 255 / 0.1);
      color: white;
      cursor: pointer;
    }

    .ngxsmk-lightbox__nav:hover:not(:disabled) {
      background: rgb(255 255 255 / 0.25);
    }

    .ngxsmk-lightbox__nav:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }

    .ngxsmk-lightbox__nav:focus-visible {
      outline: 2px solid var(--ngxsmk-color-ring);
      outline-offset: 2px;
    }

    .ngxsmk-lightbox__nav--prev { left: -3.5rem; }
    .ngxsmk-lightbox__nav--next { right: -3.5rem; }

    @media (max-width: 640px) {
      .ngxsmk-lightbox__panel {
        max-width: 100vw;
        max-height: 100dvh;
      }
      .ngxsmk-lightbox__nav--prev { left: var(--ngxsmk-space-2); }
      .ngxsmk-lightbox__nav--next { right: var(--ngxsmk-space-2); }
      .ngxsmk-lightbox__close { top: var(--ngxsmk-space-2); right: var(--ngxsmk-space-2); }
      .ngxsmk-lightbox__counter { bottom: var(--ngxsmk-space-2); }
    }

    .ngxsmk-lightbox__counter {
      position: absolute;
      bottom: -2rem;
      left: 50%;
      transform: translateX(-50%);
      color: rgb(255 255 255 / 0.7);
      font-size: var(--ngxsmk-text-body-sm-size);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkLightbox {
  private readonly zone = inject(NgZone);

  readonly images = input.required<NgxsmkLightboxImage[]>();
  readonly index = model(0);
  readonly open = model(false);

  protected currentImage = () => this.images()[this.index()] ?? null;

  /** Open the lightbox at the given image index. */
  show(index = 0): void {
    this.index.set(Math.min(Math.max(0, index), this.images().length - 1));
    this.open.set(true);
  }

  prev(): void {
    if (this.index() > 0) {
      this.index.update((i) => i - 1);
    }
  }

  next(): void {
    if (this.index() < this.images().length - 1) {
      this.index.update((i) => i + 1);
    }
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    this.open.set(false);
  }

  @HostListener('document:keydown.arrowleft')
  protected onArrowLeft(): void {
    if (this.open()) this.prev();
  }

  @HostListener('document:keydown.arrowright')
  protected onArrowRight(): void {
    if (this.open()) this.next();
  }
}
