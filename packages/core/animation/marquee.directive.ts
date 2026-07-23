import { DestroyRef, Directive, ElementRef, afterNextRender, inject, input } from '@angular/core';
import { loadMotion, prefersReducedMotion } from './animate';

/**
 * Creates a continuous scrolling marquee animation from the host element's
 * content. The content is cloned to fill the viewport.
 *
 * When `motion` is installed, uses `motion.animate()` with `repeat: Infinity`
 * for smooth hardware-accelerated scrolling. Falls back to CSS @keyframes
 * when motion is not installed.
 *
 * ```html
 * <div ngxsmkMarquee [marqueeSpeed]="20" [marqueeDirection]="'horizontal'">
 *   Scrolling text content
 * </div>
 *
 * <!-- Custom easing -->
 * <div
 *   ngxsmkMarquee
 *   [marqueeSpeed]="15"
 *   marqueeEasing="linear"
 *   marqueeRepeatType="reverse"
 * >
 *   Ping-pong text
 * </div>
 * ```
 */
@Directive({
  standalone: true,
  selector: '[ngxsmkMarquee]',
})
export class NgxsmkMarquee {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);

  /** Scroll direction. Default `'horizontal'`. */
  readonly ngxsmkMarquee = input<'horizontal' | 'vertical'>('horizontal');

  /** Duration of one complete scroll cycle in seconds. Default `15`. */
  readonly marqueeSpeed = input<number>(15);

  /** Pause animation on hover. Default `true`. */
  readonly marqueePauseOnHover = input<boolean>(true);

  /** Scroll direction: `'normal'` (left-to-right) or `'reverse'`. */
  readonly marqueeDirection = input<'normal' | 'reverse'>('normal');

  /** Easing function name. Default `'linear'`. */
  readonly marqueeEasing = input<string | number[]>('linear');

  /** Repeat type: `'loop'`, `'reverse'`, or `'mirror'`. Default `'loop'`. */
  readonly marqueeRepeatType = input<'loop' | 'reverse' | 'mirror'>('loop');

  constructor() {
    afterNextRender(async () => {
      if (prefersReducedMotion()) return;

      const nativeEl = this.el.nativeElement;
      const isHorizontal = this.ngxsmkMarquee() === 'horizontal';
      const speed = this.marqueeSpeed();
      const direction = this.marqueeDirection();
      const easing = this.marqueeEasing();
      const repeatType = this.marqueeRepeatType();

      nativeEl.style.overflow = 'hidden';
      nativeEl.style.display = 'flex';
      nativeEl.style.gap = '0';

      if (isHorizontal) {
        nativeEl.style.whiteSpace = 'nowrap';
        nativeEl.style.flexDirection = 'row';
      } else {
        nativeEl.style.flexDirection = 'column';
        nativeEl.style.height = '100%';
      }

      const original = document.createElement('div');
      original.style.display = 'flex';
      original.style.flexShrink = '0';
      original.style.willChange = 'transform';
      original.innerHTML = nativeEl.innerHTML;

      const clone = document.createElement('div');
      clone.style.display = 'flex';
      clone.style.flexShrink = '0';
      clone.style.willChange = 'transform';
      clone.innerHTML = nativeEl.innerHTML;
      clone.setAttribute('aria-hidden', 'true');

      nativeEl.textContent = '';
      nativeEl.appendChild(original);
      nativeEl.appendChild(clone);

      const motion = await loadMotion();

      if (motion) {
        this.setupMotionMarquee(motion, original, clone, nativeEl, {
          isHorizontal,
          speed,
          direction,
          easing,
          repeatType,
        });
      } else {
        this.setupFallbackMarquee(original, clone, nativeEl, {
          isHorizontal,
          speed,
          direction,
        });
      }
    });
  }

  private setupMotionMarquee(
    motion: NonNullable<Awaited<ReturnType<typeof loadMotion>>>,
    original: HTMLDivElement,
    clone: HTMLDivElement,
    host: HTMLElement,
    config: {
      isHorizontal: boolean;
      speed: number;
      direction: string;
      easing: string | number[];
      repeatType: string;
    },
  ): void {
    const keyframes: Record<string, string | number> = config.isHorizontal
      ? { transform: ['translateX(0)', 'translateX(-100%)'] as unknown as string }
      : { transform: ['translateY(0)', 'translateY(-100%)'] as unknown as string };

    const options: Record<string, unknown> = {
      duration: config.speed,
      ease: config.easing,
      repeat: Infinity,
      repeatType: config.repeatType === 'reverse' ? 'reverse' :
        config.repeatType === 'mirror' ? 'mirror' : 'loop',
    };

    const anim1 = motion.animate(original, keyframes, options);
    const anim2 = motion.animate(clone, keyframes, options);

    if (this.marqueePauseOnHover()) {
      const pause = () => {
        anim1.stop();
        anim2.stop();
      };
      const resume = () => {
        this.setupMotionMarquee(motion, original, clone, host, config);
      };

      host.addEventListener('pointerenter', pause);
      host.addEventListener('pointerleave', resume);

      this.destroyRef.onDestroy(() => {
        host.removeEventListener('pointerenter', pause);
        host.removeEventListener('pointerleave', resume);
        anim1.stop();
        anim2.stop();
      });
    } else {
      this.destroyRef.onDestroy(() => {
        anim1.stop();
        anim2.stop();
      });
    }
  }

  private setupFallbackMarquee(
    original: HTMLDivElement,
    clone: HTMLDivElement,
    host: HTMLElement,
    config: {
      isHorizontal: boolean;
      speed: number;
      direction: string;
    },
  ): void {
    const animName = `ngxsmk-marquee-${config.isHorizontal ? 'h' : 'v'}`;
    const keyframes = config.isHorizontal
      ? [{ transform: 'translateX(0)' }, { transform: 'translateX(-100%)' }]
      : [{ transform: 'translateY(0)' }, { transform: 'translateY(-100%)' }];

    if (config.direction === 'reverse') {
      keyframes.reverse();
    }

    original.style.animation = `${animName} ${config.speed}s linear infinite`;
    clone.style.animation = `${animName} ${config.speed}s linear infinite`;

    const styleId = `ngxsmk-marquee-${animName}`;
    let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      styleEl.textContent = config.isHorizontal
        ? `@keyframes ${animName} { 0% { transform: translateX(0); } 100% { transform: translateX(-100%); } }`
        : `@keyframes ${animName} { 0% { transform: translateY(0); } 100% { transform: translateY(-100%); } }`;
      document.head.appendChild(styleEl);
    }

    if (this.marqueePauseOnHover()) {
      const pause = () => {
        original.style.animationPlayState = 'paused';
        clone.style.animationPlayState = 'paused';
      };
      const resume = () => {
        original.style.animationPlayState = 'running';
        clone.style.animationPlayState = 'running';
      };

      host.addEventListener('pointerenter', pause);
      host.addEventListener('pointerleave', resume);

      this.destroyRef.onDestroy(() => {
        host.removeEventListener('pointerenter', pause);
        host.removeEventListener('pointerleave', resume);
      });
    }
  }
}
