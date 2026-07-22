import type { CellAddress, CellRange } from './cell.model';

/** What is currently selected. */
export interface SelectionState {
  /** Currently active cell (keyboard focus). */
  readonly activeCell: CellAddress | null;
  /** Rectangular range selection. */
  readonly range: CellRange | null;
  /** Set of selected row indices. */
  readonly selectedRows: ReadonlySet<number>;
  /** Set of selected column indices. */
  readonly selectedCols: ReadonlySet<number>;
  /** Selection mode. */
  readonly mode: SelectionMode;
  /** Whether the user is currently dragging to extend selection. */
  readonly dragging: boolean;
}

export type SelectionMode = 'cell' | 'range' | 'row' | 'column' | 'none';
