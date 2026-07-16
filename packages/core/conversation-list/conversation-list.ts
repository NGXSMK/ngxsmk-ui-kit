import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';

export interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  updatedAt: Date;
}

@Component({
  standalone: true,
  selector: 'ngxsmk-conversation-list',
  template: `
    <div class="ngxsmk-conversation-list__items">
      @for (conv of conversations(); track conv.id) {
        <button
          type="button"
          class="ngxsmk-conversation-list__item"
          [attr.data-active]="activeId() === conv.id ? '' : null"
          (click)="activeId.set(conv.id)"
        >
          <div class="ngxsmk-conversation-list__title">{{ conv.title }}</div>
          <div class="ngxsmk-conversation-list__preview">{{ conv.lastMessage }}</div>
        </button>
      }
    </div>
  `,
  host: { class: 'ngxsmk-conversation-list' },
  styles: `
    :host {
      display: block;
      font-family: var(--ngxsmk-font-sans);
    }
    .ngxsmk-conversation-list__items {
      display: flex;
      flex-direction: column;
      gap: var(--ngxsmk-space-1);
    }
    .ngxsmk-conversation-list__item {
      display: block;
      width: 100%;
      padding: var(--ngxsmk-space-3) var(--ngxsmk-space-4);
      border: none;
      background: none;
      text-align: left;
      cursor: pointer;
      border-radius: var(--ngxsmk-radius-md);
      transition: background var(--ngxsmk-duration-fast);
    }
    .ngxsmk-conversation-list__item:hover {
      background: var(--ngxsmk-color-surface-hover);
    }
    .ngxsmk-conversation-list__item[data-active] {
      background: var(--ngxsmk-color-primary-container);
    }
    .ngxsmk-conversation-list__title {
      font-size: var(--ngxsmk-text-label-lg-size);
      font-weight: 500;
      color: var(--ngxsmk-color-on-surface);
    }
    .ngxsmk-conversation-list__preview {
      font-size: var(--ngxsmk-text-label-md-size);
      color: var(--ngxsmk-color-on-surface-variant);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkConversationList {
  readonly conversations = input.required<Conversation[]>();
  readonly activeId = model('');
}
