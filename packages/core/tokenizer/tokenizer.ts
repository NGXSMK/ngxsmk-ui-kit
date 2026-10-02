import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  input,
  model,
  output,
} from '@angular/core';

/**
 * Free-form tags / chips input. Press Enter (or a delimiter) to commit a token;
 * Backspace on an empty input removes the last token.
 *
 * ```html
 * <ngxsmk-tokenizer [(tokens)]="tags" placeholder="Add a tag…" [maxTokens]="12" />
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-tokenizer',
  template: `
    <!-- eslint-disable-next-line @angular-eslint/template/click-events-have-key-events, @angular-eslint/template/interactive-supports-focus -->
    <div
      class="ngxsmk-tokenizer__wrap"
      [attr.data-disabled]="disabled() ? '' : null"
      (click)="focusInput(input)"
    >
      @for (t of tokens(); track t) {
        <span class="ngxsmk-tokenizer__token">
          {{ t }}
          <button
            type="button"
            class="ngxsmk-tokenizer__remove"
            [disabled]="disabled()"
            (click)="remove(t); $event.stopPropagation()"
            [attr.aria-label]="'Remove ' + t"
          >
            &times;
          </button>
        </span>
      }
      <input
        #input
        class="ngxsmk-tokenizer__input"
        [placeholder]="tokens().length ? '' : placeholder()"
        [disabled]="disabled() || atMax()"
        [attr.aria-label]="ariaLabel() || placeholder()"
        (keydown)="onKeydown($event, input)"
        (paste)="onPaste($event, input)"
        (blur)="commitDraft(input)"
      />
    </div>
  `,
  host: { class: 'ngxsmk-tokenizer' },
  styles: `
    :host {
      display: flex;
      font-family: var(--ngxsmk-font-sans);
      width: 100%;
    }
    .ngxsmk-tokenizer__wrap {
      display: flex;
      flex-wrap: wrap;
      gap: var(--ngxsmk-space-1);
      padding: var(--ngxsmk-space-1);
      border: 1px solid var(--ngxsmk-color-outline-strong, var(--ngxsmk-color-outline));
      border-radius: var(--ngxsmk-radius-md);
      min-height: var(--ngxsmk-control-height, 2.5rem);
      background: var(--ngxsmk-color-surface);
      cursor: text;
      width: 100%;
      box-sizing: border-box;
      transition:
        border-color var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out),
        box-shadow var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out);
    }
    .ngxsmk-tokenizer__wrap:hover:not([data-disabled]) {
      border-color: var(--ngxsmk-color-ring);
    }
    .ngxsmk-tokenizer__wrap:focus-within {
      border-color: var(--ngxsmk-color-ring);
      box-shadow: var(--ngxsmk-focus-ring);
    }
    .ngxsmk-tokenizer__wrap[data-disabled] {
      opacity: var(--ngxsmk-opacity-disabled, 0.5);
      cursor: not-allowed;
    }
    .ngxsmk-tokenizer__token {
      display: inline-flex;
      align-items: center;
      gap: var(--ngxsmk-space-1);
      padding: var(--ngxsmk-space-0-5) var(--ngxsmk-space-2);
      background: var(--ngxsmk-color-primary-container);
      color: var(--ngxsmk-color-on-primary-container);
      border-radius: var(--ngxsmk-radius-full);
      font-size: var(--ngxsmk-text-body-sm-size);
      max-width: 100%;
    }
    .ngxsmk-tokenizer__remove {
      border: none;
      background: none;
      cursor: pointer;
      font-size: var(--ngxsmk-text-body-lg-size);
      line-height: var(--ngxsmk-leading-none, 1);
      padding: 0;
      color: inherit;
      opacity: var(--ngxsmk-opacity-muted, 0.7);
    }
    .ngxsmk-tokenizer__remove:hover:not(:disabled) {
      opacity: 1;
    }
    .ngxsmk-tokenizer__remove:focus-visible {
      outline: none;
      opacity: 1;
      border-radius: var(--ngxsmk-radius-full);
      box-shadow: var(--ngxsmk-focus-ring);
    }
    .ngxsmk-tokenizer__input {
      flex: 1;
      min-width: 6rem;
      border: none;
      outline: none;
      padding: var(--ngxsmk-space-1);
      font-size: var(--ngxsmk-text-label-lg-size, var(--ngxsmk-text-body-sm-size));
      background: transparent;
      color: var(--ngxsmk-color-on-surface);
      font-family: inherit;
    }
    .ngxsmk-tokenizer__input::placeholder {
      color: var(--ngxsmk-color-on-surface-variant);
    }
    .ngxsmk-tokenizer__input:disabled {
      cursor: not-allowed;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkTokenizer {
  readonly tokens = model<string[]>([]);
  readonly placeholder = input('Type and press Enter...');
  readonly disabled = input(false, { transform: booleanAttribute });
  /** Cap on token count; `0` means unlimited. */
  readonly maxTokens = input(0);
  /** Characters that also commit a token (e.g. `,`). Enter always commits. */
  readonly delimiters = input(',;');
  readonly ariaLabel = input('');
  readonly allowDuplicates = input(false, { transform: booleanAttribute });
  readonly changed = output<string[]>();

  protected atMax(): boolean {
    const max = this.maxTokens();
    return max > 0 && this.tokens().length >= max;
  }

  protected focusInput(el: HTMLInputElement): void {
    if (!this.disabled()) el.focus();
  }

  protected onKeydown(event: KeyboardEvent, el: HTMLInputElement): void {
    if (this.disabled()) return;
    if (event.key === 'Enter') {
      event.preventDefault();
      this.commitDraft(el);
      return;
    }
    if (event.key === 'Backspace') {
      this.backspace(el);
      return;
    }
    if (this.delimiters().includes(event.key)) {
      event.preventDefault();
      this.commitDraft(el);
    }
  }

  protected onPaste(event: ClipboardEvent, el: HTMLInputElement): void {
    if (this.disabled()) return;
    const text = event.clipboardData?.getData('text') ?? '';
    if (!text) return;
    const delimRe = new RegExp(`[${escapeRegExp(this.delimiters())}\\n]+`);
    if (!delimRe.test(text) && !text.includes('\n')) return;
    event.preventDefault();
    for (const part of text.split(delimRe)) {
      this.addToken(part);
    }
    el.value = '';
  }

  protected commitDraft(el: HTMLInputElement): void {
    this.addToken(el.value);
    el.value = '';
  }

  protected remove(t: string): void {
    if (this.disabled()) return;
    this.tokens.set(this.tokens().filter((x) => x !== t));
    this.changed.emit(this.tokens());
  }

  protected backspace(el: HTMLInputElement): void {
    if (!el.value && this.tokens().length) {
      this.tokens.set(this.tokens().slice(0, -1));
      this.changed.emit(this.tokens());
    }
  }

  private addToken(raw: string): void {
    const val = raw.trim();
    if (!val || this.atMax()) return;
    if (!this.allowDuplicates() && this.tokens().includes(val)) return;
    this.tokens.set([...this.tokens(), val]);
    this.changed.emit(this.tokens());
  }
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
