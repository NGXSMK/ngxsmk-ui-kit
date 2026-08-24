import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type NgxsmkAudioVisualizerVariant = 'bars' | 'wave' | 'dots';

/**
 * Animated real-time spectrum bar and wave audio visualizer component for AI voice streams, active dictation, and media players.
 *
 * ```html
 * <ngxsmk-audio-visualizer [active]="isRecording" [bars]="16" variant="bars" />
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-audio-visualizer',
  template: `
    <div
      class="ngxsmk-audio-vis"
      [style.height]="height() + 'px'"
      role="graphics-symbol"
      [attr.aria-label]="ariaLabel()"
      [attr.data-active]="active() ? '' : null"
      [attr.data-variant]="variant()"
    >
      @for (item of barList(); track item.index) {
        <div
          class="ngxsmk-audio-vis__bar"
          [style.background]="color()"
          [style.animation-delay]="item.delay + 'ms'"
          [style.animation-duration]="item.duration + 'ms'"
        ></div>
      }
    </div>
  `,
  host: {
    class: 'ngxsmk-audio-visualizer',
  },
  styles: `
    :host {
      display: inline-block;
    }

    .ngxsmk-audio-vis {
      display: flex;
      align-items: center;
      gap: var(--ngxsmk-space-1, 0.25rem);
    }

    .ngxsmk-audio-vis__bar {
      width: 0.25rem;
      height: 20%;
      border-radius: var(--ngxsmk-radius-full, 9999px);
      transition: height 0.2s ease;
    }

    /* BARS ANIMATION */
    .ngxsmk-audio-vis[data-active][data-variant='bars'] .ngxsmk-audio-vis__bar {
      animation: ngxsmk-vis-bounce 0.8s ease-in-out infinite alternate;
    }

    /* WAVE ANIMATION */
    .ngxsmk-audio-vis[data-active][data-variant='wave'] .ngxsmk-audio-vis__bar {
      animation: ngxsmk-vis-wave 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    /* DOTS ANIMATION */
    .ngxsmk-audio-vis[data-variant='dots'] .ngxsmk-audio-vis__bar {
      width: 0.35rem;
      height: 0.35rem;
    }
    .ngxsmk-audio-vis[data-active][data-variant='dots'] .ngxsmk-audio-vis__bar {
      animation: ngxsmk-vis-pulse 1s ease-in-out infinite alternate;
    }

    @keyframes ngxsmk-vis-bounce {
      0% {
        height: 15%;
      }
      100% {
        height: 95%;
      }
    }

    @keyframes ngxsmk-vis-wave {
      0%,
      100% {
        height: 20%;
      }
      50% {
        height: 100%;
      }
    }

    @keyframes ngxsmk-vis-pulse {
      0% {
        transform: scale(0.6);
        opacity: 0.4;
      }
      100% {
        transform: scale(1.3);
        opacity: 1;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .ngxsmk-audio-vis[data-active] .ngxsmk-audio-vis__bar {
        animation-duration: 2.5s !important;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkAudioVisualizer {
  /** Whether the audio visualization animation is active. Default: true. */
  readonly active = input<boolean>(true);

  /** Number of spectrum bars or dots. Default: 12. */
  readonly bars = input<number>(12);

  /** Visual variant: 'bars' | 'wave' | 'dots'. Default: 'bars'. */
  readonly variant = input<NgxsmkAudioVisualizerVariant>('bars');

  /** Color of the visualizer elements. */
  readonly color = input<string>('var(--ngxsmk-color-primary)');

  /** Container height in pixels. Default: 32. */
  readonly height = input<number>(32);

  /** Accessible label description. */
  readonly ariaLabel = input<string>('Audio activity visualizer');

  protected readonly barList = computed(() => {
    const count = Math.max(2, this.bars());
    const list: { index: number; delay: number; duration: number }[] = [];
    for (let i = 0; i < count; i++) {
      // Create pseudorandom phase delays for organic movement
      const delay = Math.round((i * 137) % 500);
      const duration = 600 + Math.round((i * 73) % 400);
      list.push({ index: i, delay, duration });
    }
    return list;
  });
}
