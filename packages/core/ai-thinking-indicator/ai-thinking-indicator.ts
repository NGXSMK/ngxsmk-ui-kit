import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type NgxsmkAiThinkingVariant = 'orb' | 'wave' | 'dots';

/**
 * Animated glowing orb, pulse wave, and skeleton indicator for active AI reasoning.
 *
 * ```html
 * <ngxsmk-ai-thinking-indicator label="Reasoning..." variant="orb" />
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-ai-thinking-indicator',
  template: `
    <div class="ngxsmk-ai-thinking" [attr.data-variant]="variant()">
      @if (variant() === 'orb') {
        <div
          class="ngxsmk-ai-thinking__orb"
          [style.width]="size() + 'px'"
          [style.height]="size() + 'px'"
        >
          <div class="ngxsmk-ai-thinking__orb-inner"></div>
        </div>
      } @else if (variant() === 'dots') {
        <div class="ngxsmk-ai-thinking__dots">
          <span class="ngxsmk-ai-thinking__dot"></span>
          <span class="ngxsmk-ai-thinking__dot"></span>
          <span class="ngxsmk-ai-thinking__dot"></span>
        </div>
      } @else {
        <div class="ngxsmk-ai-thinking__wave">
          <span class="ngxsmk-ai-thinking__wave-bar"></span>
          <span class="ngxsmk-ai-thinking__wave-bar"></span>
          <span class="ngxsmk-ai-thinking__wave-bar"></span>
        </div>
      }

      @if (label()) {
        <span class="ngxsmk-ai-thinking__label">{{ label() }}</span>
      }
    </div>
  `,
  host: {
    class: 'ngxsmk-ai-thinking-indicator',
  },
  styles: `
    :host {
      display: inline-block;
      font-family: var(--ngxsmk-font-sans);
    }

    .ngxsmk-ai-thinking {
      display: flex;
      align-items: center;
      gap: var(--ngxsmk-space-2);
    }

    /* ORB VARIANT */
    .ngxsmk-ai-thinking__orb {
      position: relative;
      border-radius: var(--ngxsmk-radius-full);
      background: radial-gradient(
        circle,
        var(--ngxsmk-color-primary) 0%,
        color-mix(in srgb, var(--ngxsmk-color-primary) 20%, transparent) 70%
      );
      display: flex;
      align-items: center;
      justify-content: center;
      animation: ngxsmk-orb-pulse 1.8s ease-in-out infinite alternate;
    }

    .ngxsmk-ai-thinking__orb-inner {
      width: 45%;
      height: 45%;
      border-radius: var(--ngxsmk-radius-full);
      background: var(--ngxsmk-color-surface);
      box-shadow: 0 0 10px color-mix(in srgb, var(--ngxsmk-color-primary) 50%, white);
      animation: ngxsmk-orb-glow 1.2s ease-in-out infinite alternate;
    }

    /* DOTS VARIANT */
    .ngxsmk-ai-thinking__dots {
      display: flex;
      gap: var(--ngxsmk-space-1);
    }

    .ngxsmk-ai-thinking__dot {
      width: 0.5rem;
      height: 0.5rem;
      border-radius: var(--ngxsmk-radius-full);
      background: var(--ngxsmk-color-primary);
      animation: ngxsmk-dots-bounce 1.2s infinite ease-in-out both;
    }

    .ngxsmk-ai-thinking__dot:nth-child(1) {
      animation-delay: -0.32s;
    }
    .ngxsmk-ai-thinking__dot:nth-child(2) {
      animation-delay: -0.16s;
    }

    /* WAVE VARIANT */
    .ngxsmk-ai-thinking__wave {
      display: flex;
      align-items: center;
      gap: var(--ngxsmk-space-0-5);
      height: 1.25rem;
    }

    .ngxsmk-ai-thinking__wave-bar {
      width: 0.2rem;
      height: 100%;
      background: var(--ngxsmk-color-primary);
      border-radius: var(--ngxsmk-radius-full);
      animation: ngxsmk-wave-scale 1s ease-in-out infinite alternate;
    }

    .ngxsmk-ai-thinking__wave-bar:nth-child(1) {
      animation-delay: -0.4s;
    }
    .ngxsmk-ai-thinking__wave-bar:nth-child(2) {
      animation-delay: -0.2s;
    }

    .ngxsmk-ai-thinking__label {
      font-size: var(--ngxsmk-text-label-sm-size);
      font-weight: var(--ngxsmk-font-weight-semibold, 600);
      color: var(--ngxsmk-color-on-surface-variant);
      letter-spacing: 0.02em;
    }

    @keyframes ngxsmk-orb-pulse {
      0% {
        transform: scale(0.85);
        box-shadow: 0 0 0 0 color-mix(in srgb, var(--ngxsmk-color-primary) 40%, transparent);
      }
      100% {
        transform: scale(1.15);
        box-shadow: 0 0 20px 8px color-mix(in srgb, var(--ngxsmk-color-primary) 30%, transparent);
      }
    }

    @keyframes ngxsmk-orb-glow {
      0% {
        opacity: 0.5;
      }
      100% {
        opacity: 1;
      }
    }

    @keyframes ngxsmk-dots-bounce {
      0%,
      80%,
      100% {
        transform: scale(0);
      }
      40% {
        transform: scale(1);
      }
    }

    @keyframes ngxsmk-wave-scale {
      0% {
        transform: scaleY(0.3);
      }
      100% {
        transform: scaleY(1);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .ngxsmk-ai-thinking__orb,
      .ngxsmk-ai-thinking__dot,
      .ngxsmk-ai-thinking__wave-bar {
        animation-duration: 3s !important;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkAiThinkingIndicator {
  /** Optional text description label. Default: 'Thinking...'. */
  readonly label = input<string>('Thinking...');

  /** Visual animation style: 'orb' | 'dots' | 'wave'. Default: 'orb'. */
  readonly variant = input<NgxsmkAiThinkingVariant>('orb');

  /** Diameter size in pixels for orb variant. Default: 24. */
  readonly size = input<number>(24);
}
