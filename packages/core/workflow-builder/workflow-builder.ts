import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface WorkflowNode {
  id: string;
  label: string;
  type: string;
}

export interface WorkflowEdge {
  from: string;
  to: string;
}

@Component({
  standalone: true,
  selector: 'ngxsmk-workflow-builder',
  template: `
    <div class="ngxsmk-workflow-builder__canvas">
      @for (node of nodes(); track node.id) {
        <div class="ngxsmk-workflow-builder__node">
          <div class="ngxsmk-workflow-builder__node-label">{{ node.label }}</div>
          <div class="ngxsmk-workflow-builder__node-type">{{ node.type }}</div>
        </div>
      }
    </div>
  `,
  host: { class: 'ngxsmk-workflow-builder' },
  styles: `
    :host {
      display: block;
      min-height: 20rem;
      background: var(--ngxsmk-color-surface-container);
      border-radius: var(--ngxsmk-radius-lg);
      border: 1px solid var(--ngxsmk-color-outline-variant);
      font-family: var(--ngxsmk-font-sans);
    }
    .ngxsmk-workflow-builder__canvas {
      display: flex;
      flex-wrap: wrap;
      gap: var(--ngxsmk-space-4);
      padding: var(--ngxsmk-space-4);
    }
    .ngxsmk-workflow-builder__node {
      padding: var(--ngxsmk-space-3);
      background: var(--ngxsmk-color-surface);
      border-radius: var(--ngxsmk-radius-md);
      border: 1px solid var(--ngxsmk-color-outline);
      min-width: 8rem;
      cursor: pointer;
    }
    .ngxsmk-workflow-builder__node:hover {
      border-color: var(--ngxsmk-color-primary);
      box-shadow: var(--ngxsmk-shadow-sm);
    }
    .ngxsmk-workflow-builder__node-label {
      font-weight: 500;
      font-size: 0.875rem;
      color: var(--ngxsmk-color-on-surface);
    }
    .ngxsmk-workflow-builder__node-type {
      font-size: 0.6875rem;
      color: var(--ngxsmk-color-on-surface-variant);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkWorkflowBuilder {
  readonly nodes = input.required<WorkflowNode[]>();
  readonly edges = input<WorkflowEdge[]>([]);
}
