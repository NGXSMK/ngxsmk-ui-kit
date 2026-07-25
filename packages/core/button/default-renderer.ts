import { InjectionToken, Injectable, Renderer2, Type, inject } from '@angular/core';
import { ButtonRenderer } from './button-renderer';

/**
 * Default web renderer: a CSS-animated `<span>` styled by
 * `.ngxsmk-button__spinner` in the theme stylesheet.
 */
@Injectable()
export class DefaultButtonRenderer implements ButtonRenderer {
  private readonly renderer = inject(Renderer2);
  private spinner: HTMLElement | null = null;

  createSpinner(host: HTMLElement): void {
    if (this.spinner) return;
    this.spinner = this.renderer.createElement('span');
    this.renderer.addClass(this.spinner, 'ngxsmk-button__spinner');
    this.renderer.setAttribute(this.spinner, 'aria-hidden', 'true');
    this.renderer.insertBefore(host, this.spinner, host.firstChild);
  }

  removeSpinner(host: HTMLElement): void {
    if (this.spinner) {
      this.renderer.removeChild(host, this.spinner);
      this.spinner = null;
    }
  }
}

/**
 * Application-level choice of button renderer.
 *
 * `NGXSMK_BUTTON_RENDERER` is provided by the button directive itself, and a
 * directive's own providers always shadow environment providers — so it cannot
 * be overridden from `bootstrapApplication`. This token carries the *class*
 * instead: it lives in the root injector, where an app can replace it, and the
 * directive instantiates whatever it finds.
 *
 * ```ts
 * providers: [{ provide: NGXSMK_BUTTON_RENDERER_CLASS, useValue: IonicButtonRenderer }]
 * ```
 *
 * A node-level `NGXSMK_BUTTON_RENDERER` provider still wins for a single
 * subtree, which is the right precedence: more specific beats more general.
 */
export const NGXSMK_BUTTON_RENDERER_CLASS = new InjectionToken<Type<ButtonRenderer>>(
  'NGXSMK_BUTTON_RENDERER_CLASS',
  { providedIn: 'root', factory: () => DefaultButtonRenderer },
);

/**
 * Ionic renderer: inserts an `<ion-spinner>` so the loading indicator picks up
 * the platform look Ionic resolves at runtime (lines on iOS, circular on
 * Material) instead of our own CSS animation.
 *
 * Requires `@ionic/angular` to be loaded so the `ion-spinner` custom element is
 * defined; it is a plain element until then, and the `.ngxsmk-button__spinner`
 * class keeps our own sizing/margin rules applying either way.
 *
 * ```ts
 * providers: [{ provide: NGXSMK_BUTTON_RENDERER, useClass: IonicButtonRenderer }]
 * ```
 */
@Injectable()
export class IonicButtonRenderer implements ButtonRenderer {
  private readonly renderer = inject(Renderer2);
  private spinner: HTMLElement | null = null;

  createSpinner(host: HTMLElement): void {
    if (this.spinner) return;
    this.spinner = this.renderer.createElement('ion-spinner');
    this.renderer.addClass(this.spinner, 'ngxsmk-button__spinner');
    this.renderer.setAttribute(this.spinner, 'aria-hidden', 'true');
    // Inherit the button's text color rather than Ionic's default.
    this.renderer.setStyle(this.spinner, 'color', 'currentColor');
    this.renderer.insertBefore(host, this.spinner, host.firstChild);
  }

  removeSpinner(host: HTMLElement): void {
    if (this.spinner) {
      this.renderer.removeChild(host, this.spinner);
      this.spinner = null;
    }
  }
}
