import {
  Directive,
  ElementRef,
  TemplateRef,
  ViewContainerRef,
  effect,
  inject,
  input,
  output,
} from '@angular/core';
import { NgxsmkMotionState, playEnter, playExit } from './animate';

/**
 * Structural directive that mounts its template and plays an enter animation,
 * then plays an exit animation before detaching when the `show` input flips to
 * `false`. Mirrors the host's presence so leave animations can complete.
 */
@Directive({
  selector: '[ngxsmkPresence]',
})
export class NgxsmkPresence {
  private readonly template = inject(TemplateRef<unknown>);
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly host = inject(ElementRef<HTMLElement>);

  readonly show = input<boolean>(false);
  readonly motion = input<NgxsmkMotionState>();
  readonly afterLeave = output<void>();

  constructor() {
    effect(() => {
      const show = this.show();
      if (show) {
        if (this.viewContainer.length === 0) {
          const view = this.viewContainer.createEmbeddedView(this.template);
          const el = view.rootNodes.find(
            (n): n is HTMLElement => n instanceof HTMLElement,
          );
          if (el) {
            void playEnter(el, this.motion());
          }
        }
      } else if (this.viewContainer.length > 0) {
        const el = this.host.nativeElement.querySelector('*') as HTMLElement | null;
        const target = el ?? this.host.nativeElement;
        void playExit(target, this.motion()).then(() => {
          this.viewContainer.clear();
          this.afterLeave.emit();
        });
      }
    });
  }
}
