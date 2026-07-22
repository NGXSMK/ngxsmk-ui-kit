/** Supported cell value types. */
export type CellValue = string | number | boolean | Date | null | undefined;

/** Cell type determines rendering and editing behavior. */
export type CellType =
  | 'text'
  | 'number'
  | 'currency'
  | 'percentage'
  | 'boolean'
  | 'checkbox'
  | 'date'
  | 'datetime'
  | 'time'
  | 'select'
  | 'rating'
  | 'progress'
  | 'link'
  | 'image'
  | 'icon'
  | 'badge'
  | 'json'
  | 'code'
  | 'html'
  | 'markdown'
  | 'custom';

/** Cell metadata carried alongside the raw value. */
export interface CellMeta {
  readonly type: CellType;
  readonly editable?: boolean;
  readonly selectable?: boolean;
  readonly className?: string;
  readonly style?: Record<string, string>;
  readonly colSpan?: number;
  readonly rowSpan?: number;
  readonly tooltip?: string;
  readonly ariaLabel?: string;
  /** Validation errors applied to this cell. */
  readonly errors?: string[];
  /** Custom formatting string (e.g. '$#,##0.00' for currency). */
  readonly format?: string;
}

/** A cell is a value + metadata pair keyed by its column field. */
export interface Cell {
  readonly value: CellValue;
  readonly meta?: CellMeta;
}

/** Edit state tracks the lifecycle of an in-progress edit. */
export interface CellEditState {
  readonly rowIndex: number;
  readonly colId: string;
  readonly originalValue: CellValue;
  readonly currentValue: CellValue;
  readonly dirty: boolean;
}

/** Cell address – row + column index pair. */
export interface CellAddress {
  readonly row: number;
  readonly col: number;
}

/** Rectangular selection range in grid coordinates. */
export interface CellRange {
  readonly start: CellAddress;
  readonly end: CellAddress;
}
