import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  computed,
  inject,
  input,
  model,
  signal,
} from '@angular/core';

export interface NgxsmkTreeSelectNode {
  id?: string;
  key?: string;
  label: string;
  children?: NgxsmkTreeSelectNode[];
}

export type TreeNode = NgxsmkTreeSelectNode;

/**
 * Hierarchical tree dropdown selector with multi-checkbox nodes and tag preview.
 *
 * ```html
 * <ngxsmk-tree-select [nodes]="categoryTree" [(selectedKeys)]="selectedCategories" />
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-tree-select',
  template: `
    <div class="ngxsmk-tree-sel">
      <!-- SELECT CONTROL TRIGGER BUTTON -->
      <div
        class="ngxsmk-tree-sel__trigger"
        role="button"
        tabindex="0"
        (click)="toggleOpen()"
        (keydown.enter)="toggleOpen()"
        (keydown.space)="toggleOpen()"
      >
        @if (activeSelectedIds().length === 0) {
          <span class="ngxsmk-tree-sel__ph">{{ placeholder() }}</span>
        } @else {
          <div class="ngxsmk-tree-sel__tags">
            @for (id of activeSelectedIds().slice(0, 3); track id) {
              <span class="ngxsmk-tree-sel__tag">{{ getLabel(id) }}</span>
            }
            @if (activeSelectedIds().length > 3) {
              <span class="ngxsmk-tree-sel__more">+{{ activeSelectedIds().length - 3 }}</span>
            }
          </div>
        }
      </div>

      <!-- DROPDOWN PANEL -->
      @if (isOpen()) {
        <div class="ngxsmk-tree-sel__panel">
          @for (node of nodes(); track getNodeKey(node)) {
            <div class="ngxsmk-tree-sel__node">
              <label class="ngxsmk-tree-sel__node-label">
                <input
                  type="checkbox"
                  [checked]="isSelected(getNodeKey(node))"
                  (change)="toggleNode(getNodeKey(node))"
                />
                <span>{{ node.label }}</span>
              </label>

              @if (node.children && node.children.length > 0) {
                <div class="ngxsmk-tree-sel__children">
                  @for (child of node.children; track getNodeKey(child)) {
                    <label class="ngxsmk-tree-sel__node-label">
                      <input
                        type="checkbox"
                        [checked]="isSelected(getNodeKey(child))"
                        (change)="toggleNode(getNodeKey(child))"
                      />
                      <span>{{ child.label }}</span>
                    </label>
                  }
                </div>
              }
            </div>
          }
        </div>
      }
    </div>
  `,
  host: {
    class: 'ngxsmk-tree-select',
  },
  styles: `
    :host {
      display: inline-block;
      width: 100%;
      position: relative;
      font-family: var(--ngxsmk-font-sans, system-ui);
    }

    .ngxsmk-tree-sel__trigger {
      padding: 0.5rem 0.75rem;
      border-radius: var(--ngxsmk-radius-md, 0.375rem);
      border: 1px solid var(--ngxsmk-color-outline);
      background: var(--ngxsmk-color-surface);
      cursor: pointer;
      min-height: 2.5rem;
      display: flex;
      align-items: center;
    }

    .ngxsmk-tree-sel__ph {
      color: var(--ngxsmk-color-on-surface-variant);
      font-size: 0.875rem;
    }

    .ngxsmk-tree-sel__tags {
      display: flex;
      gap: 0.35rem;
      flex-wrap: wrap;
    }

    .ngxsmk-tree-sel__tag {
      font-size: 0.75rem;
      background: var(--ngxsmk-color-surface-variant);
      padding: 0.15rem 0.4rem;
      border-radius: var(--ngxsmk-radius-sm, 0.25rem);
      color: var(--ngxsmk-color-on-surface);
    }

    .ngxsmk-tree-sel__more {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--ngxsmk-color-primary);
    }

    .ngxsmk-tree-sel__panel {
      position: absolute;
      top: calc(100% + 0.25rem);
      left: 0;
      right: 0;
      z-index: 100;
      background: var(--ngxsmk-color-surface);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-md, 0.375rem);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      max-height: 14rem;
      overflow-y: auto;
      padding: 0.5rem;
    }

    .ngxsmk-tree-sel__node {
      display: flex;
      flex-direction: column;
    }

    .ngxsmk-tree-sel__node-label {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.3rem 0.4rem;
      font-size: 0.85rem;
      cursor: pointer;
      border-radius: var(--ngxsmk-radius-sm, 0.25rem);
    }

    .ngxsmk-tree-sel__children {
      padding-left: 1.25rem;
      display: flex;
      flex-direction: column;
    }

    .ngxsmk-tree-sel__node-label:hover {
      background: var(--ngxsmk-color-surface-variant);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkTreeSelect {
  /** Array of hierarchical tree nodes. */
  readonly nodes = input<NgxsmkTreeSelectNode[]>([]);

  /** Placeholder trigger text. Default: 'Select items...'. */
  readonly placeholder = input<string>('Select items...');

  /** Two-way signal model array of selected node IDs. */
  readonly selectedIds = model<string[]>([]);

  /** Two-way signal model array of selected node keys. */
  readonly selectedKeys = model<string[]>([]);

  private readonly elementRef = inject(ElementRef);

  protected readonly isOpen = signal(false);

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (this.isOpen() && !this.elementRef.nativeElement.contains(event.target as Node)) {
      this.isOpen.set(false);
    }
  }

  protected readonly activeSelectedIds = computed(() => {
    return this.selectedKeys().length > 0 ? this.selectedKeys() : this.selectedIds();
  });

  protected getNodeKey(node: NgxsmkTreeSelectNode): string {
    return node.key || node.id || node.label;
  }

  protected toggleOpen(): void {
    this.isOpen.update((v) => !v);
  }

  protected isSelected(id: string): boolean {
    return this.activeSelectedIds().includes(id);
  }

  protected toggleNode(id: string): void {
    if (this.selectedKeys().length > 0 || this.selectedIds().length === 0) {
      this.selectedKeys.update((list) =>
        list.includes(id) ? list.filter((i) => i !== id) : [...list, id],
      );
    }
    this.selectedIds.update((list) =>
      list.includes(id) ? list.filter((i) => i !== id) : [...list, id],
    );
  }

  protected getLabel(id: string): string {
    for (const parent of this.nodes()) {
      if (this.getNodeKey(parent) === id) return parent.label;
      if (parent.children) {
        const match = parent.children.find((c) => this.getNodeKey(c) === id);
        if (match) return match.label;
      }
    }
    return id;
  }
}
