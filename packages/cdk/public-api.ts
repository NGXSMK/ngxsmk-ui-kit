/*
 * Public API Surface of @ngxsmk/cdk
 */

export * from '@ngxsmk/cdk/click-outside';
export * from '@ngxsmk/cdk/focusable';
export * from '@ngxsmk/cdk/focus-trap';
export * from '@ngxsmk/cdk/live-announcer';
export * from '@ngxsmk/cdk/media-query';
export * from '@ngxsmk/cdk/platform';
export * from '@ngxsmk/cdk/scroll-lock';
export * from '@ngxsmk/cdk/visually-hidden';
export * from '@ngxsmk/cdk/intersection-observer';
export * from '@ngxsmk/cdk/resize-observer';
export * from '@ngxsmk/cdk/autofocus';
export * from '@ngxsmk/cdk/cva-base';
export * from '@ngxsmk/cdk/listbox-keyboard';
export * from '@ngxsmk/cdk/scheduler';

// Spreadsheet — selective re-exports to avoid name collisions with scheduler
export {
  SpreadsheetEngine,
  type SpreadsheetConfig,
  type SpreadsheetDensity,
  type SpreadsheetLifecycleHooks,
} from '@ngxsmk/cdk/spreadsheet';
export type {
  Cell,
  CellValue,
  CellType,
  CellMeta,
  CellEditState,
  CellAddress,
  CellRange,
  ColumnDef,
  ColumnState,
  SortDirection,
  ColumnWidthPreset,
  RowDef,
  RowData,
  SummaryRow,
  SelectionState as SpreadsheetSelectionState,
  SelectionMode,
  SortCriterion,
  SortState,
  FilterCriterion,
  FilterOperator,
  FilterState,
  FormulaNode,
  FormulaResult,
  FormulaDependency,
  FormulaFunction,
} from '@ngxsmk/cdk/spreadsheet';
export {
  PluginHost as SpreadsheetPluginHost,
  SortPlugin,
  FilterPlugin,
  SelectionPlugin as SpreadsheetSelectionPlugin,
  FormulaPlugin,
  ClipboardPlugin,
  UndoPlugin,
  ValidationPlugin,
  type SpreadsheetPlugin,
} from '@ngxsmk/cdk/spreadsheet';
export {
  colIndexToLetter,
  colLetterToIndex,
  cellRef,
  parseCellRef,
  normalizeRange,
  isCellInRange,
  cellsInRange,
  formatCellValue,
  createEmptyRow,
  generateRowId,
  cloneRow,
  pinnedWidth,
} from '@ngxsmk/cdk/spreadsheet';

// Input Group — no naming collisions, re-export everything
export * from '@ngxsmk/cdk/input-group';

// NOTE: '@ngxsmk/cdk/testing' is intentionally NOT re-exported here. It pulls in
// axe-core (a CommonJS dependency) which would otherwise leak into every runtime
// bundle that imports the main '@ngxsmk/cdk' barrel. Import test helpers directly
// from the dedicated entry point instead: `import { ... } from '@ngxsmk/cdk/testing'`.
