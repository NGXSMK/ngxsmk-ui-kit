import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  HostListener,
  TemplateRef,
  booleanAttribute,
  contentChildren,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

export interface NgxsmkTableColumn {
  key: string;
  label: string;
  /** Fixed or preferred width (e.g. `8rem`, `120px`). */
  width?: string;
  /** Minimum width in px while resizing. Default 64. */
  minWidth?: number;
  /** When true (and data-table `columnFilterable`), show a per-column filter. */
  filterable?: boolean;
}

@Directive({
  standalone: true,
  selector: '[ngxsmkCell]',
})
export class NgxsmkCellDef {
  readonly columnKey = input.required<string>({ alias: 'ngxsmkCell' });
  readonly templateRef = inject(TemplateRef);
}

/**
 * Lightweight data table with optional sort, column resize, and drag-reorder.
 *
 * ```html
 * <ngxsmk-table
 *   [columns]="cols"
 *   [rows]="rows"
 *   [sortable]="true"
 *   [resizable]="true"
 *   [reorderable]="true"
 *   (columnResize)="onResize($event)"
 *   (columnReorder)="cols = $event"
 * />
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-table',
  imports: [NgTemplateOutlet],
  template: `
    <table class="ngxsmk-table__element" [class.ngxsmk-table__element--fixed]="resizable()">
      @if (columns().length) {
        <thead class="ngxsmk-table__head">
          <tr class="ngxsmk-table__row">
            @for (col of columns(); track col.key; let i = $index) {
              <th
                class="ngxsmk-table__header-cell"
                scope="col"
                [attr.aria-sort]="ariaSort(col.key)"
                [style.width]="resolvedWidth(col)"
                [style.minWidth.px]="col.minWidth ?? 64"
                [attr.draggable]="reorderable() && col.key !== '__select' ? 'true' : null"
                [attr.data-dragging]="dragKey() === col.key ? '' : null"
                [attr.data-drop-target]="dropKey() === col.key ? '' : null"
                (dragstart)="onDragStart($event, col.key)"
                (dragover)="onDragOver($event, col.key)"
                (dragleave)="onDragLeave(col.key)"
                (drop)="onDrop($event, col.key)"
                (dragend)="onDragEnd()"
              >
                <div class="ngxsmk-table__header-inner">
                  @if (sortable() && col.key !== '__select') {
                    <button type="button" class="ngxsmk-table__sort-btn" (click)="onSort(col.key)">
                      <span>{{ col.label }}</span>
                      <span
                        class="ngxsmk-table__sort-icon"
                        [attr.data-state]="sortState(col.key)"
                        aria-hidden="true"
                      >
                        <svg viewBox="0 0 16 16" width="12" height="12">
                          <path
                            d="M4 10l4-4 4 4"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </span>
                    </button>
                  } @else {
                    <span class="ngxsmk-table__header-label">{{ col.label }}</span>
                  }
                  @if (resizable() && col.key !== '__select') {
                    <button
                      type="button"
                      class="ngxsmk-table__resize"
                      aria-label="Resize column"
                      (mousedown)="onResizeStart($event, col, i)"
                    ></button>
                  }
                </div>
              </th>
            }
          </tr>
        </thead>
      }
      <tbody class="ngxsmk-table__body">
        @for (row of rows(); track $index) {
          <tr
            class="ngxsmk-table__row"
            [attr.data-striped]="striped() && $index % 2 !== 0 ? '' : null"
          >
            @if (columns().length) {
              @for (col of columns(); track col.key) {
                <td class="ngxsmk-table__cell" [style.width]="resolvedWidth(col)">
                  @if (getCellTemplate(col.key); as template) {
                    <ng-container
                      [ngTemplateOutlet]="template"
                      [ngTemplateOutletContext]="{ $implicit: row[col.key], row: row }"
                    />
                  } @else {
                    {{ row[col.key] }}
                  }
                </td>
              }
            } @else {
              <td class="ngxsmk-table__cell" colspan="1"><ng-content /></td>
            }
          </tr>
        }
      </tbody>
    </table>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
      overflow-x: auto;
      font-family: var(--ngxsmk-font-sans);
      font-size: var(--ngxsmk-text-body-sm-size);
      line-height: var(--ngxsmk-text-body-sm-line);
      color: var(--ngxsmk-color-on-surface);
    }

    .ngxsmk-table__element {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid var(--ngxsmk-table-border, var(--ngxsmk-color-outline));
    }

    .ngxsmk-table__element--fixed {
      table-layout: fixed;
    }

    .ngxsmk-table__header-cell {
      position: relative;
      padding: var(--ngxsmk-table-cell-padding, var(--ngxsmk-space-3) var(--ngxsmk-space-4));
      background: var(--ngxsmk-table-header-bg, var(--ngxsmk-color-surface-variant));
      color: var(--ngxsmk-color-on-surface);
      font-weight: var(--ngxsmk-font-weight-semibold, 600);
      text-align: start;
      border-bottom: 2px solid var(--ngxsmk-color-outline-strong);
      white-space: nowrap;
      user-select: none;
    }

    .ngxsmk-table__header-cell[data-dragging] {
      opacity: 0.5;
    }

    .ngxsmk-table__header-cell[data-drop-target] {
      box-shadow: var(--ngxsmk-table-drop-indicator, inset 2px 0 0 var(--ngxsmk-color-primary));
    }

    .ngxsmk-table__header-inner {
      display: flex;
      align-items: center;
      gap: var(--ngxsmk-space-1);
      min-width: 0;
    }

    .ngxsmk-table__header-label {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .ngxsmk-table__sort-btn {
      display: inline-flex;
      align-items: center;
      gap: var(--ngxsmk-space-2);
      flex: 1;
      min-width: 0;
      margin: 0;
      padding: 0;
      border: none;
      background: none;
      color: inherit;
      font: inherit;
      font-weight: inherit;
      cursor: pointer;
      border-radius: var(--ngxsmk-radius-sm);
    }
    .ngxsmk-table__sort-btn:focus-visible {
      outline: none;
      box-shadow: var(--ngxsmk-focus-ring);
    }

    .ngxsmk-table__sort-icon {
      display: inline-flex;
      color: var(--ngxsmk-color-on-surface-variant);
      opacity: var(--ngxsmk-opacity-faint);
      transition:
        opacity var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out),
        transform var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out);
    }
    .ngxsmk-table__sort-icon[data-state='asc'] {
      opacity: 1;
      color: var(--ngxsmk-color-primary);
    }
    .ngxsmk-table__sort-icon[data-state='desc'] {
      opacity: 1;
      color: var(--ngxsmk-color-primary);
      transform: rotate(180deg);
    }

    .ngxsmk-table__resize {
      position: absolute;
      top: 0;
      right: 0;
      width: 6px;
      height: 100%;
      margin: 0;
      padding: 0;
      border: none;
      background: transparent;
      cursor: col-resize;
      z-index: 1;
    }
    .ngxsmk-table__resize:hover,
    .ngxsmk-table__resize:focus-visible {
      background: color-mix(in srgb, var(--ngxsmk-color-primary) 35%, transparent);
      outline: none;
    }

    .ngxsmk-table__cell {
      padding: var(--ngxsmk-table-cell-padding, var(--ngxsmk-space-3) var(--ngxsmk-space-4));
      border-bottom: 1px solid var(--ngxsmk-table-border, var(--ngxsmk-color-outline));
      overflow: hidden;
      text-overflow: ellipsis;
    }

    :host([data-striped]) .ngxsmk-table__row[data-striped] .ngxsmk-table__cell {
      background: var(--ngxsmk-table-stripe, var(--ngxsmk-color-surface-variant));
    }

    .ngxsmk-table__row:last-child .ngxsmk-table__cell {
      border-bottom: none;
    }

    :host([data-responsive]) {
      @media (max-width: 640px) {
        .ngxsmk-table__element {
          border: none;
        }
        .ngxsmk-table__head {
          display: none;
        }
        .ngxsmk-table__row {
          display: flex;
          flex-direction: column;
          margin-bottom: var(--ngxsmk-space-3);
          border: 1px solid var(--ngxsmk-color-outline);
          border-radius: var(--ngxsmk-radius-lg);
          background: var(--ngxsmk-color-surface);
          box-shadow: var(--ngxsmk-shadow-sm);
        }
        .ngxsmk-table__cell {
          display: flex;
          justify-content: space-between;
          padding: var(--ngxsmk-space-2) var(--ngxsmk-space-3);
          border-bottom: 1px solid var(--ngxsmk-color-outline);
        }
        .ngxsmk-table__cell:last-child {
          border-bottom: none;
        }
        .ngxsmk-table__resize {
          display: none;
        }
      }
    }
  `,
  host: {
    class: 'ngxsmk-table',
    '[attr.data-striped]': 'striped() ? "" : null',
    '[attr.data-responsive]': 'responsive() ? "" : null',
    '[attr.data-resizing]': 'resizeKey() ? "" : null',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkTable {
  readonly columns = input<NgxsmkTableColumn[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly rows = input<any[]>([]);
  readonly striped = input(false, { transform: booleanAttribute });
  readonly responsive = input(false, { transform: booleanAttribute });
  readonly sortable = input(false, { transform: booleanAttribute });
  readonly resizable = input(false, { transform: booleanAttribute });
  readonly reorderable = input(false, { transform: booleanAttribute });
  readonly sortField = input<string>('');
  readonly sortDir = input<'asc' | 'desc'>('asc');
  /** Optional width overrides keyed by column key (wins over column.width). */
  readonly columnWidths = input<Record<string, string>>({});

  readonly sortChange = output<string>();
  readonly columnResize = output<{ key: string; width: string }>();
  readonly columnReorder = output<NgxsmkTableColumn[]>();

  readonly cellDefs = contentChildren(NgxsmkCellDef);

  protected readonly dragKey = signal<string | null>(null);
  protected readonly dropKey = signal<string | null>(null);
  protected readonly resizeKey = signal<string | null>(null);
  private resizeStartX = 0;
  private resizeStartWidth = 0;
  private resizeMin = 64;

  protected getCellTemplate(key: string) {
    const def = this.cellDefs().find((d) => d.columnKey() === key);
    return def ? def.templateRef : null;
  }

  protected resolvedWidth(col: NgxsmkTableColumn): string | null {
    return this.columnWidths()[col.key] ?? col.width ?? null;
  }

  protected onSort(key: string): void {
    this.sortChange.emit(key);
  }

  protected sortState(key: string): 'asc' | 'desc' | null {
    return this.sortField() === key ? this.sortDir() : null;
  }

  protected ariaSort(key: string): 'ascending' | 'descending' | 'none' | null {
    if (!this.sortable() || key === '__select') return null;
    if (this.sortField() !== key) return 'none';
    return this.sortDir() === 'asc' ? 'ascending' : 'descending';
  }

  protected onResizeStart(event: MouseEvent, col: NgxsmkTableColumn, _index: number): void {
    if (!this.resizable()) return;
    event.preventDefault();
    event.stopPropagation();
    const th = (event.target as HTMLElement).closest('th');
    const width = th?.getBoundingClientRect().width ?? 120;
    this.resizeKey.set(col.key);
    this.resizeStartX = event.clientX;
    this.resizeStartWidth = width;
    this.resizeMin = col.minWidth ?? 64;
  }

  @HostListener('document:mousemove', ['$event'])
  protected onMouseMove(event: MouseEvent): void {
    const key = this.resizeKey();
    if (!key) return;
    const next = Math.max(
      this.resizeMin,
      this.resizeStartWidth + (event.clientX - this.resizeStartX),
    );
    this.columnResize.emit({ key, width: `${Math.round(next)}px` });
  }

  @HostListener('document:mouseup')
  protected onMouseUp(): void {
    this.resizeKey.set(null);
  }

  protected onDragStart(event: DragEvent, key: string): void {
    if (!this.reorderable() || key === '__select') {
      event.preventDefault();
      return;
    }
    this.dragKey.set(key);
    event.dataTransfer?.setData('text/plain', key);
    if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move';
  }

  protected onDragOver(event: DragEvent, key: string): void {
    if (!this.reorderable() || !this.dragKey() || key === '__select') return;
    event.preventDefault();
    this.dropKey.set(key);
  }

  protected onDragLeave(key: string): void {
    if (this.dropKey() === key) this.dropKey.set(null);
  }

  protected onDrop(event: DragEvent, targetKey: string): void {
    event.preventDefault();
    const fromKey = this.dragKey() ?? event.dataTransfer?.getData('text/plain');
    this.dropKey.set(null);
    this.dragKey.set(null);
    if (!fromKey || fromKey === targetKey || targetKey === '__select') return;

    const cols = [...this.columns()];
    const from = cols.findIndex((c) => c.key === fromKey);
    const to = cols.findIndex((c) => c.key === targetKey);
    if (from < 0 || to < 0) return;
    const [moved] = cols.splice(from, 1);
    cols.splice(to, 0, moved);
    this.columnReorder.emit(cols);
  }

  protected onDragEnd(): void {
    this.dragKey.set(null);
    this.dropKey.set(null);
  }
}
