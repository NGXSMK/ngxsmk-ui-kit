import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface OrgNode {
  id: string;
  name: string;
  role: string;
  children?: OrgNode[];
}

@Component({
  standalone: true,
  selector: 'ngxsmk-org-chart',
  template: `
    <div class="ngxsmk-org-chart__tree">
      @for (node of nodes(); track node.id) {
        <div class="ngxsmk-org-chart__node">
          <div class="ngxsmk-org-chart__card">
            <div class="ngxsmk-org-chart__name">{{ node.name }}</div>
            <div class="ngxsmk-org-chart__role">{{ node.role }}</div>
          </div>
          @if (node.children?.length) {
            <div class="ngxsmk-org-chart__children">
              @for (child of node.children; track child.id) {
                <div class="ngxsmk-org-chart__node">
                  <div class="ngxsmk-org-chart__card">
                    <div class="ngxsmk-org-chart__name">{{ child.name }}</div>
                    <div class="ngxsmk-org-chart__role">{{ child.role }}</div>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      }
    </div>
  `,
  host: { class: 'ngxsmk-org-chart' },
  styles: `
    :host {
      display: block;
      max-width: 100%;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      font-family: var(--ngxsmk-font-sans);
      font-size: 0.8125rem;
    }
    .ngxsmk-org-chart__tree {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--ngxsmk-space-4);
    }
    .ngxsmk-org-chart__children {
      display: flex;
      gap: var(--ngxsmk-space-3);
      margin-top: var(--ngxsmk-space-2);
    }
    .ngxsmk-org-chart__card {
      padding: var(--ngxsmk-space-3) var(--ngxsmk-space-4);
      background: var(--ngxsmk-color-surface);
      border: 1px solid var(--ngxsmk-color-outline-variant);
      border-radius: var(--ngxsmk-radius-md);
      text-align: center;
      min-width: 8rem;
    }
    .ngxsmk-org-chart__name {
      font-weight: 600;
      color: var(--ngxsmk-color-on-surface);
    }
    .ngxsmk-org-chart__role {
      font-size: var(--ngxsmk-text-label-sm-size);
      color: var(--ngxsmk-color-on-surface-variant);
      margin-top: var(--ngxsmk-space-1);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkOrgChart {
  readonly nodes = input.required<OrgNode[]>();
}
