/** Filter operator for a single column. */
export type FilterOperator =
  | 'equals'
  | 'notEquals'
  | 'contains'
  | 'notContains'
  | 'startsWith'
  | 'endsWith'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'between'
  | 'in'
  | 'empty'
  | 'notEmpty';

/** A single filter criterion. */
export interface FilterCriterion {
  readonly colId: string;
  readonly operator: FilterOperator;
  readonly value: unknown;
  readonly valueTo?: unknown;
}

/** The engine's filter state. */
export interface FilterState {
  readonly criteria: ReadonlyArray<FilterCriterion>;
  readonly mode: 'and' | 'or';
}
