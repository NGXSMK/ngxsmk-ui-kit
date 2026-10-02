import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  PLATFORM_ID,
  computed,
  effect,
  inject,
  input,
  model,
  untracked,
} from '@angular/core';
import { NgxsmkFocusTrap, NgxsmkScrollLock } from '@ngxsmk/cdk';

export interface NgxsmkLightboxImage {
  src: string;
  alt?: string;
}

/**
 * Full-viewport image gallery overlay. Call `show(index)` to open at a specific
 * image (projected previews should wire their own clicks). The overlay portals
 * to `document.body` so showcase overflow cannot clip it.
 *
 * ```html
 * <ngxsmk-lightbox #lb [images]="images">
 *   @for (img of images; track img.src; let i = $index) {
 *     <button type="button" (click)="lb.show(i)"><img [src]="img.src" [alt]="img.alt" /></button>
 *   }
 * </ngxsmk-lightbox>
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-lightbox',
  imports: [NgxsmkFocusTrap],
  template: `
    <div class="ngxsmk-lightbox__trigger">
      <ng-content />
    </div>
    @if (open()) {
      <div
        class="ngxsmk-lightbox__overlay"
        role="dialog"
        aria-modal="true"
        [attr.aria-label]="dialogLabel()"
      >
        <!-- eslint-disable-next-line @angular-eslint/template/click-events-have-key-events, @angular-eslint/template/interactive-supports-focus -->
        <div class="ngxsmk-lightbox__backdrop" (click)="close()"></div>
        <div
          class="ngxsmk-lightbox__panel"
          tabindex="-1"
          ngxsmkFocusTrap
          [ngxsmkFocusTrapAutoCapture]="true"
        >
          <button
            type="button"
            class="ngxsmk-lightbox__close"
            aria-label="Close"
            (click)="close()"
          >
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
              <path
                d="M4 4l8 8M12 4l-8 8"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              />
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
              <path
                d="M10 2L4 8l6 6"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
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
              <path
                d="M6 2l6 6-6 6"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>

          <div class="ngxsmk-lightbox__counter" aria-live="polite">
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
      flex-wrap: wrap;
      gap: var(--ngxsmk-space-2);
      max-width: 100%;
    }
    .ngxsmk-lightbox__trigger:empty {
      display: none;
    }

    .ngxsmk-lightbox__overlay {
      position: fixed;
      inset: 0;
      z-index: var(--ngxsmk-z-modal, 1400);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--ngxsmk-space-4);
      box-sizing: border-box;
      pointer-events: none;
    }

    .ngxsmk-lightbox__backdrop {
      position: absolute;
      inset: 0;
      background: var(--ngxsmk-lightbox-backdrop, rgb(0 0 0 / 0.9));
      pointer-events: auto;
    }

    .ngxsmk-lightbox__panel {
      position: relative;
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      grid-template-rows: auto minmax(0, 1fr) auto;
      align-items: center;
      justify-items: center;
      gap: var(--ngxsmk-space-3);
      z-index: 1;
      width: min(96vw, 72rem);
      max-height: min(96dvh, 100%);
      padding: var(--ngxsmk-space-2);
      box-sizing: border-box;
      outline: none;
      pointer-events: auto;
      color: var(--ngxsmk-lightbox-fg, #ffffff);
    }

    .ngxsmk-lightbox__image-wrap {
      grid-column: 2;
      grid-row: 2;
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 0;
      max-width: 100%;
      max-height: calc(96dvh - 6rem);
    }

    .ngxsmk-lightbox__image {
      display: block;
      max-width: 100%;
      max-height: calc(96dvh - 6rem);
      width: auto;
      height: auto;
      object-fit: contain;
      border-radius: var(--ngxsmk-radius-md);
    }

    .ngxsmk-lightbox__close {
      grid-column: 3;
      grid-row: 1;
      justify-self: end;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 2.5rem;
      height: 2.5rem;
      padding: 0;
      border: none;
      border-radius: var(--ngxsmk-radius-md);
      background: var(--ngxsmk-lightbox-control-bg, rgb(255 255 255 / 0.12));
      color: var(--ngxsmk-lightbox-fg, #ffffff);
      cursor: pointer;
    }

    .ngxsmk-lightbox__close:hover {
      background: var(--ngxsmk-lightbox-control-bg-hover, rgb(255 255 255 / 0.22));
    }

    .ngxsmk-lightbox__close:focus-visible {
      outline: none;
      box-shadow: 0 0 0 2px #fff, 0 0 0 4px color-mix(in srgb, #fff 40%, transparent);
    }

    .ngxsmk-lightbox__nav {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 2.5rem;
      height: 2.5rem;
      padding: 0;
      border: none;
      border-radius: 50%;
      background: var(--ngxsmk-lightbox-control-bg, rgb(255 255 255 / 0.12));
      color: var(--ngxsmk-lightbox-fg, #ffffff);
      cursor: pointer;
    }

    .ngxsmk-lightbox__nav:hover:not(:disabled) {
      background: var(--ngxsmk-lightbox-control-bg-hover, rgb(255 255 255 / 0.22));
    }

    .ngxsmk-lightbox__nav:disabled {
      opacity: 0.35;
      cursor: not-allowed;
    }

    .ngxsmk-lightbox__nav:focus-visible {
      outline: none;
      box-shadow: 0 0 0 2px #fff, 0 0 0 4px color-mix(in srgb, #fff 40%, transparent);
    }

    .ngxsmk-lightbox__nav--prev {
      grid-column: 1;
      grid-row: 2;
    }
    .ngxsmk-lightbox__nav--next {
      grid-column: 3;
      grid-row: 2;
    }

    .ngxsmk-lightbox__counter {
      grid-column: 2;
      grid-row: 3;
      color: color-mix(in srgb, var(--ngxsmk-lightbox-fg, #ffffff) 75%, transparent);
      font-size: var(--ngxsmk-text-body-sm-size);
    }

    @media (max-width: 640px) {
      .ngxsmk-lightbox__overlay {
        padding: var(--ngxsmk-space-2);
      }
      .ngxsmk-lightbox__panel {
        width: 100%;
        grid-template-columns: auto minmax(0, 1fr) auto;
        grid-template-rows: auto minmax(0, 1fr) auto;
      }
      .ngxsmk-lightbox__close {
        grid-column: 3;
        grid-row: 1;
      }
      .ngxsmk-lightbox__image-wrap {
        grid-column: 1 / -1;
        grid-row: 2;
        max-height: calc(100dvh - 8rem);
      }
      .ngxsmk-lightbox__image {
        max-height: calc(100dvh - 8rem);
      }
      .ngxsmk-lightbox__nav--prev {
        grid-column: 1;
        grid-row: 3;
        justify-self: start;
      }
      .ngxsmk-lightbox__nav--next {
        grid-column: 3;
        grid-row: 3;
        justify-self: end;
      }
      .ngxsmk-lightbox__counter {
        grid-column: 2;
        grid-row: 3;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkLightbox {
  private readonly scrollLock = inject(NgxsmkScrollLock);
  private readonly hostEl = inject(ElementRef<HTMLElement>);
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly images = input.required<NgxsmkLightboxImage[]>();
  readonly index = model(0);
  readonly open = model(false);

  protected readonly currentImage = computed(
    () => this.images()[this.index()] ?? null,
  );

  protected readonly dialogLabel = computed(() => {
    const alt = this.currentImage()?.alt?.trim();
    return alt || 'Image gallery';
  });

  private locked = false;
  private portaledOverlay: HTMLElement | null = null;

  constructor() {
    effect(() => {
      if (this.open()) {
        this.setLocked(true);
        untracked(() => this.schedulePortal());
      } else {
        this.setLocked(false);
        this.portaledOverlay = null;
      }
    });

    inject(DestroyRef).onDestroy(() => {
      this.setLocked(false);
      this.portaledOverlay = null;
    });
  }

  /** Open the lightbox at the given image index. */
  show(index = 0): void {
    const last = Math.max(0, this.images().length - 1);
    this.index.set(Math.min(Math.max(0, index), last));
    this.open.set(true);
  }

  close(): void {
    this.open.set(false);
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
    if (this.open()) {
      this.close();
    }
  }

  @HostListener('document:keydown.arrowleft')
  protected onArrowLeft(): void {
    if (this.open()) this.prev();
  }

  @HostListener('document:keydown.arrowright')
  protected onArrowRight(): void {
    if (this.open()) this.next();
  }

  private schedulePortal(): void {
    if (!this.isBrowser) return;
    queueMicrotask(() => {
      const overlay =
        (this.hostEl.nativeElement.querySelector(
          '.ngxsmk-lightbox__overlay',
        ) as HTMLElement | null) ?? this.portaledOverlay;
      if (!overlay || !this.open()) return;
      if (overlay.parentElement !== this.document.body) {
        this.document.body.appendChild(overlay);
      }
      this.portaledOverlay = overlay;
    });
  }

  private setLocked(locked: boolean): void {
    if (locked === this.locked) return;
    this.locked = locked;
    if (locked) {
      this.scrollLock.lock();
    } else {
      this.scrollLock.unlock();
    }
  }
}
