import {
  DOCUMENT,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  output,
} from '@angular/core';

/**
 * Emits when a pointer press lands outside the host element.
 *
 * ```html
 * <div class="menu" (ngxsmkClickOutside)="close()">…</div>
 * ```
 */
@Directive({
  selector: '[ngxsmkClickOutside]',
})
export class NgxsmkClickOutside {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly ngxsmkClickOutside = output<Event>();

  constructor() {
    const document = inject(DOCUMENT);
    const destroyRef = inject(DestroyRef);

    const onPointerDown = (event: Event) => {
      const target = event.target as Node | null;
      if (target && !this.host.nativeElement.contains(target)) {
        this.ngxsmkClickOutside.emit(event);
      }
    };

    // Capture phase so stopped propagation inside other widgets can't
    // swallow the outside press.
    document.addEventListener('pointerdown', onPointerDown, true);
    destroyRef.onDestroy(() =>
      document.removeEventListener('pointerdown', onPointerDown, true),
    );
  }
}
