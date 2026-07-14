import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'ngxsmk-chat-tokenized-text',
  template: `{{ text() }}`,
  host: { class: 'ngxsmk-chat-tokenized-text' },
  styles: `
    :host { white-space: pre-wrap; word-wrap: break-word; font-family: var(--ngxsmk-font-sans); line-height: 1.5; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkChatTokenizedText {
  readonly text = input('');
  readonly tokens = input<{ value: string; label: string }[]>([]);
}
