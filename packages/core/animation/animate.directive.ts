import { Directive, ElementRef, afterNextRender, inject, input } from '@angular/core';
import { NgxsmkMotionState, playEnter } from './animate';

/**
 * Plays an enter animation on the host element once it is rendered.
 * The motion state is supplied via the `ngxsmkAnimate` input.
 */
@Directive({
  selector: '[ngxsmkAnimate]',
})
export class NgxsmkAnimate {
  private readonly el = inject(ElementRef<HTMLElement>);
  readonly ngxsmkAnimate = input<NgxsmkMotionState>();

  constructor() {
    afterNextRender(() => {
      void playEnter(this.el.nativeElement, this.ngxsmkAnimate());
    });
  }
}
