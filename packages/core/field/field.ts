import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'ngxsmk-field',
  template: `
    <ng-content />
    @if (hint()) {
      <p class="ngxsmk-field__hint">{{ hint() }}</p>
    }
  `,
  host: { class: 'ngxsmk-field', '[attr.data-direction]': 'direction()' },
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: var(--ngxsmk-space-1);
      font-family: var(--ngxsmk-font-sans);
    }
    :host([data-direction='horizontal']) {
      flex-direction: row;
      align-items: center;
      gap: var(--ngxsmk-space-3);
    }
    .ngxsmk-field__hint {
      margin: 0;
      font-size: var(--ngxsmk-text-body-sm-size);
      color: var(--ngxsmk-color-on-surface-variant);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/**
 * @deprecated Use `NgxsmkFormField` (`@ngxsmk/core/form-field`) instead. Will be removed in v3.0.0.
 */
export class NgxsmkField {
  readonly hint = input('');
  readonly direction = input<'vertical' | 'horizontal'>('vertical');
}
