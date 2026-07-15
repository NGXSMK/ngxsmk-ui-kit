import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'ngxsmk-audio-player',
  template: `
    <div class="ngxsmk-audio-player__bar">
      <span class="ngxsmk-audio-player__label">{{ label() }}</span>
      <progress class="ngxsmk-audio-player__progress" [value]="progress()" max="100"></progress>
      <span class="ngxsmk-audio-player__time">{{ currentTime() }} / {{ duration() }}</span>
    </div>
  `,
  host: { class: 'ngxsmk-audio-player' },
  styles: `
    :host {
      display: block;
      padding: var(--ngxsmk-space-2) var(--ngxsmk-space-3);
      background: var(--ngxsmk-color-surface-variant);
      border-radius: var(--ngxsmk-radius-md);
      font-family: var(--ngxsmk-font-sans);
      font-size: 0.8125rem;
    }
    .ngxsmk-audio-player__bar {
      display: flex;
      align-items: center;
      gap: var(--ngxsmk-space-3);
    }
    .ngxsmk-audio-player__label {
      font-weight: 500;
      color: var(--ngxsmk-color-on-surface);
      min-width: 5rem;
    }
    .ngxsmk-audio-player__progress {
      flex: 1;
      height: 0.375rem;
      accent-color: var(--ngxsmk-color-primary);
    }
    .ngxsmk-audio-player__time {
      color: var(--ngxsmk-color-on-surface-variant);
      white-space: nowrap;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkAudioPlayer {
  readonly label = input('Audio');
  readonly progress = input(0);
  readonly currentTime = input('0:00');
  readonly duration = input('0:00');
}
