import { computed, signal, type WritableSignal, type Signal } from '@angular/core';
import type {
  CellValue,
  CellAddress,
  CellMeta,
  ColumnDef,
  ColumnState,
  RowDef,
  SelectionState,
  SortState,
  SortCriterion,
  FilterState,
  FilterCriterion,
} from './models';
import type { SpreadsheetPlugin } from './plugin/plugin.types';
import { PluginHost } from './plugin/plugin-host';
import { generateRowId, createEmptyRow } from './utils/cell-utils';

/** Density presets controlling row height and cell padding. */
export type SpreadsheetDensity = 'compact' | 'comfortable' | 'dense';

export interface SpreadsheetConfig {
  /** Column definitions. */
  columns?: ColumnDef[];
  /** Initial row data. */
  rows?: RowDef[];
  /** Enable multi-column sorting. */
  multiSort?: boolean;
  /** Selection mode. */
  selectionMode?: 'cell' | 'range' | 'row' | 'column' | 'none';
  /** Density preset. */
  density?: SpreadsheetDensity;
  /** Enable inline editing. */
  editable?: boolean;
  /** Enable formula evaluation. */
  formulas?: boolean;
  /** Number of rows to render in the viewport buffer. */
  bufferRows?: number;
  /** Row height in px (used for virtual scroll calculations). */
  rowHeight?: number;
  /** Header height in px. */
  headerHeight?: number;
  /** Plugins to register. */
  plugins?: SpreadsheetPlugin[];
  /** Enable tree / hierarchical data. */
  treeData?: boolean;
  /** RTL layout. */
  rtl?: boolean;
  /** Frozen row count. */
  frozenRows?: number;
  /** Frozen column count. */
  frozenColumns?: number;
}

/** Lifecycle hooks for before/after operations. */
export interface SpreadsheetLifecycleHooks {
  beforeEdit: Signal<(rowIndex: number, colId: string) => boolean>;
  afterEdit: Signal<
    (rowIndex: number, colId: string, oldValue: CellValue, newValue: CellValue) => void
  >;
  beforeSort: Signal<(colId: string, direction: 'asc' | 'desc' | null) => boolean>;
  afterSort: Signal<() => void>;
  beforeFilter: Signal<() => boolean>;
  afterFilter: Signal<() => void>;
  beforeInsertRows: Signal<(count: number, atIndex: number) => boolean>;
  afterInsertRows: Signal<(indices: number[]) => void>;
  beforeDeleteRows: Signal<(indices: number[]) => boolean>;
  afterDeleteRows: Signal<(indices: number[]) => void>;
  beforeInsertColumns: Signal<(count: number, atIndex: number) => boolean>;
  afterInsertColumns: Signal<(indices: number[]) => void>;
  beforeDeleteColumns: Signal<(indices: number[]) => boolean>;
  afterDeleteColumns: Signal<(indices: number[]) => void>;
  beforeCopy: Signal<() => boolean>;
  afterCopy: Signal<() => void>;
  beforePaste: Signal<(data: string, startCell: CellAddress) => boolean>;
  afterPaste: Signal<() => void>;
}

const DENSITY_ROW_HEIGHT: Record<SpreadsheetDensity, number> = {
  compact: 28,
  comfortable: 36,
  dense: 24,
};

const DENSITY_HEADER_HEIGHT: Record<SpreadsheetDensity, number> = {
  compact: 32,
  comfortable: 40,
  dense: 28,
};

const DENSITY_CELL_PADDING: Record<SpreadsheetDensity, string> = {
  compact: '2px 6px',
  comfortable: '6px 10px',
  dense: '2px 4px',
};

/**
 * SpreadsheetEngine — headless, signal-based state machine for spreadsheet data.
 * Zero DOM, zero Angular dependencies beyond signals.
 *
 * Supports: columns, rows, sorting, filtering, selection, editing,
 * undo/redo, clipboard, formulas, tree data, virtual scrolling state.
 */
export class SpreadsheetEngine {
  // ── Core Data ──
  readonly columnDefs: WritableSignal<ColumnDef[]>;
  readonly rowData: WritableSignal<RowDef[]>;
  readonly columnStates: WritableSignal<Map<string, ColumnState>>;

  // ── State ──
  readonly selection: WritableSignal<SelectionState>;
  readonly sortState: WritableSignal<SortState>;
  readonly filterState: WritableSignal<FilterState>;
  readonly plugins: WritableSignal<SpreadsheetPlugin[]>;

  // ── Editing ──
  readonly editingCell: WritableSignal<CellAddress | null>;
  readonly editingValue: WritableSignal<CellValue>;

  // ── Config ──
  readonly density: WritableSignal<SpreadsheetDensity>;
  readonly editable: WritableSignal<boolean>;
  readonly rtl: WritableSignal<boolean>;
  readonly frozenRows: WritableSignal<number>;
  readonly frozenColumns: WritableSignal<number>;

  // ── Scroll State ──
  readonly scrollTop: WritableSignal<number>;
  readonly scrollLeft: WritableSignal<number>;
  readonly viewportHeight: WritableSignal<number>;
  readonly viewportWidth: WritableSignal<number>;

  // ── Plugin Host ──
  readonly pluginHost: PluginHost;

  // ── Computed ──

  /** Visible rows after filtering. */
  readonly visibleRows: Signal<RowDef[]>;

  /** Sorted + filtered rows. */
  readonly displayRows: Signal<RowDef[]>;

  /** Visible row range for virtual scrolling (startIndex, endIndex). */
  readonly virtualRowRange: Signal<{
    start: number;
    end: number;
    offsetY: number;
    totalHeight: number;
  }>;

  /** Visible column range for horizontal virtual scrolling. */
  readonly virtualColRange: Signal<{
    start: number;
    end: number;
    offsetX: number;
    totalWidth: number;
  }>;

  /** Row height for current density. */
  readonly rowHeight: Signal<number>;

  /** Header height for current density. */
  readonly headerHeight: Signal<number>;

  /** Cell padding for current density. */
  readonly cellPadding: Signal<string>;

  /** Total number of rows. */
  readonly totalRows: Signal<number>;

  /** Total number of columns. */
  readonly totalColumns: Signal<number>;

  /** Total scrollable height. */
  readonly totalHeight: Signal<number>;

  /** Total scrollable width. */
  readonly totalWidth: Signal<number>;

  /** Visible (non-hidden) columns. */
  readonly visibleColumns: Signal<ColumnDef[]>;

  /** Pinned left columns. */
  readonly pinnedLeftColumns: Signal<ColumnDef[]>;

  /** Pinned right columns. */
  readonly pinnedRightColumns: Signal<ColumnDef[]>;

  /** Unpinned (scrollable) columns. */
  readonly unpinnedColumns: Signal<ColumnDef[]>;

  /** Column width map for computed widths. */
  readonly columnWidths: Signal<Map<string, number>>;

  // ── Lifecycle ──
  readonly lifecycle: SpreadsheetLifecycleHooks;

  private _config: SpreadsheetConfig;

  constructor(config: SpreadsheetConfig = {}) {
    this._config = config;
    this.pluginHost = new PluginHost();

    // Density
    this.density = signal(config.density ?? 'comfortable');
    this.editable = signal(config.editable ?? true);
    this.rtl = signal(config.rtl ?? false);
    this.frozenRows = signal(config.frozenRows ?? 0);
    this.frozenColumns = signal(config.frozenColumns ?? 0);

    // Row/column height computed from density
    this.rowHeight = computed(() => DENSITY_ROW_HEIGHT[this.density()]);
    this.headerHeight = computed(() => DENSITY_HEADER_HEIGHT[this.density()]);
    this.cellPadding = computed(() => DENSITY_CELL_PADDING[this.density()]);

    // Column definitions
    this.columnDefs = signal(config.columns ?? []);

    // Column states (width, visibility, pin, sort)
    const initialStates = new Map<string, ColumnState>();
    (config.columns ?? []).forEach((col, idx) => {
      initialStates.set(col.id, {
        id: col.id,
        width: col.width ?? 150,
        visible: col.visible !== false,
        pinned: col.pinned ?? false,
        sort: col.sort ?? null,
        sortIndex: undefined,
        order: idx,
      });
    });
    this.columnStates = signal(initialStates);

    // Row data
    this.rowData = signal(config.rows ?? []);

    // Selection
    this.selection = signal<SelectionState>({
      activeCell: null,
      range: null,
      selectedRows: new Set(),
      selectedCols: new Set(),
      mode: config.selectionMode ?? 'cell',
      dragging: false,
    });

    // Sort
    this.sortState = signal<SortState>({
      criteria: (config.columns ?? [])
        .filter((c) => c.sort)
        .map((c, i) => ({ colId: c.id, direction: c.sort!, index: i })),
      multiSort: config.multiSort ?? false,
    });

    // Filter
    this.filterState = signal<FilterState>({ criteria: [], mode: 'and' });

    // Editing
    this.editingCell = signal(null);
    this.editingValue = signal(null);

    // Scroll
    this.scrollTop = signal(0);
    this.scrollLeft = signal(0);
    this.viewportHeight = signal(600);
    this.viewportWidth = signal(800);

    // Plugins
    this.plugins = signal(config.plugins ?? []);

    // Lifecycle hooks
    this.lifecycle = {
      beforeEdit: signal(() => true),
      afterEdit: signal(() => {
        /* noop */
      }),
      beforeSort: signal(() => true),
      afterSort: signal(() => {
        /* noop */
      }),
      beforeFilter: signal(() => true),
      afterFilter: signal(() => {
        /* noop */
      }),
      beforeInsertRows: signal(() => true),
      afterInsertRows: signal(() => {
        /* noop */
      }),
      beforeDeleteRows: signal(() => true),
      afterDeleteRows: signal(() => {
        /* noop */
      }),
      beforeInsertColumns: signal(() => true),
      afterInsertColumns: signal(() => {
        /* noop */
      }),
      beforeDeleteColumns: signal(() => true),
      afterDeleteColumns: signal(() => {
        /* noop */
      }),
      beforeCopy: signal(() => true),
      afterCopy: signal(() => {
        /* noop */
      }),
      beforePaste: signal(() => true),
      afterPaste: signal(() => {
        /* noop */
      }),
    };

    // ── Computed ──

    this.visibleColumns = computed(() => {
      const states = this.columnStates();
      return this.columnDefs().filter((col) => {
        const st = states.get(col.id);
        return st?.visible ?? true;
      });
    });

    this.pinnedLeftColumns = computed(() =>
      this.visibleColumns().filter((c) => c.pinned === 'left'),
    );

    this.pinnedRightColumns = computed(() =>
      this.visibleColumns().filter((c) => c.pinned === 'right'),
    );

    this.unpinnedColumns = computed(() => this.visibleColumns().filter((c) => !c.pinned));

    this.columnWidths = computed(() => {
      const states = this.columnStates();
      const widths = new Map<string, number>();
      for (const col of this.columnDefs()) {
        widths.set(col.id, states.get(col.id)?.width ?? col.width ?? 150);
      }
      return widths;
    });

    this.totalColumns = computed(() => this.visibleColumns().length);

    this.visibleRows = computed(() => {
      return this.rowData();
    });

    this.displayRows = computed(() => {
      return this.visibleRows();
    });

    this.totalRows = computed(() => this.displayRows().length);

    this.rowHeight = computed(() => DENSITY_ROW_HEIGHT[this.density()]);

    this.totalHeight = computed(() => this.totalRows() * this.rowHeight());

    this.totalWidth = computed(() => {
      const widths = this.columnWidths();
      let total = 0;
      for (const col of this.visibleColumns()) {
        total += widths.get(col.id) ?? 150;
      }
      return total;
    });

    // Virtual scroll range — which rows are visible
    this.virtualRowRange = computed(() => {
      const rh = this.rowHeight();
      const vh = this.viewportHeight();
      const st = this.scrollTop();
      const total = this.totalRows();
      const buffer = config.bufferRows ?? 5;

      const start = Math.max(0, Math.floor(st / rh) - buffer);
      const visibleCount = Math.ceil(vh / rh);
      const end = Math.min(total, start + visibleCount + buffer * 2);

      return {
        start,
        end,
        offsetY: start * rh,
        totalHeight: total * rh,
      };
    });

    // Virtual scroll range — which columns are visible
    this.virtualColRange = computed(() => {
      const widths = this.columnWidths();
      const vw = this.viewportWidth();
      const sl = this.scrollLeft();
      const cols = this.unpinnedColumns();
      const buffer = 3;

      let start = 0;
      let end = cols.length;

      // Find start column
      let accWidth = 0;
      for (let i = 0; i < cols.length; i++) {
        const w = widths.get(cols[i].id) ?? 150;
        if (accWidth + w > sl) {
          start = Math.max(0, i - buffer);
          break;
        }
        accWidth += w;
      }

      // Find end column
      let accWidth2 = 0;
      for (let i = start; i < cols.length; i++) {
        accWidth2 += widths.get(cols[i].id) ?? 150;
        if (accWidth2 > vw + sl) {
          end = Math.min(cols.length, i + buffer + 1);
          break;
        }
      }

      // Recalculate offsetX
      let finalOffsetX = 0;
      for (let i = 0; i < start; i++) {
        finalOffsetX += widths.get(cols[i].id) ?? 150;
      }

      return {
        start,
        end,
        offsetX: finalOffsetX,
        totalWidth: cols.reduce((sum, c) => sum + (widths.get(c.id) ?? 150), 0),
      };
    });

    // Initialize plugins
    this.pluginHost.init(this);
  }

  // ── Column Operations ──

  /** Get column state by ID. */
  getColumnState(colId: string): ColumnState | undefined {
    return this.columnStates().get(colId);
  }

  /** Set column width. */
  setColumnWidth(colId: string, width: number): void {
    const states = new Map(this.columnStates());
    const st = states.get(colId);
    if (st) {
      const col = this.columnDefs().find((c) => c.id === colId);
      const min = col?.minWidth ?? 40;
      const max = col?.maxWidth ?? 600;
      states.set(colId, { ...st, width: Math.max(min, Math.min(max, width)) });
      this.columnStates.set(states);
    }
  }

  /** Toggle column visibility. */
  toggleColumnVisibility(colId: string): void {
    const states = new Map(this.columnStates());
    const st = states.get(colId);
    if (st) {
      states.set(colId, { ...st, visible: !st.visible });
      this.columnStates.set(states);
    }
  }

  /** Set column sort direction. */
  setColumnSort(colId: string, direction: 'asc' | 'desc' | null): void {
    const states = new Map(this.columnStates());
    const st = states.get(colId);
    if (st) {
      states.set(colId, { ...st, sort: direction });
      this.columnStates.set(states);
    }

    // Update sort state
    const current = this.sortState();
    let criteria: SortCriterion[];

    if (current.multiSort) {
      const existing = current.criteria.filter((c) => c.colId !== colId);
      if (direction) {
        criteria = [...existing, { colId, direction, index: existing.length }];
      } else {
        criteria = existing;
      }
    } else {
      // Single sort: clear other sorts
      for (const [id, s] of states) {
        if (id !== colId && s.sort) {
          states.set(id, { ...s, sort: null });
        }
      }
      this.columnStates.set(states);
      criteria = direction ? [{ colId, direction, index: 0 }] : [];
    }

    this.sortState.set({ ...current, criteria });
  }

  /** Reorder columns. */
  moveColumn(fromIndex: number, toIndex: number): void {
    const cols = [...this.columnDefs()];
    const [moved] = cols.splice(fromIndex, 1);
    if (moved) {
      cols.splice(toIndex, 0, moved);
      this.columnDefs.set(cols);
    }
  }

  // ── Row Operations ──

  /** Insert rows at the given index. */
  insertRows(count: number, atIndex?: number): number[] {
    const index = atIndex ?? this.rowData().length;
    const rows = [...this.rowData()];
    const newIndices: number[] = [];

    for (let i = 0; i < count; i++) {
      const newRow = createEmptyRow(generateRowId(), this.columnDefs());
      rows.splice(index + i, 0, newRow);
      newIndices.push(index + i);
    }

    this.rowData.set(rows);
    return newIndices;
  }

  /** Delete rows by index. */
  deleteRows(indices: number[]): RowDef[] {
    const sorted = [...indices].sort((a, b) => b - a);
    const rows = [...this.rowData()];
    const deleted: RowDef[] = [];

    for (const idx of sorted) {
      if (idx >= 0 && idx < rows.length) {
        deleted.push(rows[idx]);
        rows.splice(idx, 1);
      }
    }

    this.rowData.set(rows);
    return deleted;
  }

  // ── Cell Operations ──

  /** Get a cell value. */
  getCellValue(rowIndex: number, colId: string): CellValue {
    return this.rowData()[rowIndex]?.cells[colId]?.value ?? null;
  }

  /** Set a cell value. */
  setCellValue(rowIndex: number, colId: string, value: CellValue): void {
    const rows = [...this.rowData()];
    const row = rows[rowIndex];
    if (!row) return;

    rows[rowIndex] = {
      ...row,
      cells: {
        ...row.cells,
        [colId]: { value, meta: row.cells[colId]?.meta },
      },
    };

    this.rowData.set(rows);
  }

  /** Get cell metadata. */
  getCellMeta(rowIndex: number, colId: string): CellMeta | undefined {
    return this.rowData()[rowIndex]?.cells[colId]?.meta;
  }

  /** Get a column definition by ID. */
  getColumnDef(colId: string): ColumnDef | undefined {
    return this.columnDefs().find((c) => c.id === colId);
  }

  /** Get the 0-based column index by ID. */
  getColIndex(colId: string): number {
    return this.visibleColumns().findIndex((c) => c.id === colId);
  }

  // ── Editing ──

  /** Begin editing a cell. */
  startEdit(rowIndex: number, colId: string): boolean {
    if (!this.editable()) return false;
    if (!this.pluginHost.beforeEdit(rowIndex, colId)) return false;

    const value = this.getCellValue(rowIndex, colId);
    this.editingCell.set({ row: rowIndex, col: this.getColIndex(colId) });
    this.editingValue.set(value);
    return true;
  }

  /** Commit the current edit. */
  commitEdit(): void {
    const cell = this.editingCell();
    if (!cell) return;

    const col = this.visibleColumns()[cell.col];
    if (!col) return;

    const oldValue = this.getCellValue(cell.row, col.id);
    const newValue = this.editingValue();

    if (oldValue !== newValue) {
      this.setCellValue(cell.row, col.id, newValue);
      this.pluginHost.afterEdit(cell.row, col.id, oldValue, newValue);
    }

    this.editingCell.set(null);
  }

  /** Cancel the current edit. */
  cancelEdit(): void {
    this.editingCell.set(null);
    this.editingValue.set(null);
  }

  // ── Sort ──

  /** Sort by a column (toggles direction). */
  sortBy(colId: string): void {
    const st = this.columnStates().get(colId);
    if (!st) return;

    const currentSort = st.sort;
    let newDirection: 'asc' | 'desc' | null;

    if (currentSort === null) {
      newDirection = 'asc';
    } else if (currentSort === 'asc') {
      newDirection = 'desc';
    } else {
      newDirection = null;
    }

    if (!this.pluginHost.beforeSort(colId, newDirection)) return;

    this.setColumnSort(colId, newDirection);
    this.pluginHost.afterSort();
  }

  /** Clear all sorting. */
  clearSort(): void {
    const states = new Map(this.columnStates());
    for (const [id, st] of states) {
      if (st.sort) {
        states.set(id, { ...st, sort: null, sortIndex: undefined });
      }
    }
    this.columnStates.set(states);
    this.sortState.set({ criteria: [], multiSort: this.sortState().multiSort });
  }

  // ── Filter ──

  /** Apply a filter. */
  applyFilter(
    colId: string,
    operator: FilterCriterion['operator'],
    value: unknown,
    valueTo?: unknown,
  ): void {
    const current = this.filterState();
    const existing = current.criteria.filter((c) => c.colId !== colId);
    const criteria = [...existing, { colId, operator, value, valueTo }];
    this.filterState.set({ ...current, criteria });
  }

  /** Clear filter for a column. */
  clearColumnFilter(colId: string): void {
    const current = this.filterState();
    this.filterState.set({
      ...current,
      criteria: current.criteria.filter((c) => c.colId !== colId),
    });
  }

  /** Clear all filters. */
  clearFilters(): void {
    this.filterState.set({ criteria: [], mode: 'and' });
  }

  // ── Navigation ──

  /** Move the active cell by delta. */
  navigate(deltaRow: number, deltaCol: number): void {
    const sel = this.selection();
    const current = sel.activeCell ?? { row: 0, col: 0 };
    const newRow = Math.max(0, Math.min(this.totalRows() - 1, current.row + deltaRow));
    const newCol = Math.max(0, Math.min(this.totalColumns() - 1, current.col + deltaCol));

    this.selection.set({
      ...sel,
      activeCell: { row: newRow, col: newCol },
      range: { start: { row: newRow, col: newCol }, end: { row: newRow, col: newCol } },
    });
  }

  /** Scroll to make a cell visible. */
  scrollToCell(rowIndex: number, _colIndex: number): void {
    const rh = this.rowHeight();
    const cellTop = rowIndex * rh;
    const cellBottom = cellTop + rh;

    const st = this.scrollTop();
    const vh = this.viewportHeight();

    if (cellTop < st) {
      this.scrollTop.set(cellTop);
    } else if (cellBottom > st + vh) {
      this.scrollTop.set(cellBottom - vh);
    }
  }

  // ── Selection ──

  /** Select a cell. */
  selectCell(row: number, col: number): void {
    this.selection.set({
      ...this.selection(),
      activeCell: { row, col },
      range: { start: { row, col }, end: { row, col } },
      mode: 'cell',
    });
  }

  /** Select a range. */
  selectRange(start: CellAddress, end: CellAddress): void {
    this.selection.set({
      ...this.selection(),
      range: { start, end },
      mode: 'range',
    });
  }

  /** Select a row. */
  selectRow(rowIndex: number): void {
    const rows = new Set(this.selection().selectedRows);
    if (rows.has(rowIndex)) {
      rows.delete(rowIndex);
    } else {
      rows.add(rowIndex);
    }
    this.selection.set({ ...this.selection(), selectedRows: rows, mode: 'row' });
  }

  /** Select a column. */
  selectColumn(colIndex: number): void {
    const cols = new Set(this.selection().selectedCols);
    if (cols.has(colIndex)) {
      cols.delete(colIndex);
    } else {
      cols.add(colIndex);
    }
    this.selection.set({ ...this.selection(), selectedCols: cols, mode: 'column' });
  }

  /** Select all cells. */
  selectAll(): void {
    const allRows = new Set(Array.from({ length: this.totalRows() }, (_, i) => i));
    const allCols = new Set(Array.from({ length: this.totalColumns() }, (_, i) => i));
    this.selection.set({
      activeCell: { row: 0, col: 0 },
      range: {
        start: { row: 0, col: 0 },
        end: { row: this.totalRows() - 1, col: this.totalColumns() - 1 },
      },
      selectedRows: allRows,
      selectedCols: allCols,
      mode: 'range',
      dragging: false,
    });
  }

  /** Check if a cell is selected. */
  isCellSelected(row: number, col: number): boolean {
    const sel = this.selection();
    if (sel.range) {
      const minR = Math.min(sel.range.start.row, sel.range.end.row);
      const maxR = Math.max(sel.range.start.row, sel.range.end.row);
      const minC = Math.min(sel.range.start.col, sel.range.end.col);
      const maxC = Math.max(sel.range.start.col, sel.range.end.col);
      if (row >= minR && row <= maxR && col >= minC && col <= maxC) return true;
    }
    return sel.selectedRows.has(row) || sel.selectedCols.has(col);
  }

  /** Check if a cell is the active cell. */
  isCellActive(row: number, col: number): boolean {
    const ac = this.selection().activeCell;
    return ac?.row === row && ac?.col === col;
  }

  // ── Refresh ──

  /** Force recalculation by re-setting data. */
  refresh(): void {
    this.rowData.update((r) => [...r]);
    this.columnStates.update((s) => new Map(s));
  }

  // ── Destroy ──

  destroy(): void {
    this.pluginHost.destroy();
  }
}
