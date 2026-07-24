import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface ToolCall {
  id: string;
  name: string;
  args: Record<string, unknown>;
  result?: string;
  status: 'running' | 'completed' | 'error';
}

@Component({
  standalone: true,
  selector: 'ngxsmk-tool-call-viewer',
  template: `
    @for (call of calls(); track call.id) {
      <div class="ngxsmk-tool-call-viewer__item" [attr.data-status]="call.status">
        <div class="ngxsmk-tool-call-viewer__header">
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
          <span class="ngxsmk-tool-call-viewer__status">{{ call.status }}</span>
        </div>
        <div class="ngxsmk-tool-call-viewer__args">{{ stringify(call.args) }}</div>
        @if (call.result) {
          <div class="ngxsmk-tool-call-viewer__result">{{ call.result }}</div>
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
      padding: var(--ngxsmk-space-2) var(--ngxsmk-space-3);
      border-radius: var(--ngxsmk-radius-md);
      background: var(--ngxsmk-color-surface-variant);
    }
    .ngxsmk-tool-call-viewer__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--ngxsmk-space-1);
    }
    .ngxsmk-tool-call-viewer__name {
      font-weight: 500;
      color: var(--ngxsmk-color-on-surface);
    }
    .ngxsmk-tool-call-viewer__status {
      font-size: var(--ngxsmk-text-label-sm-size);
      text-transform: uppercase;
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
    .ngxsmk-tool-call-viewer__name svg {
      display: inline-block;
      vertical-align: -2px;
      margin-right: 4px;
    }
    .ngxsmk-tool-call-viewer__args,
    .ngxsmk-tool-call-viewer__result {
      font-family: var(--ngxsmk-font-mono);
      font-size: var(--ngxsmk-text-label-md-size);
      color: var(--ngxsmk-color-on-surface-variant);
      word-break: break-all;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkToolCallViewer {
  readonly calls = input.required<ToolCall[]>();

  protected stringify(v: unknown): string {
    return JSON.stringify(v, null, 1);
  }
}
