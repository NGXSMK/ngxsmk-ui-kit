import type { SpreadsheetPlugin } from './plugin.types';
import type { SpreadsheetEngine } from '../spreadsheet-engine';
import type { CellAddress, CellRange } from '../models';

/**
 * SelectionPlugin manages cell/row/column/range selection state.
 * Handles keyboard navigation and selection extension.
 */
export class SelectionPlugin implements SpreadsheetPlugin {
  readonly name = 'selection';
  readonly priority = 5;

  private _engine: SpreadsheetEngine | null = null;

  onInit(engine: SpreadsheetEngine): void {
    this._engine = engine;
  }

  /** Select a single cell. */
  selectCell(row: number, col: number): void {
    if (!this._engine) return;
    this._engine.selection.set({
      ...this._engine.selection(),
      activeCell: { row, col },
      range: { start: { row, col }, end: { row, col } },
      mode: 'cell',
    });
  }

  /** Select a rectangular range. */
  selectRange(start: CellAddress, end: CellAddress): void {
    if (!this._engine) return;
    this._engine.selection.set({
      ...this._engine.selection(),
      range: { start, end },
      mode: 'range',
    });
  }

  /** Select an entire row. */
  selectRow(rowIndex: number): void {
    if (!this._engine) return;
    const rows = new Set(this._engine.selection().selectedRows);
    if (rows.has(rowIndex)) {
      rows.delete(rowIndex);
    } else {
      rows.add(rowIndex);
    }
    this._engine.selection.set({
      ...this._engine.selection(),
      selectedRows: rows,
      mode: 'row',
    });
  }

  /** Select an entire column. */
  selectColumn(colIndex: number): void {
    if (!this._engine) return;
    const cols = new Set(this._engine.selection().selectedCols);
    if (cols.has(colIndex)) {
      cols.delete(colIndex);
    } else {
      cols.add(colIndex);
    }
    this._engine.selection.set({
      ...this._engine.selection(),
      selectedCols: cols,
      mode: 'column',
    });
  }

  /** Extend the range selection to include the given cell. */
  extendSelection(row: number, col: number): void {
    if (!this._engine) return;
    const sel = this._engine.selection();
    if (!sel.range) {
      this.selectRange(sel.activeCell ?? { row, col }, { row, col });
    } else {
      this.selectRange(sel.range.start, { row, col });
    }
  }

  /** Clear all selection. */
  clearSelection(): void {
    if (!this._engine) return;
    this._engine.selection.set({
      activeCell: null,
      range: null,
      selectedRows: new Set(),
      selectedCols: new Set(),
      mode: 'cell',
      dragging: false,
    });
  }

  /** Check if a cell is within the current selection. */
  isSelected(row: number, col: number): boolean {
    const sel = this._engine?.selection();
    if (!sel) return false;

    if (sel.range) {
      const minRow = Math.min(sel.range.start.row, sel.range.end.row);
      const maxRow = Math.max(sel.range.start.row, sel.range.end.row);
      const minCol = Math.min(sel.range.start.col, sel.range.end.col);
      const maxCol = Math.max(sel.range.start.col, sel.range.end.col);
      if (row >= minRow && row <= maxRow && col >= minCol && col <= maxCol) return true;
    }

    if (sel.selectedRows.has(row)) return true;
    if (sel.selectedCols.has(col)) return true;

    return false;
  }
}
