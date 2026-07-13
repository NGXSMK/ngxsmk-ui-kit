import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface ToolCall {
  id: string;
  name: string;
  args: Record<string, unknown>;
  result?: string;
  status: 'running' | 'completed' | 'error';
}

@Component({
  selector: 'ngxsmk-tool-call-viewer',
  template: `
    @for (call of calls(); track call.id) {
      <div class="ngxsmk-tool-call-viewer__item" [attr.data-status]="call.status">
        <div class="ngxsmk-tool-call-viewer__header">
          <span class="ngxsmk-tool-call-viewer__name">🔧 {{ call.name }}</span>
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
    :host { display: flex; flex-direction: column; gap: var(--ngxsmk-space-2); font-family: var(--ngxsmk-font-sans); font-size: 0.8125rem; }
    .ngxsmk-tool-call-viewer__item { padding: var(--ngxsmk-space-2) var(--ngxsmk-space-3); border-radius: var(--ngxsmk-radius-md); background: var(--ngxsmk-color-surface-variant); }
    .ngxsmk-tool-call-viewer__header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--ngxsmk-space-1); }
    .ngxsmk-tool-call-viewer__name { font-weight: 500; color: var(--ngxsmk-color-on-surface); }
    .ngxsmk-tool-call-viewer__status { font-size: 0.6875rem; text-transform: uppercase; }
    .ngxsmk-tool-call-viewer__item[data-status='running'] .ngxsmk-tool-call-viewer__status { color: var(--ngxsmk-color-primary); }
    .ngxsmk-tool-call-viewer__item[data-status='completed'] .ngxsmk-tool-call-viewer__status { color: var(--ngxsmk-color-success); }
    .ngxsmk-tool-call-viewer__item[data-status='error'] .ngxsmk-tool-call-viewer__status { color: var(--ngxsmk-color-error); }
    .ngxsmk-tool-call-viewer__args, .ngxsmk-tool-call-viewer__result { font-family: var(--ngxsmk-font-mono); font-size: 0.75rem; color: var(--ngxsmk-color-on-surface-variant); word-break: break-all; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkToolCallViewer {
  readonly calls = input.required<ToolCall[]>();

  protected stringify(v: unknown): string {
    return JSON.stringify(v, null, 1);
  }
}
