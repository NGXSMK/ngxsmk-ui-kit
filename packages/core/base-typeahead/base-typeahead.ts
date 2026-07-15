import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  input,
  signal,
  TemplateRef,
} from '@angular/core';
import { ngxsmkUniqueId } from '@ngxsmk/core/util';

@Directive({
  selector: '[ngxsmkBaseTypeaheadItem]',
  standalone: true,
})
export class NgxsmkBaseTypeaheadItem {
  readonly template = signal<TemplateRef<unknown> | null>(null);
}

@Component({
  standalone: true,
  selector: 'ngxsmk-base-typeahead',
  template: `
    <div class="ngxsmk-base-typeahead__wrap">
      <input
        class="ngxsmk-base-typeahead__input"
        [value]="searchQuery()"
        (input)="onQuery($event)"
        (focus)="onFocus()"
        (blur)="onBlur()"
        role="combobox"
        aria-autocomplete="list"
        [attr.aria-expanded]="open()"
        [attr.aria-controls]="open() && items().length ? dropdownId : null"
      />
      @if (open() && items().length) {
        <div [id]="dropdownId" class="ngxsmk-base-typeahead__dropdown" role="listbox">
          @for (item of items(); track $index) {
            <ng-content />
          }
        </div>
      }
    </div>
  `,
  host: { class: 'ngxsmk-base-typeahead' },
  styles: `
    :host {
      display: block;
      position: relative;
      font-family: var(--ngxsmk-font-sans);
    }
    .ngxsmk-base-typeahead__input {
      display: block;
      width: 100%;
      padding: var(--ngxsmk-space-2) var(--ngxsmk-space-3);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-md);
      font-size: 0.875rem;
      background: var(--ngxsmk-color-surface);
      color: var(--ngxsmk-color-on-surface);
      outline: none;
      box-sizing: border-box;
    }
    .ngxsmk-base-typeahead__input:focus {
      border-color: var(--ngxsmk-color-primary);
    }
    .ngxsmk-base-typeahead__dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      margin-top: var(--ngxsmk-space-1);
      background: var(--ngxsmk-color-surface);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-md);
      box-shadow: var(--ngxsmk-shadow-lg);
      max-height: 15rem;
      overflow-y: auto;
      z-index: var(--ngxsmk-z-dropdown, 1000);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkBaseTypeahead {
  readonly items = input.required<unknown[]>();

  protected readonly dropdownId = ngxsmkUniqueId('ngxsmk-base-typeahead-dropdown');
  protected readonly searchQuery = signal('');
  protected readonly open = signal(false);

  protected onQuery(e: Event): void {
    this.searchQuery.set((e.target as HTMLInputElement).value);
  }

  protected onFocus(): void {
    this.open.set(true);
  }

  protected onBlur(): void {
    setTimeout(() => this.open.set(false), 150);
  }
}
