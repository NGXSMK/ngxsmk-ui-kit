import { ChangeDetectionStrategy, Component, output } from '@angular/core';

@Component({
  selector: 'ngxsmk-chat-layout-scroll-button',
  template: `↓`,
  host: {
    class: 'ngxsmk-chat-layout-scroll-button',
    '(click)': 'scrolled.emit()',
    role: 'button',
    tabindex: '0',
    '[attr.aria-label]': '"Scroll to bottom"',
  },
  styles: `
    :host { position: absolute; bottom: var(--ngxsmk-space-4); right: var(--ngxsmk-space-4); width: 2.5rem; height: 2.5rem; border-radius: var(--ngxsmk-radius-full); background: var(--ngxsmk-color-primary-container); color: var(--ngxsmk-color-on-primary-container); display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: var(--ngxsmk-shadow-md); font-size: 1.125rem; }
    :host(:hover) { background: var(--ngxsmk-color-primary); color: var(--ngxsmk-color-on-primary); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkChatLayoutScrollButton {
  readonly scrolled = output<void>();
}
