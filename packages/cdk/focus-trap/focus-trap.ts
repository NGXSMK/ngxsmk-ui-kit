import {
  DOCUMENT,
  DestroyRef,
  Directive,
  ElementRef,
  afterNextRender,
  booleanAttribute,
  inject,
  input,
} from '@angular/core';
import { getFocusable } from '@ngxsmk/cdk/focusable';

/**
 * Traps Tab/Shift+Tab focus cycling inside the host element while active.
 * With `ngxsmkFocusTrapAutoCapture`, moves focus into the trap on init and
 * restores the previously focused element on destroy.
 */
@Directive({
  selector: '[ngxsmkFocusTrap]',
  host: {
    '(keydown)': 'onKeydown($event)',
  },
})
export class NgxsmkFocusTrap {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly document = inject(DOCUMENT);

  /** Set to `false` to disable the trap without removing the directive. */
  readonly ngxsmkFocusTrap = input(true, {
    transform: (v: unknown) => v === '' || v === true || v === 'true',
  });

  /** Focus the first focusable child on init; restore focus on destroy. */
  readonly ngxsmkFocusTrapAutoCapture = input(false, {
    transform: booleanAttribute,
  });

  constructor() {
    const previouslyFocused = this.document.activeElement as HTMLElement | null;

    afterNextRender(() => {
      if (this.ngxsmkFocusTrapAutoCapture()) {
        const focusable = getFocusable(this.host.nativeElement);
        (focusable[0] ?? this.host.nativeElement).focus();
      }
    });

    inject(DestroyRef).onDestroy(() => {
      if (this.ngxsmkFocusTrapAutoCapture()) {
        previouslyFocused?.focus?.();
      }
    });
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Tab' || !this.ngxsmkFocusTrap()) {
      return;
    }
    const focusable = getFocusable(this.host.nativeElement);
    if (focusable.length === 0) {
      event.preventDefault();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = this.document.activeElement;

    if (event.shiftKey && (active === first || active === this.host.nativeElement)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }
}
