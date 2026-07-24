import { ChangeDetectionStrategy, Component, computed, input, model, signal } from '@angular/core';

/**
 * Code editor container with line numbers, language tag header, copy button, and editable canvas.
 *
 * ```html
 * <ngxsmk-code-editor [(value)]="sourceCode" language="typescript" />
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-code-editor',
  template: `
    <div class="ngxsmk-code-ed">
      <!-- EDITOR HEADER -->
      <div class="ngxsmk-code-ed__header">
        <span class="ngxsmk-code-ed__lang">{{ language() }}</span>
        <button type="button" class="ngxsmk-code-ed__copy-btn" (click)="copyCode()">
          {{ copied() ? '✓ Copied' : 'Copy' }}
        </button>
      </div>

      <!-- CANVAS BODY -->
      <div class="ngxsmk-code-ed__body">
        <!-- GUTTER LINE NUMBERS -->
        <div class="ngxsmk-code-ed__gutter">
          @for (num of lineNumbers(); track num) {
            <span>{{ num }}</span>
          }
        </div>

        <!-- EDITABLE TEXTAREA -->
        <textarea
          class="ngxsmk-code-ed__textarea"
          [value]="activeCode()"
          [readonly]="readonly()"
          (input)="onInput($event)"
          spellcheck="false"
        ></textarea>
      </div>
    </div>
  `,
  host: {
    class: 'ngxsmk-code-editor',
  },
  styles: `
    :host {
      display: block;
      width: 100%;
      font-family: var(--ngxsmk-font-mono, monospace);
    }

    .ngxsmk-code-ed {
      border: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
      border-radius: var(--ngxsmk-radius-md, 0.375rem);
      background: #09090b;
      color: #f4f4f5;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .ngxsmk-code-ed__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.35rem 0.75rem;
      background: #18181b;
      border-bottom: 1px solid #27272a;
    }

    .ngxsmk-code-ed__lang {
      font-size: 0.725rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--ngxsmk-color-primary, #a78bfa);
    }

    .ngxsmk-code-ed__copy-btn {
      border: none;
      background: none;
      color: #a1a1aa;
      font-family: inherit;
      font-size: 0.725rem;
      font-weight: 600;
      cursor: pointer;
      padding: 0.15rem 0.4rem;
      border-radius: 0.2rem;
      transition: color 0.15s ease;
    }

    .ngxsmk-code-ed__copy-btn:hover {
      color: #ffffff;
    }

    .ngxsmk-code-ed__body {
      display: flex;
      min-height: 120px;
    }

    .ngxsmk-code-ed__gutter {
      padding: 0.75rem 0.5rem;
      background: #121215;
      color: #52525b;
      user-select: none;
      display: flex;
      flex-direction: column;
      text-align: right;
      font-size: 0.8rem;
      line-height: 1.5;
      border-right: 1px solid #27272a;
    }

    .ngxsmk-code-ed__textarea {
      flex: 1;
      padding: 0.75rem 0.85rem;
      border: none;
      background: transparent;
      color: #f4f4f5;
      font-family: inherit;
      font-size: 0.825rem;
      line-height: 1.5;
      outline: none;
      resize: vertical;
      white-space: pre;
      overflow-x: auto;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkCodeEditor {
  /** Code language name. Default: 'typescript'. */
  readonly language = input<string>('typescript');

  /** Readonly mode toggle. Default: false. */
  readonly readonly = input<boolean>(false);

  /** Code string input. */
  readonly code = input<string>('');

  /** Two-way signal model for code source string. */
  readonly value = model<string>('');

  protected readonly activeCode = computed(() => this.value() || this.code());

  protected readonly copied = signal(false);

  protected readonly lineNumbers = computed(() => {
    const lines = this.activeCode().split('\n').length;
    return Array.from({ length: Math.max(1, lines) }, (_, i) => i + 1);
  });

  protected onInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.value.set(target.value);
  }

  protected copyCode(): void {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(this.value());
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    }
  }
}
