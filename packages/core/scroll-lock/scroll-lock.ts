import { Directive, inject, input, effect, DestroyRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Directive({
  standalone: true,
  selector: '[ngxsmkScrollLock]',
})
export class NgxsmkScrollLock {
  readonly ngxsmkScrollLock = input(false);
  private readonly doc = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    effect(() => {
      this.doc.body.style.overflow = this.ngxsmkScrollLock() ? 'hidden' : '';
    });
    this.destroyRef.onDestroy(() => {
      this.doc.body.style.overflow = '';
    });
  }
}
