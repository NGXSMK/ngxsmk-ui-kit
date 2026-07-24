import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  standalone: true,
  selector: 'ngxsmk-chat-send-button',
  template: `{{ label() }}`,
  host: {
    class: 'ngxsmk-chat-send-button',
    role: 'button',
    tabindex: '0',
    '[attr.disabled]': 'disabled() ? "" : null',
    '(click)': '!disabled() && clicked.emit()',
    '(keydown.enter)': '!disabled() && clicked.emit()',
  },
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: var(--ngxsmk-space-2) var(--ngxsmk-space-4);
      background: var(--ngxsmk-color-primary);
      color: var(--ngxsmk-color-on-primary);
      border-radius: var(--ngxsmk-radius-full);
      font-family: var(--ngxsmk-font-sans);
      font-size: var(--ngxsmk-text-label-lg-size);
      font-weight: var(--ngxsmk-font-weight-medium, 500);
      cursor: pointer;
      transition: opacity var(--ngxsmk-duration-fast);
    }
    :host([disabled]) {
      opacity: var(--ngxsmk-opacity-disabled);
      cursor: not-allowed;
    }
    :host(:hover:not([disabled])) {
      opacity: 0.9;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkChatSendButton {
  readonly label = input('Send');
  readonly disabled = input(false);
  readonly clicked = output<void>();
}
