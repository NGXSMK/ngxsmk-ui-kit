import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'ngxsmk-chat-message-bubble',
  template: `<div class="ngxsmk-chat-message-bubble__bubble"><ng-content /></div>`,
  host: { class: 'ngxsmk-chat-message-bubble' },
  styles: `
    :host {
      display: flex;
      max-width: 75%;
    }
    .ngxsmk-chat-message-bubble__bubble {
      padding: var(--ngxsmk-space-2) var(--ngxsmk-space-3);
      border-radius: var(--ngxsmk-radius-lg);
      background: var(--ngxsmk-color-surface-container);
      color: var(--ngxsmk-color-on-surface);
      font-size: var(--ngxsmk-text-body-md-size);
      line-height: var(--ngxsmk-leading-normal, 1.5);
      word-wrap: break-word;
    }
    ::ng-deep [data-role='user'] ngxsmk-chat-message-bubble .ngxsmk-chat-message-bubble__bubble {
      background: var(--ngxsmk-color-primary-container);
      color: var(--ngxsmk-color-on-primary-container);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkChatMessageBubble {}
