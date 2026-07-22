import type { SortDirection } from './column.model';

/** A single sort criterion. */
export interface SortCriterion {
  readonly colId: string;
  readonly direction: SortDirection;
  /** For multi-sort, the priority index. */
  readonly index: number;
}

/** The engine's sort state. */
export interface SortState {
  readonly criteria: ReadonlyArray<SortCriterion>;
  readonly multiSort: boolean;
}
