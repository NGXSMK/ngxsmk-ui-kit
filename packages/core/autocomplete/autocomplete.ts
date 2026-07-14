import { ChangeDetectionStrategy, Component, input, model, signal } from '@angular/core';

@Component({
  standalone: true,
  selector: 'ngxsmk-autocomplete',
  template: `
    <div class="ngxsmk-autocomplete__wrap">
      <input class="ngxsmk-autocomplete__input" [value]="value()" (input)="onInput($event)" (focus)="open.set(true)" (blur)="open.set(false)" [placeholder]="placeholder()" />
      @if (open() && filtered().length) {
        <div class="ngxsmk-autocomplete__dropdown">
          @for (opt of filtered(); track opt.value) {
            <button type="button" class="ngxsmk-autocomplete__option" (mousedown)="select(opt.value); $event.preventDefault()">{{ opt.label }}</button>
          }
        </div>
      }
    </div>
  `,
  host: { class: 'ngxsmk-autocomplete' },
  styles: `
    :host { display: block; position: relative; font-family: var(--ngxsmk-font-sans); }
    .ngxsmk-autocomplete__input { display: block; width: 100%; padding: var(--ngxsmk-space-2) var(--ngxsmk-space-3); border: 1px solid var(--ngxsmk-color-outline); border-radius: var(--ngxsmk-radius-md); font-size: 0.875rem; background: var(--ngxsmk-color-surface); color: var(--ngxsmk-color-on-surface); outline: none; box-sizing: border-box; }
    .ngxsmk-autocomplete__input:focus { border-color: var(--ngxsmk-color-primary); }
    .ngxsmk-autocomplete__dropdown { position: absolute; top: 100%; left: 0; right: 0; margin-top: var(--ngxsmk-space-1); background: var(--ngxsmk-color-surface); border: 1px solid var(--ngxsmk-color-outline); border-radius: var(--ngxsmk-radius-md); box-shadow: var(--ngxsmk-shadow-lg); max-height: 12rem; overflow-y: auto; z-index: var(--ngxsmk-z-dropdown, 1000); }
    .ngxsmk-autocomplete__option { display: block; width: 100%; padding: var(--ngxsmk-space-2) var(--ngxsmk-space-3); border: none; background: none; text-align: left; font-size: 0.875rem; color: var(--ngxsmk-color-on-surface); cursor: pointer; }
    .ngxsmk-autocomplete__option:hover { background: var(--ngxsmk-color-surface-hover); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkAutocomplete {
  readonly options = input.required<{ value: string; label: string }[]>();
  readonly placeholder = input('');
  readonly value = model('');

  protected readonly open = signal(false);
  protected readonly filtered = signal<{ value: string; label: string }[]>([]);

  protected onInput(e: Event): void {
    const q = (e.target as HTMLInputElement).value.toLowerCase();
    this.value.set(q);
    this.filtered.set(this.options().filter(o => o.label.toLowerCase().includes(q)));
    this.open.set(true);
  }

  protected select(v: string): void {
    this.value.set(v);
    this.open.set(false);
  }
}
