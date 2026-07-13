import {
  Directive,
  ElementRef,
  Renderer2,
  booleanAttribute,
  computed,
  effect,
  inject,
  input,
} from '@angular/core';

export type NgxsmkButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'destructive'
  | 'link';

export type NgxsmkButtonSize = 'sm' | 'md' | 'lg';

/**
 * Button applied to native `<button>`/`<a>` elements so browser semantics,
 * forms integration, and keyboard behavior come for free.
 *
 * ```html
 * <button ngxsmk-button>Save</button>
 * <button ngxsmk-button variant="outline" size="sm">Cancel</button>
 * <a ngxsmk-button variant="link" href="/docs">Docs</a>
 * <button ngxsmk-button iconOnly aria-label="Settings">⚙</button>
 * ```
 */
@Directive({
  selector: 'button[ngxsmk-button], a[ngxsmk-button]',
  host: {
    class: 'ngxsmk-button',
    '[attr.data-variant]': 'variant()',
    '[attr.data-size]': 'size()',
    '[attr.data-icon-only]': 'iconOnly() ? "" : null',
    '[attr.disabled]': 'isDisabled() ? "" : null',
    '[attr.aria-disabled]': 'isDisabled() ? "true" : null',
    '[attr.aria-busy]': 'loading() ? "true" : null',
  },
})
export class NgxsmkButton {
  readonly variant = input<NgxsmkButtonVariant>('primary');
  readonly size = input<NgxsmkButtonSize>('md');
  readonly iconOnly = input(false, { transform: booleanAttribute });
  readonly loading = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });

  protected readonly isDisabled = computed(
    () => this.disabled() || this.loading(),
  );

  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private spinner: HTMLElement | null = null;

  constructor() {
    effect(() => {
      if (this.loading()) {
        if (!this.spinner) {
          this.spinner = this.renderer.createElement('span');
          this.renderer.addClass(this.spinner, 'ngxsmk-button__spinner');
          this.renderer.setAttribute(this.spinner, 'aria-hidden', 'true');
          this.renderer.insertBefore(
            this.el.nativeElement,
            this.spinner,
            this.el.nativeElement.firstChild,
          );
        }
      } else {
        if (this.spinner) {
          this.renderer.removeChild(this.el.nativeElement, this.spinner);
          this.spinner = null;
        }
      }
    });
  }
}
