import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type NgxsmkTokenVariant = 'default' | 'primary' | 'success' | 'warning' | 'error';

@Component({
  standalone: true,
  selector: 'ngxsmk-token',
  template: `
    <span class="ngxsmk-token__label"><ng-content /></span>
    @if (removable()) {
      <button type="button" class="ngxsmk-token__remove" (click)="remove()" aria-label="Remove">
        <svg viewBox="0 0 14 14" width="10" height="10" aria-hidden="true">
          <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>
      </button>
    }
  `,
  host: {
    class: 'ngxsmk-token',
    '[attr.data-variant]': 'variant()',
    '[attr.data-removable]': 'removable() ? "" : null',
  },
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      gap: var(--ngxsmk-space-1);
      padding: var(--ngxsmk-space-0-5) var(--ngxsmk-space-2);
      border-radius: var(--ngxsmk-radius-full);
      font-family: var(--ngxsmk-font-sans);
      font-size: var(--ngxsmk-text-body-sm-size);
      line-height: var(--ngxsmk-text-body-sm-line);
      white-space: nowrap;
      background: var(--ngxsmk-color-surface-variant);
      color: var(--ngxsmk-color-on-surface);
      border: 1px solid var(--ngxsmk-color-outline);
    }
    :host([data-variant='primary']) { background: var(--ngxsmk-color-primary-container); color: var(--ngxsmk-color-on-primary-container); border-color: transparent; }
    :host([data-variant='success']) { background: var(--ngxsmk-color-success-container); color: var(--ngxsmk-color-on-success-container); border-color: transparent; }
    :host([data-variant='warning']) { background: var(--ngxsmk-color-warning-container); color: var(--ngxsmk-color-on-warning-container); border-color: transparent; }
    :host([data-variant='error']) { background: var(--ngxsmk-color-error-container); color: var(--ngxsmk-color-on-error-container); border-color: transparent; }

    .ngxsmk-token__remove {
      display: inline-flex; align-items: center; justify-content: center;
      padding: 0; border: none; background: transparent; color: inherit;
      cursor: pointer; opacity: 0.7; border-radius: var(--ngxsmk-radius-sm);
    }
    .ngxsmk-token__remove:hover { opacity: 1; }
    .ngxsmk-token__remove:focus-visible { outline: 2px solid var(--ngxsmk-color-ring); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkToken {
  readonly variant = input<NgxsmkTokenVariant>('default');
  readonly removable = input(false);

  remove(): void {
    // Parent handles removal via output when used in Tokenizer
  }
}
