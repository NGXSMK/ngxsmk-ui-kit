import { DestroyRef, Directive, ElementRef, inject, input, output } from '@angular/core';

/**
 * Emits when the host element's dimensions change.
 *
 * ```html
 * <div [ngxsmkResizeObserver] (resize)="onResize($event)">…</div>
 * ```
 */
@Directive({
  standalone: true,
  selector: '[ngxsmkResizeObserver]',
})
export class NgxsmkResizeObserver {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  readonly debounceMs = input<number>(0);
  readonly resize = output<ResizeObserverEntry>();

  private observer: ResizeObserver | null = null;
  private timeoutId: any = null;

  constructor() {
    if (typeof window === 'undefined' || !('ResizeObserver' in window)) {
      return;
    }

    this.observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) {
        return;
      }

      const debounce = this.debounceMs();
      if (debounce > 0) {
        if (this.timeoutId) {
          clearTimeout(this.timeoutId);
        }
        this.timeoutId = setTimeout(() => {
          this.resize.emit(entry);
        }, debounce);
      } else {
        this.resize.emit(entry);
      }
    });

    this.observer.observe(this.elementRef.nativeElement);

    this.destroyRef.onDestroy(() => {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }
      if (this.observer) {
        this.observer.disconnect();
      }
    });
  }
}
