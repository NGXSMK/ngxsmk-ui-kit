import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';

@Component({
  standalone: true,
  selector: 'ngxsmk-voice-input',
  template: `
    <button
      type="button"
      class="ngxsmk-voice-input__button"
      [attr.data-recording]="recording() ? '' : null"
      (click)="toggle()"
      [attr.aria-label]="recording() ? 'Stop recording' : 'Start recording'"
    >
      @if (recording()) {
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>
      } @else {
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>
      }
    </button>
    @if (transcript()) {
      <span class="ngxsmk-voice-input__transcript">{{ transcript() }}</span>
    }
  `,
  host: { class: 'ngxsmk-voice-input' },
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      gap: var(--ngxsmk-space-2);
      font-family: var(--ngxsmk-font-sans);
    }
    .ngxsmk-voice-input__button {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: var(--ngxsmk-radius-full);
      border: none;
      background: var(--ngxsmk-color-surface-variant);
      cursor: pointer;
      font-size: var(--ngxsmk-text-title-md-size);
      display: flex;
      align-items: center;
      justify-content: center;
      transition:
        color var(--ngxsmk-duration-fast),
        background-color var(--ngxsmk-duration-fast),
        border-color var(--ngxsmk-duration-fast),
        box-shadow var(--ngxsmk-duration-fast),
        transform var(--ngxsmk-duration-fast),
        opacity var(--ngxsmk-duration-fast);
    }
    .ngxsmk-voice-input__button:hover {
      background: var(--ngxsmk-color-surface-hover);
    }
    .ngxsmk-voice-input__button[data-recording] {
      background: var(--ngxsmk-color-error-container);
      color: var(--ngxsmk-color-on-error-container);
      animation: pulse 1s infinite;
    }
    .ngxsmk-voice-input__transcript {
      font-size: var(--ngxsmk-text-label-lg-size);
      color: var(--ngxsmk-color-on-surface-variant);
    }
    @keyframes pulse {
      0%,
      100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.1);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkVoiceInput {
  readonly recording = signal(false);
  readonly transcript = signal('');
  readonly toggled = output<boolean>();
  readonly result = output<string>();

  protected toggle(): void {
    this.recording.set(!this.recording());
    this.toggled.emit(this.recording());
  }
}
