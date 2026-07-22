import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CvaBase } from '@ngxsmk/cdk/cva-base';
import { NGXSMK_FORM_FIELD_CONTROL, NgxsmkFormFieldControl } from '@ngxsmk/core/form-field';
import { ngxsmkUniqueId } from '@ngxsmk/core/util';

export interface TransferItem {
  key: string;
  title: string;
  description?: string;
  disabled?: boolean;
}

export type TransferDirection = 'left' | 'right';

/**
 * Dual listbox component for moving items between two container columns.
 *
 * ```html
 * <ngxsmk-transfer
 *   [dataSource]="items"
 *   [(targetKeys)]="selectedKeys"
 *   [titles]="['Available', 'Selected']"
 * />
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-transfer',
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NGXSMK_FORM_FIELD_CONTROL,
      useExisting: forwardRef(() => NgxsmkTransfer),
    },
  ],
  host: {
    class: 'ngxsmk-transfer',
    '[class.ngxsmk-transfer--disabled]': 'disabled()',
    '[attr.data-size]': 'size()',
  },
  template: `
    <!-- Left List Column -->
    <div class="ngxsmk-transfer__list" role="group" [attr.aria-label]="titles()[0]">
      <div class="ngxsmk-transfer__header">
        <span class="ngxsmk-transfer__header-title">{{ titles()[0] }}</span>
        <span class="ngxsmk-transfer__header-count">
          {{ leftSelectedKeys().size }}/{{ leftItems().length }}
        </span>
      </div>

      @if (showSearch()) {
        <div class="ngxsmk-transfer__search">
          <input
            type="search"
            class="ngxsmk-transfer__search-input"
            [placeholder]="searchPlaceholder()"
            [ngModel]="leftSearch()"
            (ngModelChange)="leftSearch.set($event)"
            [disabled]="disabled()"
          />
        </div>
      }

      <div class="ngxsmk-transfer__body" role="listbox" aria-multiselectable="true">
        @for (item of filteredLeftItems(); track item.key) {
          <!-- eslint-disable-next-line @angular-eslint/template/click-events-have-key-events, @angular-eslint/template/interactive-supports-focus -->
          <div
            class="ngxsmk-transfer__item"
            [class.ngxsmk-transfer__item--selected]="leftSelectedKeys().has(item.key)"
            [class.ngxsmk-transfer__item--disabled]="item.disabled || disabled()"
            role="option"
            [attr.aria-selected]="leftSelectedKeys().has(item.key)"
            (click)="toggleLeftSelection(item)"
          >
            <input
              type="checkbox"
              class="ngxsmk-transfer__checkbox"
              [checked]="leftSelectedKeys().has(item.key)"
              [disabled]="item.disabled || disabled()"
              tabindex="-1"
            />
            <div class="ngxsmk-transfer__item-label">
              <span class="ngxsmk-transfer__item-title">{{ item.title }}</span>
              @if (item.description) {
                <span class="ngxsmk-transfer__item-desc">{{ item.description }}</span>
              }
            </div>
          </div>
        }
        @if (filteredLeftItems().length === 0) {
          <div class="ngxsmk-transfer__empty">No items</div>
        }
      </div>
    </div>

    <!-- Operation Buttons -->
    <div class="ngxsmk-transfer__actions">
      <button
        type="button"
        class="ngxsmk-transfer__btn"
        [disabled]="disabled() || leftSelectedKeys().size === 0"
        (click)="moveToRight()"
        aria-label="Move selected right"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
      <button
        type="button"
        class="ngxsmk-transfer__btn"
        [disabled]="disabled() || rightSelectedKeys().size === 0"
        (click)="moveToLeft()"
        aria-label="Move selected left"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>
    </div>

    <!-- Right List Column -->
    <div class="ngxsmk-transfer__list" role="group" [attr.aria-label]="titles()[1]">
      <div class="ngxsmk-transfer__header">
        <span class="ngxsmk-transfer__header-title">{{ titles()[1] }}</span>
        <span class="ngxsmk-transfer__header-count">
          {{ rightSelectedKeys().size }}/{{ rightItems().length }}
        </span>
      </div>

      @if (showSearch()) {
        <div class="ngxsmk-transfer__search">
          <input
            type="search"
            class="ngxsmk-transfer__search-input"
            [placeholder]="searchPlaceholder()"
            [ngModel]="rightSearch()"
            (ngModelChange)="rightSearch.set($event)"
            [disabled]="disabled()"
          />
        </div>
      }

      <div class="ngxsmk-transfer__body" role="listbox" aria-multiselectable="true">
        @for (item of filteredRightItems(); track item.key) {
          <!-- eslint-disable-next-line @angular-eslint/template/click-events-have-key-events, @angular-eslint/template/interactive-supports-focus -->
          <div
            class="ngxsmk-transfer__item"
            [class.ngxsmk-transfer__item--selected]="rightSelectedKeys().has(item.key)"
            [class.ngxsmk-transfer__item--disabled]="item.disabled || disabled()"
            role="option"
            [attr.aria-selected]="rightSelectedKeys().has(item.key)"
            (click)="toggleRightSelection(item)"
          >
            <input
              type="checkbox"
              class="ngxsmk-transfer__checkbox"
              [checked]="rightSelectedKeys().has(item.key)"
              [disabled]="item.disabled || disabled()"
              tabindex="-1"
            />
            <div class="ngxsmk-transfer__item-label">
              <span class="ngxsmk-transfer__item-title">{{ item.title }}</span>
              @if (item.description) {
                <span class="ngxsmk-transfer__item-desc">{{ item.description }}</span>
              }
            </div>
          </div>
        }
        @if (filteredRightItems().length === 0) {
          <div class="ngxsmk-transfer__empty">No items</div>
        }
      </div>
    </div>
  `,
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      gap: var(--ngxsmk-space-4, 1rem);
      font-family: var(--ngxsmk-font-sans, system-ui, sans-serif);
      font-size: var(--ngxsmk-text-body-sm-size, 0.875rem);
      color: var(--ngxsmk-color-on-surface, #09090b);
    }

    .ngxsmk-transfer__list {
      display: flex;
      flex-direction: column;
      width: 220px;
      height: 280px;
      border: 1px solid var(--ngxsmk-color-outline, #d1d5db);
      border-radius: var(--ngxsmk-radius-md, 0.5rem);
      background: var(--ngxsmk-color-surface, #ffffff);
      overflow: hidden;
    }

    .ngxsmk-transfer__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--ngxsmk-space-2, 0.5rem) var(--ngxsmk-space-3, 0.75rem);
      border-bottom: 1px solid var(--ngxsmk-color-outline, #d1d5db);
      background: var(--ngxsmk-color-surface-variant, #f4f4f5);
      font-weight: 600;
    }

    .ngxsmk-transfer__header-count {
      font-size: var(--ngxsmk-text-body-xs-size, 0.75rem);
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
    }

    .ngxsmk-transfer__search {
      padding: var(--ngxsmk-space-2, 0.5rem);
      border-bottom: 1px solid var(--ngxsmk-color-outline, #e5e7eb);
    }

    .ngxsmk-transfer__search-input {
      width: 100%;
      padding: var(--ngxsmk-space-1, 0.25rem) var(--ngxsmk-space-2, 0.5rem);
      border: 1px solid var(--ngxsmk-color-outline, #e5e7eb);
      border-radius: var(--ngxsmk-radius-sm, 0.25rem);
      font-size: var(--ngxsmk-text-body-xs-size, 0.75rem);
      outline: none;
      background: var(--ngxsmk-color-surface, #ffffff);
      color: var(--ngxsmk-color-on-surface, #09090b);
    }

    .ngxsmk-transfer__body {
      flex: 1;
      overflow-y: auto;
      padding: var(--ngxsmk-space-1, 0.25rem);
    }

    .ngxsmk-transfer__item {
      display: flex;
      align-items: center;
      gap: var(--ngxsmk-space-2, 0.5rem);
      padding: var(--ngxsmk-space-1-5, 0.375rem) var(--ngxsmk-space-2, 0.5rem);
      border-radius: var(--ngxsmk-radius-sm, 0.25rem);
      cursor: pointer;
      user-select: none;
      transition: background 0.15s ease;
    }

    .ngxsmk-transfer__item:hover:not(.ngxsmk-transfer__item--disabled) {
      background: var(--ngxsmk-color-surface-hover, rgba(0, 0, 0, 0.04));
    }

    .ngxsmk-transfer__item--selected {
      background: color-mix(in srgb, var(--ngxsmk-color-primary, #7c3aed) 10%, transparent);
    }

    .ngxsmk-transfer__item--disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .ngxsmk-transfer__item-label {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .ngxsmk-transfer__item-title {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .ngxsmk-transfer__item-desc {
      font-size: 0.7rem;
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
    }

    .ngxsmk-transfer__empty {
      padding: 2rem 0;
      text-align: center;
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
      font-size: var(--ngxsmk-text-body-xs-size, 0.75rem);
    }

    .ngxsmk-transfer__actions {
      display: flex;
      flex-direction: column;
      gap: var(--ngxsmk-space-2, 0.5rem);
    }

    .ngxsmk-transfer__btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 2rem;
      height: 2rem;
      border: 1px solid var(--ngxsmk-color-outline, #d1d5db);
      border-radius: var(--ngxsmk-radius-md, 0.375rem);
      background: var(--ngxsmk-color-surface, #ffffff);
      color: var(--ngxsmk-color-on-surface, #09090b);
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .ngxsmk-transfer__btn:hover:not(:disabled) {
      background: var(--ngxsmk-color-primary, #7c3aed);
      color: #ffffff;
      border-color: var(--ngxsmk-color-primary, #7c3aed);
    }

    .ngxsmk-transfer__btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  `,
})
export class NgxsmkTransfer extends CvaBase<string[]> implements NgxsmkFormFieldControl {
  readonly dataSource = input<TransferItem[]>([]);
  readonly titles = input<[string, string]>(['Source', 'Target']);
  readonly showSearch = input(true);
  readonly searchPlaceholder = input('Search...');
  readonly disabled = input(false);
  readonly size = input<'sm' | 'md' | 'lg'>('md');

  // Two-way Model
  readonly targetKeys = model<string[]>([]);

  // Form Field Control
  readonly id = input(ngxsmkUniqueId('ngxsmk-transfer'));
  readonly ariaInvalid = model(false);
  readonly ariaDescribedby = model<string | null>(null);

  // Outputs
  readonly transferChange = output<{
    targetKeys: string[];
    direction: TransferDirection;
    moveKeys: string[];
  }>();

  // Internal selection signals
  protected readonly leftSearch = signal('');
  protected readonly rightSearch = signal('');
  protected readonly leftSelectedKeys = signal<Set<string>>(new Set());
  protected readonly rightSelectedKeys = signal<Set<string>>(new Set());

  protected readonly targetKeysSet = computed(() => new Set(this.targetKeys()));

  protected readonly leftItems = computed(() => {
    const targets = this.targetKeysSet();
    return this.dataSource().filter((item) => !targets.has(item.key));
  });

  protected readonly rightItems = computed(() => {
    const targets = this.targetKeysSet();
    return this.dataSource().filter((item) => targets.has(item.key));
  });

  protected readonly filteredLeftItems = computed(() => {
    const q = this.leftSearch().toLowerCase().trim();
    if (!q) return this.leftItems();
    return this.leftItems().filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q)),
    );
  });

  protected readonly filteredRightItems = computed(() => {
    const q = this.rightSearch().toLowerCase().trim();
    if (!q) return this.rightItems();
    return this.rightItems().filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q)),
    );
  });

  protected toggleLeftSelection(item: TransferItem): void {
    if (item.disabled || this.disabled()) return;
    this.leftSelectedKeys.update((set) => {
      const next = new Set(set);
      if (next.has(item.key)) {
        next.delete(item.key);
      } else {
        next.add(item.key);
      }
      return next;
    });
  }

  protected toggleRightSelection(item: TransferItem): void {
    if (item.disabled || this.disabled()) return;
    this.rightSelectedKeys.update((set) => {
      const next = new Set(set);
      if (next.has(item.key)) {
        next.delete(item.key);
      } else {
        next.add(item.key);
      }
      return next;
    });
  }

  protected moveToRight(): void {
    const moveKeys = Array.from(this.leftSelectedKeys());
    if (moveKeys.length === 0) return;
    const newTargetKeys = [...this.targetKeys(), ...moveKeys];
    this.targetKeys.set(newTargetKeys);
    this.emitChange(newTargetKeys);
    this.leftSelectedKeys.set(new Set());
    this.transferChange.emit({ targetKeys: newTargetKeys, direction: 'right', moveKeys });
  }

  protected moveToLeft(): void {
    const moveKeys = Array.from(this.rightSelectedKeys());
    if (moveKeys.length === 0) return;
    const moveSet = new Set(moveKeys);
    const newTargetKeys = this.targetKeys().filter((key) => !moveSet.has(key));
    this.targetKeys.set(newTargetKeys);
    this.emitChange(newTargetKeys);
    this.rightSelectedKeys.set(new Set());
    this.transferChange.emit({ targetKeys: newTargetKeys, direction: 'left', moveKeys });
  }

  protected inputDisabled(): boolean {
    return this.disabled();
  }

  writeValue(value: unknown): void {
    if (Array.isArray(value)) {
      this.targetKeys.set(value.map(String));
    }
  }
}
