import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  booleanAttribute,
  effect,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';

/**
 * Full-featured chat layout with collapsible sidebar, auto-scroll, scroll-to-bottom
 * FAB, and responsive behavior. Designed for modern AI chat interfaces.
 *
 * ```html
 * <ngxsmk-chat-layout>
 *   <div chatLayoutSidebar>
 *     <ngxsmk-conversation-list ... />
 *   </div>
 *   <div chatLayoutHeader>
 *     <strong>Assistant</strong>
 *   </div>
 *   <ngxsmk-chat-message *ngFor="let msg of messages" [message]="msg">
 *     <ngxsmk-chat-message-bubble>{{ msg.content }}</ngxsmk-chat-message-bubble>
 *   </ngxsmk-chat-message>
 *   <div chatLayoutEmpty>
 *     <p>Start a conversation</p>
 *   </div>
 *   <div chatLayoutTyping *ngIf="isTyping">
 *     <ngxsmk-typing-indicator />
 *   </div>
 *   <div chatLayoutInput>
 *     <ngxsmk-chat-input placeholder="Reply..." />
 *   </div>
 * </ngxsmk-chat-layout>
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-chat-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ngxsmk-chat-layout',
    '[class.ngxsmk-chat-layout--sidebar-open]': 'sidebarOpen()',
    '[class.ngxsmk-chat-layout--sidebar-collapsed]': '!sidebarOpen()',
    '[style.--ngxsmk-chat-sidebar-width]': '_resolvedSidebarWidth()',
  },
  template: `
    <!-- Sidebar backdrop (mobile) -->
    @if (sidebarOpen() && _isMobile()) {
      <div
        class="ngxsmk-chat-layout__backdrop"
        role="button"
        tabindex="0"
        (click)="closeSidebar()"
        (keydown.escape)="closeSidebar()"
        (keydown.enter)="closeSidebar()"
        (keydown.space)="closeSidebar()"
        aria-label="Close sidebar"
      ></div>
    }

    <!-- Sidebar -->
    <aside
      class="ngxsmk-chat-layout__sidebar"
      [class.ngxsmk-chat-layout__sidebar--open]="sidebarOpen()"
    >
      <ng-content select="[chatLayoutSidebar]" />
      <!-- Backward compat: old [sidebar] selector -->
      <ng-content select="[sidebar]" />
    </aside>

    <!-- Main panel -->
    <main class="ngxsmk-chat-layout__main">
      <!-- Header -->
      <header class="ngxsmk-chat-layout__header">
        <button
          class="ngxsmk-chat-layout__toggle"
          type="button"
          (click)="toggleSidebar()"
          [attr.aria-label]="sidebarOpen() ? 'Close sidebar' : 'Open sidebar'"
          [attr.aria-expanded]="sidebarOpen()"
        >
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            @if (sidebarOpen()) {
              <path d="M18 6 6 18M6 6l12 12" />
            } @else {
              <path d="M3 12h18M3 6h18M3 18h18" />
            }
          </svg>
        </button>
        <div class="ngxsmk-chat-layout__header-content">
          <ng-content select="[chatLayoutHeader]" />
          <!-- Backward compat: old [header] selector -->
          <ng-content select="[header]" />
        </div>
      </header>

      <!-- Messages area -->
      <div class="ngxsmk-chat-layout__messages" #messagesContainer>
        <!-- Default content (messages) -->
        <ng-content />

        <!-- Empty state -->
        @if (_hasEmpty()) {
          <div class="ngxsmk-chat-layout__empty">
            <ng-content select="[chatLayoutEmpty]" />
          </div>
        }

        <!-- Typing indicator -->
        @if (_hasTyping()) {
          <div class="ngxsmk-chat-layout__typing">
            <ng-content select="[chatLayoutTyping]" />
          </div>
        }

        <!-- Scroll anchor (bottom sentinel) -->
        <div #scrollAnchor class="ngxsmk-chat-layout__anchor"></div>
      </div>

      <!-- Scroll-to-bottom FAB -->
      @if (showScrollFab()) {
        <button
          class="ngxsmk-chat-layout__fab"
          type="button"
          (click)="scrollToBottom()"
          aria-label="Scroll to bottom"
        >
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
        </button>
      }

      <!-- Input area -->
      <footer class="ngxsmk-chat-layout__input">
        <ng-content select="[chatLayoutInput]" />
        <!-- Backward compat: old [input] selector -->
        <ng-content select="[input]" />
      </footer>
    </main>
  `,
  styles: `
    :host {
      display: grid;
      grid-template-columns: var(--ngxsmk-chat-sidebar-width, 280px) 1fr;
      height: 100vh;
      font-family: var(--ngxsmk-font-sans);
      background: var(--ngxsmk-color-surface);
      color: var(--ngxsmk-color-on-surface);
      overflow: hidden;
      transition: grid-template-columns var(--ngxsmk-duration-normal) var(--ngxsmk-ease-out);
    }

    /* ── Sidebar ── */
    .ngxsmk-chat-layout__sidebar {
      display: flex;
      flex-direction: column;
      border-right: 1px solid var(--ngxsmk-color-outline-variant);
      background: var(--ngxsmk-color-surface-container);
      overflow-y: auto;
      overflow-x: hidden;
      min-width: 0;
    }

    .ngxsmk-chat-layout--sidebar-collapsed .ngxsmk-chat-layout__sidebar {
      display: none;
    }

    /* ── Main ── */
    .ngxsmk-chat-layout__main {
      display: flex;
      flex-direction: column;
      overflow: hidden;
      position: relative;
      min-width: 0;
    }

    /* ── Header ── */
    .ngxsmk-chat-layout__header {
      display: flex;
      align-items: center;
      gap: var(--ngxsmk-space-3);
      padding: var(--ngxsmk-space-3) var(--ngxsmk-space-4);
      border-bottom: 1px solid var(--ngxsmk-color-outline-variant);
      background: var(--ngxsmk-color-surface);
      min-height: 3.5rem;
      flex-shrink: 0;
    }
    .ngxsmk-chat-layout__header-content {
      flex: 1;
      min-width: 0;
      display: flex;
      align-items: center;
      gap: var(--ngxsmk-space-2);
    }

    /* ── Toggle button ── */
    .ngxsmk-chat-layout__toggle {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2rem;
      height: 2rem;
      border: none;
      border-radius: var(--ngxsmk-radius-md);
      background: transparent;
      color: var(--ngxsmk-color-on-surface-variant);
      cursor: pointer;
      flex-shrink: 0;
      transition:
        background var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out),
        color var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out);
    }
    .ngxsmk-chat-layout__toggle:hover {
      background: var(--ngxsmk-color-surface-hover);
      color: var(--ngxsmk-color-on-surface);
    }
    .ngxsmk-chat-layout__toggle:focus-visible {
      outline: 2px solid var(--ngxsmk-color-primary);
      outline-offset: -2px;
    }

    /* ── Messages area ── */
    .ngxsmk-chat-layout__messages {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      position: relative;
    }

    .ngxsmk-chat-layout__empty {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      padding: var(--ngxsmk-space-8);
      color: var(--ngxsmk-color-on-surface-variant);
      text-align: center;
    }

    .ngxsmk-chat-layout__typing {
      padding: var(--ngxsmk-space-2) var(--ngxsmk-space-4);
    }

    .ngxsmk-chat-layout__anchor {
      height: 1px;
      width: 100%;
    }

    /* ── Scroll-to-bottom FAB ── */
    .ngxsmk-chat-layout__fab {
      position: absolute;
      bottom: calc(var(--ngxsmk-chat-input-height, 4rem) + var(--ngxsmk-space-4));
      right: var(--ngxsmk-space-4);
      width: 2.5rem;
      height: 2.5rem;
      border: none;
      border-radius: var(--ngxsmk-radius-full);
      background: var(--ngxsmk-color-primary-container);
      color: var(--ngxsmk-color-on-primary-container);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: var(--ngxsmk-shadow-md);
      z-index: 1;
      transition:
        transform var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out),
        opacity var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out);
      animation: ngxsmk-chat-fab-enter var(--ngxsmk-duration-normal) var(--ngxsmk-ease-out);
    }
    .ngxsmk-chat-layout__fab:hover {
      background: var(--ngxsmk-color-primary);
      color: var(--ngxsmk-color-on-primary);
      transform: scale(1.05);
    }
    .ngxsmk-chat-layout__fab:focus-visible {
      outline: 2px solid var(--ngxsmk-color-primary);
      outline-offset: 2px;
    }

    @keyframes ngxsmk-chat-fab-enter {
      from {
        opacity: 0;
        transform: translateY(8px) scale(0.9);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    /* ── Input area ── */
    .ngxsmk-chat-layout__input {
      padding: var(--ngxsmk-space-3) var(--ngxsmk-space-4);
      border-top: 1px solid var(--ngxsmk-color-outline-variant);
      background: var(--ngxsmk-color-surface);
      flex-shrink: 0;
    }

    /* ── Backdrop (mobile) ── */
    .ngxsmk-chat-layout__backdrop {
      display: none;
    }

    /* ── Mobile ── */
    @media (max-width: 768px) {
      :host {
        grid-template-columns: 1fr;
      }

      .ngxsmk-chat-layout__sidebar {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        z-index: var(--ngxsmk-z-banner);
        width: min(80vw, 320px);
        transform: translateX(-100%);
        transition: transform var(--ngxsmk-duration-normal) var(--ngxsmk-ease-out);
        box-shadow: none;
      }
      .ngxsmk-chat-layout__sidebar--open {
        transform: translateX(0);
        box-shadow: var(--ngxsmk-shadow-xl);
      }

      .ngxsmk-chat-layout__backdrop {
        display: block;
        position: fixed;
        inset: 0;
        z-index: calc(var(--ngxsmk-z-banner) - 1);
        background: rgb(0 0 0 / 0.4);
        animation: ngxsmk-chat-backdrop-in var(--ngxsmk-duration-normal) var(--ngxsmk-ease-out);
      }

      .ngxsmk-chat-layout__fab {
        bottom: calc(var(--ngxsmk-space-16) + var(--ngxsmk-space-4));
      }
    }

    @keyframes ngxsmk-chat-backdrop-in {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  `,
})
export class NgxsmkChatLayout {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);

  // ── Refs ──
  private readonly messagesContainer = viewChild<ElementRef<HTMLElement>>('messagesContainer');
  private readonly scrollAnchor = viewChild<ElementRef<HTMLElement>>('scrollAnchor');

  // ── Content queries (for slot detection) ──
  protected readonly _hasEmpty = signal(false);
  protected readonly _hasTyping = signal(false);

  // ── Inputs ──
  /** Whether the sidebar is open. Two-way bindable. */
  readonly sidebarOpen = input(true, { transform: booleanAttribute });

  /** Sidebar width in px or CSS value. */
  readonly sidebarWidth = input<string | number>(280);

  /** Width when sidebar is collapsed. */
  readonly collapsedWidth = input<number>(0);

  /** Breakpoint (px) below which sidebar auto-collapses. */
  readonly mobileBreakpoint = input<number>(768);

  /** Auto-scroll to bottom when new content is added. */
  readonly autoScroll = input(true, { transform: booleanAttribute });

  /** Distance in px from bottom that counts as "near bottom" for auto-scroll. */
  readonly scrollThreshold = input<number>(150);

  // ── Outputs ──
  /** Emitted when sidebar toggle is clicked. */
  readonly sidebarToggle = output<void>();

  /** Emitted when scroll-to-bottom FAB is clicked. */
  readonly scrollToBottomClick = output<void>();

  // ── Internal state ──
  protected readonly showScrollFab = signal(false);
  protected readonly _isMobile = signal(false);
  protected readonly _resolvedSidebarWidth = signal<string>('280px');

  private _userScrolledUp = false;
  private _resizeObserver: ResizeObserver | null = null;
  private _intersectionObserver: IntersectionObserver | null = null;
  private _lastContentHeight = 0;

  constructor() {
    afterNextRender(() => {
      this._setupResponsive();
      this._setupScrollTracking();
      this._setupAutoScroll();
    });

    // Respond to sidebarOpen changes
    effect(() => {
      const open = this.sidebarOpen();
      const mobile = this._isMobile();
      this._resolvedSidebarWidth.set(
        mobile ? '0px' : open ? `${this.sidebarWidth()}px` : `${this.collapsedWidth()}px`,
      );
    });
  }

  /** Toggle sidebar open/closed. */
  toggleSidebar(): void {
    this.sidebarToggle.emit();
  }

  /** Close sidebar (mobile backdrop click). */
  closeSidebar(): void {
    if (this.sidebarOpen()) {
      this.sidebarToggle.emit();
    }
  }

  /** Scroll the messages area to the bottom. */
  scrollToBottom(): void {
    const container = this.messagesContainer()?.nativeElement;
    if (!container) return;
    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth',
    });
    this._userScrolledUp = false;
    this.showScrollFab.set(false);
    this.scrollToBottomClick.emit();
  }

  // ── Private ──

  private _setupResponsive(): void {
    const mq = window.matchMedia(`(max-width: ${this.mobileBreakpoint()}px)`);
    this._isMobile.set(mq.matches);

    const handler = (e: MediaQueryListEvent | MediaQueryList): void => {
      this._isMobile.set(e.matches);
      // Auto-close sidebar on mobile
      if (e.matches && this.sidebarOpen()) {
        this.sidebarToggle.emit();
      }
    };

    mq.addEventListener('change', handler);
    this.destroyRef.onDestroy(() => mq.removeEventListener('change', handler));
  }

  private _setupScrollTracking(): void {
    const container = this.messagesContainer()?.nativeElement;
    if (!container) return;

    const onScroll = (): void => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

      this._userScrolledUp = distanceFromBottom > this.scrollThreshold();
      this.showScrollFab.set(this._userScrolledUp);
    };

    container.addEventListener('scroll', onScroll, { passive: true });
    this.destroyRef.onDestroy(() => container.removeEventListener('scroll', onScroll));
  }

  private _setupAutoScroll(): void {
    const container = this.messagesContainer()?.nativeElement;
    const anchor = this.scrollAnchor()?.nativeElement;
    if (!container || !anchor) return;

    this._intersectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            // Anchor is visible — we're at the bottom
            this._userScrolledUp = false;
            this.showScrollFab.set(false);
          }
        }
      },
      { root: container, threshold: 0 },
    );

    this._intersectionObserver.observe(anchor);
    this.destroyRef.onDestroy(() => this._intersectionObserver?.disconnect());

    // Auto-scroll on content size changes
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newHeight = entry.borderBoxSize?.[0]?.blockSize ?? entry.target.scrollHeight;
        if (newHeight > this._lastContentHeight && this.autoScroll() && !this._userScrolledUp) {
          // Content grew and we're near bottom — scroll down
          requestAnimationFrame(() => {
            container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
          });
        }
        this._lastContentHeight = newHeight;
      }
    });

    ro.observe(container);
    this._resizeObserver = ro;
    this.destroyRef.onDestroy(() => ro.disconnect());
  }
}
