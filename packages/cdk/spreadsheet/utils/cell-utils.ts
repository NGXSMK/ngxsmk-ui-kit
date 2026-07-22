import type { Cell, CellValue, CellAddress, CellRange, RowDef, ColumnDef } from '../models';

/** Convert a column index to an Excel-style column letter (0=A, 25=Z, 26=AA). */
export function colIndexToLetter(index: number): string {
  let letter = '';
  let i = index;
  while (i >= 0) {
    letter = String.fromCharCode(65 + (i % 26)) + letter;
    i = Math.floor(i / 26) - 1;
  }
  return letter;
}

/** Convert an Excel-style column letter to a 0-based index. */
export function colLetterToIndex(letter: string): number {
  let index = 0;
  for (let i = 0; i < letter.length; i++) {
    index = index * 26 + (letter.charCodeAt(i) - 64);
  }
  return index - 1;
}

/** Build a cell reference string like "A1", "B5". */
export function cellRef(row: number, col: number): string {
  return `${colIndexToLetter(col)}${row + 1}`;
}

/** Parse a cell reference string like "A1" into a CellAddress. */
export function parseCellRef(ref: string): CellAddress | null {
  const match = ref.match(/^([A-Z]+)(\d+)$/i);
  if (!match) return null;
  return { row: parseInt(match[2], 10) - 1, col: colLetterToIndex(match[1].toUpperCase()) };
}

/** Normalize a range so start <= end in both dimensions. */
export function normalizeRange(range: CellRange): CellRange {
  return {
    start: {
      row: Math.min(range.start.row, range.end.row),
      col: Math.min(range.start.col, range.end.col),
    },
    end: {
      row: Math.max(range.start.row, range.end.row),
      col: Math.max(range.start.col, range.end.col),
    },
  };
}

/** Check if a cell address is within a range. */
export function isCellInRange(address: CellAddress, range: CellRange): boolean {
  const nr = normalizeRange(range);
  return (
    address.row >= nr.start.row &&
    address.row <= nr.end.row &&
    address.col >= nr.start.col &&
    address.col <= nr.end.col
  );
}

/** Get all cell addresses in a range. */
export function cellsInRange(range: CellRange): CellAddress[] {
  const nr = normalizeRange(range);
  const cells: CellAddress[] = [];
  for (let r = nr.start.row; r <= nr.end.row; r++) {
    for (let c = nr.start.col; c <= nr.end.col; c++) {
      cells.push({ row: r, col: c });
    }
  }
  return cells;
}

/** Format a cell value for display. */
export function formatCellValue(value: CellValue, format?: string): string {
  if (value == null || value === '') return '';
  if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE';
  if (value instanceof Date) {
    return value.toLocaleDateString();
  }
  if (typeof value === 'number') {
    if (format) {
      return applyNumberFormat(value, format);
    }
    return String(value);
  }
  return String(value);
}

/** Apply a basic number format string. */
function applyNumberFormat(value: number, format: string): string {
  const isNeg = value < 0;
  const abs = Math.abs(value);

  // Currency format: $#,##0.00
  if (format.includes('$')) {
    const decimals = format.includes('.00') ? 2 : 0;
    return `${isNeg ? '-' : ''}$${abs.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  }

  // Percentage format
  if (format.includes('%')) {
    return `${(abs * 100).toFixed(format.includes('.00') ? 2 : 0)}%`;
  }

  // Plain number with commas: #,##0
  if (format.includes(',')) {
    return `${isNeg ? '-' : ''}${abs.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  }

  return String(value);
}

/** Create a new RowDef with empty cells for each column. */
export function createEmptyRow(id: string, columns: ColumnDef[]): RowDef {
  const cells: Record<string, Cell> = {};
  for (const col of columns) {
    cells[col.id] = {
      value: (col.defaultValue ?? null) as CellValue,
      meta: { type: col.cellType ?? 'text' },
    };
  }
  return { id, cells, selectable: true, editable: true };
}

/** Generate a unique row ID. */
export function generateRowId(): string {
  return `row_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/** Deep clone a row's cell data (for immutable updates). */
export function cloneRow(row: RowDef): RowDef {
  return {
    ...row,
    cells: Object.fromEntries(
      Object.entries(row.cells).map(([k, v]) => [k, { ...v, meta: v.meta ? { ...v.meta } : undefined }]),
    ),
  };
}

/** Calculate the total width of pinned columns. */
export function pinnedWidth(columns: ColumnDef[], states: Map<string, number>, side: 'left' | 'right'): number {
  return columns
    .filter((c) => c.pinned === side)
    .reduce((sum, c) => sum + (states.get(c.id) ?? c.width ?? 150), 0);
}
