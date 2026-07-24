import { UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, model, output, signal } from '@angular/core';

export interface NgxsmkKanbanColumn {
  id: string;
  title: string;
  color?: string;
  items?: NgxsmkKanbanItem[];
}

export type KanbanColumn = NgxsmkKanbanColumn;

export interface NgxsmkKanbanItem {
  id: string;
  columnId?: string;
  title: string;
  description?: string;
  tags?: string[];
  assignee?: string;
}

export type KanbanItem = NgxsmkKanbanItem;

/**
 * Multi-column Kanban task board component with native HTML5 drag-and-drop.
 *
 * ```html
 * <ngxsmk-kanban-board [(columns)]="boardCols" [(items)]="boardTasks" (itemDropped)="onDrop($event)" />
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-kanban-board',
  imports: [UpperCasePipe],
  template: `
    <div class="ngxsmk-kanban">
      @for (col of columns(); track col.id) {
        <div
          class="ngxsmk-kanban__col"
          [class.ngxsmk-kanban__col--drag-over]="dragOverColId() === col.id"
          (dragover)="_onDragOver($event, col.id)"
          (dragleave)="_onDragLeave($event, col.id)"
          (drop)="_onDrop($event, col.id)"
        >
          <!-- COLUMN HEADER -->
          <div class="ngxsmk-kanban__col-header">
            <div class="ngxsmk-kanban__col-title-wrap">
              @if (col.color) {
                <span class="ngxsmk-kanban__dot" [style.background]="col.color"></span>
              }
              <h4 class="ngxsmk-kanban__col-title">{{ col.title }}</h4>
            </div>
            <span class="ngxsmk-kanban__count">
              {{ getColumnItems(col.id).length }}
            </span>
          </div>

          <!-- COLUMN CARDS LIST -->
          <div class="ngxsmk-kanban__col-list">
            @for (item of getColumnItems(col.id); track item.id) {
              <div
                class="ngxsmk-kanban__card"
                [class.ngxsmk-kanban__card--dragging]="draggedItem()?.id === item.id"
                [draggable]="true"
                role="button"
                tabindex="0"
                (dragstart)="_onDragStart($event, item, col.id)"
                (dragend)="_onDragEnd()"
                (click)="cardClick.emit(item)"
                (keydown.enter)="cardClick.emit(item)"
                (keydown.space)="cardClick.emit(item)"
              >
                <h5 class="ngxsmk-kanban__card-title">{{ item.title }}</h5>
                @if (item.description) {
                  <p class="ngxsmk-kanban__card-desc">{{ item.description }}</p>
                }
                <div class="ngxsmk-kanban__card-footer">
                  @if (item.tags && item.tags.length > 0) {
                    <div class="ngxsmk-kanban__card-tags">
                      @for (tag of item.tags; track tag) {
                        <span class="ngxsmk-kanban__card-tag">{{ tag }}</span>
                      }
                    </div>
                  }
                  @if (item.assignee) {
                    <span class="ngxsmk-kanban__avatar">{{
                      item.assignee.slice(0, 2) | uppercase
                    }}</span>
                  }
                </div>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  host: {
    class: 'ngxsmk-kanban-board',
  },
  styles: `
    :host {
      display: block;
      width: 100%;
      font-family: var(--ngxsmk-font-sans, system-ui);
    }

    .ngxsmk-kanban {
      display: flex;
      gap: 1rem;
      overflow-x: auto;
      padding-bottom: 0.5rem;
    }

    .ngxsmk-kanban__col {
      flex: 1;
      min-width: 16rem;
      max-width: 22rem;
      background: var(--ngxsmk-color-surface-variant, #f4f4f5);
      border: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
      border-radius: var(--ngxsmk-radius-lg, 0.5rem);
      padding: 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.65rem;
      transition:
        background-color 0.15s ease,
        border-color 0.15s ease,
        box-shadow 0.15s ease;
    }

    .ngxsmk-kanban__col--drag-over {
      border-color: var(--ngxsmk-color-primary, #7c3aed);
      background: color-mix(
        in srgb,
        var(--ngxsmk-color-primary, #7c3aed) 8%,
        var(--ngxsmk-color-surface-variant, #f4f4f5)
      );
      box-shadow: 0 0 0 2px
        color-mix(in srgb, var(--ngxsmk-color-primary, #7c3aed) 25%, transparent);
    }

    .ngxsmk-kanban__col-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 0.35rem;
    }

    .ngxsmk-kanban__col-title-wrap {
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    .ngxsmk-kanban__dot {
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 9999px;
    }

    .ngxsmk-kanban__col-title {
      margin: 0;
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--ngxsmk-color-on-surface, #09090b);
    }

    .ngxsmk-kanban__count {
      font-size: 0.7rem;
      font-weight: 700;
      padding: 0.1rem 0.4rem;
      border-radius: var(--ngxsmk-radius-full, 9999px);
      background: var(--ngxsmk-color-surface, #ffffff);
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
    }

    .ngxsmk-kanban__col-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      min-height: 5rem;
    }

    .ngxsmk-kanban__card {
      padding: 0.75rem;
      border-radius: var(--ngxsmk-radius-md, 0.375rem);
      background: var(--ngxsmk-color-surface, #ffffff);
      border: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
      cursor: grab;
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      transition:
        border-color 0.15s ease,
        box-shadow 0.15s ease,
        transform 0.15s ease,
        opacity 0.15s ease;
      user-select: none;
    }

    .ngxsmk-kanban__card:active {
      cursor: grabbing;
    }

    .ngxsmk-kanban__card:hover {
      border-color: var(--ngxsmk-color-primary, #7c3aed);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
      transform: translateY(-1px);
    }

    .ngxsmk-kanban__card--dragging {
      opacity: 0.4;
      border-style: dashed;
    }

    .ngxsmk-kanban__card-title {
      margin: 0;
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--ngxsmk-color-on-surface, #09090b);
    }

    .ngxsmk-kanban__card-desc {
      margin: 0;
      font-size: 0.775rem;
      line-height: 1.4;
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
    }

    .ngxsmk-kanban__card-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 0.25rem;
    }

    .ngxsmk-kanban__card-tags {
      display: flex;
      gap: 0.25rem;
    }

    .ngxsmk-kanban__card-tag {
      font-size: 0.65rem;
      font-weight: 600;
      padding: 0.1rem 0.35rem;
      border-radius: var(--ngxsmk-radius-sm, 0.25rem);
      background: var(--ngxsmk-color-primary-container, #ede9fe);
      color: var(--ngxsmk-color-primary, #7c3aed);
    }

    .ngxsmk-kanban__avatar {
      font-size: 0.65rem;
      font-weight: 700;
      width: 1.35rem;
      height: 1.35rem;
      border-radius: 9999px;
      background: var(--ngxsmk-color-surface-variant, #f4f4f5);
      color: var(--ngxsmk-color-on-surface, #09090b);
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkKanbanBoard {
  /** Two-way signal model array of column definitions `{ id, title, color? }`. */
  readonly columns = model<NgxsmkKanbanColumn[]>([]);

  /** Two-way signal model array of card items. */
  readonly items = model<NgxsmkKanbanItem[]>([]);

  /** Emits when a card is clicked. */
  readonly cardClick = output<NgxsmkKanbanItem>();

  /** Emits when a task card is dragged and dropped into a column. */
  readonly itemDropped = output<{
    item: NgxsmkKanbanItem;
    fromColumnId: string;
    toColumnId: string;
  }>();

  protected readonly draggedItem = signal<NgxsmkKanbanItem | null>(null);
  protected readonly dragOverColId = signal<string | null>(null);

  protected getColumnItems(colId: string): NgxsmkKanbanItem[] {
    const flatItems = this.items();
    if (flatItems && flatItems.length > 0) {
      return flatItems.filter((i) => i.columnId === colId);
    }
    const col = this.columns().find((c) => c.id === colId);
    return col?.items || [];
  }

  protected _onDragStart(event: DragEvent, item: NgxsmkKanbanItem, colId: string): void {
    this.draggedItem.set({ ...item, columnId: colId });
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', item.id);
    }
  }

  protected _onDragEnd(): void {
    this.draggedItem.set(null);
    this.dragOverColId.set(null);
  }

  protected _onDragOver(event: DragEvent, colId: string): void {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
    this.dragOverColId.set(colId);
  }

  protected _onDragLeave(event: DragEvent, colId: string): void {
    if (this.dragOverColId() === colId) {
      this.dragOverColId.set(null);
    }
  }

  protected _onDrop(event: DragEvent, toColId: string): void {
    event.preventDefault();
    this.dragOverColId.set(null);
    const item = this.draggedItem();
    if (!item) return;

    const fromColId = item.columnId || '';
    if (fromColId === toColId) {
      this.draggedItem.set(null);
      return;
    }

    const updatedItem = { ...item, columnId: toColId };

    // 1. Update items signal model if present
    const currentItems = this.items();
    if (currentItems && currentItems.length > 0) {
      const nextItems = currentItems.map((i) => (i.id === item.id ? updatedItem : i));
      this.items.set(nextItems);
    }

    // 2. Update columns signal model if items are nested inside columns
    const currentCols = this.columns();
    if (currentCols && currentCols.length > 0) {
      const nextCols = currentCols.map((col) => {
        if (col.id === fromColId && col.items) {
          return { ...col, items: col.items.filter((i: NgxsmkKanbanItem) => i.id !== item.id) };
        }
        if (col.id === toColId && col.items) {
          return { ...col, items: [...col.items, updatedItem] };
        }
        return col;
      });
      this.columns.set(nextCols);
    }

    this.itemDropped.emit({ item: updatedItem, fromColumnId: fromColId, toColumnId: toColId });
    this.draggedItem.set(null);
  }
}
