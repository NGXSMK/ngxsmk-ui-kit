import { Directive, input, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Directive({
  standalone: true,
  selector: '[ngxsmkFocusTrap]',
  host: {
    tabindex: '0',
    '(keydown)': 'onKeydown($event)',
  },
})
export class NgxsmkFocusTrap {
  readonly ngxsmkFocusTrap = input(true);
  private readonly document = inject(DOCUMENT);

  protected onKeydown(e: KeyboardEvent): void {
    if (e.key !== 'Tab' || !this.ngxsmkFocusTrap()) return;
    const focusable = (e.currentTarget as HTMLElement).querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable.length) return;
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (e.shiftKey && this.document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && this.document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
}
