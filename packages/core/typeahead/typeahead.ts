import { ChangeDetectionStrategy, Component, Directive, input, model, signal, TemplateRef } from '@angular/core';
import { ngxsmkUniqueId } from '@ngxsmk/core/util';

@Directive({
  selector: '[ngxsmkTypeaheadItem]',
  standalone: true,
})
export class NgxsmkTypeaheadItem {
  readonly template = signal<TemplateRef<unknown> | null>(null);
  // Used as structural directive; hostDirectives for template ref
}

@Component({
  standalone: true,
  selector: 'ngxsmk-typeahead',
  template: `
    <div class="ngxsmk-typeahead__wrap">
      <input
        class="ngxsmk-typeahead__input"
        [value]="value()"
        (input)="onInput($event)"
        (focus)="open.set(true)"
        (blur)="close()"
        [placeholder]="placeholder()"
        role="combobox"
        aria-autocomplete="list"
        [attr.aria-expanded]="open()"
        [attr.aria-controls]="open() && filteredOptions.length ? dropdownId : null"
      />
      @if (open() && filteredOptions.length) {
        <div [id]="dropdownId" class="ngxsmk-typeahead__dropdown" role="listbox">
          @for (opt of filteredOptions; track opt) {
            <button
              type="button"
              class="ngxsmk-typeahead__option"
              role="option"
              [attr.aria-selected]="value() === opt"
              (mousedown)="select(opt); $event.preventDefault()"
            >
              {{ opt }}
            </button>
          }
        </div>
      }
    </div>
  `,
  host: { class: 'ngxsmk-typeahead' },
  styles: `
    :host { display: block; position: relative; font-family: var(--ngxsmk-font-sans); }
    .ngxsmk-typeahead__input { display: block; width: 100%; padding: var(--ngxsmk-space-2) var(--ngxsmk-space-3); border: 1px solid var(--ngxsmk-color-outline); border-radius: var(--ngxsmk-radius-md); font-size: 0.875rem; background: var(--ngxsmk-color-surface); color: var(--ngxsmk-color-on-surface); outline: none; box-sizing: border-box; }
    .ngxsmk-typeahead__input:focus { border-color: var(--ngxsmk-color-primary); box-shadow: 0 0 0 2px var(--ngxsmk-color-primary-container); }
    .ngxsmk-typeahead__dropdown { position: absolute; top: 100%; left: 0; right: 0; margin-top: var(--ngxsmk-space-1); background: var(--ngxsmk-color-surface); border: 1px solid var(--ngxsmk-color-outline); border-radius: var(--ngxsmk-radius-md); box-shadow: var(--ngxsmk-shadow-lg); max-height: 15rem; overflow-y: auto; z-index: var(--ngxsmk-z-dropdown, 1000); }
    .ngxsmk-typeahead__option { display: block; width: 100%; padding: var(--ngxsmk-space-2) var(--ngxsmk-space-3); border: none; background: none; text-align: left; color: var(--ngxsmk-color-on-surface); font-size: 0.875rem; cursor: pointer; }
    .ngxsmk-typeahead__option:hover, .ngxsmk-typeahead__option[aria-selected='true'] { background: var(--ngxsmk-color-surface-hover); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkTypeahead {
  readonly options = input.required<string[]>();
  readonly placeholder = input('Type to search...');
  readonly value = model('');
  readonly filtered = model<string[]>([]);

  protected readonly dropdownId = ngxsmkUniqueId('ngxsmk-typeahead-dropdown');
  protected readonly open = signal(false);
  protected filteredOptions: string[] = [];

  protected onInput(e: Event): void {
    const q = (e.target as HTMLInputElement).value;
    this.value.set(q);
    this.filteredOptions = this.options().filter(o => o.toLowerCase().includes(q.toLowerCase()));
    this.filtered.set(this.filteredOptions);
    this.open.set(true);
  }

  protected select(v: string): void {
    this.value.set(v);
    this.filteredOptions = [];
    this.open.set(false);
  }

  protected close(): void {
    setTimeout(() => this.open.set(false), 150);
  }
}
