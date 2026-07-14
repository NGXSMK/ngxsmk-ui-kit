import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';

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
      {{ recording() ? '⬤' : '🎤' }}
    </button>
    @if (transcript()) {
      <span class="ngxsmk-voice-input__transcript">{{ transcript() }}</span>
    }
  `,
  host: { class: 'ngxsmk-voice-input' },
  styles: `
    :host { display: inline-flex; align-items: center; gap: var(--ngxsmk-space-2); font-family: var(--ngxsmk-font-sans); }
    .ngxsmk-voice-input__button { width: 2.5rem; height: 2.5rem; border-radius: var(--ngxsmk-radius-full); border: none; background: var(--ngxsmk-color-surface-variant); cursor: pointer; font-size: 1.125rem; display: flex; align-items: center; justify-content: center; transition: all var(--ngxsmk-duration-fast); }
    .ngxsmk-voice-input__button:hover { background: var(--ngxsmk-color-surface-hover); }
    .ngxsmk-voice-input__button[data-recording] { background: var(--ngxsmk-color-error-container); color: var(--ngxsmk-color-on-error-container); animation: pulse 1s infinite; }
    .ngxsmk-voice-input__transcript { font-size: 0.875rem; color: var(--ngxsmk-color-on-surface-variant); }
    @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
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
