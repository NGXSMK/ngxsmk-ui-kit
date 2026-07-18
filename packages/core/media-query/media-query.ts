import { Directive, OnDestroy, effect, input, signal } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[ngxsmkMediaQuery]',
})
export class NgxsmkMediaQuery implements OnDestroy {
  readonly ngxsmkMediaQuery = input('(min-width: 768px)');
  readonly matches = signal(false);

  private mql: MediaQueryList | null = null;
  private listener: ((e: MediaQueryListEvent) => void) | null = null;

  constructor() {
    effect(() => {
      const query = this.ngxsmkMediaQuery();
      this.cleanup();

      if (typeof window !== 'undefined') {
        this.mql = window.matchMedia(query);
        this.matches.set(this.mql.matches);

        this.listener = (e: MediaQueryListEvent) => this.matches.set(e.matches);
        this.mql.addEventListener('change', this.listener);
      }
    });
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  private cleanup(): void {
    if (this.mql && this.listener) {
      this.mql.removeEventListener('change', this.listener);
    }
    this.mql = null;
    this.listener = null;
  }
}
