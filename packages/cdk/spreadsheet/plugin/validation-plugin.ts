import type { SpreadsheetPlugin } from './plugin.types';
import type { SpreadsheetEngine } from '../spreadsheet-engine';
import type { CellValue } from '../models';

/** Validation rule applied to cells. */
export interface ValidationRule {
  readonly colId: string;
  readonly validator: (value: CellValue) => string | null;
}

/**
 * ValidationPlugin validates cell values against registered rules.
 */
export class ValidationPlugin implements SpreadsheetPlugin {
  readonly name = 'validation';
  readonly priority = 40;

  private _engine: SpreadsheetEngine | null = null;
  private _rules: Map<string, (value: CellValue) => string | null> = new Map();

  onInit(engine: SpreadsheetEngine): void {
    this._engine = engine;
  }

  /** Register a validation rule for a column. */
  addRule(rule: ValidationRule): void {
    this._rules.set(rule.colId, rule.validator);
  }

  /** Remove a validation rule. */
  removeRule(colId: string): void {
    this._rules.delete(colId);
  }

  /** Validate a single cell value. Returns null if valid, error string if not. */
  validate(colId: string, value: CellValue): string | null {
    const rule = this._rules.get(colId);
    return rule ? rule(value) : null;
  }

  /** Validate all cells and return errors indexed by "row:colId". */
  validateAll(): Map<string, string[]> {
    const errors = new Map<string, string[]>();
    if (!this._engine) return errors;

    const rows = this._engine.rowData();
    const cols = this._engine.columnDefs();

    for (let r = 0; r < rows.length; r++) {
      for (const col of cols) {
        const val = rows[r].cells[col.id]?.value;
        const err = this.validate(col.id, val);
        if (err) {
          const key = `${r}:${col.id}`;
          errors.set(key, [err]);
        }
      }
    }

    return errors;
  }

  onBeforeEdit(rowIndex: number, colId: string): boolean {
    return true;
  }

  onAfterEdit(rowIndex: number, colId: string, _oldValue: unknown, newValue: unknown): void {
    const err = this.validate(colId, newValue as CellValue);
    if (err && this._engine) {
      const rows = [...this._engine.rowData()];
      const row = rows[rowIndex];
      if (row) {
        const cell = row.cells[colId];
        rows[rowIndex] = {
          ...row,
          cells: {
            ...row.cells,
            [colId]: { value: newValue as CellValue, meta: { ...cell?.meta, errors: [err], type: cell?.meta?.type ?? 'text' } },
          },
        };
        this._engine.rowData.set(rows);
      }
    }
  }
}
