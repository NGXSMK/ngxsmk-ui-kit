import { InjectionToken } from '@angular/core';

/**
 * Loading-indicator strategy for the button directive.
 *
 * Variant, size, icon-only, and disabled state are all reflected declaratively
 * through host bindings on `NgxsmkButton` and styled from `data-*` attributes,
 * so they need no renderer seam. The spinner is the one piece that requires
 * imperative DOM work, and the one piece a host platform may want to own:
 * `DefaultButtonRenderer` inserts a CSS-animated `<span>`, while
 * `IonicButtonRenderer` inserts an `<ion-spinner>` so the indicator matches the
 * iOS/Material look Ionic selects at runtime.
 */
export interface ButtonRenderer {
  /** Create and insert a loading spinner element. */
  createSpinner(host: HTMLElement): void;
  /** Remove the loading spinner element. */
  removeSpinner(host: HTMLElement): void;
}

export const NGXSMK_BUTTON_RENDERER = new InjectionToken<ButtonRenderer>('ButtonRenderer');
