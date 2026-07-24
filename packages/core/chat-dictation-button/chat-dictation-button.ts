import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  standalone: true,
  selector: 'ngxsmk-chat-dictation-button',
  template: `<svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="22" />
  </svg>`,
  host: {
    class: 'ngxsmk-chat-dictation-button',
    '[attr.data-listening]': 'listening() ? "" : null',
    '(click)': 'toggled.emit()',
    role: 'button',
    tabindex: '0',
    '[attr.aria-label]': 'listening() ? "Stop dictation" : "Start dictation"',
  },
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 2.25rem;
      height: 2.25rem;
      border-radius: var(--ngxsmk-radius-full);
      background: transparent;
      cursor: pointer;
      transition:
        color var(--ngxsmk-duration-fast),
        background-color var(--ngxsmk-duration-fast),
        border-color var(--ngxsmk-duration-fast),
        box-shadow var(--ngxsmk-duration-fast),
        transform var(--ngxsmk-duration-fast),
        opacity var(--ngxsmk-duration-fast);
      font-size: var(--ngxsmk-text-title-md-size);
    }
    :host(:hover) {
      background: var(--ngxsmk-color-surface-hover);
    }
    :host([data-listening]) {
      background: var(--ngxsmk-color-error-container);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkChatDictationButton {
  readonly listening = input(false);
  readonly toggled = output<void>();
}
