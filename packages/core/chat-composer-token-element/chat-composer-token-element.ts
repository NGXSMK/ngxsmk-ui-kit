import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'ngxsmk-chat-composer-token-element',
  template: `{{ label() }}`,
  host: { class: 'ngxsmk-chat-composer-token-element', '[attr.data-variant]': 'variant()' },
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      padding: var(--ngxsmk-space-0-5) var(--ngxsmk-space-2);
      border-radius: var(--ngxsmk-radius-sm);
      font-family: var(--ngxsmk-font-sans);
      font-size: 0.75rem;
      white-space: nowrap;
    }
    :host([data-variant='entity']) {
      background: var(--ngxsmk-color-tertiary-container);
      color: var(--ngxsmk-color-on-tertiary-container);
    }
    :host([data-variant='tool']) {
      background: var(--ngxsmk-color-primary-container);
      color: var(--ngxsmk-color-on-primary-container);
    }
    :host([data-variant='file']) {
      background: var(--ngxsmk-color-surface-variant);
      color: var(--ngxsmk-color-on-surface-variant);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkChatComposerTokenElement {
  readonly label = input('');
  readonly variant = input<'entity' | 'tool' | 'file'>('entity');
}
