import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';

@Component({
  standalone: true,
  selector: 'ngxsmk-chat-input',
  template: `
    <div class="ngxsmk-chat-input__bar">
      <textarea
        class="ngxsmk-chat-input__textarea"
        [value]="value()"
        (input)="onInput($event)"
        (keydown.enter)="onEnter($event)"
        [placeholder]="placeholder()"
        [disabled]="disabled()"
        rows="1"
      ></textarea>
      <ng-content select="[actions]" />
    </div>
  `,
  host: { class: 'ngxsmk-chat-input' },
  styles: `
    :host { display: flex; border-top: 1px solid var(--ngxsmk-color-outline-variant); padding: var(--ngxsmk-space-3); background: var(--ngxsmk-color-surface); }
    .ngxsmk-chat-input__bar { display: flex; align-items: flex-end; gap: var(--ngxsmk-space-2); width: 100%; }
    .ngxsmk-chat-input__textarea { flex: 1; resize: none; border: 1px solid var(--ngxsmk-color-outline); border-radius: var(--ngxsmk-radius-lg); padding: var(--ngxsmk-space-2) var(--ngxsmk-space-3); font-family: var(--ngxsmk-font-sans); font-size: 0.875rem; background: var(--ngxsmk-color-surface-container); color: var(--ngxsmk-color-on-surface); outline: none; max-height: 10rem; }
    .ngxsmk-chat-input__textarea:focus { border-color: var(--ngxsmk-color-primary); }
    @media (max-width: 768px) {
      .ngxsmk-chat-input__bar { flex-wrap: wrap; }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkChatInput {
  readonly value = model('');
  readonly placeholder = input('Type a message...');
  readonly disabled = input(false);
  readonly submitted = output<string>();

  protected onInput(e: Event): void {
    this.value.set((e.target as HTMLTextAreaElement).value);
  }

  protected onEnter(e: Event): void {
    const ke = e as KeyboardEvent;
    if (!ke.shiftKey && this.value().trim()) {
      ke.preventDefault();
      this.submitted.emit(this.value());
      this.value.set('');
    }
  }
}
