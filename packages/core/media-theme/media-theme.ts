import { DestroyRef, Directive, effect, inject, input, signal } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[ngxsmkMediaTheme]',
  host: {
    '[attr.data-theme-mode]': 'matched() ? theme() : null',
  },
})
export class NgxsmkMediaTheme {
  readonly query = input('(prefers-color-scheme: dark)');
  readonly theme = input('dark');

  protected readonly matched = signal(false);

  private mediaQueryList: MediaQueryList | null = null;

  constructor() {
    const destroyRef = inject(DestroyRef);

    if (typeof window !== 'undefined' && window.matchMedia) {
      effect(() => {
        this.mediaQueryList?.removeEventListener('change', this.onChange);
        this.mediaQueryList = window.matchMedia(this.query());
        this.matched.set(this.mediaQueryList.matches);
        this.mediaQueryList.addEventListener('change', this.onChange);
      });

      destroyRef.onDestroy(() => {
        this.mediaQueryList?.removeEventListener('change', this.onChange);
      });
    }
  }

  private readonly onChange = (event: MediaQueryListEvent): void => {
    this.matched.set(event.matches);
  };
}
