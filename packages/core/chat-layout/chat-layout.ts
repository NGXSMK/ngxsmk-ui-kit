import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'ngxsmk-chat-layout',
  template: `
    <div class="ngxsmk-chat-layout__sidebar"><ng-content select="[sidebar]" /></div>
    <div class="ngxsmk-chat-layout__main">
      <div class="ngxsmk-chat-layout__header"><ng-content select="[header]" /></div>
      <div class="ngxsmk-chat-layout__body"><ng-content /></div>
      <div class="ngxsmk-chat-layout__input"><ng-content select="[input]" /></div>
    </div>
  `,
  host: { class: 'ngxsmk-chat-layout' },
  styles: `
    :host {
      display: grid;
      grid-template-columns: auto 1fr;
      height: 100vh;
      font-family: var(--ngxsmk-font-sans);
      background: var(--ngxsmk-color-surface);
    }
    .ngxsmk-chat-layout__main {
      display: flex;
      flex-direction: column;
      overflow: hidden;
      position: relative;
    }
    .ngxsmk-chat-layout__body {
      flex: 1;
      overflow-y: auto;
    }
    @media (max-width: 768px) {
      :host {
        grid-template-columns: 1fr;
      }
      .ngxsmk-chat-layout__sidebar {
        width: 100%;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkChatLayout {
  readonly sidebar = input(false);
}
