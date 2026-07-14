import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgxsmkChatMessage } from '@ngxsmk/core/chat-message';
import { NgxsmkChatMessageBubble } from '@ngxsmk/core/chat-message-bubble';

@Component({
  standalone: true,
  selector: 'ngxsmk-chat-window',
  template: `
    <div class="ngxsmk-chat-window__messages">
      @for (msg of messages(); track msg.id) {
        <ngxsmk-chat-message [message]="msg">
          <ngxsmk-chat-message-bubble>{{ msg.content }}</ngxsmk-chat-message-bubble>
        </ngxsmk-chat-message>
      }
    </div>
  `,
  host: { class: 'ngxsmk-chat-window' },
  styles: `
    :host { display: flex; flex-direction: column; height: 100%; font-family: var(--ngxsmk-font-sans); }
    .ngxsmk-chat-window__messages { flex: 1; overflow-y: auto; padding: var(--ngxsmk-space-4); display: flex; flex-direction: column; gap: var(--ngxsmk-space-3); }
  `,
  imports: [NgxsmkChatMessage, NgxsmkChatMessageBubble],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkChatWindow {
  readonly messages = input.required<{ id: string; role: 'user' | 'assistant' | 'system'; content: string; timestamp: Date; tokens?: number }[]>();
}
