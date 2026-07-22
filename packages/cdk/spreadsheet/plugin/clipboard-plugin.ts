import type { SpreadsheetPlugin } from './plugin.types';
import type { SpreadsheetEngine } from '../spreadsheet-engine';
import type { CellValue } from '../models';

/**
 * ClipboardPlugin handles copy/paste/cut operations.
 * Reads from and writes to the system clipboard via the Clipboard API.
 */
export class ClipboardPlugin implements SpreadsheetPlugin {
  readonly name = 'clipboard';
  readonly priority = 30;

  private _engine: SpreadsheetEngine | null = null;
  private _cutCells: { row: number; col: number; value: CellValue }[] | null = null;

  onInit(engine: SpreadsheetEngine): void {
    this._engine = engine;
  }

  /** Copy the current selection to the clipboard. */
  async copy(): Promise<void> {
    if (!this._engine) return;
    const sel = this._engine.selection();
    if (!sel.range) return;

    const tsv = this._selectionToTsv(sel.range.start.row, sel.range.start.col, sel.range.end.row, sel.range.end.col);
    try {
      await navigator.clipboard.writeText(tsv);
    } catch {
      // Fallback: use a temporary textarea
      this._copyToTextarea(tsv);
    }
  }

  /** Cut the current selection (copy + clear). */
  async cut(): Promise<void> {
    if (!this._engine) return;
    const sel = this._engine.selection();
    if (!sel.range) return;

    const startRow = Math.min(sel.range.start.row, sel.range.end.row);
    const startCol = Math.min(sel.range.start.col, sel.range.end.col);
    const endRow = Math.max(sel.range.start.row, sel.range.end.row);
    const endCol = Math.max(sel.range.start.col, sel.range.end.col);

    this._cutCells = [];
    const rows = [...this._engine.rowData()];
    const cols = this._engine.columnDefs();

    for (let r = startRow; r <= endRow; r++) {
      for (let c = startCol; c <= endCol; c++) {
        const colId = cols[c]?.id;
        if (colId) {
          this._cutCells.push({ row: r, col: c, value: rows[r]?.cells[colId]?.value ?? null });
        }
      }
    }

    await this.copy();
    this.clearSelectionContent();
  }

  /** Paste clipboard content starting at the active cell. */
  async paste(): Promise<void> {
    if (!this._engine) return;
    const sel = this._engine.selection();
    const activeCell = sel.activeCell;
    if (!activeCell) return;

    let text: string;
    try {
      text = await navigator.clipboard.readText();
    } catch {
      return;
    }

    if (!text) return;

    const lines = text.split('\n').filter((l) => l.length > 0);
    const cols = this._engine.columnDefs();
    const rows = [...this._engine.rowData()];
    const startRow = activeCell.row;
    const startCol = activeCell.col;

    for (let r = 0; r < lines.length; r++) {
      const cells = lines[r].split('\t');
      const targetRow = startRow + r;
      if (targetRow >= rows.length) break;

      for (let c = 0; c < cells.length; c++) {
        const targetCol = startCol + c;
        if (targetCol >= cols.length) break;

        const colId = cols[targetCol].id;
        const rowData = rows[targetRow];
        if (rowData) {
          const raw = cells[c].trim();
          const value: CellValue = parseClipboardValue(raw);
          rows[targetRow] = {
            ...rowData,
            cells: { ...rowData.cells, [colId]: { value, meta: rowData.cells[colId]?.meta } },
          };
        }
      }
    }

    this._engine.rowData.set(rows);
  }

  /** Clear the content of selected cells. */
  clearSelectionContent(): void {
    if (!this._engine) return;
    const sel = this._engine.selection();
    if (!sel.range) return;

    const startRow = Math.min(sel.range.start.row, sel.range.end.row);
    const startCol = Math.min(sel.range.start.col, sel.range.end.col);
    const endRow = Math.max(sel.range.start.row, sel.range.end.row);
    const endCol = Math.max(sel.range.start.col, sel.range.end.col);

    const rows = [...this._engine.rowData()];
    const cols = this._engine.columnDefs();

    for (let r = startRow; r <= endRow; r++) {
      for (let c = startCol; c <= endCol; c++) {
        const colId = cols[c]?.id;
        if (colId && rows[r]) {
          rows[r] = {
            ...rows[r],
            cells: { ...rows[r].cells, [colId]: { value: null, meta: rows[r].cells[colId]?.meta } },
          };
        }
      }
    }

    this._engine.rowData.set(rows);
  }

  private _selectionToTsv(startRow: number, startCol: number, endRow: number, endCol: number): string {
    if (!this._engine) return '';
    const rows = this._engine.rowData();
    const cols = this._engine.columnDefs();
    const minRow = Math.min(startRow, endRow);
    const maxRow = Math.max(startRow, endRow);
    const minCol = Math.min(startCol, endCol);
    const maxCol = Math.max(startCol, endCol);

    const lines: string[] = [];
    for (let r = minRow; r <= maxRow; r++) {
      const cells: string[] = [];
      for (let c = minCol; c <= maxCol; c++) {
        const colId = cols[c]?.id;
        const val = colId ? rows[r]?.cells[colId]?.value : null;
        cells.push(val == null ? '' : String(val));
      }
      lines.push(cells.join('\t'));
    }
    return lines.join('\n');
  }

  private _copyToTextarea(text: string): void {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }
}

function parseClipboardValue(raw: string): CellValue {
  if (raw === '') return null;
  if (raw === 'TRUE') return true;
  if (raw === 'FALSE') return false;
  const num = Number(raw);
  if (!isNaN(num) && raw !== '') return num;
  return raw;
}
