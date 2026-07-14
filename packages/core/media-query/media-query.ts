import { Directive, input, signal } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[ngxsmkMediaQuery]',
})
export class NgxsmkMediaQuery {
  readonly ngxsmkMediaQuery = input('(min-width: 768px)');
  readonly matches = signal(false);

  constructor() {
    if (typeof window !== 'undefined') {
      const mql = window.matchMedia('(min-width: 768px)');
      this.matches.set(mql.matches);
      mql.addEventListener('change', (e) => this.matches.set(e.matches));
    }
  }
}
