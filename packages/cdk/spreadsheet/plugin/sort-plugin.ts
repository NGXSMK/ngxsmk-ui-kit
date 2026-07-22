import type { SpreadsheetPlugin } from './plugin.types';
import type { SpreadsheetEngine } from '../spreadsheet-engine';
import type { SortCriterion } from '../models';

/**
 * SortPlugin manages multi-column sorting.
 * Sorts the engine's rows by the active sort criteria.
 */
export class SortPlugin implements SpreadsheetPlugin {
  readonly name = 'sort';
  readonly priority = 10;

  private _engine: SpreadsheetEngine | null = null;

  onInit(engine: SpreadsheetEngine): void {
    this._engine = engine;
  }

  /** Apply all active sort criteria to the engine's row list. */
  applySort(criteria: readonly SortCriterion[]): void {
    if (!this._engine || criteria.length === 0) return;

    const defs = this._engine.columnDefs();
    const sorted = [...this._engine.rowData()];

    sorted.sort((a, b) => {
      for (const crit of criteria) {
        const col = defs.find((d) => d.id === crit.colId);
        const aVal = a.cells[crit.colId]?.value;
        const bVal = b.cells[crit.colId]?.value;

        let cmp: number;
        if (col?.comparator) {
          cmp = col.comparator(aVal, bVal, crit.direction);
        } else {
          cmp = defaultCompare(aVal, bVal);
        }

        if (cmp !== 0) {
          return crit.direction === 'desc' ? -cmp : cmp;
        }
      }
      return 0;
    });

    this._engine.rowData.set(sorted);
  }

  onBeforeSort(_colId: string, _direction: 'asc' | 'desc' | null): boolean {
    return true;
  }

  onAfterSort(): void {
    const criteria = this._engine?.sortState().criteria;
    if (criteria && criteria.length > 0) {
      this.applySort(criteria);
    }
  }
}

function defaultCompare(a: unknown, b: unknown): number {
  if (a == null && b == null) return 0;
  if (a == null) return -1;
  if (b == null) return 1;
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  return String(a).localeCompare(String(b));
}
