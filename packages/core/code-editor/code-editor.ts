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
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-md);
      background: var(--ngxsmk-color-background);
      color: var(--ngxsmk-color-on-background);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .ngxsmk-code-ed__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--ngxsmk-space-1-5) var(--ngxsmk-space-3);
      background: var(--ngxsmk-color-surface-variant);
      border-bottom: 1px solid var(--ngxsmk-color-outline);
    }

    .ngxsmk-code-ed__lang {
      font-size: var(--ngxsmk-text-label-sm-size);
      font-weight: var(--ngxsmk-font-weight-bold, 700);
      text-transform: uppercase;
      letter-spacing: var(--ngxsmk-tracking-wide, 0.05em);
      color: var(--ngxsmk-color-primary);
    }

    .ngxsmk-code-ed__copy-btn {
      border: none;
      background: none;
      color: var(--ngxsmk-color-on-surface-variant);
      font-family: inherit;
      font-size: var(--ngxsmk-text-label-sm-size);
      font-weight: var(--ngxsmk-font-weight-semibold, 600);
      cursor: pointer;
      padding: var(--ngxsmk-space-0-5) var(--ngxsmk-space-1-5);
      border-radius: var(--ngxsmk-radius-sm);
      transition: color var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out);
    }

    .ngxsmk-code-ed__copy-btn:hover {
      color: var(--ngxsmk-color-on-surface);
    }

    .ngxsmk-code-ed__body {
      display: flex;
      min-height: 120px;
    }

    .ngxsmk-code-ed__gutter {
      padding: var(--ngxsmk-space-3) var(--ngxsmk-space-2);
      background: var(--ngxsmk-color-surface-variant);
      color: var(--ngxsmk-color-on-surface-variant);
      user-select: none;
      display: flex;
      flex-direction: column;
      text-align: end;
      font-size: var(--ngxsmk-text-label-sm-size);
      line-height: 1.5;
      border-inline-end: 1px solid var(--ngxsmk-color-outline);
    }

    .ngxsmk-code-ed__textarea {
      flex: 1;
      padding: var(--ngxsmk-space-3) var(--ngxsmk-space-4);
      border: none;
      background: transparent;
      color: var(--ngxsmk-color-on-surface);
      font-family: inherit;
      font-size: var(--ngxsmk-text-body-sm-size);
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
