import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { createPresence } from '@ngxsmk/cdk';
import { NgxsmkAnimate, NgxsmkMotionState, playExit } from '@ngxsmk/core/animation';

/**
 * Hover / focus card that reveals rich content next to a trigger.
 *
 * ```html
 * <ngxsmk-hover-card>
 *   <a ngxsmkHoverCardTrigger href="#">@ngxsmk</a>
 *   <div ngxsmkHoverCardContent>Profile summary…</div>
 * </ngxsmk-hover-card>
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-hover-card',
  template: `
    <div
      class="ngxsmk-hover-card__trigger"
      (mouseenter)="onTriggerEnter()"
      (mouseleave)="onTriggerLeave()"
      (focusin)="onTriggerEnter()"
      (focusout)="onTriggerLeave()"
    >
      <ng-content select="[ngxsmkHoverCardTrigger]" />
    </div>
    @if (visible()) {
      <div
        class="ngxsmk-hover-card__popover"
        [ngxsmkAnimate]="HOVER_CARD_MOTION"
        (mouseenter)="onPopoverEnter()"
        (mouseleave)="onPopoverLeave()"
      >
        <ng-content />
      </div>
    }
  `,
  host: { class: 'ngxsmk-hover-card' },
  imports: [NgxsmkAnimate],
  styles: `
    :host {
      display: inline-block;
      position: relative;
      font-family: var(--ngxsmk-font-sans);
    }

    .ngxsmk-hover-card__trigger {
      display: inline-flex;
    }

    .ngxsmk-hover-card__popover {
      position: absolute;
      top: calc(100% + var(--ngxsmk-space-1));
      left: 50%;
      transform: translateX(-50%);
      z-index: var(--ngxsmk-z-popover, 1500);
      min-width: 14rem;
      max-width: 20rem;
      padding: var(--ngxsmk-space-4);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-lg);
      background: var(--ngxsmk-color-surface);
      color: var(--ngxsmk-color-on-surface);
      box-shadow: var(--ngxsmk-shadow-lg);
      font-size: var(--ngxsmk-text-body-sm-size);
      line-height: var(--ngxsmk-text-body-sm-line);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkHoverCard {
  readonly openDelay = input(300);
  readonly closeDelay = input(150);

  protected readonly visible = signal(false);

  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly presence = createPresence();
  protected readonly closing = this.presence.isClosing;

  /** Plays the exit animation, then flips `visible` to false (reduced-motion safe). */
  hide(): void {
    if (!this.visible() || this.presence.isClosing()) return;
    const el = this.host.nativeElement.querySelector(
      '.ngxsmk-hover-card__popover',
    ) as HTMLElement | null;
    void this.presence
      .close(() => playExit(el ?? this.host.nativeElement, this.HOVER_CARD_MOTION))
      .then((settled) => {
        if (settled) this.visible.set(false);
      });
  }

  /** Opacity-only so the popover's `translateX(-50%)` centering is preserved. */
  protected readonly HOVER_CARD_MOTION: NgxsmkMotionState = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.15, easing: 'ease-out' },
  };

  private openTimer: ReturnType<typeof setTimeout> | null = null;
  private closeTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.clearTimers();
      this.presence.forceClose();
    });
  }

  protected onTriggerEnter(): void {
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }
    if (this.presence.isClosing()) {
      this.presence.open();
      this.visible.set(true);
      return;
    }
    if (!this.openTimer && !this.visible()) {
      this.openTimer = setTimeout(() => {
        this.openTimer = null;
        this.presence.open();
        this.visible.set(true);
      }, this.openDelay());
    }
  }

  protected onTriggerLeave(): void {
    if (this.openTimer) {
      clearTimeout(this.openTimer);
      this.openTimer = null;
    }
    this.scheduleClose();
  }

  protected onPopoverEnter(): void {
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }
  }

  protected onPopoverLeave(): void {
    this.scheduleClose();
  }

  private scheduleClose(): void {
    if (this.closeTimer) return;
    this.closeTimer = setTimeout(() => {
      this.closeTimer = null;
      this.hide();
    }, this.closeDelay());
  }

  private clearTimers(): void {
    if (this.openTimer) {
      clearTimeout(this.openTimer);
      this.openTimer = null;
    }
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }
  }
}
