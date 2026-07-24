import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  output,
  signal,
} from '@angular/core';

export interface NgxsmkNotificationItem {
  id: string;
  title: string;
  description?: string;
  timestamp: string;
  read?: boolean;
  type?: 'info' | 'success' | 'warning' | 'error';
  avatar?: string;
  actionLabel?: string;
}

/**
 * Notification Center bell toggle button and panel container.
 *
 * ```html
 * <ngxsmk-notification-center [(notifications)]="items" (markAsRead)="onRead($event)" />
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-notification-center',
  template: `
    <!-- TRIGGER BELL BUTTON -->
    <button
      type="button"
      class="ngxsmk-notif__bell-btn"
      [attr.aria-label]="ariaLabel()"
      (click)="toggleOpen()"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
      </svg>

      @if (unreadCount() > 0) {
        <span class="ngxsmk-notif__badge">{{ unreadCount() > 99 ? '99+' : unreadCount() }}</span>
      }
    </button>

    <!-- NOTIFICATION SLIDE PANEL / POPOVER -->
    @if (isOpen()) {
      <div class="ngxsmk-notif__panel">
        <div class="ngxsmk-notif__header">
          <div class="ngxsmk-notif__title-group">
            <h3 class="ngxsmk-notif__title">{{ title() }}</h3>
            @if (unreadCount() > 0) {
              <span class="ngxsmk-notif__pill">{{ unreadCount() }} new</span>
            }
          </div>

          @if (unreadCount() > 0) {
            <button type="button" class="ngxsmk-notif__action-btn" (click)="onMarkAllRead()">
              Mark all read
            </button>
          }
        </div>

        <!-- FILTER TABS -->
        <div class="ngxsmk-notif__tabs">
          <button
            type="button"
            class="ngxsmk-notif__tab"
            [class.ngxsmk-notif__tab--active]="filterMode() === 'all'"
            (click)="filterMode.set('all')"
          >
            All
          </button>
          <button
            type="button"
            class="ngxsmk-notif__tab"
            [class.ngxsmk-notif__tab--active]="filterMode() === 'unread'"
            (click)="filterMode.set('unread')"
          >
            Unread ({{ unreadCount() }})
          </button>
        </div>

        <!-- LIST ITEMS -->
        <div class="ngxsmk-notif__list">
          @if (filteredItems().length === 0) {
            <div class="ngxsmk-notif__empty">
              <span>No notifications to show</span>
            </div>
          } @else {
            @for (item of filteredItems(); track item.id) {
              <div
                class="ngxsmk-notif__item"
                [class.ngxsmk-notif__item--unread]="!item.read"
                role="button"
                tabindex="0"
                (click)="onItemClick(item)"
                (keydown.enter)="onItemClick(item)"
                (keydown.space)="onItemClick(item)"
              >
                <div class="ngxsmk-notif__indicator" [attr.data-type]="item.type || 'info'"></div>

                <div class="ngxsmk-notif__body">
                  <div class="ngxsmk-notif__top">
                    <span class="ngxsmk-notif__item-title">{{ item.title }}</span>
                    <span class="ngxsmk-notif__time">{{ item.timestamp }}</span>
                  </div>

                  @if (item.description) {
                    <p class="ngxsmk-notif__desc">{{ item.description }}</p>
                  }

                  @if (item.actionLabel) {
                    <button
                      type="button"
                      class="ngxsmk-notif__item-action"
                      (click)="onActionClick($event, item)"
                    >
                      {{ item.actionLabel }}
                    </button>
                  }
                </div>
              </div>
            }
          }
        </div>
      </div>
    }
  `,
  host: {
    class: 'ngxsmk-notification-center',
  },
  styles: `
    :host {
      position: relative;
      display: inline-block;
    }

    .ngxsmk-notif__bell-btn {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.5rem;
      height: 2.5rem;
      border: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
      border-radius: var(--ngxsmk-radius-md, 0.375rem);
      background: var(--ngxsmk-color-surface, #ffffff);
      color: var(--ngxsmk-color-on-surface, #09090b);
      cursor: pointer;
      transition:
        background-color 0.15s ease,
        border-color 0.15s ease;
    }

    .ngxsmk-notif__bell-btn:hover {
      background: var(--ngxsmk-color-surface-variant, #f4f4f5);
    }

    .ngxsmk-notif__badge {
      position: absolute;
      top: -0.25rem;
      right: -0.25rem;
      padding: 0.1rem 0.35rem;
      border-radius: var(--ngxsmk-radius-full, 9999px);
      background: var(--ngxsmk-color-error, #ef4444);
      color: #ffffff;
      font-size: 0.65rem;
      font-weight: 700;
      line-height: 1;
      border: 2px solid var(--ngxsmk-color-surface, #ffffff);
    }

    .ngxsmk-notif__panel {
      position: absolute;
      right: 0;
      top: calc(100% + 0.5rem);
      width: 22rem;
      max-height: 28rem;
      background: var(--ngxsmk-color-surface, #ffffff);
      border: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
      border-radius: var(--ngxsmk-radius-lg, 0.5rem);
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.12);
      display: flex;
      flex-direction: column;
      z-index: 100;
      overflow: hidden;
    }

    .ngxsmk-notif__header {
      padding: 0.75rem 1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
    }

    .ngxsmk-notif__title-group {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .ngxsmk-notif__title {
      margin: 0;
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--ngxsmk-color-on-surface, #09090b);
    }

    .ngxsmk-notif__pill {
      font-size: 0.65rem;
      font-weight: 600;
      background: var(--ngxsmk-color-primary-container, #ede9fe);
      color: var(--ngxsmk-color-primary, #7c3aed);
      padding: 0.1rem 0.4rem;
      border-radius: var(--ngxsmk-radius-full, 9999px);
    }

    .ngxsmk-notif__action-btn {
      border: none;
      background: none;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--ngxsmk-color-primary, #7c3aed);
      cursor: pointer;
    }

    .ngxsmk-notif__tabs {
      display: flex;
      padding: 0.25rem 0.75rem;
      background: var(--ngxsmk-color-surface-variant, #f4f4f5);
      gap: 0.25rem;
    }

    .ngxsmk-notif__tab {
      flex: 1;
      padding: 0.25rem 0;
      border: none;
      background: none;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
      cursor: pointer;
      border-radius: var(--ngxsmk-radius-sm, 0.25rem);
      transition:
        background 0.15s ease,
        color 0.15s ease;
    }

    .ngxsmk-notif__tab--active {
      background: var(--ngxsmk-color-surface, #ffffff);
      color: var(--ngxsmk-color-on-surface, #09090b);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }

    .ngxsmk-notif__list {
      flex: 1;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
    }

    .ngxsmk-notif__empty {
      padding: 2rem 1rem;
      text-align: center;
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
      font-size: 0.85rem;
    }

    .ngxsmk-notif__item {
      position: relative;
      display: flex;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      border-bottom: 1px solid var(--ngxsmk-color-outline, #f4f4f5);
      cursor: pointer;
      transition: background 0.15s ease;
    }

    .ngxsmk-notif__item:hover {
      background: color-mix(in srgb, var(--ngxsmk-color-on-surface, #09090b) 4%, transparent);
    }

    .ngxsmk-notif__item--unread {
      background: color-mix(in srgb, var(--ngxsmk-color-primary, #7c3aed) 4%, transparent);
    }

    .ngxsmk-notif__indicator {
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 9999px;
      margin-top: 0.35rem;
      flex-shrink: 0;
      background: var(--ngxsmk-color-primary, #7c3aed);
    }

    .ngxsmk-notif__indicator[data-type='success'] {
      background: var(--ngxsmk-color-success, #16a34a);
    }
    .ngxsmk-notif__indicator[data-type='warning'] {
      background: var(--ngxsmk-color-amber, #f59e0b);
    }
    .ngxsmk-notif__indicator[data-type='error'] {
      background: var(--ngxsmk-color-error, #ef4444);
    }

    .ngxsmk-notif__body {
      flex: 1;
      min-width: 0;
    }

    .ngxsmk-notif__top {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 0.5rem;
    }

    .ngxsmk-notif__item-title {
      font-size: 0.825rem;
      font-weight: 600;
      color: var(--ngxsmk-color-on-surface, #09090b);
    }

    .ngxsmk-notif__time {
      font-size: 0.7rem;
      color: var(--ngxsmk-color-on-surface-variant, #a1a1aa);
    }

    .ngxsmk-notif__desc {
      margin: 0.2rem 0 0;
      font-size: 0.775rem;
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
      line-height: 1.4;
    }

    .ngxsmk-notif__item-action {
      margin-top: 0.4rem;
      padding: 0.2rem 0.5rem;
      border: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
      border-radius: var(--ngxsmk-radius-sm, 0.25rem);
      background: var(--ngxsmk-color-surface, #ffffff);
      font-size: 0.7rem;
      font-weight: 600;
      color: var(--ngxsmk-color-primary, #7c3aed);
      cursor: pointer;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkNotificationCenter {
  /** Notification panel title. Default: 'Notifications'. */
  readonly title = input<string>('Notifications');

  /** Accessible bell trigger button label. */
  readonly ariaLabel = input<string>('Open notification center');

  /** Two-way signal bound array of notifications. */
  readonly notifications = model<NgxsmkNotificationItem[]>([]);

  /** Emits when an item is marked as read. */
  readonly markAsRead = output<string>();

  /** Emits when 'Mark all read' is clicked. */
  readonly markAllRead = output<void>();

  /** Emits when a notification action button is clicked. */
  readonly actionClick = output<{ id: string; action: string }>();

  protected readonly isOpen = signal(false);
  protected readonly filterMode = signal<'all' | 'unread'>('all');

  protected readonly unreadCount = computed(() => {
    return this.notifications().filter((n) => !n.read).length;
  });

  protected readonly filteredItems = computed(() => {
    const list = this.notifications();
    if (this.filterMode() === 'unread') {
      return list.filter((n) => !n.read);
    }
    return list;
  });

  protected toggleOpen(): void {
    this.isOpen.update((v) => !v);
  }

  protected onItemClick(item: NgxsmkNotificationItem): void {
    if (!item.read) {
      this.notifications.update((list) =>
        list.map((n) => (n.id === item.id ? { ...n, read: true } : n)),
      );
      this.markAsRead.emit(item.id);
    }
  }

  protected onMarkAllRead(): void {
    this.notifications.update((list) => list.map((n) => ({ ...n, read: true })));
    this.markAllRead.emit();
  }

  protected onActionClick(event: Event, item: NgxsmkNotificationItem): void {
    event.stopPropagation();
    if (item.actionLabel) {
      this.actionClick.emit({ id: item.id, action: item.actionLabel });
    }
  }
}
