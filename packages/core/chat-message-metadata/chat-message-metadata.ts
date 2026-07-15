import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'ngxsmk-chat-message-metadata',
  template: `{{ formattedTime() }}`,
  host: { class: 'ngxsmk-chat-message-metadata' },
  styles: `
    :host {
      display: block;
      font-size: var(--ngxsmk-text-body-xs-size);
      color: var(--ngxsmk-color-on-surface-variant);
      padding: 0 var(--ngxsmk-space-1);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkChatMessageMetadata {
  readonly timestamp = input<Date>(new Date());

  protected formattedTime(): string {
    return this.timestamp().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}
