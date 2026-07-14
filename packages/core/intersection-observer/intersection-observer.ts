import {
  Directive,
  inject,
  output,
  ElementRef,
  DestroyRef,
} from '@angular/core';

@Directive({
  standalone: true,
  selector: '[ngxsmkIntersectionObserver]',
})
export class NgxsmkIntersectionObserver {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);
  readonly intersected = output<boolean>();

  private readonly io: IntersectionObserver;

  constructor() {
    this.io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        this.intersected.emit(entry.isIntersecting);
      }
    });
    this.io.observe(this.el.nativeElement);
    this.destroyRef.onDestroy(() => this.io.disconnect());
  }
}
