import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  untracked,
} from '@angular/core';

export type PullToRefreshStatus = 'idle' | 'pulling' | 'ready' | 'refreshing';

function resistedDistance(distance: number, maxPull: number): number {
  return maxPull * (1 - Math.exp(-Math.max(0, distance) / maxPull));
}

/**
 * Native-feeling pull-to-refresh container with drag resistance, threshold
 * feedback, and async refresh handling. Supports both touch and pointer
 * events.
 *
 * ```html
 * <ngxsmk-pull-to-refresh [pullToRefresh]="onRefresh">
 *   <div class="content">...</div>
 * </ngxsmk-pull-to-refresh>
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-pull-to-refresh',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.overflow-y]': '"auto"',
    '[style.overscroll-behavior]': '"contain"',
    '[style.position]': '"relative"',
    '[class.ngxsmk-ptr--grabbing]': 'status() === "pulling" || status() === "ready"',
    '[class.ngxsmk-ptr--disabled]': 'disabled()',
    '[class.ngxsmk-ptr--refreshing]': 'status() === "refreshing"',
    '[attr.aria-busy]': 'status() === "refreshing"',
    '[attr.data-state]': 'status()',
  },
  styles: `
    :host {
      display: block;
      position: relative;
      overflow-y: auto;
      overscroll-behavior: contain;
    }
    :host.ngxsmk-ptr--grabbing {
      cursor: grabbing;
      user-select: none;
    }
    :host.ngxsmk-ptr--disabled,
    :host.ngxsmk-ptr--refreshing {
      cursor: default;
    }

    .ngxsmk-ptr__indicator {
      position: absolute;
      inset-inline: 0;
      top: 0;
      z-index: 20;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 2px;
      pointer-events: none;
      font-size: 11px;
      font-weight: var(--ngxsmk-font-weight-medium, 500);
      color: var(--ngxsmk-color-on-surface-variant);
    }

    .ngxsmk-ptr__spinner {
      width: 36px;
      height: 36px;
    }

    .ngxsmk-ptr__label {
      min-width: 96px;
      text-align: center;
      white-space: nowrap;
    }

    .ngxsmk-ptr__indicator path,
    .ngxsmk-ptr__indicator circle,
    .ngxsmk-ptr__indicator rect {
      transition: opacity var(--ngxsmk-duration-normal, 150ms);
    }

    .ngxsmk-ptr__content {
      position: relative;
      z-index: 10;
      min-height: 100%;
      will-change: transform;
      transition: transform 200ms cubic-bezier(0.2, 0, 0, 1);
    }
  `,
  template: `
    <div
      class="ngxsmk-ptr__indicator"
      [style.opacity]="indicatorOpacity()"
      [style.transform]="'translateY(' + indicatorTranslate() + 'px)'"
      aria-live="polite"
      aria-atomic="true"
    >
      <svg class="ngxsmk-ptr__spinner" viewBox="0 0 36 36">
        <path
          d="M18 2.5a15.5 15.5 0 0 1 12.7 6.6"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          [style.opacity]="status() === 'ready' || status() === 'refreshing' ? 1 : 0"
        />
        <circle
          cx="31.3"
          cy="10.2"
          r="2.2"
          fill="currentColor"
          [style.opacity]="status() === 'ready' || status() === 'refreshing' ? 1 : 0"
        />
        <rect x="7" y="7" width="22" height="22" rx="9" fill="currentColor" />
        <circle cx="14.2" cy="16" r="1.45" fill="var(--ngxsmk-color-surface)" />
        <circle cx="21.8" cy="16" r="1.45" fill="var(--ngxsmk-color-surface)" />
        <path
          d="M14.5 21h7"
          fill="none"
          stroke="var(--ngxsmk-color-surface)"
          stroke-width="1.5"
          stroke-linecap="round"
          [style.opacity]="status() === 'ready' || status() === 'refreshing' ? 0 : 1"
        />
        <path
          d="M14 20.5c1 2.4 7 2.4 8 0"
          fill="none"
          stroke="var(--ngxsmk-color-surface)"
          stroke-width="1.5"
          stroke-linecap="round"
          [style.opacity]="status() === 'ready' ? 1 : 0"
        />
        <circle
          cx="18"
          cy="21"
          r="1.6"
          fill="var(--ngxsmk-color-surface)"
          [style.opacity]="status() === 'refreshing' ? 1 : 0"
        />
      </svg>
      <span class="ngxsmk-ptr__label" [style.opacity]="labelOpacity()">{{ label() }}</span>
    </div>

    <div class="ngxsmk-ptr__content" [style.transform]="'translateY(' + contentOffset() + 'px)'">
      <ng-content />
    </div>
  `,
})
export class NgxsmkPullToRefresh {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);

  /** Callback when the pull threshold is exceeded and the user releases. */
  readonly pullToRefresh = input.required<() => void | Promise<void>>();

  /** Whether a refresh is in progress (externally managed). */
  readonly refreshing = input<boolean>(false);

  /** Disable pull-to-refresh. */
  readonly disabled = input<boolean>(false);

  /** Resisted pull distance in px required to trigger refresh. */
  readonly pullThreshold = input<number>(76);

  /** Maximum resisted pull distance in px. */
  readonly maxPull = input<number>(132);

  /** Content offset in px while refreshing. */
  readonly holdDistance = input<number>(68);

  /** Label shown while pulling. */
  readonly pullingLabel = input<string>('Pull to refresh');

  /** Label shown when threshold is reached. */
  readonly releaseLabel = input<string>('Release to refresh');

  /** Label shown during refresh. */
  readonly refreshingLabel = input<string>('Refreshing');

  /** Animation mode: `'css'` (default) or `'motion'` (motion.dev animate). */
  readonly ptrAnimation = input<'css' | 'motion'>('css');

  /** Snap-back duration in seconds. Default `0.2`. */
  readonly ptrDuration = input<number>(0.2);

  /** Easing name or cubic-bezier array. Default `'ease-out'`. */
  readonly ptrEase = input<string | number[]>('ease-out');

  /** Emits the current status. */
  readonly statusChange = output<PullToRefreshStatus>();

  readonly status = signal<PullToRefreshStatus>('idle');
  private readonly _contentOffset = signal(0);
  readonly contentOffset = this._contentOffset.asReadonly();
  private readonly _isRefreshing = signal(false);

  readonly indicatorOpacity = computed(() => {
    const offset = this.contentOffset();
    const threshold = this.pullThreshold();
    if (offset <= 0) return 0;
    if (offset >= threshold) return 1;
    return Math.min(offset / threshold, 1) * 0.8 + 0.2;
  });

  readonly indicatorTranslate = computed(() => {
    const offset = this.contentOffset();
    return Math.min(offset * 0.6, 20);
  });

  readonly labelOpacity = computed(() => {
    const offset = this.contentOffset();
    return offset > 10 ? Math.min(offset / this.pullThreshold(), 1) : 0;
  });

  readonly label = computed(() => {
    const s = this.status();
    if (s === 'refreshing') return this.refreshingLabel();
    if (s === 'ready') return this.releaseLabel();
    return this.pullingLabel();
  });

  private gesture = { active: false, startX: 0, startY: 0, pointerId: -1 };
  private currentY = 0;

  constructor() {
    effect(() => {
      const ext = this.refreshing();
      untracked(() => {
        this._isRefreshing.set(ext);
        if (ext) {
          this.status.set('refreshing');
          this._contentOffset.set(Math.min(this.holdDistance(), this.pullThreshold()));
        } else if (this.status() === 'refreshing') {
          this.status.set('idle');
          this._contentOffset.set(0);
        }
      });
    });

    effect(() => {
      const s = this.status();
      untracked(() => this.statusChange.emit(s));
    });

    afterNextRender(() => this.setupListeners());
  }

  private setupListeners(): void {
    const nativeEl = this.el.nativeElement;

    const onTouchStart = (e: TouchEvent): void => {
      if (
        e.touches.length !== 1 ||
        nativeEl.scrollTop > 0 ||
        this.disabled() ||
        this._isRefreshing()
      )
        return;
      const t = e.touches[0];
      this.gesture = { active: true, startX: t.clientX, startY: t.clientY, pointerId: -1 };
    };

    const onTouchMove = (e: TouchEvent): void => {
      if (!this.gesture.active) return;
      const t = e.touches[0];
      if (!t) return;
      const dx = t.clientX - this.gesture.startX;
      const dy = t.clientY - this.gesture.startY;
      if (nativeEl.scrollTop > 0 || dy < 0) {
        this.gesture.active = false;
        return;
      }
      if (Math.abs(dx) > dy) return;
      e.preventDefault();
      this.updatePull(dy);
    };

    const onTouchEnd = (): void => {
      if (this.gesture.active) this.finishPull();
    };

    nativeEl.addEventListener('touchstart', onTouchStart, { passive: true });
    nativeEl.addEventListener('touchmove', onTouchMove, { passive: false });
    nativeEl.addEventListener('touchend', onTouchEnd);
    nativeEl.addEventListener('touchcancel', onTouchEnd);

    const onPointerDown = (e: PointerEvent): void => {
      if (
        e.pointerType === 'touch' ||
        e.button !== 0 ||
        nativeEl.scrollTop > 0 ||
        this.disabled() ||
        this._isRefreshing()
      )
        return;
      nativeEl.setPointerCapture(e.pointerId);
      this.gesture = { active: true, startX: e.clientX, startY: e.clientY, pointerId: e.pointerId };
    };

    const onPointerMove = (e: PointerEvent): void => {
      if (!this.gesture.active || this.gesture.pointerId !== e.pointerId) return;
      const dx = e.clientX - this.gesture.startX;
      const dy = e.clientY - this.gesture.startY;
      if (dy < 0 || Math.abs(dx) > dy) return;
      e.preventDefault();
      this.updatePull(dy);
    };

    const onPointerUp = (e: PointerEvent): void => {
      if (this.gesture.pointerId === e.pointerId) this.finishPull();
    };

    nativeEl.addEventListener('pointerdown', onPointerDown);
    nativeEl.addEventListener('pointermove', onPointerMove);
    nativeEl.addEventListener('pointerup', onPointerUp);
    nativeEl.addEventListener('pointercancel', onPointerUp);

    this.destroyRef.onDestroy(() => {
      nativeEl.removeEventListener('touchstart', onTouchStart);
      nativeEl.removeEventListener('touchmove', onTouchMove);
      nativeEl.removeEventListener('touchend', onTouchEnd);
      nativeEl.removeEventListener('touchcancel', onTouchEnd);
      nativeEl.removeEventListener('pointerdown', onPointerDown);
      nativeEl.removeEventListener('pointermove', onPointerMove);
      nativeEl.removeEventListener('pointerup', onPointerUp);
      nativeEl.removeEventListener('pointercancel', onPointerUp);
    });
  }

  private updatePull(distance: number): void {
    if (this.disabled() || this._isRefreshing()) return;
    const pullLimit = Math.max(this.maxPull(), this.pullThreshold() + 24);
    const next = resistedDistance(distance, pullLimit);
    this.currentY = next;
    this._contentOffset.set(next);
    this.status.set(next >= this.pullThreshold() ? 'ready' : 'pulling');
  }

  private finishPull(): void {
    const shouldRefresh =
      this.currentY >= this.pullThreshold() && !this.disabled() && !this._isRefreshing();
    this.gesture = { active: false, startX: 0, startY: 0, pointerId: -1 };
    if (shouldRefresh) {
      void this.runRefresh();
    } else {
      this.status.set('idle');
      this._contentOffset.set(0);
    }
  }

  private async runRefresh(): Promise<void> {
    if (this.disabled() || this._isRefreshing()) return;
    this._isRefreshing.set(true);
    this.status.set('refreshing');
    this._contentOffset.set(Math.min(this.holdDistance(), this.pullThreshold()));
    try {
      await this.pullToRefresh()();
    } finally {
      this._isRefreshing.set(false);
      this.status.set('idle');
      this._contentOffset.set(0);
    }
  }
}
