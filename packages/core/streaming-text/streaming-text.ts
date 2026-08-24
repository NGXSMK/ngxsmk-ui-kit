import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  input,
  output,
  signal,
  effect,
  viewChild,
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
  private readonly cursorRef = viewChild<ElementRef<HTMLElement>>('cursor');

  readonly text = input('');
  readonly speed = input(30);

  /** Cursor blink mode: `'css'` (default) or `'motion'` (motion.dev animate). */
  readonly streamingCursorAnimation = input<'css' | 'motion'>('css');

  /** Emits when streaming finishes rendering the current text target. */
  readonly completed = output<string>();

  protected readonly displayText = signal('');
  private timerId: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.clearTimer();
    });

    effect(() => {
      const target = this.text();
      this.clearTimer();
      // If target changed completely, reset
      if (!target.startsWith(this.displayText())) {
        this.displayText.set('');
      }
      this.streamTo(target);
    });

    // Animate cursor with motion.dev when enabled
    afterNextRender(async () => {
      if (this.streamingCursorAnimation() !== 'motion') return;
      if (prefersReducedMotion()) return;

      const motion = await loadMotion();
      if (!motion) return;

      const cursorEl = this.cursorRef()?.nativeElement;
      if (!cursorEl) return;

      // Override CSS animation with motion.dev infinite blink
      cursorEl.style.animation = 'none';
      motion.animate(cursorEl, { opacity: [1, 0] } as unknown as Record<string, string | number>, {
        duration: 0.8,
        ease: 'steps(1)',
        repeat: Infinity,
        repeatType: 'reverse',
      });
    });
  }

  private clearTimer(): void {
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  private streamTo(target: string): void {
    const currentLen = this.displayText().length;
    if (target.length <= currentLen) {
      if (target.length === currentLen && target.length > 0) {
        this.completed.emit(target);
      }
      return;
    }
    const nextChar = target[currentLen];
    this.displayText.update((t) => t + nextChar);
    if (this.displayText().length < target.length) {
      this.timerId = setTimeout(() => this.streamTo(target), this.speed());
    } else {
      this.completed.emit(target);
    }
  }
}
