import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  input,
  signal,
  effect,
} from '@angular/core';
import { loadMotion, prefersReducedMotion } from '@ngxsmk/core/animation';

@Component({
  standalone: true,
  selector: 'ngxsmk-streaming-text',
  template: `{{ displayText()
    }}<span #cursor class="ngxsmk-streaming-text__cursor">&ZeroWidthSpace;</span>`,
  host: { class: 'ngxsmk-streaming-text', 'aria-live': 'polite' },
  styles: `
    :host {
      white-space: pre-wrap;
      word-wrap: break-word;
      font-family: var(--ngxsmk-font-sans);
    }
    .ngxsmk-streaming-text__cursor {
      display: inline-block;
      width: 0.125rem;
      height: 1em;
      background: var(--ngxsmk-color-primary);
      margin-inline-start: var(--ngxsmk-space-1);
      animation: blink 0.8s step-end infinite;
      vertical-align: text-bottom;
    }
    @keyframes blink {
      50% {
        opacity: 0;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkStreamingText {
  private readonly destroyRef = inject(DestroyRef);

  readonly text = input('');
  readonly speed = input(30);

  /** Cursor blink mode: `'css'` (default) or `'motion'` (motion.dev animate). */
  readonly streamingCursorAnimation = input<'css' | 'motion'>('css');

  protected readonly displayText = signal('');

  constructor() {
    effect(() => {
      const target = this.text();
      this.streamTo(target);
    });

    // Animate cursor with motion.dev when enabled
    afterNextRender(async () => {
      if (this.streamingCursorAnimation() !== 'motion') return;
      if (prefersReducedMotion()) return;

      const motion = await loadMotion();
      if (!motion) return;

      const cursorEl = (this as unknown as { cursorRef?: ElementRef<HTMLElement> }).cursorRef;
      if (!cursorEl?.nativeElement) return;

      const cursor = cursorEl.nativeElement;
      // Override CSS animation with motion.dev infinite blink
      cursor.style.animation = 'none';
      motion.animate(cursor, { opacity: [1, 0] } as unknown as Record<string, string | number>, {
        duration: 0.8,
        ease: 'steps(1)',
        repeat: Infinity,
        repeatType: 'reverse',
      });
    });
  }

  private streamTo(target: string): void {
    const currentLen = this.displayText().length;
    if (target.length <= currentLen) return;
    const nextChar = target[currentLen];
    this.displayText.update((t) => t + nextChar);
    if (this.displayText().length < target.length) {
      setTimeout(() => this.streamTo(target), this.speed());
    }
  }
}
