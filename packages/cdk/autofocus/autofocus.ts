import { afterNextRender, booleanAttribute, Directive, ElementRef, inject, input } from '@angular/core';

/**
 * Automatically focuses the host element on render.
 *
 * ```html
 * <input ngxsmkAutofocus />
 * <button [ngxsmkAutofocus]="shouldFocus" [autofocusDelay]="150">Confirm</button>
 * ```
 */
@Directive({
  standalone: true,
  selector: '[ngxsmkAutofocus]',
})
export class NgxsmkAutofocus {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly ngxsmkAutofocus = input(true, { transform: booleanAttribute });
  readonly autofocusDelay = input<number>(0);

  constructor() {
    afterNextRender(() => {
      if (this.ngxsmkAutofocus()) {
        const delay = this.autofocusDelay();
        if (delay > 0) {
          setTimeout(() => this.focusElement(), delay);
        } else {
          this.focusElement();
        }
      }
    });
  }

  private focusElement(): void {
    const el = this.elementRef.nativeElement;
    if (el && typeof el.focus === 'function') {
      el.focus();
    }
  }
}
