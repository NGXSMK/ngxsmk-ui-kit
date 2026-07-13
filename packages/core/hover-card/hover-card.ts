import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  signal,
} from '@angular/core';

@Component({
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
        (mouseenter)="onPopoverEnter()"
        (mouseleave)="onPopoverLeave()"
      >
        <ng-content />
      </div>
    }
  `,
  host: { class: 'ngxsmk-hover-card' },
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

  private openTimer: ReturnType<typeof setTimeout> | null = null;
  private closeTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.clearTimers();
    });
  }

  protected onTriggerEnter(): void {
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }
    if (!this.openTimer && !this.visible()) {
      this.openTimer = setTimeout(() => {
        this.openTimer = null;
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
      this.visible.set(false);
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
