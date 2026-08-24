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

export interface NgxsmkComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

@Component({
  standalone: true,
  selector: 'ngxsmk-combobox',
  imports: [NgxsmkClickOutside],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxsmkCombobox),
      multi: true,
    },
    {
      provide: NGXSMK_FORM_FIELD_CONTROL,
      useExisting: forwardRef(() => NgxsmkCombobox),
    },
  ],
  template: `
    <div class="ngxsmk-combobox__wrap" (ngxsmkClickOutside)="close()">
      <input
        class="ngxsmk-combobox__input"
        [id]="id()"
        [value]="displayValue()"
        [placeholder]="placeholder()"
        [disabled]="isDisabled()"
        (input)="onInput($event)"
        (focus)="onFocus()"
        (blur)="onBlur()"
        (keydown)="onKeydown($event)"
        role="combobox"
        aria-autocomplete="list"
        [attr.aria-expanded]="open()"
        [attr.aria-controls]="open() && filtered().length ? dropdownId : null"
        [attr.aria-activedescendant]="activeDescendant()"
        [attr.aria-invalid]="ariaInvalid() ? 'true' : null"
        [attr.aria-describedby]="ariaDescribedby()"
      />
      @if (open() && filtered().length) {
        <div [id]="dropdownId" class="ngxsmk-combobox__dropdown" role="listbox">
          @for (opt of filtered(); track opt.value; let i = $index) {
            <button
              type="button"
              [id]="dropdownId + '-' + i"
              role="option"
              class="ngxsmk-combobox__option"
              [class.ngxsmk-combobox__option--active]="i === activeIndex()"
              [attr.aria-selected]="value() === opt.value"
              [attr.aria-disabled]="opt.disabled ? 'true' : null"
              [disabled]="opt.disabled"
              (click)="select(opt)"
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
    class: 'ngxsmk-combobox',
    '[attr.data-disabled]': 'isDisabled() ? "" : null',
    '[attr.data-invalid]': 'ariaInvalid() ? "" : null',
  },
  styles: `
    :host {
      display: block;
      position: relative;
      font-family: var(--ngxsmk-font-sans);
    }
    .ngxsmk-combobox__input {
      display: block;
      width: 100%;
      height: var(--ngxsmk-control-height);
      padding: 0 var(--ngxsmk-space-3);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-md);
      font-size: var(--ngxsmk-text-body-md-size);
      line-height: var(--ngxsmk-text-body-md-line);
      background: var(--ngxsmk-color-surface);
      color: var(--ngxsmk-color-on-surface);
      outline: none;
      box-sizing: border-box;
      transition: border-color var(--ngxsmk-duration-fast), box-shadow var(--ngxsmk-duration-fast);
    }
    .ngxsmk-combobox__input::placeholder {
      color: var(--ngxsmk-color-on-surface-variant);
    }
    .ngxsmk-combobox__input:focus {
      border-color: var(--ngxsmk-color-primary);
      box-shadow: var(--ngxsmk-focus-ring);
    }
    :host([data-invalid]) .ngxsmk-combobox__input {
      border-color: var(--ngxsmk-color-error);
    }
    :host([data-invalid]) .ngxsmk-combobox__input:focus {
      box-shadow: var(--ngxsmk-focus-ring-error);
    }
    .ngxsmk-combobox__input:disabled {
      opacity: var(--ngxsmk-opacity-disabled);
      cursor: not-allowed;
      background: var(--ngxsmk-color-surface-variant);
    }
    .ngxsmk-combobox__dropdown {
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
    .ngxsmk-combobox__option {
      display: block;
      width: 100%;
      padding: var(--ngxsmk-space-2) var(--ngxsmk-space-3);
      border: none;
      background: none;
      text-align: left;
      font-size: var(--ngxsmk-text-label-lg-size);
      color: var(--ngxsmk-color-on-surface);
      cursor: pointer;
    }
    .ngxsmk-combobox__option:hover,
    .ngxsmk-combobox__option--active,
    .ngxsmk-combobox__option[aria-selected='true'] {
      background: var(--ngxsmk-color-surface-hover);
    }
    .ngxsmk-combobox__option:disabled {
      opacity: var(--ngxsmk-opacity-disabled);
      cursor: not-allowed;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkCombobox extends CvaBase<string> implements NgxsmkFormFieldControl {
  readonly options = input.required<NgxsmkComboboxOption[]>();
  readonly value = model('');
  readonly placeholder = input('');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly id = input(ngxsmkUniqueId('ngxsmk-combobox'));

  readonly ariaInvalid = model(false);
  readonly ariaDescribedby = model<string | null>(null);

  readonly changed = output<string>();

  protected readonly dropdownId = ngxsmkUniqueId('ngxsmk-combobox-dropdown');
  protected readonly open = signal(false);
  protected readonly query = signal('');

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  protected readonly filtered = computed(() => {
    const q = this.query().toLowerCase();
    return this.options().filter((o) => o.label.toLowerCase().includes(q));
  });

  protected readonly displayValue = computed(() => {
    const matched = this.options().find((o) => o.value === this.value());
    return matched ? matched.label : this.query();
  });

  protected readonly kb = new ListboxKeyboard({
    optionSelector: '.ngxsmk-combobox__option',
    options: () => this.filtered(),
    host: this.host,
  });

  protected readonly activeIndex = this.kb.activeIndex;

  protected readonly activeDescendant = computed(() =>
    this.open() && this.activeIndex() >= 0
      ? `${this.dropdownId}-${this.activeIndex()}`
      : null,
  );

  protected inputDisabled(): boolean {
    return this.disabled();
  }

  writeValue(val: unknown): void {
    this.value.set(typeof val === 'string' ? val : '');
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
    const text = (e.target as HTMLInputElement).value;
    this.query.set(text);
    this.open.set(true);
    this.activeIndex.set(this.filtered().length ? 0 : -1);
  }

  protected onKeydown(e: KeyboardEvent): void {
    if (this.isDisabled()) return;
    this.kb.handleKeydown(e, {
      onSelect: (i) => {
        const item = this.filtered()[i];
        if (item && !item.disabled) {
          this.select(item);
        }
      },
      onOpen: () => this.open.set(true),
      onClose: () => this.open.set(false),
      isOpen: () => this.open(),
    });
  }

  protected select(opt: NgxsmkComboboxOption): void {
    if (opt.disabled) return;
    this.value.set(opt.value);
    this.query.set(opt.label);
    this.open.set(false);
    this.activeIndex.set(-1);
    this.emitChange(opt.value);
    this.changed.emit(opt.value);
  }

  protected close(): void {
    setTimeout(() => this.open.set(false), 150);
  }
}
