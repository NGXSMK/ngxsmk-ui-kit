import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';

@Component({
  standalone: true,
  selector: 'ngxsmk-tokenizer',
  template: `
    <!-- eslint-disable-next-line @angular-eslint/template/click-events-have-key-events, @angular-eslint/template/interactive-supports-focus -->
    <div class="ngxsmk-tokenizer__wrap" (click)="input.focus()">
      @for (t of tokens(); track t) {
        <span class="ngxsmk-tokenizer__token">
          {{ t }}
          <button type="button" class="ngxsmk-tokenizer__remove" (click)="remove(t)" [attr.aria-label]="'Remove ' + t">&times;</button>
        </span>
      }
      <input
        #input
        class="ngxsmk-tokenizer__input"
        [placeholder]="placeholder()"
        [attr.disabled]="disabled() ? true : null"
        (keydown.enter)="add(input); $event.preventDefault()"
        (keydown.Backspace)="backspace(input)"
      />
    </div>
  `,
  host: { class: 'ngxsmk-tokenizer' },
  styles: `
    :host { display: flex; font-family: var(--ngxsmk-font-sans); }
    .ngxsmk-tokenizer__wrap { display: flex; flex-wrap: wrap; gap: var(--ngxsmk-space-1); padding: var(--ngxsmk-space-1); border: 1px solid var(--ngxsmk-color-outline); border-radius: var(--ngxsmk-radius-md); min-height: 2.5rem; background: var(--ngxsmk-color-surface); cursor: text; width: 100%; }
    .ngxsmk-tokenizer__token { display: inline-flex; align-items: center; gap: var(--ngxsmk-space-1); padding: var(--ngxsmk-space-0-5) var(--ngxsmk-space-2); background: var(--ngxsmk-color-primary-container); color: var(--ngxsmk-color-on-primary-container); border-radius: var(--ngxsmk-radius-full); font-size: 0.8125rem; }
    .ngxsmk-tokenizer__remove { border: none; background: none; cursor: pointer; font-size: 1rem; line-height: 1; padding: 0; color: inherit; opacity: 0.7; }
    .ngxsmk-tokenizer__remove:hover { opacity: 1; }
    .ngxsmk-tokenizer__input { flex: 1; min-width: 6rem; border: none; outline: none; padding: var(--ngxsmk-space-1); font-size: 0.875rem; background: transparent; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkTokenizer {
  readonly tokens = model<string[]>([]);
  readonly placeholder = input('Type and press Enter...');
  readonly disabled = input(false);
  readonly changed = output<string[]>();

  protected add(input: HTMLInputElement): void {
    const val = input.value.trim();
    if (val && !this.tokens().includes(val)) {
      this.tokens.set([...this.tokens(), val]);
      this.changed.emit(this.tokens());
    }
    input.value = '';
  }

  protected remove(t: string): void {
    this.tokens.set(this.tokens().filter(x => x !== t));
    this.changed.emit(this.tokens());
  }

  protected backspace(input: HTMLInputElement): void {
    if (!input.value && this.tokens().length) {
      this.tokens.set(this.tokens().slice(0, -1));
      this.changed.emit(this.tokens());
    }
  }
}
