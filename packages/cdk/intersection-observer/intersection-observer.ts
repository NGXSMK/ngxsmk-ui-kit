import { DestroyRef, Directive, ElementRef, inject, input, output, effect } from '@angular/core';

/**
 * Monitors the visibility of an element relative to the viewport or a parent container.
 *
 * ```html
 * <div [ngxsmkIntersectionObserver] (intersecting)="onIntersect($event)">…</div>
 * ```
 */
@Directive({
  standalone: true,
  selector: '[ngxsmkIntersectionObserver]',
})
export class NgxsmkIntersectionObserver {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  readonly rootMargin = input<string>('0px');
  readonly threshold = input<number | number[]>(0);

  readonly intersecting = output<boolean>();
  readonly intersection = output<IntersectionObserverEntry>();

  private observer: IntersectionObserver | null = null;

  constructor() {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return;
    }

    effect(() => {
      this.cleanup();

      const options = {
        rootMargin: this.rootMargin(),
        threshold: this.threshold(),
      };

      this.observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          this.intersecting.emit(entry.isIntersecting);
          this.intersection.emit(entry);
        }
      }, options);

      this.observer.observe(this.elementRef.nativeElement);
    });

    this.destroyRef.onDestroy(() => {
      this.cleanup();
    });
  }

  private cleanup(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}
