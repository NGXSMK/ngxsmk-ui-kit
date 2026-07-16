import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'ngxsmk-chat-system-message',
  template: `{{ message() }}`,
  host: { class: 'ngxsmk-chat-system-message' },
  styles: `
    :host {
      display: inline-block;
      padding: var(--ngxsmk-space-1) var(--ngxsmk-space-3);
      background: var(--ngxsmk-color-surface-variant);
      border-radius: var(--ngxsmk-radius-full);
      font-family: var(--ngxsmk-font-sans);
      font-size: var(--ngxsmk-text-label-md-size);
      color: var(--ngxsmk-color-on-surface-variant);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkChatSystemMessage {
  readonly message = input('');
}
