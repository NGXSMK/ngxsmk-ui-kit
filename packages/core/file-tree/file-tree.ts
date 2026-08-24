import { ChangeDetectionStrategy, Component, input, model, output, signal } from '@angular/core';

export interface NgxsmkFileTreeNode {
  id?: string;
  name?: string;
  label?: string;
  type: 'file' | 'folder';
  expanded?: boolean;
  children?: NgxsmkFileTreeNode[];
}

export type FileNode = NgxsmkFileTreeNode;
export type NgxsmkFileNode = NgxsmkFileTreeNode;

/**
 * Directory explorer file tree component with folder collapse/expand and file selection.
 *
 * ```html
 * <ngxsmk-file-tree [nodes]="directoryTree" [(selectedId)]="activeFileId" (nodeSelect)="onFileOpen($event)" />
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-file-tree',
  template: `
    <ul class="ngxsmk-file-tree__list">
      @for (node of nodes(); track getNodeId(node)) {
        <li class="ngxsmk-file-tree__item">
          <button
            type="button"
            class="ngxsmk-file-tree__node-btn"
            [class.ngxsmk-file-tree__node-btn--active]="selectedId() === getNodeId(node)"
            (click)="toggleOrSelect(node)"
          >
            <!-- EXPAND/COLLAPSE ARROW OR INDENT -->
            @if (node.type === 'folder') {
              <span
                class="ngxsmk-file-tree__arrow"
                [class.ngxsmk-file-tree__arrow--open]="isExpanded(node)"
              >
                ▸
              </span>
              <span class="ngxsmk-file-tree__icon">📁</span>
            } @else {
              <span class="ngxsmk-file-tree__indent"></span>
              <span class="ngxsmk-file-tree__icon">📄</span>
            }

            <span class="ngxsmk-file-tree__label">{{ getNodeLabel(node) }}</span>
          </button>

          <!-- NESTED CHILD NODES -->
          @if (
            node.type === 'folder' && isExpanded(node) && node.children && node.children.length > 0
          ) {
            <ngxsmk-file-tree
              [nodes]="node.children"
              [(selectedId)]="selectedId"
              (nodeSelect)="nodeSelect.emit($event)"
              class="ngxsmk-file-tree__sub"
            />
          }
        </li>
      }
    </ul>
  `,
  host: {
    class: 'ngxsmk-file-tree',
  },
  styles: `
    :host {
      display: block;
      font-family: var(--ngxsmk-font-sans, system-ui);
    }

    .ngxsmk-file-tree__list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 0.1rem;
    }

    .ngxsmk-file-tree__sub {
      padding-left: 1.15rem;
    }

    .ngxsmk-file-tree__node-btn {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      width: 100%;
      padding: 0.25rem 0.5rem;
      border: none;
      background: none;
      color: var(--ngxsmk-color-on-surface);
      font-family: inherit;
      font-size: 0.825rem;
      font-weight: 500;
      text-align: left;
      cursor: pointer;
      border-radius: var(--ngxsmk-radius-sm, 0.25rem);
      transition: background-color 0.15s ease;
    }

    .ngxsmk-file-tree__node-btn:hover {
      background: var(--ngxsmk-color-surface-variant);
    }

    .ngxsmk-file-tree__node-btn--active {
      background: var(--ngxsmk-color-primary-container);
      color: var(--ngxsmk-color-primary);
      font-weight: 600;
    }

    .ngxsmk-file-tree__arrow {
      font-size: 0.75rem;
      color: var(--ngxsmk-color-on-surface-variant);
      transition: transform 0.15s ease;
    }

    .ngxsmk-file-tree__arrow--open {
      transform: rotate(90deg);
    }

    .ngxsmk-file-tree__indent {
      width: 0.75rem;
    }

    .ngxsmk-file-tree__icon {
      font-size: 0.85rem;
    }

    .ngxsmk-file-tree__label {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkFileTree {
  /** Array of file/folder tree nodes. */
  readonly nodes = input<NgxsmkFileTreeNode[]>([]);

  /** Two-way signal model for currently selected node ID. */
  readonly selectedId = model<string>('');

  /** Emits when a node is selected. */
  readonly nodeSelect = output<NgxsmkFileTreeNode>();

  protected readonly expandedIds = signal<Set<string>>(new Set());

  protected getNodeId(node: NgxsmkFileTreeNode): string {
    return node.id || node.name || node.label || 'file';
  }

  protected getNodeLabel(node: NgxsmkFileTreeNode): string {
    return node.name || node.label || node.id || '';
  }

  protected isExpanded(node: NgxsmkFileTreeNode): boolean {
    const id = this.getNodeId(node);
    if (this.expandedIds().has(id)) return true;
    return node.expanded ?? false;
  }

  protected toggleOrSelect(node: NgxsmkFileTreeNode): void {
    const id = this.getNodeId(node);
    if (node.type === 'folder') {
      this.expandedIds.update((set) => {
        const next = new Set(set);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        return next;
      });
    } else {
      this.selectedId.set(id);
      this.nodeSelect.emit(node);
    }
  }
}
