import { InjectionToken } from '@angular/core';
import { NgxsmkButtonSize, NgxsmkButtonVariant } from './button';

/**
 * Rendering strategy for the button component. The behavioral class accepts
 * inputs and computes state; this interface handles DOM manipulation.
 *
 * Two adapters justify the seam: `DefaultButtonRenderer` (current web behavior
 * with CSS classes) and `IonicButtonRenderer` (wraps `ion-button`).
 */
export interface ButtonRenderer {
  /** Apply variant, size, and state attributes/classes to the host element. */
  applyVariant(variant: NgxsmkButtonVariant, size: NgxsmkButtonSize): void;
  /** Apply icon-only styling. */
  applyIconOnly(iconOnly: boolean): void;
  /** Apply disabled state. */
  applyDisabled(disabled: boolean): void;
  /** Create and insert a loading spinner element. */
  createSpinner(host: HTMLElement): void;
  /** Remove the loading spinner element. */
  removeSpinner(host: HTMLElement): void;
}

export const NGXSMK_BUTTON_RENDERER = new InjectionToken<ButtonRenderer>('ButtonRenderer');
