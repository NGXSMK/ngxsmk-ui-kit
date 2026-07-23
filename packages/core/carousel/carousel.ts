import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  PLATFORM_ID,
  booleanAttribute,
  computed,
  contentChildren,
  effect,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { loadMotion, prefersReducedMotion } from '@ngxsmk/core/animation';

let nextSlideId = 0;

@Component({
  standalone: true,
  selector: 'ngxsmk-carousel-slide',
  template: `<ng-content />`,
  host: {
    class: 'ngxsmk-carousel-slide',
    role: 'group',
    'aria-roledescription': 'slide',
    '[attr.id]': 'id',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkCarouselSlide {
  readonly id = `ngxsmk-carousel-slide-${nextSlideId++}`;
}

@Component({
  standalone: true,
  selector: 'ngxsmk-carousel',
  template: `
    <div
      class="ngxsmk-carousel__viewport"
      role="region"
      aria-roledescription="carousel"
      [attr.aria-label]="label()"
    >
      <div class="ngxsmk-carousel__track" [style.transform]="trackTransform()">
        <ng-content />
      </div>
    </div>

    @if (showControls() && slides().length > 1) {
      <button
        type="button"
        class="ngxsmk-carousel__btn ngxsmk-carousel__btn--prev"
        aria-label="Previous slide"
        (click)="prev()"
      >
        <svg
          viewBox="0 0 16 16"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        >
          <path d="M10 3L5 8l5 5" />
        </svg>
      </button>
      <button
        type="button"
        class="ngxsmk-carousel__btn ngxsmk-carousel__btn--next"
        aria-label="Next slide"
        (click)="next()"
      >
        <svg
          viewBox="0 0 16 16"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        >
          <path d="M6 3l5 5-5 5" />
        </svg>
      </button>
    }

    @if (showIndicators() && slides().length > 1) {
      <div class="ngxsmk-carousel__indicators" role="tablist">
        @for (slide of slides(); track slide.id; let idx = $index) {
          <button
            type="button"
            role="tab"
            [attr.aria-selected]="idx === activeIndex()"
            [attr.aria-controls]="slide.id"
            [attr.aria-label]="'Slide ' + (idx + 1)"
            [class.active]="idx === activeIndex()"
            (click)="goTo(idx)"
          ></button>
        }
      </div>
    }
  `,
  host: {
    class: 'ngxsmk-carousel',
  },
  styles: `
    :host {
      display: block;
      position: relative;
      overflow: hidden;
      width: 100%;
      box-sizing: border-box;
    }

    .ngxsmk-carousel__viewport {
      overflow: hidden;
      width: 100%;
    }

    .ngxsmk-carousel__track {
      display: flex;
      transition: transform var(--ngxsmk-motion-duration) var(--ngxsmk-motion-ease);
      width: 100%;
    }

    ::ng-deep ngxsmk-carousel-slide {
      flex: 0 0 100%;
      width: 100%;
      box-sizing: border-box;
    }

    .ngxsmk-carousel__btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: var(--ngxsmk-color-surface);
      color: var(--ngxsmk-color-on-surface);
      border: 1px solid var(--ngxsmk-color-outline);
      width: 2.25rem;
      height: 2.25rem;
      border-radius: var(--ngxsmk-radius-full);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 2;
      box-shadow: var(--ngxsmk-shadow-md);
      transition: background-color var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out);
    }
    .ngxsmk-carousel__btn:hover {
      background: var(--ngxsmk-color-surface-hover);
    }
    .ngxsmk-carousel__btn--prev {
      left: 1rem;
    }
    .ngxsmk-carousel__btn--next {
      right: 1rem;
    }

    .ngxsmk-carousel__indicators {
      position: absolute;
      bottom: 1rem;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: var(--ngxsmk-space-2);
      z-index: 2;
    }

    .ngxsmk-carousel__indicators button {
      width: 0.5rem;
      height: 0.5rem;
      border-radius: var(--ngxsmk-radius-full);
      border: none;
      background: var(--ngxsmk-color-outline-strong, rgba(255, 255, 255, 0.5));
      cursor: pointer;
      padding: 0;
      transition:
        width var(--ngxsmk-motion-duration) var(--ngxsmk-motion-ease),
        background-color var(--ngxsmk-motion-duration) var(--ngxsmk-motion-ease);
    }
    .ngxsmk-carousel__indicators button.active {
      background: var(--ngxsmk-color-primary, white);
      width: 1.25rem;
    }

    @media (prefers-reduced-motion: reduce) {
      .ngxsmk-carousel__track {
        transition: none;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkCarousel {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);

  readonly label = input<string>('Image gallery');
  readonly autoplay = input(false, { transform: booleanAttribute });
  readonly interval = input<number>(3000);
  readonly loop = input(true, { transform: booleanAttribute });
  readonly showControls = input(true, { transform: booleanAttribute });
  readonly showIndicators = input(true, { transform: booleanAttribute });

  /** Animation mode: `'css'` (default, CSS transition) or `'motion'` (motion.dev animate). */
  readonly carouselAnimation = input<'css' | 'motion'>('css');

  /** Slide transition duration in seconds. Default `0.3`. */
  readonly carouselDuration = input<number>(0.3);

  /** Easing name or cubic-bezier array. Default `'ease-out'`. */
  readonly carouselEase = input<string | number[]>('ease-out');

  /** Animation type: `'tween'` or `'spring'`. Default `'tween'`. */
  readonly carouselType = input<'tween' | 'spring'>('tween');

  /** Spring stiffness (when type is 'spring'). */
  readonly carouselStiffness = input<number>();

  /** Spring damping (when type is 'spring'). */
  readonly carouselDamping = input<number>();

  readonly slides = contentChildren(NgxsmkCarouselSlide);
  readonly activeIndex = signal(0);

  private readonly trackRef = viewChild<ElementRef<HTMLElement>>('track');

  protected readonly trackTransform = computed(() => {
    return `translateX(-${this.activeIndex() * 100}%)`;
  });

  constructor() {
    effect((onCleanup) => {
      if (isPlatformBrowser(this.platformId) && this.autoplay() && this.slides().length > 1) {
        const id = setInterval(() => {
          this.next();
        }, this.interval());
        onCleanup(() => clearInterval(id));
      }
    });
  }

  private buildMotionOptions(): Record<string, unknown> {
    const type = this.carouselType();
    if (type === 'spring') {
      const opts: Record<string, unknown> = { type: 'spring' };
      const stiffness = this.carouselStiffness();
      const damping = this.carouselDamping();
      if (stiffness != null) opts['stiffness'] = stiffness;
      if (damping != null) opts['damping'] = damping;
      return opts;
    }
    return { duration: this.carouselDuration(), ease: this.carouselEase() };
  }

  private async animateTrackTo(targetPercent: number): Promise<void> {
    if (this.carouselAnimation() !== 'motion') return;
    if (prefersReducedMotion()) return;

    const track = this.trackRef()?.nativeElement;
    if (!track) return;

    const motion = await loadMotion();
    if (!motion) return;

    track.style.transition = 'none';
    await motion.animate(
      track,
      { transform: `translateX(-${targetPercent}%)` },
      this.buildMotionOptions(),
    ).finished;
    track.style.transition = '';
  }

  next(): void {
    const len = this.slides().length;
    if (len <= 1) return;

    const fromIdx = this.activeIndex();
    this.activeIndex.update((idx) => {
      if (idx === len - 1) {
        return this.loop() ? 0 : idx;
      }
      return idx + 1;
    });
    const toIdx = this.activeIndex();
    if (fromIdx !== toIdx) {
      void this.animateTrackTo(toIdx * 100);
    }
  }

  prev(): void {
    const len = this.slides().length;
    if (len <= 1) return;

    const fromIdx = this.activeIndex();
    this.activeIndex.update((idx) => {
      if (idx === 0) {
        return this.loop() ? len - 1 : idx;
      }
      return idx - 1;
    });
    const toIdx = this.activeIndex();
    if (fromIdx !== toIdx) {
      void this.animateTrackTo(toIdx * 100);
    }
  }

  goTo(index: number): void {
    if (index >= 0 && index < this.slides().length) {
      const fromIdx = this.activeIndex();
      this.activeIndex.set(index);
      if (fromIdx !== index) {
        void this.animateTrackTo(index * 100);
      }
    }
  }
}
