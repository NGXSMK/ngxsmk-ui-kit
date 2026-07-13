import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';

@Component({
  selector: 'ngxsmk-multi-select',
  template: `
    <div class="ngxsmk-multi-select__tags">
      @for (s of selectedValues(); track s) {
        <span class="ngxsmk-multi-select__tag">{{ labelFor(s) }} <button type="button" class="ngxsmk-multi-select__remove" (click)="remove(s)">&times;</button></span>
      }
      <select class="ngxsmk-multi-select__control" (change)="onAdd($event)" [disabled]="disabled()">
        <option value="">{{ placeholder() || 'Add...' }}</option>
        @for (opt of remaining(); track opt.value) {
          <option value="{{ opt.value }}">{{ opt.label }}</option>
        }
      </select>
    </div>
  `,
  host: { class: 'ngxsmk-multi-select' },
  styles: `
    :host { display: block; font-family: var(--ngxsmk-font-sans); }
    .ngxsmk-multi-select__tags { display: flex; flex-wrap: wrap; gap: var(--ngxsmk-space-1); padding: var(--ngxsmk-space-1); border: 1px solid var(--ngxsmk-color-outline); border-radius: var(--ngxsmk-radius-md); min-height: 2.5rem; background: var(--ngxsmk-color-surface); }
    .ngxsmk-multi-select__tag { display: inline-flex; align-items: center; gap: var(--ngxsmk-space-1); padding: var(--ngxsmk-space-0-5) var(--ngxsmk-space-2); background: var(--ngxsmk-color-primary-container); color: var(--ngxsmk-color-on-primary-container); border-radius: var(--ngxsmk-radius-full); font-size: 0.8125rem; }
    .ngxsmk-multi-select__remove { border: none; background: none; cursor: pointer; font-size: 1rem; line-height: 1; padding: 0; color: inherit; opacity: 0.7; }
    .ngxsmk-multi-select__remove:hover { opacity: 1; }
    .ngxsmk-multi-select__control { flex: 1; min-width: 5rem; border: none; outline: none; background: transparent; font-size: 0.875rem; cursor: pointer; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkMultiSelect {
  readonly options = input.required<{ value: string; label: string }[]>();
  readonly value = model<string[]>([]);
  readonly placeholder = input('');
  readonly disabled = input(false);
  readonly changed = output<string[]>();

  protected selectedValues(): string[] {
    return this.value().filter(v => this.options().some(o => o.value === v));
  }

  protected labelFor(v: string): string {
    return this.options().find(o => o.value === v)?.label || v;
  }

  protected remaining(): { value: string; label: string }[] {
    return this.options().filter(o => !this.value().includes(o.value));
  }

  protected onAdd(e: Event): void {
    const val = (e.target as HTMLSelectElement).value;
    if (val) {
      this.value.set([...this.value(), val]);
      this.changed.emit(this.value());
    }
    (e.target as HTMLSelectElement).value = '';
  }

  protected remove(v: string): void {
    this.value.set(this.value().filter(x => x !== v));
    this.changed.emit(this.value());
  }
}
