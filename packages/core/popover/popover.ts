import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  booleanAttribute,
  computed,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { NgxsmkClickOutside, NgxsmkFocusTrap } from '@ngxsmk/cdk';
import {
  NgxsmkAnimate,
  NgxsmkMotionState,
  playExit,
} from '@ngxsmk/core/animation';

export type NgxsmkPopoverPlacement = 'top' | 'bottom' | 'left' | 'right';
export type NgxsmkPopoverAlign = 'start' | 'center' | 'end';

/**
 * Click-triggered popover anchored to its trigger. Positioning is done entirely
 * in CSS from `data-placement`/`data-align` — there are **no** `getBoundingClientRect`
 * reads, scroll listeners, or portals — so it never thrashes layout and renders
 * identically under SSR. Outside-click and Escape close it; focus is trapped and
 * restored to the trigger.
 *
 * ```html
 * <ngxsmk-popover placement="bottom" align="start">
 *   <button ngxsmkPopoverTrigger>Open</button>
 *   <div>Popover body</div>
 * </ngxsmk-popover>
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-popover',
  imports: [NgxsmkClickOutside, NgxsmkFocusTrap, NgxsmkAnimate],
  template: `
    <div
      class="ngxsmk-popover__trigger"
      tabindex="0"
      role="button"
      [attr.aria-expanded]="open()"
      (click)="toggle()"
      (keydown.enter)="toggle()"
      (keydown.space)="toggle(); $event.preventDefault()"
      (keydown.escape)="close()"
    >
      <ng-content select="[ngxsmkPopoverTrigger]" />
    </div>

    @if (open()) {
      <div
        class="ngxsmk-popover__panel"
        role="dialog"
        [attr.data-placement]="placement()"
        [attr.data-align]="align()"
        [style.--ngxsmk-popover-offset]="offset()"
        [ngxsmkAnimate]="motion()"
        ngxsmkFocusTrap
        [ngxsmkFocusTrapAutoCapture]="true"
        (ngxsmkClickOutside)="onOutside($event)"
        (keydown.escape)="close()"
      >
        <ng-content />
      </div>
    }
  `,
  host: {
    class: 'ngxsmk-popover',
    '[attr.data-open]': 'open() ? "" : null',
  },
  styles: `
    :host {
      display: inline-block;
      position: relative;
      font-family: var(--ngxsmk-font-sans, sans-serif);
    }
    .ngxsmk-popover__trigger { display: inline-flex; }

    .ngxsmk-popover__panel {
      position: absolute;
      z-index: var(--ngxsmk-z-popover, 1500);
      min-width: 12rem;
      max-width: min(20rem, calc(100vw - 2rem));
      padding: var(--ngxsmk-space-4, 1rem);
      border: 1px solid var(--ngxsmk-color-outline, #e2e8f0);
      border-radius: var(--ngxsmk-radius-lg, 12px);
      background: var(--ngxsmk-color-surface, #fff);
      color: var(--ngxsmk-color-on-surface, #0f172a);
      box-shadow: var(--ngxsmk-shadow-lg, 0 10px 30px rgba(0, 0, 0, 0.15));
      font-size: var(--ngxsmk-text-body-sm-size, 0.875rem);
      line-height: var(--ngxsmk-text-body-sm-line, 1.4);
      --ngxsmk-popover-gap: calc(var(--ngxsmk-popover-offset, 8) * 1px);
    }

    /* Placement: which edge the panel hangs off. */
    .ngxsmk-popover__panel[data-placement='bottom'] { top: calc(100% + var(--ngxsmk-popover-gap)); }
    .ngxsmk-popover__panel[data-placement='top'] { bottom: calc(100% + var(--ngxsmk-popover-gap)); }
    .ngxsmk-popover__panel[data-placement='right'] { left: calc(100% + var(--ngxsmk-popover-gap)); top: 0; }
    .ngxsmk-popover__panel[data-placement='left'] { right: calc(100% + var(--ngxsmk-popover-gap)); top: 0; }

    /* Align along the cross axis. */
    .ngxsmk-popover__panel[data-placement='bottom'][data-align='start'],
    .ngxsmk-popover__panel[data-placement='top'][data-align='start'] { left: 0; }
    .ngxsmk-popover__panel[data-placement='bottom'][data-align='center'],
    .ngxsmk-popover__panel[data-placement='top'][data-align='center'] { left: 50%; transform: translateX(-50%); }
    .ngxsmk-popover__panel[data-placement='bottom'][data-align='end'],
    .ngxsmk-popover__panel[data-placement='top'][data-align='end'] { right: 0; }

    .ngxsmk-popover__panel[data-placement='left'][data-align='center'],
    .ngxsmk-popover__panel[data-placement='right'][data-align='center'] { top: 50%; transform: translateY(-50%); }
    .ngxsmk-popover__panel[data-placement='left'][data-align='end'],
    .ngxsmk-popover__panel[data-placement='right'][data-align='end'] { top: auto; bottom: 0; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkPopover {
  readonly open = model(false);
  readonly placement = input<NgxsmkPopoverPlacement>('bottom');
  readonly align = input<NgxsmkPopoverAlign>('center');
  readonly offset = input(8);
  readonly disabled = input(false, { transform: booleanAttribute });
  /** Close when a pointer press lands outside the panel and trigger. */
  readonly closeOnOutsideClick = input(true, { transform: booleanAttribute });
  readonly opened = output<void>();
  readonly closed = output<void>();

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly closing = signal(false);

  /** Slide direction follows the placement; opacity-only keeps centering intact. */
  protected readonly motion = computed<NgxsmkMotionState>(() => {
    const delta = 6;
    const from: Record<NgxsmkPopoverPlacement, Record<string, number>> = {
      bottom: { y: -delta },
      top: { y: delta },
      left: { x: delta },
      right: { x: -delta },
    };
    const shift = from[this.placement()];
    return {
      initial: { opacity: 0, ...shift },
      animate: { opacity: 1, x: 0, y: 0 },
      exit: { opacity: 0, ...shift },
      transition: { duration: 0.15, easing: 'ease-out' },
    };
  });

  toggle(): void {
    if (this.disabled()) return;
    if (this.open()) {
      this.close();
    } else {
      this.show();
    }
  }

  show(): void {
    if (this.disabled() || this.open()) return;
    this.open.set(true);
    this.opened.emit();
  }

  close(): void {
    if (!this.open() || this.closing()) return;
    const panel = this.host.nativeElement.querySelector<HTMLElement>(
      '.ngxsmk-popover__panel',
    );
    if (!panel) {
      this.finishClose();
      return;
    }
    this.closing.set(true);
    void playExit(panel, this.motion()).then(() => this.finishClose());
  }

  private finishClose(): void {
    this.closing.set(false);
    this.open.set(false);
    this.closed.emit();
  }

  protected onOutside(event: Event): void {
    if (!this.closeOnOutsideClick()) return;
    // Ignore presses on the trigger — the trigger's own click handles toggle.
    const trigger = this.host.nativeElement.querySelector(
      '.ngxsmk-popover__trigger',
    );
    if (trigger?.contains(event.target as Node)) return;
    this.close();
  }
}
