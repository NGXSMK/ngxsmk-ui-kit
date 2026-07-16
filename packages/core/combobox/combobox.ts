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

@Component({
  standalone: true,
  selector: 'ngxsmk-combobox',
  template: `
    <div class="ngxsmk-combobox__wrap">
      <input
        class="ngxsmk-combobox__input"
        [value]="displayValue()"
        (input)="onInput($event)"
        (focus)="open.set(true)"
        (blur)="close()"
        (keydown)="onKeydown($event)"
        role="combobox"
        aria-autocomplete="list"
        [attr.aria-expanded]="open()"
        [attr.aria-controls]="open() && filtered().length ? dropdownId : null"
        [attr.aria-activedescendant]="activeDescendant()"
      />
      @if (open()) {
        <div [id]="dropdownId" class="ngxsmk-combobox__dropdown" role="listbox">
          @for (opt of filtered(); track opt.value; let i = $index) {
            <button
              type="button"
              [id]="dropdownId + '-' + i"
              role="option"
              class="ngxsmk-combobox__option"
              [class.ngxsmk-combobox__option--active]="i === activeIndex()"
              [attr.aria-selected]="value() === opt.value"
              (mousedown)="select(opt); $event.preventDefault()"
              (mouseenter)="activeIndex.set(i)"
            >
              {{ opt.label }}
            </button>
          }
        </div>
      }
    </div>
  `,
  host: { class: 'ngxsmk-combobox' },
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
    }
    .ngxsmk-combobox__input:focus {
      border-color: var(--ngxsmk-color-primary);
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
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkCombobox {
  readonly options = input.required<{ value: string; label: string }[]>();
  readonly value = model('');
  readonly placeholder = input('');

  protected readonly dropdownId = ngxsmkUniqueId('ngxsmk-combobox-dropdown');
  protected open = signal(false);
  protected query = signal('');
  protected readonly activeIndex = signal(-1);

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  protected displayValue(): string {
    return this.options().find((o) => o.value === this.value())?.label || this.query();
  }

  protected filtered(): { value: string; label: string }[] {
    const q = this.query().toLowerCase();
    return this.options().filter((o) => o.label.toLowerCase().includes(q));
  }

  protected activeDescendant(): string | null {
    return this.open() && this.activeIndex() >= 0
      ? `${this.dropdownId}-${this.activeIndex()}`
      : null;
  }

  protected onInput(e: Event): void {
    this.query.set((e.target as HTMLInputElement).value);
    this.open.set(true);
    // Highlight the first match so Enter has an obvious target.
    this.activeIndex.set(this.filtered().length ? 0 : -1);
  }

  protected onKeydown(e: KeyboardEvent): void {
    const list = this.filtered();
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!this.open()) {
          this.open.set(true);
        }
        this.move(1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        this.move(-1);
        break;
      case 'Home':
        if (this.open() && list.length) {
          e.preventDefault();
          this.activeIndex.set(0);
          this.scrollActiveIntoView();
        }
        break;
      case 'End':
        if (this.open() && list.length) {
          e.preventDefault();
          this.activeIndex.set(list.length - 1);
          this.scrollActiveIntoView();
        }
        break;
      case 'Enter': {
        const opt = list[this.activeIndex()];
        if (this.open() && opt) {
          e.preventDefault();
          this.select(opt);
        }
        break;
      }
      case 'Escape':
        if (this.open()) {
          e.preventDefault();
          this.open.set(false);
        }
        break;
      default:
        break;
    }
  }

  protected select(opt: { value: string; label: string }): void {
    this.value.set(opt.value);
    this.query.set(opt.label);
    this.open.set(false);
    this.activeIndex.set(-1);
  }

  protected close(): void {
    setTimeout(() => this.open.set(false), 150);
  }

  private move(delta: number): void {
    const list = this.filtered();
    if (!list.length) {
      return;
    }
    let next = this.activeIndex() + delta;
    if (next < 0) {
      next = list.length - 1;
    } else if (next >= list.length) {
      next = 0;
    }
    this.activeIndex.set(next);
    this.scrollActiveIntoView();
  }

  private scrollActiveIntoView(): void {
    requestAnimationFrame(() => {
      const items = this.host.nativeElement.querySelectorAll<HTMLElement>(
        '.ngxsmk-combobox__option',
      );
      items[this.activeIndex()]?.scrollIntoView({ block: 'nearest' });
    });
  }
}
