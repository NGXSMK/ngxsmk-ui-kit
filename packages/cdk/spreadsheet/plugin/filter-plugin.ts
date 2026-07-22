import type { SpreadsheetPlugin } from './plugin.types';
import type { SpreadsheetEngine } from '../spreadsheet-engine';
import type { FilterCriterion, RowDef } from '../models';

/**
 * FilterPlugin applies column-level filters to the row set.
 * Stores original rows and restores on clear.
 */
export class FilterPlugin implements SpreadsheetPlugin {
  readonly name = 'filter';
  readonly priority = 20;

  private _engine: SpreadsheetEngine | null = null;
  private _originalRows: ReadonlyArray<RowDef> = [];

  onInit(engine: SpreadsheetEngine): void {
    this._engine = engine;
    this._originalRows = engine.rowData();
  }

  /** Apply filter criteria. */
  applyFilter(criteria: ReadonlyArray<FilterCriterion>, mode: 'and' | 'or'): void {
    if (!this._engine) return;
    if (criteria.length === 0) {
      this._engine.rowData.set([...this._originalRows]);
      return;
    }

    this._originalRows = this._engine.rowData();
    const filtered = this._originalRows.filter((row) => {
      const results = criteria.map((c) => matchesCriterion(row.cells[c.colId]?.value, c));
      return mode === 'and' ? results.every(Boolean) : results.some(Boolean);
    });

    this._engine.rowData.set(filtered);
  }

  /** Clear all filters and restore original rows. */
  clearFilter(): void {
    if (!this._engine) return;
    this._engine.rowData.set([...this._originalRows]);
  }

  onBeforeFilter(): boolean {
    return true;
  }

  onAfterFilter(): void {
    // Sync original rows when data changes externally
    if (this._engine) {
      this._originalRows = this._engine.rowData();
    }
  }
}

function matchesCriterion(value: unknown, criterion: FilterCriterion): boolean {
  const v = value == null ? '' : String(value).toLowerCase();
  const c = criterion.value == null ? '' : String(criterion.value).toLowerCase();

  switch (criterion.operator) {
    case 'equals':
      return v === c;
    case 'notEquals':
      return v !== c;
    case 'contains':
      return v.includes(c);
    case 'notContains':
      return !v.includes(c);
    case 'startsWith':
      return v.startsWith(c);
    case 'endsWith':
      return v.endsWith(c);
    case 'gt':
      return Number(value) > Number(criterion.value);
    case 'gte':
      return Number(value) >= Number(criterion.value);
    case 'lt':
      return Number(value) < Number(criterion.value);
    case 'lte':
      return Number(value) <= Number(criterion.value);
    case 'between': {
      const num = Number(value);
      return num >= Number(criterion.value) && num <= Number(criterion.valueTo);
    }
    case 'in': {
      const arr = Array.isArray(criterion.value) ? criterion.value : [];
      return arr.some((item) => String(item).toLowerCase() === v);
    }
    case 'empty':
      return v === '';
    case 'notEmpty':
      return v !== '';
    default:
      return true;
  }
}
