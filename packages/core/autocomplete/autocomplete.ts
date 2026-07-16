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
      font-size: var(--ngxsmk-text-label-lg-size);
      background: var(--ngxsmk-color-surface);
      color: var(--ngxsmk-color-on-surface);
      outline: none;
      box-sizing: border-box;
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
      font-size: var(--ngxsmk-text-label-lg-size);
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
  protected readonly activeIndex = signal(-1);

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

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
    // Highlight the first match so Enter has an obvious target.
    this.activeIndex.set(this.filtered().length ? 0 : -1);
  }

  protected onKeydown(e: KeyboardEvent): void {
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
        if (this.open() && this.filtered().length) {
          e.preventDefault();
          this.activeIndex.set(0);
          this.scrollActiveIntoView();
        }
        break;
      case 'End':
        if (this.open() && this.filtered().length) {
          e.preventDefault();
          this.activeIndex.set(this.filtered().length - 1);
          this.scrollActiveIntoView();
        }
        break;
      case 'Enter': {
        const opt = this.filtered()[this.activeIndex()];
        if (this.open() && opt) {
          e.preventDefault();
          this.select(opt.value);
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

  protected select(v: string): void {
    this.value.set(v);
    this.open.set(false);
    this.activeIndex.set(-1);
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
        '.ngxsmk-autocomplete__option',
      );
      items[this.activeIndex()]?.scrollIntoView({ block: 'nearest' });
    });
  }
}
