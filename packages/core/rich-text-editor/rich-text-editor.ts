import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  input,
  model,
} from '@angular/core';

/**
 * Lightweight WYSIWYG rich text editor control with formatting toolbar.
 *
 * ```html
 * <ngxsmk-rich-text-editor [(value)]="htmlContent" placeholder="Write article content..." />
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-rich-text-editor',
  template: `
    <div class="ngxsmk-rte" [class.ngxsmk-rte--disabled]="disabled()">
      <!-- FORMATTING TOOLBAR -->
      <div class="ngxsmk-rte__toolbar" role="toolbar" aria-label="Formatting options">
        <button
          type="button"
          class="ngxsmk-rte__tool-btn"
          title="Bold"
          (click)="execCommand('bold')"
        >
          <b>B</b>
        </button>
        <button
          type="button"
          class="ngxsmk-rte__tool-btn"
          title="Italic"
          (click)="execCommand('italic')"
        >
          <i>I</i>
        </button>
        <button
          type="button"
          class="ngxsmk-rte__tool-btn"
          title="Underline"
          (click)="execCommand('underline')"
        >
          <u>U</u>
        </button>
        <button
          type="button"
          class="ngxsmk-rte__tool-btn"
          title="Strikethrough"
          (click)="execCommand('strikeThrough')"
        >
          <s>S</s>
        </button>

        <div class="ngxsmk-rte__divider"></div>

        <button
          type="button"
          class="ngxsmk-rte__tool-btn"
          title="Heading"
          (click)="execCommand('formatBlock', '<h2>')"
        >
          H2
        </button>
        <button
          type="button"
          class="ngxsmk-rte__tool-btn"
          title="Bullet List"
          (click)="execCommand('insertUnorderedList')"
        >
          • List
        </button>
        <button
          type="button"
          class="ngxsmk-rte__tool-btn"
          title="Numbered List"
          (click)="execCommand('insertOrderedList')"
        >
          1. List
        </button>
        <button
          type="button"
          class="ngxsmk-rte__tool-btn"
          title="Quote"
          (click)="execCommand('formatBlock', '<blockquote>')"
        >
          ” Quote
        </button>

        <div class="ngxsmk-rte__divider"></div>

        <button
          type="button"
          class="ngxsmk-rte__tool-btn"
          title="Clear Formatting"
          (click)="execCommand('removeFormat')"
        >
          Clear
        </button>
      </div>

      <!-- EDITABLE CANVAS -->
      <div
        #editorCanvas
        contenteditable="true"
        class="ngxsmk-rte__canvas"
        [style.min-height]="minHeight() + 'px'"
        [attr.data-placeholder]="placeholder()"
        (input)="onContentInput()"
        (blur)="onContentInput()"
      ></div>
    </div>
  `,
  host: {
    class: 'ngxsmk-rich-text-editor',
  },
  styles: `
    :host {
      display: block;
      width: 100%;
      font-family: var(--ngxsmk-font-sans, system-ui);
    }

    .ngxsmk-rte {
      border: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
      border-radius: var(--ngxsmk-radius-md, 0.375rem);
      background: var(--ngxsmk-color-surface, #ffffff);
      overflow: hidden;
      transition:
        border-color 0.15s ease,
        box-shadow 0.15s ease;
    }

    .ngxsmk-rte:focus-within {
      border-color: var(--ngxsmk-color-primary, #7c3aed);
      box-shadow: 0 0 0 3px
        color-mix(in srgb, var(--ngxsmk-color-primary, #7c3aed) 12%, transparent);
    }

    .ngxsmk-rte__toolbar {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.2rem;
      padding: 0.35rem 0.5rem;
      background: var(--ngxsmk-color-surface-variant, #f4f4f5);
      border-bottom: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
    }

    .ngxsmk-rte__tool-btn {
      padding: 0.25rem 0.45rem;
      border: 1px solid transparent;
      border-radius: var(--ngxsmk-radius-sm, 0.25rem);
      background: none;
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
      font-family: inherit;
      font-size: 0.775rem;
      font-weight: 600;
      cursor: pointer;
      transition:
        background 0.15s ease,
        color 0.15s ease;
    }

    .ngxsmk-rte__tool-btn:hover {
      background: var(--ngxsmk-color-surface, #ffffff);
      color: var(--ngxsmk-color-on-surface, #09090b);
      border-color: var(--ngxsmk-color-outline, #e4e4e7);
    }

    .ngxsmk-rte__divider {
      width: 1px;
      height: 1.2rem;
      background: var(--ngxsmk-color-outline, #e4e4e7);
      margin: 0 0.2rem;
    }

    .ngxsmk-rte__canvas {
      padding: 0.75rem 1rem;
      outline: none;
      font-size: 0.9rem;
      line-height: 1.6;
      color: var(--ngxsmk-color-on-surface, #09090b);
      overflow-y: auto;
    }

    .ngxsmk-rte__canvas:empty::before {
      content: attr(data-placeholder);
      color: var(--ngxsmk-color-on-surface-variant, #a1a1aa);
      pointer-events: none;
    }

    .ngxsmk-rte--disabled {
      opacity: 0.6;
      pointer-events: none;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkRichTextEditor {
  @ViewChild('editorCanvas') editorCanvas!: ElementRef<HTMLDivElement>;

  /** Placeholder prompt text for empty editor. */
  readonly placeholder = input<string>('Write content...');

  /** Disable editor canvas. Default: false. */
  readonly disabled = input<boolean>(false);

  /** Minimum editor canvas height in pixels. Default: 140. */
  readonly minHeight = input<number>(140);

  /** Two-way signal model for HTML string content. */
  readonly value = model<string>('');

  protected execCommand(command: string, arg: string | undefined = undefined): void {
    if (typeof document === 'undefined') return;
    document.execCommand(command, false, arg);
    this.onContentInput();
  }

  protected onContentInput(): void {
    if (!this.editorCanvas) return;
    const html = this.editorCanvas.nativeElement.innerHTML;
    this.value.set(html);
  }
}
