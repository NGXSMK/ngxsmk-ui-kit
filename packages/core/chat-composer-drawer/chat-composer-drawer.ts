import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  output,
} from '@angular/core';
import { NgxsmkScrollLock } from '@ngxsmk/cdk';

@Component({
  standalone: true,
  selector: 'ngxsmk-chat-composer-drawer',
  template: `
    @if (open()) {
      <div class="ngxsmk-chat-composer-drawer__root">
        <!-- eslint-disable-next-line @angular-eslint/template/click-events-have-key-events, @angular-eslint/template/interactive-supports-focus -->
        <div class="ngxsmk-chat-composer-drawer__overlay" (click)="close()"></div>
        <div
          class="ngxsmk-chat-composer-drawer__panel"
          role="dialog"
          aria-modal="true"
          aria-label="Composer"
        >
          <button
            type="button"
            class="ngxsmk-chat-composer-drawer__close"
            aria-label="Close composer"
            (click)="close()"
          >
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
              <path
                d="M4 4l8 8M12 4l-8 8"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              />
            </svg>
          </button>
          <div class="ngxsmk-chat-composer-drawer__body">
            <ng-content />
          </div>
        </div>
      </div>
    }
  `,
  host: {
    class: 'ngxsmk-chat-composer-drawer',
    '(document:keydown.escape)': 'onEscape()',
  },
  styles: `
    :host {
      display: block;
    }

    .ngxsmk-chat-composer-drawer__root {
      position: fixed;
      inset: 0;
      z-index: var(--ngxsmk-z-modal, 1400);
      display: flex;
      align-items: flex-end;
    }

    .ngxsmk-chat-composer-drawer__overlay {
      position: absolute;
      inset: 0;
      background: var(--ngxsmk-color-backdrop, rgb(0 0 0 / 0.5));
      animation: ngxsmk-composer-drawer-fade 0.2s ease both;
    }

    .ngxsmk-chat-composer-drawer__panel {
      position: relative;
      width: 100%;
      max-height: var(--ngxsmk-composer-drawer-height, 50vh);
      display: flex;
      flex-direction: column;
      background: var(--ngxsmk-color-surface);
      color: var(--ngxsmk-color-on-surface);
      font-family: var(--ngxsmk-font-sans);
      border: 1px solid var(--ngxsmk-color-outline-variant);
      border-radius: var(--ngxsmk-radius-lg) var(--ngxsmk-radius-lg) 0 0;
      box-shadow: var(--ngxsmk-shadow-xl);
      z-index: 1;
      animation: ngxsmk-composer-drawer-in 0.22s var(--ngxsmk-ease-out, ease) both;
    }

    .ngxsmk-chat-composer-drawer__close {
      position: absolute;
      top: var(--ngxsmk-space-3);
      right: var(--ngxsmk-space-3);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1.75rem;
      height: 1.75rem;
      padding: 0;
      border: none;
      border-radius: var(--ngxsmk-radius-md);
      background: transparent;
      color: var(--ngxsmk-color-on-surface-variant);
      cursor: pointer;
    }

    .ngxsmk-chat-composer-drawer__close:hover {
      background: var(--ngxsmk-color-surface-hover);
      color: var(--ngxsmk-color-on-surface);
    }

    .ngxsmk-chat-composer-drawer__close:focus-visible {
      outline: 2px solid var(--ngxsmk-color-ring);
      outline-offset: 1px;
    }

    .ngxsmk-chat-composer-drawer__body {
      flex: 1;
      overflow-y: auto;
      padding: var(--ngxsmk-space-6);
      font-size: var(--ngxsmk-text-body-md-size);
      line-height: var(--ngxsmk-text-body-md-line);
    }

    @keyframes ngxsmk-composer-drawer-fade {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    @keyframes ngxsmk-composer-drawer-in {
      from {
        transform: translateY(100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkChatComposerDrawer {
  readonly open = input(false);
  readonly closed = output<void>();

  private readonly scrollLock = inject(NgxsmkScrollLock);
  private locked = false;

  constructor() {
    effect(() => {
      this.setLocked(this.open());
    });

    inject(DestroyRef).onDestroy(() => this.setLocked(false));
  }

  protected onEscape(): void {
    if (this.open()) {
      this.close();
    }
  }

  protected close(): void {
    this.closed.emit();
    this.setLocked(false);
  }

  private setLocked(locked: boolean): void {
    if (locked === this.locked) return;
    this.locked = locked;
    if (locked) {
      this.scrollLock.lock();
    } else {
      this.scrollLock.unlock();
    }
  }
}
