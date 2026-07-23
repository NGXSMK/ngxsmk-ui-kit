import { ChangeDetectionStrategy, Component, output } from '@angular/core';

/**
 * Floating scroll-to-bottom button for chat layouts. Positioned absolutely
 * within a relatively-positioned parent. Works with `NgxsmkChatLayout`'s
 * built-in FAB or can be used standalone.
 *
 * ```html
 * <div style="position:relative; height:100%">
 *   <ngxsmk-chat-layout-scroll-button (scrolled)="scrollToBottom()" />
 * </div>
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-chat-layout-scroll-button',
  template: `
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      stroke-width="2.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M12 5v14M19 12l-7 7-7-7" />
    </svg>
  `,
  host: {
    class: 'ngxsmk-chat-layout-scroll-button',
    '(click)': 'scrolled.emit()',
    role: 'button',
    tabindex: '0',
    '[attr.aria-label]': '"Scroll to bottom"',
  },
  styles: `
    :host {
      position: absolute;
      bottom: var(--ngxsmk-space-4);
      right: var(--ngxsmk-space-4);
      width: 2.5rem;
      height: 2.5rem;
      border-radius: var(--ngxsmk-radius-full);
      background: var(--ngxsmk-color-primary-container);
      color: var(--ngxsmk-color-on-primary-container);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: var(--ngxsmk-shadow-md);
      transition: background var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out),
                  color var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out),
                  transform var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out);
    }
    :host(:hover) {
      background: var(--ngxsmk-color-primary);
      color: var(--ngxsmk-color-on-primary);
      transform: scale(1.05);
    }
    :host(:focus-visible) {
      outline: 2px solid var(--ngxsmk-color-primary);
      outline-offset: 2px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkChatLayoutScrollButton {
  readonly scrolled = output<void>();
}
