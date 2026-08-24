import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  forwardRef,
  inject,
  input,
  model,
  output,
  signal,
  computed,
  booleanAttribute,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ngxsmkUniqueId } from '@ngxsmk/core/util';
import { ListboxKeyboard } from '@ngxsmk/cdk/listbox-keyboard';
import { NgxsmkClickOutside } from '@ngxsmk/cdk';
import { CvaBase } from '@ngxsmk/cdk/cva-base';
import { NGXSMK_FORM_FIELD_CONTROL, NgxsmkFormFieldControl } from '@ngxsmk/core/form-field';

export interface NgxsmkAutocompleteOption {
  value: string;
  label: string;
  disabled?: boolean;
}

@Component({
  standalone: true,
  selector: 'ngxsmk-autocomplete',
  imports: [NgxsmkClickOutside],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxsmkAutocomplete),
      multi: true,
    },
    {
      provide: NGXSMK_FORM_FIELD_CONTROL,
      useExisting: forwardRef(() => NgxsmkAutocomplete),
    },
  ],
  template: `
    <div class="ngxsmk-autocomplete__wrap" (ngxsmkClickOutside)="close()">
      <input
        class="ngxsmk-autocomplete__input"
        [id]="id()"
        [value]="value()"
        [placeholder]="placeholder()"
        [disabled]="isDisabled()"
        (input)="onInput($event)"
        (focus)="onFocus()"
        (blur)="onBlur()"
        (keydown)="onKeydown($event)"
        role="combobox"
        aria-autocomplete="list"
        [attr.aria-expanded]="open() && filtered().length ? 'true' : 'false'"
        [attr.aria-controls]="open() && filtered().length ? listboxId : null"
        [attr.aria-activedescendant]="activeDescendant()"
        [attr.aria-invalid]="ariaInvalid() ? 'true' : null"
        [attr.aria-describedby]="ariaDescribedby()"
      />
      @if (open() && filtered().length) {
        <div [id]="listboxId" class="ngxsmk-autocomplete__dropdown" role="listbox">
          @for (opt of filtered(); track opt.value; let i = $index) {
            <button
              type="button"
              [id]="listboxId + '-' + i"
              role="option"
              [attr.aria-selected]="i === activeIndex()"
              [attr.aria-disabled]="opt.disabled ? 'true' : null"
              [disabled]="opt.disabled"
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
  host: {
    class: 'ngxsmk-autocomplete',
    '[attr.data-disabled]': 'isDisabled() ? "" : null',
    '[attr.data-invalid]': 'ariaInvalid() ? "" : null',
  },
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
      transition:
        border-color var(--ngxsmk-duration-fast),
        box-shadow var(--ngxsmk-duration-fast);
    }
    .ngxsmk-autocomplete__input::placeholder {
      color: var(--ngxsmk-color-on-surface-variant);
    }
    .ngxsmk-autocomplete__input:focus {
      border-color: var(--ngxsmk-color-primary);
      box-shadow: var(--ngxsmk-focus-ring);
    }
    :host([data-invalid]) .ngxsmk-autocomplete__input {
      border-color: var(--ngxsmk-color-error);
    }
    :host([data-invalid]) .ngxsmk-autocomplete__input:focus {
      box-shadow: var(--ngxsmk-focus-ring-error);
    }
    .ngxsmk-autocomplete__input:disabled {
      opacity: var(--ngxsmk-opacity-disabled);
      cursor: not-allowed;
      background: var(--ngxsmk-color-surface-variant);
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
    .ngxsmk-autocomplete__option:disabled {
      opacity: var(--ngxsmk-opacity-disabled);
      cursor: not-allowed;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkAutocomplete extends CvaBase<string> implements NgxsmkFormFieldControl {
  readonly options = input.required<NgxsmkAutocompleteOption[]>();
  readonly placeholder = input('');
  readonly value = model('');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly id = input(ngxsmkUniqueId('ngxsmk-autocomplete'));

  readonly ariaInvalid = model(false);
  readonly ariaDescribedby = model<string | null>(null);

  readonly changed = output<string>();

  protected readonly listboxId = ngxsmkUniqueId('ngxsmk-autocomplete-listbox');
  protected readonly open = signal(false);
  protected readonly query = signal('');

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  protected readonly filtered = computed(() => {
    const q = this.query().toLowerCase();
    if (!q) return this.options();
    return this.options().filter(
      (o) => o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q),
    );
  });

  protected readonly kb = new ListboxKeyboard({
    optionSelector: '.ngxsmk-autocomplete__option',
    options: () => this.filtered(),
    host: this.host,
  });

  protected readonly activeIndex = this.kb.activeIndex;

  protected readonly activeDescendant = computed(() =>
    this.open() && this.activeIndex() >= 0 ? `${this.listboxId}-${this.activeIndex()}` : null,
  );

  protected inputDisabled(): boolean {
    return this.disabled();
  }

  writeValue(val: unknown): void {
    const str = typeof val === 'string' ? val : '';
    this.value.set(str);
    this.query.set(str);
  }

  protected onFocus(): void {
    if (!this.isDisabled()) {
      this.open.set(true);
    }
  }

  protected onBlur(): void {
    this.emitTouched();
  }

  protected onInput(e: Event): void {
    const q = (e.target as HTMLInputElement).value;
    this.query.set(q);
    this.value.set(q);
    this.emitChange(q);
    this.changed.emit(q);
    this.open.set(true);
    this.activeIndex.set(this.filtered().length ? 0 : -1);
  }

  protected onKeydown(e: KeyboardEvent): void {
    if (this.isDisabled()) return;
    this.kb.handleKeydown(e, {
      onSelect: (i) => {
        const item = this.filtered()[i];
        if (item && !item.disabled) {
          this.select(item.value);
        }
      },
      onOpen: () => this.open.set(true),
      onClose: () => this.open.set(false),
      isOpen: () => this.open(),
    });
  }

  protected select(v: string): void {
    this.value.set(v);
    this.query.set(v);
    this.open.set(false);
    this.activeIndex.set(-1);
    this.emitChange(v);
    this.changed.emit(v);
  }

  protected close(): void {
    this.open.set(false);
  }
}
