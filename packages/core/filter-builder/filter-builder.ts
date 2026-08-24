import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';

export interface NgxsmkFilterField {
  id: string;
  label: string;
  type?: 'string' | 'number' | 'boolean';
}

export interface NgxsmkFilterCondition {
  id?: string;
  fieldId?: string;
  field?: string;
  operator: string;
  value: string;
}

export type FilterCondition = NgxsmkFilterCondition;

/**
 * Dynamic filter predicate builder component (Field, Operator, Value condition rows).
 *
 * ```html
 * <ngxsmk-filter-builder [fields]="tableFields" [(conditions)]="activeFilters" />
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-filter-builder',
  template: `
    <div class="ngxsmk-filter-bldr">
      <div class="ngxsmk-filter-bldr__header">
        <span class="ngxsmk-filter-bldr__title">Filter Rules</span>
        <button type="button" class="ngxsmk-filter-bldr__add-btn" (click)="addCondition()">
          + Add Condition
        </button>
      </div>

      <div class="ngxsmk-filter-bldr__rows">
        @if (conditions().length === 0) {
          <div class="ngxsmk-filter-bldr__empty">
            <span>No filter rules applied</span>
          </div>
        } @else {
          @for (cond of conditions(); track cond.id; let i = $index) {
            <div class="ngxsmk-filter-bldr__row">
              <span class="ngxsmk-filter-bldr__connector">{{ i === 0 ? 'Where' : 'And' }}</span>

              <!-- FIELD SELECT -->
              <select
                [value]="cond.fieldId"
                (change)="updateField(i, $event)"
                class="ngxsmk-filter-bldr__select"
              >
                @for (f of fields(); track f.id) {
                  <option [value]="f.id">{{ f.label }}</option>
                }
              </select>

              <!-- OPERATOR SELECT -->
              <select
                [value]="cond.operator"
                (change)="updateOperator(i, $event)"
                class="ngxsmk-filter-bldr__select ngxsmk-filter-bldr__select--op"
              >
                <option value="contains">contains</option>
                <option value="equals">equals</option>
                <option value="greater">greater than</option>
                <option value="less">less than</option>
              </select>

              <!-- VALUE INPUT -->
              <input
                type="text"
                placeholder="Value..."
                [value]="cond.value"
                (input)="updateValue(i, $event)"
                class="ngxsmk-filter-bldr__input"
              />

              <!-- REMOVE BUTTON -->
              <button
                type="button"
                class="ngxsmk-filter-bldr__remove-btn"
                (click)="removeCondition(i)"
                title="Remove condition"
              >
                ✕
              </button>
            </div>
          }
        }
      </div>
    </div>
  `,
  host: {
    class: 'ngxsmk-filter-builder',
  },
  styles: `
    :host {
      display: block;
      width: 100%;
      font-family: var(--ngxsmk-font-sans, system-ui);
    }

    .ngxsmk-filter-bldr {
      padding: 0.85rem;
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-md, 0.375rem);
      background: var(--ngxsmk-color-surface);
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .ngxsmk-filter-bldr__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .ngxsmk-filter-bldr__title {
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--ngxsmk-color-on-surface);
    }

    .ngxsmk-filter-bldr__add-btn {
      padding: 0.25rem 0.5rem;
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-sm, 0.25rem);
      background: var(--ngxsmk-color-surface-variant);
      color: var(--ngxsmk-color-primary);
      font-size: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s ease;
    }

    .ngxsmk-filter-bldr__rows {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .ngxsmk-filter-bldr__empty {
      padding: 1rem;
      text-align: center;
      color: var(--ngxsmk-color-on-surface-variant);
      font-size: 0.8rem;
    }

    .ngxsmk-filter-bldr__row {
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    .ngxsmk-filter-bldr__connector {
      width: 3rem;
      font-size: 0.725rem;
      font-weight: 700;
      color: var(--ngxsmk-color-on-surface-variant);
      text-transform: uppercase;
      text-align: right;
      flex-shrink: 0;
    }

    .ngxsmk-filter-bldr__select {
      height: 2.25rem;
      padding: 0 0.5rem;
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-sm, 0.25rem);
      background: var(--ngxsmk-color-surface);
      color: var(--ngxsmk-color-on-surface);
      font-size: 0.8rem;
      font-weight: 500;
      outline: none;
    }

    .ngxsmk-filter-bldr__select--op {
      font-family: var(--ngxsmk-font-mono, monospace);
    }

    .ngxsmk-filter-bldr__input {
      flex: 1;
      height: 2.25rem;
      padding: 0 0.5rem;
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-sm, 0.25rem);
      background: var(--ngxsmk-color-surface);
      color: var(--ngxsmk-color-on-surface);
      font-size: 0.8rem;
      outline: none;
    }

    .ngxsmk-filter-bldr__remove-btn {
      border: none;
      background: none;
      color: var(--ngxsmk-color-on-surface-variant);
      font-size: 0.8rem;
      cursor: pointer;
      padding: 0.2rem 0.4rem;
    }

    .ngxsmk-filter-bldr__remove-btn:hover {
      color: var(--ngxsmk-color-error);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkFilterBuilder {
  /** Array of available target filter fields. */
  readonly fields = input<NgxsmkFilterField[]>([]);

  /** Two-way signal model for active conditions array. */
  readonly conditions = model<NgxsmkFilterCondition[]>([]);

  protected addCondition(): void {
    const defaultField = this.fields()[0]?.id || 'field';
    const newCond: NgxsmkFilterCondition = {
      id: String(Date.now() + Math.random()),
      fieldId: defaultField,
      operator: 'contains',
      value: '',
    };
    this.conditions.update((list) => [...list, newCond]);
  }

  protected removeCondition(index: number): void {
    this.conditions.update((list) => list.filter((_, idx) => idx !== index));
  }

  protected updateField(index: number, event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.conditions.update((list) =>
      list.map((c, i) => (i === index ? { ...c, fieldId: target.value } : c)),
    );
  }

  protected updateOperator(index: number, event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.conditions.update((list) =>
      list.map((c, i) => (i === index ? { ...c, operator: target.value } : c)),
    );
  }

  protected updateValue(index: number, event: Event): void {
    const target = event.target as HTMLInputElement;
    this.conditions.update((list) =>
      list.map((c, i) => (i === index ? { ...c, value: target.value } : c)),
    );
  }
}
