import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  standalone: true,
  selector: 'ngxsmk-chat-dictation-button',
  template: `ðŸŽ¤`,
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
        color,
        background-color,
        border-color,
        box-shadow,
        transform,
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
