import type { Cell } from './cell.model';

/** A row is a map of column-id → Cell. */
export type RowData = Record<string, Cell>;

/** Row definition with optional metadata. */
export interface RowDef {
  /** Unique row identifier. */
  readonly id: string;
  /** The cell data keyed by column id. */
  readonly cells: RowData;
  /** Whether the row is selectable. */
  readonly selectable?: boolean;
  /** Whether the row is editable (overrides column-level). */
  readonly editable?: boolean;
  /** Custom CSS class applied to the row. */
  readonly className?: string;
  /** Custom inline styles applied to the row. */
  readonly style?: Record<string, string>;
  /** Grouping key for tree / master-detail. */
  readonly groupKey?: string;
  /** Parent row id for tree data. */
  readonly parentId?: string;
  /** Whether this row is expanded (tree data). */
  readonly expanded?: boolean;
  /** Row level in the tree hierarchy. */
  readonly level?: number;
  /** Loading placeholder flag for lazy rows. */
  readonly loading?: boolean;
}

/** Summary / aggregate row. */
export interface SummaryRow extends RowDef {
  readonly isSummary: true;
}
