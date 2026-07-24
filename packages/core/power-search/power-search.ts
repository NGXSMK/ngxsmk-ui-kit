import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';

export interface PowerSearchFilter {
  id: string;
  label: string;
  items: { value: string; label: string }[];
}

@Component({
  standalone: true,
  selector: 'ngxsmk-power-search',
  template: `
    <div class="ngxsmk-power-search__bar">
      <input
        class="ngxsmk-power-search__input"
        [value]="query()"
        (input)="onQuery($event)"
        [placeholder]="placeholder()"
      />
    </div>
    @if (filters().length) {
      <div class="ngxsmk-power-search__filters">
        @for (f of filters(); track f.id) {
          <select class="ngxsmk-power-search__filter" (change)="onFilter(f.id, $event)">
            <option value="">{{ f.label }}</option>
            @for (item of f.items; track item.value) {
              <option [value]="item.value" [selected]="activeFilter(f.id) === item.value">
                {{ item.label }}
              </option>
            }
          </select>
        }
      </div>
    }
  `,
  host: { class: 'ngxsmk-power-search' },
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: var(--ngxsmk-space-2);
      font-family: var(--ngxsmk-font-sans);
    }
    .ngxsmk-power-search__bar {
      display: flex;
      gap: var(--ngxsmk-space-2);
    }
    .ngxsmk-power-search__input {
      flex: 1;
      height: var(--ngxsmk-control-height);
      padding: 0 var(--ngxsmk-space-3);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-md);
      font-size: var(--ngxsmk-text-body-md-size);
      line-height: var(--ngxsmk-text-body-md-line);
      background: var(--ngxsmk-color-surface);
      color: var(--ngxsmk-color-on-surface);
      outline: none;
    }
    .ngxsmk-power-search__input::placeholder {
      color: var(--ngxsmk-color-on-surface-variant);
    }
    .ngxsmk-power-search__input:focus {
      border-color: var(--ngxsmk-color-primary);
      box-shadow: var(--ngxsmk-shadow-focus);
    }
    .ngxsmk-power-search__filters {
      display: flex;
      flex-wrap: wrap;
      gap: var(--ngxsmk-space-2);
    }
    .ngxsmk-power-search__filter {
      height: var(--ngxsmk-control-height);
      padding: 0 var(--ngxsmk-space-2);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-md);
      font-size: var(--ngxsmk-text-body-md-size);
      line-height: var(--ngxsmk-text-body-md-line);
      background: var(--ngxsmk-color-surface);
      color: var(--ngxsmk-color-on-surface);
      outline: none;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkPowerSearch {
  readonly placeholder = input('Search...');
  readonly filters = input<PowerSearchFilter[]>([]);
  readonly query = model('');
  readonly filterValues = model<Record<string, string>>({});
  readonly searched = output<string>();
  readonly filtered = output<Record<string, string>>();

  protected onQuery(e: Event): void {
    this.query.set((e.target as HTMLInputElement).value);
    this.searched.emit(this.query());
  }

  protected activeFilter(id: string): string {
    return this.filterValues()[id] || '';
  }

  protected onFilter(id: string, e: Event): void {
    const val = (e.target as HTMLSelectElement).value;
    this.filterValues.set({ ...this.filterValues(), [id]: val });
    this.filtered.emit(this.filterValues());
  }
}
