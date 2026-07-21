import {
  Directive,
  ElementRef,
  booleanAttribute,
  computed,
  effect,
  inject,
  input,
} from '@angular/core';
import { NGXSMK_BUTTON_RENDERER } from './button-renderer';
import { DefaultButtonRenderer } from './default-renderer';

export type NgxsmkButtonVariant =
  'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link';

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
  standalone: true,
  /* eslint-disable-next-line @angular-eslint/directive-selector */
  selector: 'button[ngxsmk-button], a[ngxsmk-button]',
  providers: [{ provide: NGXSMK_BUTTON_RENDERER, useClass: DefaultButtonRenderer }],
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

  protected readonly isDisabled = computed(() => this.disabled() || this.loading());

  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(NGXSMK_BUTTON_RENDERER);

  constructor() {
    effect(() => {
      if (this.loading()) {
        this.renderer.createSpinner(this.el.nativeElement);
      } else {
        this.renderer.removeSpinner(this.el.nativeElement);
      }
    });
  }
}
