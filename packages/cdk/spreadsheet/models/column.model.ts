import type { CellType, CellMeta } from './cell.model';

/** Sort direction. */
export type SortDirection = 'asc' | 'desc' | null;

/** Column width preset. */
export type ColumnWidthPreset = 'auto' | 'compact' | 'comfortable' | 'wide';

/** Defines a column's schema and behaviour. */
export interface ColumnDef {
  /** Unique identifier / field key. */
  readonly id: string;
  /** Display header text. */
  readonly header: string;
  /** Sub-header / secondary label. */
  readonly subHeader?: string;
  /** The cell type for all cells in this column. Defaults to 'text'. */
  readonly cellType?: CellType;
  /** Whether cells in this column are editable. */
  readonly editable?: boolean;
  /** Whether the column is sortable. */
  readonly sortable?: boolean;
  /** Whether the column is filterable. */
  readonly filterable?: boolean;
  /** Whether the column is resizable. */
  readonly resizable?: boolean;
  /** Whether the column can be reordered via drag. */
  readonly reorderable?: boolean;
  /** Whether the column can be hidden. */
  readonly hideable?: boolean;
  /** Whether the column is currently visible. */
  readonly visible?: boolean;
  /** Whether the column is pinned (frozen). */
  readonly pinned?: 'left' | 'right' | false;
  /** Initial sort direction. */
  readonly sort?: SortDirection;
  /** Sort comparator function. */
  readonly comparator?: (a: unknown, b: unknown, dir: SortDirection) => number;
  /** Minimum width in px. */
  readonly minWidth?: number;
  /** Maximum width in px. */
  readonly maxWidth?: number;
  /** Default width in px. Falls back to auto if unset. */
  readonly width?: number;
  /** Alignment. */
  readonly align?: 'left' | 'center' | 'right';
  /** Tooltip / description for the header. */
  readonly tooltip?: string;
  /** Custom header CSS class. */
  readonly headerClassName?: string;
  /** Custom cell CSS class factory. */
  readonly cellClassName?: string | ((value: unknown, rowIndex: number) => string);
  /** Custom cell style factory. */
  readonly cellStyle?:
    Record<string, string> | ((value: unknown, rowIndex: number) => Record<string, string>);
  /** Cell meta applied to every cell in this column. */
  readonly cellMeta?: Partial<CellMeta>;
  /** Default value for new rows. */
  readonly defaultValue?: unknown;
  /** Value formatter – transforms raw value for display. */
  readonly formatter?: (value: unknown, row: unknown) => string;
  /** Value parser – transforms display string back to raw value on edit. */
  readonly parser?: (raw: string) => unknown;
  /** Custom header template key (matches InjectionToken name). */
  readonly headerTemplate?: string;
  /** Custom cell template key. */
  readonly cellTemplate?: string;
  /** Custom editor template key. */
  readonly editorTemplate?: string;
}

/** Runtime column state (mutable). */
export interface ColumnState {
  readonly id: string;
  readonly width: number;
  readonly visible: boolean;
  readonly pinned: 'left' | 'right' | false;
  readonly sort: SortDirection;
  readonly sortIndex?: number;
  readonly order: number;
}
