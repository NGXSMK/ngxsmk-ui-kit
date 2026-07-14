import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
  ElementRef,
  DestroyRef,
} from '@angular/core';

@Component({
  standalone: true,
  selector: 'ngxsmk-lazy-load',
  template: `
    @if (visible()) {
      <ng-content />
    }
  `,
  host: { class: 'ngxsmk-lazy-load' },
  styles: `
    :host {
      display: contents;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkLazyLoad {
  readonly rootMargin = input('200px');
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly visible = signal(false);

  constructor() {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.visible.set(true);
            io.disconnect();
          }
        }
      },
      { rootMargin: this.rootMargin() },
    );
    io.observe(this.el.nativeElement);
    this.destroyRef.onDestroy(() => io.disconnect());
  }
}
