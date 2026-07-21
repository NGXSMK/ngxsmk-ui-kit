import { ChangeDetectionStrategy, Component, model, output, signal } from '@angular/core';

export interface KanbanColumn {
  id: string;
  title: string;
  items: KanbanItem[];
}

export interface KanbanItem {
  id: string;
  title: string;
  description?: string;
}

/** Emitted when a card is dropped in a new position. */
export interface KanbanMove {
  item: KanbanItem;
  from: string;
  to: string;
}

@Component({
  standalone: true,
  selector: 'ngxsmk-kanban-board',
  template: `
    <div class="ngxsmk-kanban-board__columns">
      @for (col of columns(); track col.id) {
        <div
          class="ngxsmk-kanban-board__column"
          [class.ngxsmk-kanban-board__column--over]="dragOverCol() === col.id"
          (dragover)="onDragOver(col.id, $event)"
          (dragleave)="onDragLeave(col.id, $event)"
          (drop)="onDropColumn(col.id, $event)"
        >
          <div class="ngxsmk-kanban-board__header">{{ col.title }} ({{ col.items.length }})</div>
          <div class="ngxsmk-kanban-board__items">
            @for (item of col.items; track item.id) {
              <div
                class="ngxsmk-kanban-board__card"
                [class.ngxsmk-kanban-board__card--dragging]="dragging()?.itemId === item.id"
                draggable="true"
                (dragstart)="onDragStart(col.id, item, $event)"
                (dragend)="onDragEnd()"
                (drop)="onDropCard(col.id, item, $event)"
              >
                <div class="ngxsmk-kanban-board__card-title">{{ item.title }}</div>
                @if (item.description) {
                  <div class="ngxsmk-kanban-board__card-desc">{{ item.description }}</div>
                }
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  host: { class: 'ngxsmk-kanban-board' },
  styles: `
    :host {
      display: block;
      font-family: var(--ngxsmk-font-sans);
      overflow-x: auto;
      max-width: 100%;
      -webkit-overflow-scrolling: touch;
    }
    .ngxsmk-kanban-board__columns {
      display: flex;
      gap: var(--ngxsmk-space-4);
      min-height: 20rem;
      padding: var(--ngxsmk-space-4);
    }
    .ngxsmk-kanban-board__columns::after {
      content: '';
      display: block;
      width: 1px;
      flex-shrink: 0;
    }
    .ngxsmk-kanban-board__column {
      display: flex;
      flex-direction: column;
      min-width: 18rem;
      background: var(--ngxsmk-color-surface-variant);
      border-radius: var(--ngxsmk-radius-lg);
      padding: var(--ngxsmk-space-3);
      outline: 2px dashed transparent;
      outline-offset: -2px;
      transition:
        background-color var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out),
        outline-color var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out);
    }
    .ngxsmk-kanban-board__column--over {
      background: color-mix(
        in srgb,
        var(--ngxsmk-color-primary) 8%,
        var(--ngxsmk-color-surface-variant)
      );
      outline-color: var(--ngxsmk-color-primary);
    }
    .ngxsmk-kanban-board__header {
      font-weight: 600;
      font-size: var(--ngxsmk-text-body-md-size);
      color: var(--ngxsmk-color-on-surface);
      margin-bottom: var(--ngxsmk-space-3);
    }
    .ngxsmk-kanban-board__items {
      display: flex;
      flex-direction: column;
      gap: var(--ngxsmk-space-2);
      flex: 1 1 auto;
      min-height: 3rem;
    }
    .ngxsmk-kanban-board__card {
      padding: var(--ngxsmk-space-3);
      background: var(--ngxsmk-color-surface);
      border-radius: var(--ngxsmk-radius-md);
      box-shadow: var(--ngxsmk-shadow-sm);
      cursor: grab;
      user-select: none;
      transition:
        box-shadow var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out),
        opacity var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out);
    }
    .ngxsmk-kanban-board__card:active {
      cursor: grabbing;
    }
    .ngxsmk-kanban-board__card--dragging {
      opacity: var(--ngxsmk-opacity-faint);
    }
    .ngxsmk-kanban-board__card-title {
      font-weight: 500;
      font-size: var(--ngxsmk-text-label-lg-size);
      color: var(--ngxsmk-color-on-surface);
    }
    .ngxsmk-kanban-board__card-desc {
      font-size: var(--ngxsmk-text-label-md-size);
      color: var(--ngxsmk-color-on-surface-variant);
      margin-top: var(--ngxsmk-space-1);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkKanbanBoard {
  /** Columns and their cards. Supports two-way binding: `[(columns)]`. */
  readonly columns = model.required<KanbanColumn[]>();

  /** Emitted after a card is moved to a new column/position. */
  readonly itemMoved = output<KanbanMove>();

  /** The card currently being dragged, with its origin column. */
  protected readonly dragging = signal<{ fromCol: string; itemId: string } | null>(null);
  /** The column currently under the pointer during a drag. */
  protected readonly dragOverCol = signal<string | null>(null);

  protected onDragStart(fromCol: string, item: KanbanItem, event: DragEvent): void {
    this.dragging.set({ fromCol, itemId: item.id });
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      // Some browsers require data to be set for the drag to start.
      event.dataTransfer.setData('text/plain', item.id);
    }
  }

  protected onDragOver(colId: string, event: DragEvent): void {
    if (!this.dragging()) return;
    // preventDefault marks this element as a valid drop target.
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
    this.dragOverCol.set(colId);
  }

  protected onDragLeave(colId: string, event: DragEvent): void {
    // Ignore leaves fired when moving onto a child element.
    const related = event.relatedTarget as Node | null;
    if (related && (event.currentTarget as Node).contains(related)) return;
    if (this.dragOverCol() === colId) this.dragOverCol.set(null);
  }

  protected onDropColumn(colId: string, event: DragEvent): void {
    event.preventDefault();
    this.moveItem(colId, null);
  }

  protected onDropCard(colId: string, before: KanbanItem, event: DragEvent): void {
    event.preventDefault();
    // Stop the column handler from also firing (which would append to the end).
    event.stopPropagation();
    this.moveItem(colId, before.id);
  }

  protected onDragEnd(): void {
    this.dragging.set(null);
    this.dragOverCol.set(null);
  }

  private moveItem(toCol: string, beforeItemId: string | null): void {
    const drag = this.dragging();
    this.dragging.set(null);
    this.dragOverCol.set(null);
    if (!drag) return;
    // Dropping a card onto itself is a no-op.
    if (beforeItemId === drag.itemId) return;

    // Work on a shallow clone so change detection sees new references.
    const cols = this.columns().map((c) => ({ ...c, items: [...c.items] }));
    const from = cols.find((c) => c.id === drag.fromCol);
    const to = cols.find((c) => c.id === toCol);
    if (!from || !to) return;

    const fromIdx = from.items.findIndex((i) => i.id === drag.itemId);
    if (fromIdx === -1) return;
    const [moved] = from.items.splice(fromIdx, 1);

    let insertAt = to.items.length;
    if (beforeItemId != null) {
      const bIdx = to.items.findIndex((i) => i.id === beforeItemId);
      if (bIdx !== -1) insertAt = bIdx;
    }
    to.items.splice(insertAt, 0, moved);

    this.columns.set(cols);
    this.itemMoved.emit({ item: moved, from: drag.fromCol, to: toCol });
  }
}
