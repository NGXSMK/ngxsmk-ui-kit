import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';

export interface CheckboxListItem {
  value: string;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'ngxsmk-checkbox-list',
  template: `
    @for (item of items(); track item.value) {
      <label
        class="ngxsmk-checkbox-list__item"
        [class.ngxsmk-checkbox-list__item--disabled]="item.disabled"
      >
        <input
          type="checkbox"
          [checked]="isChecked(item.value)"
          [disabled]="item.disabled"
          (change)="toggle(item.value)"
        />
        <span>{{ item.label }}</span>
      </label>
    }
  `,
  host: { class: 'ngxsmk-checkbox-list' },
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: var(--ngxsmk-space-2);
      font-family: var(--ngxsmk-font-sans);
    }
    .ngxsmk-checkbox-list__item {
      display: flex;
      align-items: center;
      gap: var(--ngxsmk-space-2);
      cursor: pointer;
      font-size: 0.875rem;
      color: var(--ngxsmk-color-on-surface);
    }
    .ngxsmk-checkbox-list__item--disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkCheckboxList {
  readonly items = input.required<CheckboxListItem[]>();
  readonly selected = model<string[]>([]);
  readonly changed = output<string[]>();

  protected isChecked(v: string): boolean {
    return this.selected().includes(v);
  }

  protected toggle(v: string): void {
    const current = [...this.selected()];
    if (this.isChecked(v)) {
      this.selected.set(current.filter((x) => x !== v));
    } else {
      this.selected.set([...current, v]);
    }
    this.changed.emit(this.selected());
  }
}
