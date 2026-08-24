import { Injectable, Renderer2, inject } from '@angular/core';
import { ButtonRenderer } from './button-renderer';
import { NgxsmkButtonSize, NgxsmkButtonVariant } from './button';

/**
 * Default web renderer for the button. Applies CSS classes and creates
 * a `<span>` spinner element. This is the current behavior, extracted
 * behind the `ButtonRenderer` seam.
 */
@Injectable()
export class NgxsmkDefaultButtonRenderer implements ButtonRenderer {
  private readonly renderer = inject(Renderer2);
  private spinner: HTMLElement | null = null;

  applyVariant(_variant: NgxsmkButtonVariant, _size: NgxsmkButtonSize): void {
    // Variants are applied via data-attributes in the host binding —
    // the CSS file maps data-variant="primary" to visual styles.
  }

  applyIconOnly(_iconOnly: boolean): void {
    // Handled via host binding [attr.data-icon-only]
  }

  applyDisabled(_disabled: boolean): void {
    // Handled via host binding [attr.disabled] and [attr.aria-disabled]
  }

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

/** @deprecated Use NgxsmkDefaultButtonRenderer instead */
export const DefaultButtonRenderer = NgxsmkDefaultButtonRenderer;

/** Ionic adapter — wraps `ion-button` instead of native `<button>`. */
export class NgxsmkIonicButtonRenderer implements ButtonRenderer {
  private readonly renderer = inject(Renderer2);
  private spinner: HTMLElement | null = null;

  private readonly variantMap: Record<NgxsmkButtonVariant, { fill: string; color?: string }> = {
    primary: { fill: 'solid', color: 'primary' },
    secondary: { fill: 'solid', color: 'secondary' },
    outline: { fill: 'outline' },
    ghost: { fill: 'clear' },
    destructive: { fill: 'solid', color: 'danger' },
    link: { fill: 'clear' },
  };

  private readonly sizeMap: Record<NgxsmkButtonSize, string | null> = {
    sm: 'small',
    md: null,
    lg: 'large',
  };

  applyVariant(_variant: NgxsmkButtonVariant, _size: NgxsmkButtonSize): void {
    // Ionic attributes would be set on the host element.
    // In practice, when using ion-button, these would be:
    // host.setAttribute('fill', mapping.fill);
    // if (mapping.color) host.setAttribute('color', mapping.color);
    // const sizeAttr = this.sizeMap[size];
    // if (sizeAttr) host.setAttribute('size', sizeAttr);
  }

  applyIconOnly(_iconOnly: boolean): void {
    // Ionic: button with only an icon uses slot="icon-only"
    // host.setAttribute('slot', iconOnly ? 'icon-only' : '');
  }

  applyDisabled(_disabled: boolean): void {
    // Ionic: ion-button has [disabled] property
    // host.disabled = disabled;
  }

  createSpinner(_host: HTMLElement): void {
    // Ionic: ion-button has built-in loading state via [showAsyncIndicator]
    // No manual spinner creation needed
  }

  removeSpinner(_host: HTMLElement): void {
    // Ionic: clear loading state by setting showAsyncIndicator to false
  }
}
