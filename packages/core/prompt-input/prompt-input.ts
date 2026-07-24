import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  input,
  model,
  output,
} from '@angular/core';

export interface NgxsmkPromptModelOption {
  id: string;
  name: string;
}

/**
 * Multi-line AI prompt composer with model selection, attachment button, and send action.
 *
 * ```html
 * <ngxsmk-prompt-input [(value)]="promptText" (submit)="onSend($event)" />
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-prompt-input',
  template: `
    <div class="ngxsmk-prompt-box">
      <!-- MULTI-LINE TEXTAREA -->
      <textarea
        #textareaEl
        [placeholder]="placeholder()"
        [value]="value()"
        (input)="onInput($event)"
        (keydown)="onKeyDown($event)"
        class="ngxsmk-prompt-box__textarea"
        rows="2"
      ></textarea>

      <!-- BOTTOM ACTIONS TOOLBAR -->
      <div class="ngxsmk-prompt-box__toolbar">
        <div class="ngxsmk-prompt-box__left">
          <!-- ATTACH FILE BUTTON -->
          <button
            type="button"
            class="ngxsmk-prompt-box__btn"
            (click)="fileInput.click()"
            title="Attach file"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"
              />
            </svg>
          </button>
          <input #fileInput type="file" style="display:none;" (change)="onFileSelected($event)" />

          <!-- MODEL SELECTOR DROPDOWN -->
          @if (models().length > 0) {
            <select
              [value]="selectedModel()"
              (change)="onModelChange($event)"
              class="ngxsmk-prompt-box__model-select"
            >
              @for (m of models(); track m.id) {
                <option [value]="m.id">{{ m.name }}</option>
              }
            </select>
          }
        </div>

        <div class="ngxsmk-prompt-box__right">
          <!-- SEND BUTTON -->
          <button
            type="button"
            class="ngxsmk-prompt-box__send-btn"
            [disabled]="!value().trim()"
            (click)="onSubmit()"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  `,
  host: {
    class: 'ngxsmk-prompt-input',
  },
  styles: `
    :host {
      display: block;
      width: 100%;
      font-family: var(--ngxsmk-font-sans, system-ui);
    }

    .ngxsmk-prompt-box {
      border: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
      border-radius: var(--ngxsmk-radius-lg, 0.5rem);
      background: var(--ngxsmk-color-surface, #ffffff);
      padding: 0.75rem 0.85rem 0.5rem;
      transition:
        border-color 0.15s ease,
        box-shadow 0.15s ease;
    }

    .ngxsmk-prompt-box:focus-within {
      border-color: var(--ngxsmk-color-primary, #7c3aed);
      box-shadow: 0 0 0 3px
        color-mix(in srgb, var(--ngxsmk-color-primary, #7c3aed) 12%, transparent);
    }

    .ngxsmk-prompt-box__textarea {
      width: 100%;
      border: none;
      background: none;
      outline: none;
      resize: none;
      font-family: inherit;
      font-size: 0.9rem;
      line-height: 1.5;
      color: var(--ngxsmk-color-on-surface, #09090b);
    }

    .ngxsmk-prompt-box__toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 0.5rem;
      padding-top: 0.35rem;
      border-top: 1px solid var(--ngxsmk-color-outline, #f4f4f5);
    }

    .ngxsmk-prompt-box__left {
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    .ngxsmk-prompt-box__btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 1.85rem;
      height: 1.85rem;
      border: none;
      border-radius: var(--ngxsmk-radius-sm, 0.25rem);
      background: none;
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
      cursor: pointer;
      transition: background 0.15s ease;
    }

    .ngxsmk-prompt-box__btn:hover {
      background: var(--ngxsmk-color-surface-variant, #f4f4f5);
      color: var(--ngxsmk-color-on-surface, #09090b);
    }

    .ngxsmk-prompt-box__model-select {
      font-family: inherit;
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.2rem 0.5rem;
      border-radius: var(--ngxsmk-radius-sm, 0.25rem);
      border: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
      background: var(--ngxsmk-color-surface-variant, #f4f4f5);
      color: var(--ngxsmk-color-on-surface, #09090b);
      outline: none;
      cursor: pointer;
    }

    .ngxsmk-prompt-box__send-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 1.85rem;
      height: 1.85rem;
      border: none;
      border-radius: var(--ngxsmk-radius-sm, 0.25rem);
      background: var(--ngxsmk-color-primary, #7c3aed);
      color: #ffffff;
      cursor: pointer;
      transition: opacity 0.15s ease;
    }

    .ngxsmk-prompt-box__send-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkPromptInput {
  /** Placeholder prompt text. */
  readonly placeholder = input<string>('Ask anything or type / for commands...');

  /** Available AI model options. */
  readonly models = input<NgxsmkPromptModelOption[]>([]);

  /** Two-way signal model for prompt text. */
  readonly value = model<string>('');

  /** Two-way signal model for selected AI model ID. */
  readonly selectedModel = model<string>('');

  /** Emits text prompt when submit action triggered. */
  readonly submit = output<string>();

  /** Emits FileList when attachments selected. */
  readonly fileAttach = output<FileList>();

  protected onInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.value.set(target.value);
  }

  protected onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.onSubmit();
    }
  }

  protected onSubmit(): void {
    const text = this.value().trim();
    if (text) {
      this.submit.emit(text);
      this.value.set('');
    }
  }

  protected onModelChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedModel.set(target.value);
  }

  protected onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length) {
      this.fileAttach.emit(target.files);
    }
  }
}
