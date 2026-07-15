import { DOCUMENT } from '@angular/common';
import { DestroyRef, Directive, ElementRef, inject, input, signal } from '@angular/core';
import { ngxsmkUniqueId } from '@ngxsmk/core/util';
import { NgxsmkMotionState, playEnter, playExit } from '@ngxsmk/core/animation';

export type NgxsmkTooltipPosition = 'top' | 'bottom' | 'left' | 'right';

const SHOW_DELAY_MS = 150;
const GAP_PX = 8;

const TOOLTIP_MOTION: NgxsmkMotionState = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.96 },
  transition: { duration: 0.14, easing: 'ease-out' },
};

/**
 * Text tooltip on hover/focus.
 *
 * ```html
 * <button ngxsmk-button [ngxsmkTooltip]="'Delete permanently'">Delete</button>
 * ```
 */
@Directive({
  standalone: true,
  selector: '[ngxsmkTooltip]',
  host: {
    '(mouseenter)': 'scheduleShow()',
    '(mouseleave)': 'hide()',
    '(focusin)': 'scheduleShow()',
    '(focusout)': 'hide()',
    '(keydown.escape)': 'hide()',
    '[attr.aria-describedby]': 'visible() ? tooltipId : null',
  },
})
export class NgxsmkTooltip {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly document = inject(DOCUMENT);

  readonly ngxsmkTooltip = input.required<string>();
  readonly tooltipPosition = input<NgxsmkTooltipPosition>('top');

  protected readonly tooltipId = ngxsmkUniqueId('ngxsmk-tooltip');
  protected readonly visible = signal(false);

  private element: HTMLElement | null = null;
  private showTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.hide());
  }

  protected scheduleShow(): void {
    if (this.showTimer || this.visible() || !this.ngxsmkTooltip()) {
      return;
    }
    this.showTimer = setTimeout(() => {
      this.showTimer = null;
      this.show();
    }, SHOW_DELAY_MS);
  }

  protected hide(): void {
    if (this.showTimer) {
      clearTimeout(this.showTimer);
      this.showTimer = null;
    }
    const element = this.element;
    this.element = null;
    this.visible.set(false);
    if (element) {
      void playExit(element, TOOLTIP_MOTION).then(() => element.remove());
    }
  }

  private show(): void {
    const tooltip = this.document.createElement('div');
    tooltip.id = this.tooltipId;
    tooltip.setAttribute('role', 'tooltip');
    tooltip.className = 'ngxsmk-tooltip';
    tooltip.textContent = this.ngxsmkTooltip();
    // Inline styles: the element lives in <body>, outside any component's
    // style scope, so component styles can't reach it.
    Object.assign(tooltip.style, {
      position: 'fixed',
      zIndex: 'var(--ngxsmk-z-tooltip, 1700)',
      maxWidth: '18rem',
      padding: 'var(--ngxsmk-space-1-5) var(--ngxsmk-space-2)',
      borderRadius: 'var(--ngxsmk-radius-md)',
      background: 'var(--ngxsmk-color-on-surface)',
      color: 'var(--ngxsmk-color-surface)',
      fontFamily: 'var(--ngxsmk-font-sans)',
      fontSize: 'var(--ngxsmk-text-label-md-size)',
      lineHeight: 'var(--ngxsmk-text-label-md-line)',
      pointerEvents: 'none',
      boxShadow: 'var(--ngxsmk-shadow-md)',
    });

    this.document.body.appendChild(tooltip);
    this.position(tooltip);
    this.element = tooltip;
    this.visible.set(true);
    void playEnter(tooltip, TOOLTIP_MOTION);
  }

  private position(tooltip: HTMLElement): void {
    const hostRect = this.host.nativeElement.getBoundingClientRect();
    const tipRect = tooltip.getBoundingClientRect();
    const window = this.document.defaultView;

    let top: number;
    let left: number;
    switch (this.tooltipPosition()) {
      case 'bottom':
        top = hostRect.bottom + GAP_PX;
        left = hostRect.left + (hostRect.width - tipRect.width) / 2;
        break;
      case 'left':
        top = hostRect.top + (hostRect.height - tipRect.height) / 2;
        left = hostRect.left - tipRect.width - GAP_PX;
        break;
      case 'right':
        top = hostRect.top + (hostRect.height - tipRect.height) / 2;
        left = hostRect.right + GAP_PX;
        break;
      default:
        top = hostRect.top - tipRect.height - GAP_PX;
        left = hostRect.left + (hostRect.width - tipRect.width) / 2;
    }

    // Clamp inside the viewport.
    const maxLeft = (window?.innerWidth ?? Infinity) - tipRect.width - 4;
    const maxTop = (window?.innerHeight ?? Infinity) - tipRect.height - 4;
    left = Math.min(Math.max(4, left), maxLeft);
    top = Math.min(Math.max(4, top), maxTop);

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
  }
}
