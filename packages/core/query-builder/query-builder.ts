import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';

export interface QueryField {
  key: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'date';
}

export interface QueryCondition {
  field: string;
  operator: string;
  value: string;
}

@Component({
  standalone: true,
  selector: 'ngxsmk-query-builder',
  template: `
    <div class="ngxsmk-query-builder__conditions">
      @for (cond of conditions(); track $index) {
        <div class="ngxsmk-query-builder__condition">
          @if ($index > 0) {
            <span class="ngxsmk-query-builder__logical">AND</span>
          }
          <select class="ngxsmk-query-builder__select">
            @for (f of fields(); track f.key) {
              <option [value]="f.key">{{ f.label }}</option>
            }
          </select>
          <select class="ngxsmk-query-builder__select">
            <option value="eq">=</option>
            <option value="neq">!=</option>
            <option value="contains">contains</option>
            <option value="gt">&gt;</option>
            <option value="lt">&lt;</option>
          </select>
          <input class="ngxsmk-query-builder__input" [value]="cond.value" placeholder="Value" />
        </div>
      }
    </div>
  `,
  host: { class: 'ngxsmk-query-builder' },
  styles: `
    :host {
      display: block;
      font-family: var(--ngxsmk-font-sans);
      font-size: 0.8125rem;
    }
    .ngxsmk-query-builder__conditions {
      display: flex;
      flex-direction: column;
      gap: var(--ngxsmk-space-2);
    }
    .ngxsmk-query-builder__condition {
      display: flex;
      align-items: center;
      gap: var(--ngxsmk-space-2);
      flex-wrap: wrap;
    }
    .ngxsmk-query-builder__logical {
      font-weight: 600;
      font-size: 0.75rem;
      text-transform: uppercase;
      color: var(--ngxsmk-color-primary);
      min-width: 3rem;
    }
    .ngxsmk-query-builder__select,
    .ngxsmk-query-builder__input {
      padding: var(--ngxsmk-space-1-5) var(--ngxsmk-space-2);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-md);
      font-size: 0.8125rem;
      background: var(--ngxsmk-color-surface);
      color: var(--ngxsmk-color-on-surface);
    }
    .ngxsmk-query-builder__input {
      flex: 1;
      min-width: 8rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkQueryBuilder {
  readonly fields = input.required<QueryField[]>();
  readonly conditions = model<QueryCondition[]>([]);
}
