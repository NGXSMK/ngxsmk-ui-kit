import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';

export interface NgxsmkTreeNode<T = any> {
  id: string | number;
  label: string;
  children?: NgxsmkTreeNode<T>[];
  data?: T;
  disabled?: boolean;
}

@Component({
  standalone: true,
  selector: 'ngxsmk-tree-node',
  template: `
    <li
      role="treeitem"
      [attr.aria-expanded]="node().children ? isExpanded() : null"
      [attr.aria-level]="level() + 1"
    >
      <div
        class="ngxsmk-tree-node__content"
        [style.paddingLeft.px]="paddingLeft()"
        [class.selected]="isSelected()"
        [class.disabled]="node().disabled"
        (click)="onClick($event)"
      >
        @if (node().children && node().children!.length > 0) {
          <button
            type="button"
            class="ngxsmk-tree-node__toggle"
            (click)="toggle($event)"
            aria-label="Toggle node"
          >
            <svg
              viewBox="0 0 16 16"
              width="12"
              height="12"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              [style.transform]="isExpanded() ? 'rotate(90deg)' : 'none'"
            >
              <path d="M6 3l5 5-5 5" />
            </svg>
          </button>
        } @else {
          <span class="ngxsmk-tree-node__spacer"></span>
        }
        <span class="ngxsmk-tree-node__label">{{ node().label }}</span>
      </div>

      @if (node().children && node().children!.length > 0 && isExpanded()) {
        <ul role="group" class="ngxsmk-tree-node__children">
          @for (child of node().children; track child.id) {
            <ngxsmk-tree-node
              [node]="child"
              [selectable]="selectable()"
              [level]="level() + 1"
              (nodeSelected)="nodeSelected.emit($event)"
              (nodeExpanded)="nodeExpanded.emit($event)"
              (nodeCollapsed)="nodeCollapsed.emit($event)"
            />
          }
        </ul>
      }
    </li>
  `,
  styles: `
    .ngxsmk-tree-node__children {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .ngxsmk-tree-node__content {
      display: flex;
      align-items: center;
      gap: var(--ngxsmk-space-2);
      height: 2.25rem;
      padding-right: var(--ngxsmk-space-3);
      cursor: pointer;
      border-radius: var(--ngxsmk-radius-md);
      transition: background-color var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out);
      color: var(--ngxsmk-color-on-surface);
    }
    .ngxsmk-tree-node__content:hover:not(.disabled) {
      background: var(--ngxsmk-color-surface-hover);
    }
    .ngxsmk-tree-node__content.selected {
      background: var(--ngxsmk-color-primary-container);
      color: var(--ngxsmk-color-on-primary-container);
    }
    .ngxsmk-tree-node__content.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .ngxsmk-tree-node__toggle {
      background: transparent;
      border: none;
      padding: 0;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1.25rem;
      height: 1.25rem;
      color: currentColor;
    }
    .ngxsmk-tree-node__toggle svg {
      transition: transform var(--ngxsmk-motion-duration) var(--ngxsmk-motion-ease);
    }

    .ngxsmk-tree-node__spacer {
      width: 1.25rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkTreeNodeComponent {
  private readonly tree = inject<NgxsmkTreeView>(NgxsmkTreeView);

  readonly node = input.required<NgxsmkTreeNode>();
  readonly level = input<number>(0);
  readonly selectable = input<'none' | 'single' | 'multi'>('none');

  readonly nodeSelected = output<NgxsmkTreeNode>();
  readonly nodeExpanded = output<NgxsmkTreeNode>();
  readonly nodeCollapsed = output<NgxsmkTreeNode>();

  protected readonly paddingLeft = computed(() => this.level() * 16 + 8);
  protected readonly isExpanded = computed(() => this.tree.isNodeExpanded(this.node().id));
  protected readonly isSelected = computed(() => this.tree.isNodeSelected(this.node().id));

  protected toggle(event: MouseEvent): void {
    event.stopPropagation();
    this.tree.toggleNode(this.node());
  }

  protected onClick(event: MouseEvent): void {
    if (this.node().disabled) {
      return;
    }
    this.tree.selectNode(this.node());
  }
}

@Component({
  standalone: true,
  selector: 'ngxsmk-tree-view',
  imports: [NgxsmkTreeNodeComponent],
  template: `
    <ul class="ngxsmk-tree-view__list" role="tree">
      @for (node of nodes(); track node.id) {
        <ngxsmk-tree-node
          [node]="node"
          [selectable]="selectable()"
          [level]="0"
          (nodeSelected)="nodeSelected.emit($event)"
          (nodeExpanded)="nodeExpanded.emit($event)"
          (nodeCollapsed)="nodeCollapsed.emit($event)"
        />
      }
    </ul>
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--ngxsmk-font-sans);
    }
    .ngxsmk-tree-view__list {
      list-style: none;
      margin: 0;
      padding: 0;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkTreeView {
  readonly nodes = input<NgxsmkTreeNode[]>([]);
  readonly selectable = input<'none' | 'single' | 'multi'>('none');

  readonly nodeSelected = output<NgxsmkTreeNode>();
  readonly nodeExpanded = output<NgxsmkTreeNode>();
  readonly nodeCollapsed = output<NgxsmkTreeNode>();

  protected readonly expandedIds = signal<Set<string | number>>(new Set());
  protected readonly selectedIds = signal<Set<string | number>>(new Set());

  isNodeExpanded(id: string | number): boolean {
    return this.expandedIds().has(id);
  }

  isNodeSelected(id: string | number): boolean {
    return this.selectedIds().has(id);
  }

  toggleNode(node: NgxsmkTreeNode): void {
    this.expandedIds.update((set) => {
      const next = new Set(set);
      if (next.has(node.id)) {
        next.delete(node.id);
        this.nodeCollapsed.emit(node);
      } else {
        next.add(node.id);
        this.nodeExpanded.emit(node);
      }
      return next;
    });
  }

  selectNode(node: NgxsmkTreeNode): void {
    const mode = this.selectable();
    if (mode === 'none') {
      return;
    }

    this.selectedIds.update((set) => {
      const next = new Set(set);
      if (mode === 'single') {
        next.clear();
        next.add(node.id);
      } else {
        if (next.has(node.id)) {
          next.delete(node.id);
        } else {
          next.add(node.id);
        }
      }
      return next;
    });

    this.nodeSelected.emit(node);
  }

  expandAll(): void {
    const ids = new Set<string | number>();
    const visit = (nodesList: NgxsmkTreeNode[]) => {
      for (const n of nodesList) {
        if (n.children && n.children.length > 0) {
          ids.add(n.id);
          visit(n.children);
        }
      }
    };
    visit(this.nodes());
    this.expandedIds.set(ids);
  }

  collapseAll(): void {
    this.expandedIds.set(new Set());
  }
}
