import type { SpreadsheetPlugin } from './plugin.types';
import type { SpreadsheetEngine } from '../spreadsheet-engine';
import type { CellValue, RowDef } from '../models';

interface UndoEntry {
  readonly type: 'edit' | 'insert_rows' | 'delete_rows' | 'insert_cols' | 'delete_cols';
  readonly timestamp: number;
  /** For edit: row index + col id + old value. */
  readonly edits?: { rowIndex: number; colId: string; oldValue: CellValue; newValue: CellValue }[];
  /** For row/col insert/delete: the actual data that was removed or added. */
  readonly rows?: RowDef[];
  readonly rowIndex?: number;
  readonly colIds?: string[];
  readonly colWidths?: number[];
}

/**
 * UndoPlugin provides undo/redo by maintaining a history stack.
 * Captures snapshots before mutations.
 */
export class UndoPlugin implements SpreadsheetPlugin {
  readonly name = 'undo';
  readonly priority = 100;

  private _engine: SpreadsheetEngine | null = null;
  private _undoStack: UndoEntry[] = [];
  private _redoStack: UndoEntry[] = [];
  private _maxHistory = 100;

  onInit(engine: SpreadsheetEngine): void {
    this._engine = engine;
  }

  onDestroy(): void {
    this._undoStack = [];
    this._redoStack = [];
  }

  /** Record an edit mutation for undo. */
  recordEdit(rowIndex: number, colId: string, oldValue: CellValue, newValue: CellValue): void {
    this._push({
      type: 'edit',
      timestamp: Date.now(),
      edits: [{ rowIndex, colId, oldValue, newValue }],
    });
  }

  /** Record a bulk edit (multiple cells). */
  recordBulkEdit(
    edits: { rowIndex: number; colId: string; oldValue: CellValue; newValue: CellValue }[],
  ): void {
    if (edits.length === 0) return;
    this._push({ type: 'edit', timestamp: Date.now(), edits });
  }

  /** Undo the last mutation. */
  undo(): boolean {
    if (!this._engine || this._undoStack.length === 0) return false;
    const entry = this._undoStack.pop()!;
    this._applyUndo(entry);
    this._redoStack.push(entry);
    return true;
  }

  /** Redo the last undone mutation. */
  redo(): boolean {
    if (!this._engine || this._redoStack.length === 0) return false;
    const entry = this._redoStack.pop()!;
    this._applyRedo(entry);
    this._undoStack.push(entry);
    return true;
  }

  /** Whether undo is available. */
  get canUndo(): boolean {
    return this._undoStack.length > 0;
  }

  /** Whether redo is available. */
  get canRedo(): boolean {
    return this._redoStack.length > 0;
  }

  /** Clear all history. */
  clearHistory(): void {
    this._undoStack = [];
    this._redoStack = [];
  }

  private _push(entry: UndoEntry): void {
    this._undoStack.push(entry);
    if (this._undoStack.length > this._maxHistory) {
      this._undoStack.shift();
    }
    this._redoStack = [];
  }

  private _applyUndo(entry: UndoEntry): void {
    if (!this._engine) return;

    if (entry.type === 'edit' && entry.edits) {
      const rows = [...this._engine.rowData()];
      for (const edit of entry.edits) {
        if (rows[edit.rowIndex]) {
          rows[edit.rowIndex] = {
            ...rows[edit.rowIndex],
            cells: {
              ...rows[edit.rowIndex].cells,
              [edit.colId]: {
                value: edit.oldValue,
                meta: rows[edit.rowIndex].cells[edit.colId]?.meta,
              },
            },
          };
        }
      }
      this._engine.rowData.set(rows);
    } else if (entry.type === 'delete_rows' && entry.rows) {
      const rows = [...this._engine.rowData()];
      rows.splice(entry.rowIndex ?? 0, 0, ...entry.rows);
      this._engine.rowData.set(rows);
    } else if (entry.type === 'insert_rows' && entry.rowIndex != null) {
      const rows = [...this._engine.rowData()];
      rows.splice(entry.rowIndex, entry.rows?.length ?? 0);
      this._engine.rowData.set(rows);
    }
  }

  private _applyRedo(entry: UndoEntry): void {
    if (!this._engine) return;

    if (entry.type === 'edit' && entry.edits) {
      const rows = [...this._engine.rowData()];
      for (const edit of entry.edits) {
        if (rows[edit.rowIndex]) {
          rows[edit.rowIndex] = {
            ...rows[edit.rowIndex],
            cells: {
              ...rows[edit.rowIndex].cells,
              [edit.colId]: {
                value: edit.newValue,
                meta: rows[edit.rowIndex].cells[edit.colId]?.meta,
              },
            },
          };
        }
      }
      this._engine.rowData.set(rows);
    } else if (entry.type === 'insert_rows' && entry.rows) {
      const rows = [...this._engine.rowData()];
      rows.splice(entry.rowIndex ?? 0, 0, ...entry.rows);
      this._engine.rowData.set(rows);
    } else if (entry.type === 'delete_rows' && entry.rowIndex != null) {
      const rows = [...this._engine.rowData()];
      rows.splice(entry.rowIndex, entry.rows?.length ?? 0);
      this._engine.rowData.set(rows);
    }
  }
}
