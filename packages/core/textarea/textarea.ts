import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  input,
  model,
  output,
} from '@angular/core';

/**
 * Multi-line text control with a configurable row count.
 *
 * ```html
 * <ngxsmk-textarea [rows]="4" [(value)]="feedback" placeholder="Share your feedback…" />
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-textarea',
  template: `
    <textarea
      class="ngxsmk-textarea__control"
      [value]="value()"
      [rows]="rows()"
      [disabled]="disabled()"
      [attr.placeholder]="placeholder() || null"
      (input)="onInput($event)"
    ></textarea>
  `,
  host: { class: 'ngxsmk-textarea' },
  styles: `
    :host {
      display: block;
      width: 100%;
      font-family: var(--ngxsmk-font-sans);
    }

    .ngxsmk-textarea__control {
      display: block;
      width: 100%;
      box-sizing: border-box;
      min-height: 5rem;
      padding: var(--ngxsmk-space-2) var(--ngxsmk-space-3);
      border: 1px solid var(--ngxsmk-color-outline-strong);
      border-radius: var(--ngxsmk-radius-base, var(--ngxsmk-radius-md));
      background: var(--ngxsmk-color-surface);
      color: var(--ngxsmk-color-on-surface);
      font-family: inherit;
      font-size: var(--ngxsmk-text-body-md-size, 0.875rem);
      line-height: var(--ngxsmk-text-body-md-line, 1.5);
      resize: vertical;
      outline: none;
      transition:
        border-color var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out),
        box-shadow var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out);
    }
    .ngxsmk-textarea__control::placeholder {
      color: var(--ngxsmk-color-on-surface-variant);
    }
    .ngxsmk-textarea__control:focus-visible {
      border-color: var(--ngxsmk-color-ring);
      box-shadow: var(--ngxsmk-focus-ring);
    }
    .ngxsmk-textarea__control:disabled {
      opacity: var(--ngxsmk-opacity-disabled);
      cursor: not-allowed;
      background: var(--ngxsmk-color-surface-variant);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkTextarea {
  readonly value = model('');
  readonly placeholder = input('');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly rows = input(4);
  readonly changed = output<string>();

  protected onInput(e: Event): void {
    const v = (e.target as HTMLTextAreaElement).value;
    this.value.set(v);
    this.changed.emit(v);
  }
}
