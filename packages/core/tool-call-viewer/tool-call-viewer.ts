import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

export interface ToolCall {
  id: string;
  name: string;
  args: Record<string, unknown>;
  result?: string;
  status: 'running' | 'completed' | 'error';
}

/** @deprecated Prefer `ToolCall`. Alias kept for registry/search compatibility. */
export type NgxsmkToolCall = ToolCall;

/**
 * Expandable list of AI tool / function calls with status and JSON args/results.
 *
 * ```html
 * <ngxsmk-tool-call-viewer [calls]="calls" />
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-tool-call-viewer',
  template: `
    @for (call of calls(); track call.id) {
      <div class="ngxsmk-tool-call-viewer__item" [attr.data-status]="call.status">
        <button
          type="button"
          class="ngxsmk-tool-call-viewer__header"
          [attr.aria-expanded]="isOpen(call.id)"
          (click)="toggle(call.id)"
        >
          <span class="ngxsmk-tool-call-viewer__name">
            <svg
              viewBox="0 0 24 24"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path
                d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
              />
            </svg>
            {{ call.name }}
          </span>
          <span class="ngxsmk-tool-call-viewer__status">
            @if (call.status === 'running') {
              <span class="ngxsmk-tool-call-viewer__spinner" aria-hidden="true"></span>
            }
            {{ call.status }}
          </span>
        </button>
        @if (isOpen(call.id)) {
          <div class="ngxsmk-tool-call-viewer__body">
            <div class="ngxsmk-tool-call-viewer__label">Arguments</div>
            <pre class="ngxsmk-tool-call-viewer__args">{{ stringify(call.args) }}</pre>
            @if (call.result) {
              <div class="ngxsmk-tool-call-viewer__label">Result</div>
              <pre class="ngxsmk-tool-call-viewer__result">{{ call.result }}</pre>
            }
            @if (call.status === 'error' && !call.result) {
              <div class="ngxsmk-tool-call-viewer__error">Tool call failed</div>
            }
          </div>
        }
      </div>
    }
  `,
  host: { class: 'ngxsmk-tool-call-viewer' },
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: var(--ngxsmk-space-2);
      font-family: var(--ngxsmk-font-sans);
      font-size: var(--ngxsmk-text-body-sm-size);
    }
    .ngxsmk-tool-call-viewer__item {
      border-radius: var(--ngxsmk-radius-md);
      background: var(--ngxsmk-color-surface-variant);
      border: 1px solid var(--ngxsmk-color-outline);
      overflow: hidden;
    }
    .ngxsmk-tool-call-viewer__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--ngxsmk-space-2);
      width: 100%;
      padding: var(--ngxsmk-space-2) var(--ngxsmk-space-3);
      border: none;
      background: transparent;
      cursor: pointer;
      text-align: start;
      font: inherit;
      color: inherit;
    }
    .ngxsmk-tool-call-viewer__header:hover {
      background: color-mix(in srgb, var(--ngxsmk-color-on-surface) 4%, transparent);
    }
    .ngxsmk-tool-call-viewer__header:focus-visible {
      outline: none;
      box-shadow: inset var(--ngxsmk-focus-ring);
    }
    .ngxsmk-tool-call-viewer__name {
      font-weight: 500;
      color: var(--ngxsmk-color-on-surface);
      display: inline-flex;
      align-items: center;
      gap: var(--ngxsmk-space-1);
    }
    .ngxsmk-tool-call-viewer__status {
      display: inline-flex;
      align-items: center;
      gap: var(--ngxsmk-space-1);
      font-size: var(--ngxsmk-text-label-sm-size);
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }
    .ngxsmk-tool-call-viewer__item[data-status='running'] .ngxsmk-tool-call-viewer__status {
      color: var(--ngxsmk-color-primary);
    }
    .ngxsmk-tool-call-viewer__item[data-status='completed'] .ngxsmk-tool-call-viewer__status {
      color: var(--ngxsmk-color-success);
    }
    .ngxsmk-tool-call-viewer__item[data-status='error'] .ngxsmk-tool-call-viewer__status {
      color: var(--ngxsmk-color-error);
    }
    .ngxsmk-tool-call-viewer__spinner {
      width: 0.65rem;
      height: 0.65rem;
      border: 2px solid color-mix(in srgb, var(--ngxsmk-color-primary) 30%, transparent);
      border-top-color: var(--ngxsmk-color-primary);
      border-radius: 50%;
      animation: ngxsmk-tool-spin 0.7s linear infinite;
    }
    .ngxsmk-tool-call-viewer__body {
      padding: 0 var(--ngxsmk-space-3) var(--ngxsmk-space-3);
      border-top: 1px solid var(--ngxsmk-color-outline);
    }
    .ngxsmk-tool-call-viewer__label {
      margin-top: var(--ngxsmk-space-2);
      margin-bottom: var(--ngxsmk-space-1);
      font-size: var(--ngxsmk-text-label-sm-size, 0.75rem);
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--ngxsmk-color-on-surface-variant);
    }
    .ngxsmk-tool-call-viewer__args,
    .ngxsmk-tool-call-viewer__result {
      margin: 0;
      padding: var(--ngxsmk-space-2);
      border-radius: var(--ngxsmk-radius-sm);
      background: var(--ngxsmk-color-surface);
      font-family: var(--ngxsmk-font-mono);
      font-size: var(--ngxsmk-text-label-md-size);
      color: var(--ngxsmk-color-on-surface-variant);
      white-space: pre-wrap;
      word-break: break-word;
    }
    .ngxsmk-tool-call-viewer__error {
      margin-top: var(--ngxsmk-space-2);
      color: var(--ngxsmk-color-error);
      font-size: var(--ngxsmk-text-body-sm-size);
    }
    @keyframes ngxsmk-tool-spin {
      to {
        transform: rotate(360deg);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkToolCallViewer {
  readonly calls = input.required<ToolCall[]>();

  private readonly openIds = signal<Set<string>>(new Set());

  protected isOpen(id: string): boolean {
    return this.openIds().has(id);
  }

  protected toggle(id: string): void {
    this.openIds.update((set) => {
      const next = new Set(set);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  protected stringify(v: unknown): string {
    return JSON.stringify(v, null, 2);
  }
}

/** Alias for search / MCP registry naming. */
export { NgxsmkToolCallViewer as NgxsmkToolCallView };
