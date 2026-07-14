import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface ChatMessageData {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  tokens?: number;
}

@Component({
  standalone: true,
  selector: 'ngxsmk-chat-message',
  template: `<ng-content />`,
  host: {
    class: 'ngxsmk-chat-message',
    '[attr.data-role]': 'message().role',
  },
  styles: `
    :host { display: flex; gap: var(--ngxsmk-space-3); padding: var(--ngxsmk-space-3) var(--ngxsmk-space-4); font-family: var(--ngxsmk-font-sans); }
    :host([data-role='assistant']) { flex-direction: row; }
    :host([data-role='user']) { flex-direction: row-reverse; }
    :host([data-role='system']) { justify-content: center; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkChatMessage {
  readonly message = input.required<ChatMessageData>();
}
