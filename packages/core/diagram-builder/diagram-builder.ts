import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

export interface DiagramNode {
  id: string;
  label: string;
  x: number;
  y: number;
}

export interface DiagramEdge {
  from: string;
  to: string;
}

@Component({
  standalone: true,
  selector: 'ngxsmk-diagram-builder',
  template: `
    <svg class="ngxsmk-diagram-builder__svg">
      @for (edge of edges(); track $index) {
        <line class="ngxsmk-diagram-builder__edge" [attr.x1]="nodeX(edge.from)" [attr.y1]="nodeY(edge.from)" [attr.x2]="nodeX(edge.to)" [attr.y2]="nodeY(edge.to)" />
      }
      @for (node of nodes(); track node.id) {
        <g class="ngxsmk-diagram-builder__node" (click)="selected.emit(node.id)">
          <rect [attr.x]="node.x" [attr.y]="node.y" width="120" height="40" rx="8" />
          <text [attr.x]="node.x + 60" [attr.y]="node.y + 24" text-anchor="middle">{{ node.label }}</text>
        </g>
      }
    </svg>
  `,
  host: { class: 'ngxsmk-diagram-builder' },
  styles: `
    :host { display: block; min-height: 20rem; font-family: var(--ngxsmk-font-sans); }
    .ngxsmk-diagram-builder__svg { width: 100%; height: 100%; min-height: 20rem; }
    .ngxsmk-diagram-builder__edge { stroke: var(--ngxsmk-color-outline); stroke-width: 2; }
    .ngxsmk-diagram-builder__node rect { fill: var(--ngxsmk-color-surface); stroke: var(--ngxsmk-color-outline); stroke-width: 1; cursor: pointer; }
    .ngxsmk-diagram-builder__node:hover rect { stroke: var(--ngxsmk-color-primary); }
    .ngxsmk-diagram-builder__node text { fill: var(--ngxsmk-color-on-surface); font-size: 0.75rem; pointer-events: none; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkDiagramBuilder {
  readonly nodes = input.required<DiagramNode[]>();
  readonly edges = input.required<DiagramEdge[]>();
  readonly selected = output<string>();

  protected nodeX(id: string): number {
    const n = this.nodes().find(n => n.id === id);
    return n ? n.x + 60 : 0;
  }

  protected nodeY(id: string): number {
    const n = this.nodes().find(n => n.id === id);
    return n ? n.y + 20 : 0;
  }
}
