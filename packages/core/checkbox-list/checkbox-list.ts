import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';
import { NgxsmkCheckbox } from '@ngxsmk/core/checkbox';

export interface CheckboxListItem {
  value: string;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'ngxsmk-checkbox-list',
  template: `
    @for (item of items(); track item.value) {
      <ngxsmk-checkbox
        [checked]="isChecked(item.value)"
        [disabled]="item.disabled || false"
        (checkedChange)="toggle(item.value)"
      >
        {{ item.label }}
      </ngxsmk-checkbox>
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
  `,
  standalone: true,
  imports: [NgxsmkCheckbox],
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
