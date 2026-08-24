import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';

export interface NgxsmkPromptModelOption {
  id: string;
  name: string;
}

/**
 * Multi-line AI prompt composer with model selection, attachment button, and send action.
 *
 * ```html
 * <ngxsmk-prompt-input [(value)]="promptText" (submitPrompt)="onSend($event)" />
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
      font-family: var(--ngxsmk-font-sans);
    }

    .ngxsmk-prompt-box {
      border: 1px solid var(--ngxsmk-color-outline-strong);
      border-radius: var(--ngxsmk-radius-xl);
      background: var(--ngxsmk-color-surface);
      box-shadow: var(--ngxsmk-shadow-sm);
      padding: var(--ngxsmk-space-3) var(--ngxsmk-space-4) var(--ngxsmk-space-2);
      transition:
        border-color var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out),
        box-shadow var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out);
    }

    .ngxsmk-prompt-box:focus-within {
      border-color: var(--ngxsmk-color-ring);
      box-shadow: var(--ngxsmk-focus-ring);
    }

    .ngxsmk-prompt-box__textarea {
      width: 100%;
      border: none;
      background: transparent;
      outline: none;
      resize: none;
      font-family: inherit;
      font-size: var(--ngxsmk-text-body-md-size);
      line-height: var(--ngxsmk-text-body-md-line);
      color: var(--ngxsmk-color-on-surface);
    }

    .ngxsmk-prompt-box__textarea::placeholder {
      color: var(--ngxsmk-color-on-surface-variant);
    }

    .ngxsmk-prompt-box__toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: var(--ngxsmk-space-2);
      padding-top: var(--ngxsmk-space-2);
      border-top: 1px solid var(--ngxsmk-color-outline-subtle);
    }

    .ngxsmk-prompt-box__left {
      display: flex;
      align-items: center;
      gap: var(--ngxsmk-space-2);
    }

    .ngxsmk-prompt-box__btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2rem;
      height: 2rem;
      border: none;
      border-radius: var(--ngxsmk-radius-md);
      background: transparent;
      color: var(--ngxsmk-color-on-surface-variant);
      cursor: pointer;
      transition:
        background var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out),
        color var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out);
    }

    .ngxsmk-prompt-box__btn:hover {
      background: var(--ngxsmk-color-surface-hover);
      color: var(--ngxsmk-color-on-surface);
    }
    .ngxsmk-prompt-box__btn:focus-visible {
      outline: none;
      box-shadow: var(--ngxsmk-focus-ring);
    }

    .ngxsmk-prompt-box__model-select {
      font-family: inherit;
      font-size: var(--ngxsmk-text-label-sm-size);
      font-weight: var(--ngxsmk-font-weight-semibold, 600);
      padding: var(--ngxsmk-space-1) var(--ngxsmk-space-2);
      border-radius: var(--ngxsmk-radius-md);
      border: 1px solid var(--ngxsmk-color-outline);
      background: var(--ngxsmk-color-surface-variant);
      color: var(--ngxsmk-color-on-surface);
      outline: none;
      cursor: pointer;
      transition: border-color var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out);
    }
    .ngxsmk-prompt-box__model-select:focus-visible {
      border-color: var(--ngxsmk-color-ring);
      box-shadow: var(--ngxsmk-focus-ring);
    }

    .ngxsmk-prompt-box__send-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2rem;
      height: 2rem;
      border: none;
      border-radius: var(--ngxsmk-radius-full);
      background: var(--ngxsmk-color-primary);
      color: var(--ngxsmk-color-on-primary);
      cursor: pointer;
      transition:
        background var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out),
        transform var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out),
        opacity var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out);
    }

    .ngxsmk-prompt-box__send-btn:hover:not(:disabled) {
      background: var(--ngxsmk-color-primary-hover);
      transform: scale(1.06);
    }
    .ngxsmk-prompt-box__send-btn:active:not(:disabled) {
      transform: scale(0.96);
    }
    .ngxsmk-prompt-box__send-btn:focus-visible {
      outline: none;
      box-shadow: var(--ngxsmk-focus-ring);
    }

    .ngxsmk-prompt-box__send-btn:disabled {
      opacity: var(--ngxsmk-opacity-disabled);
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
  readonly submitPrompt = output<string>();

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
      this.submitPrompt.emit(text);
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
