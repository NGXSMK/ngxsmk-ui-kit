import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import { ngxsmkUniqueId } from '@ngxsmk/core/util';
import { ListboxKeyboard } from '@ngxsmk/cdk/listbox-keyboard';

@Component({
  standalone: true,
  selector: 'ngxsmk-autocomplete',
  template: `
    <div class="ngxsmk-autocomplete__wrap">
      <input
        class="ngxsmk-autocomplete__input"
        [value]="value()"
        (input)="onInput($event)"
        (focus)="open.set(true)"
        (blur)="open.set(false)"
        (keydown)="onKeydown($event)"
        [placeholder]="placeholder()"
        role="combobox"
        aria-autocomplete="list"
        [attr.aria-expanded]="open() && filtered().length ? 'true' : 'false'"
        [attr.aria-controls]="open() && filtered().length ? listboxId : null"
        [attr.aria-activedescendant]="activeDescendant()"
      />
      @if (open() && filtered().length) {
        <div [id]="listboxId" class="ngxsmk-autocomplete__dropdown" role="listbox">
          @for (opt of filtered(); track opt.value; let i = $index) {
            <button
              type="button"
              [id]="listboxId + '-' + i"
              role="option"
              [attr.aria-selected]="i === activeIndex()"
              class="ngxsmk-autocomplete__option"
              [class.ngxsmk-autocomplete__option--active]="i === activeIndex()"
              (mousedown)="select(opt.value); $event.preventDefault()"
              (mouseenter)="activeIndex.set(i)"
            >
              {{ opt.label }}
            </button>
          }
        </div>
      }
    </div>
  `,
  host: { class: 'ngxsmk-autocomplete' },
  styles: `
    :host {
      display: block;
      position: relative;
      font-family: var(--ngxsmk-font-sans);
    }
    .ngxsmk-autocomplete__input {
      display: block;
      width: 100%;
      padding: var(--ngxsmk-space-2) var(--ngxsmk-space-3);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-md);
      font-size: var(--ngxsmk-text-body-md-size);
      background: var(--ngxsmk-color-surface);
      color: var(--ngxsmk-color-on-surface);
      outline: none;
      box-sizing: border-box;
    }
    .ngxsmk-autocomplete__input::placeholder {
      color: var(--ngxsmk-color-on-surface-variant);
    }
    .ngxsmk-autocomplete__input:focus {
      border-color: var(--ngxsmk-color-primary);
    }
    .ngxsmk-autocomplete__dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      margin-top: var(--ngxsmk-space-1);
      background: var(--ngxsmk-color-surface);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-md);
      box-shadow: var(--ngxsmk-shadow-lg);
      max-height: 12rem;
      overflow-y: auto;
      z-index: var(--ngxsmk-z-dropdown, 1000);
    }
    .ngxsmk-autocomplete__option {
      display: block;
      width: 100%;
      padding: var(--ngxsmk-space-2) var(--ngxsmk-space-3);
      border: none;
      background: none;
      text-align: left;
      font-size: var(--ngxsmk-text-body-md-size);
      color: var(--ngxsmk-color-on-surface);
      cursor: pointer;
    }
    .ngxsmk-autocomplete__option:hover,
    .ngxsmk-autocomplete__option--active {
      background: var(--ngxsmk-color-surface-hover);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkAutocomplete {
  readonly options = input.required<{ value: string; label: string }[]>();
  readonly placeholder = input('');
  readonly value = model('');

  protected readonly listboxId = ngxsmkUniqueId('ngxsmk-autocomplete-listbox');
  protected readonly open = signal(false);
  protected readonly filtered = signal<{ value: string; label: string }[]>([]);

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  protected readonly kb = new ListboxKeyboard({
    optionSelector: '.ngxsmk-autocomplete__option',
    options: () => this.filtered(),
    host: this.host,
  });

  protected readonly activeIndex = this.kb.activeIndex;

  protected activeDescendant(): string | null {
    return this.open() && this.activeIndex() >= 0
      ? `${this.listboxId}-${this.activeIndex()}`
      : null;
  }

  protected onInput(e: Event): void {
    const q = (e.target as HTMLInputElement).value.toLowerCase();
    this.value.set(q);
    this.filtered.set(this.options().filter((o) => o.label.toLowerCase().includes(q)));
    this.open.set(true);
    this.activeIndex.set(this.filtered().length ? 0 : -1);
  }

  protected onKeydown(e: KeyboardEvent): void {
    this.kb.handleKeydown(e, {
      onSelect: (i) => this.select(this.filtered()[i].value),
      onOpen: () => this.open.set(true),
      onClose: () => this.open.set(false),
      isOpen: () => this.open(),
    });
  }

  protected select(v: string): void {
    this.value.set(v);
    this.open.set(false);
    this.activeIndex.set(-1);
  }
}
