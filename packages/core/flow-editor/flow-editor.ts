import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'ngxsmk-flow-editor',
  template: `
    <div class="ngxsmk-flow-editor__toolbar">
      <span class="ngxsmk-flow-editor__title">{{ title() }}</span>
    </div>
    <div class="ngxsmk-flow-editor__canvas">
      @for (node of nodes(); track node.id) {
        <div class="ngxsmk-flow-editor__node">{{ node.label }}</div>
      }
    </div>
  `,
  host: { class: 'ngxsmk-flow-editor' },
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      border: 1px solid var(--ngxsmk-color-outline-variant);
      border-radius: var(--ngxsmk-radius-lg);
      overflow: hidden;
      font-family: var(--ngxsmk-font-sans);
    }
    .ngxsmk-flow-editor__toolbar {
      padding: var(--ngxsmk-space-2) var(--ngxsmk-space-4);
      background: var(--ngxsmk-color-surface-variant);
      border-bottom: 1px solid var(--ngxsmk-color-outline-variant);
    }
    .ngxsmk-flow-editor__title {
      font-weight: 600;
      font-size: var(--ngxsmk-text-label-lg-size);
      color: var(--ngxsmk-color-on-surface);
    }
    .ngxsmk-flow-editor__canvas {
      flex: 1;
      min-height: 20rem;
      display: flex;
      flex-wrap: wrap;
      gap: var(--ngxsmk-space-4);
      padding: var(--ngxsmk-space-4);
      background: var(--ngxsmk-color-surface-container);
    }
    .ngxsmk-flow-editor__node {
      padding: var(--ngxsmk-space-3);
      background: var(--ngxsmk-color-surface);
      border: 1px solid var(--ngxsmk-color-primary);
      border-radius: var(--ngxsmk-radius-md);
      cursor: pointer;
      font-size: var(--ngxsmk-text-body-sm-size);
      color: var(--ngxsmk-color-on-surface);
    }
    .ngxsmk-flow-editor__node:hover {
      box-shadow: var(--ngxsmk-shadow-md);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkFlowEditor {
  readonly title = input('Flow Editor');
  readonly nodes = input.required<{ id: string; label: string }[]>();
}
