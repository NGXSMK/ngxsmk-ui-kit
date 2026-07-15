import { Directive, booleanAttribute, input } from '@angular/core';

@Directive({
  standalone: true,
  selector: 'button[ngxsmk-fab], a[ngxsmk-fab]',
  host: {
    class: 'ngxsmk-fab',
    '[attr.data-size]': 'size()',
    '[attr.data-variant]': 'variant()',
    '[attr.data-extended]': 'extended() ? "" : null',
    '[attr.data-position]': 'position() !== "none" ? position() : null',
    '[attr.disabled]': 'disabled() ? "" : null',
    '[attr.aria-disabled]': 'disabled() ? "true" : null',
  },
})
export class NgxsmkFab {
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly variant = input<'primary' | 'secondary'>('primary');
  readonly extended = input(false, { transform: booleanAttribute });
  readonly position = input<'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'none'>(
    'none',
  );
  readonly disabled = input(false, { transform: booleanAttribute });
}
