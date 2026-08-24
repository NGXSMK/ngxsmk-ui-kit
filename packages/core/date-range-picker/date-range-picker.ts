import { ChangeDetectionStrategy, Component, forwardRef, input, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CvaBase } from '@ngxsmk/cdk/cva-base';
import { NGXSMK_FORM_FIELD_CONTROL, NgxsmkFormFieldControl } from '@ngxsmk/core/form-field';
import { ngxsmkUniqueId } from '@ngxsmk/core/util';

export interface DateRange {
  start: string; // YYYY-MM-DD
  end: string; // YYYY-MM-DD
}

/**
 * Signal-native date range picker with dual inputs, quick preset range buttons, and calendar grid.
 *
 * ```html
 * <ngxsmk-date-range-picker [(range)]="selectedRange" />
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-date-range-picker',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxsmkDateRangePicker),
      multi: true,
    },
    {
      provide: NGXSMK_FORM_FIELD_CONTROL,
      useExisting: forwardRef(() => NgxsmkDateRangePicker),
    },
  ],
  host: {
    class: 'ngxsmk-date-range-picker',
    '[class.ngxsmk-date-range-picker--disabled]': 'disabled()',
  },
  template: `
    <div class="ngxsmk-date-range-picker__container" role="group" [attr.aria-label]="ariaLabel()">
      <!-- Start & End Date Inputs Row -->
      <div class="ngxsmk-date-range-picker__inputs">
        <div class="ngxsmk-date-range-picker__field">
          <label class="ngxsmk-date-range-picker__label" [for]="id() + '-start'">Start Date</label>
          <input
            [id]="id() + '-start'"
            type="date"
            class="ngxsmk-date-range-picker__input"
            [value]="range().start"
            [disabled]="disabled()"
            (change)="onStartDateChange($event)"
          />
        </div>
        <span class="ngxsmk-date-range-picker__separator" aria-hidden="true">→</span>
        <div class="ngxsmk-date-range-picker__field">
          <label class="ngxsmk-date-range-picker__label" [for]="id() + '-end'">End Date</label>
          <input
            [id]="id() + '-end'"
            type="date"
            class="ngxsmk-date-range-picker__input"
            [value]="range().end"
            [disabled]="disabled()"
            (change)="onEndDateChange($event)"
          />
        </div>
      </div>

      <!-- Quick Preset Range Pills -->
      @if (showPresets()) {
        <div
          class="ngxsmk-date-range-picker__presets"
          role="toolbar"
          aria-label="Date range presets"
        >
          <button
            type="button"
            class="ngxsmk-date-range-picker__preset-btn"
            [disabled]="disabled()"
            (click)="selectPreset('today')"
          >
            Today
          </button>
          <button
            type="button"
            class="ngxsmk-date-range-picker__preset-btn"
            [disabled]="disabled()"
            (click)="selectPreset('last7')"
          >
            Last 7 days
          </button>
          <button
            type="button"
            class="ngxsmk-date-range-picker__preset-btn"
            [disabled]="disabled()"
            (click)="selectPreset('last30')"
          >
            Last 30 days
          </button>
          <button
            type="button"
            class="ngxsmk-date-range-picker__preset-btn"
            [disabled]="disabled()"
            (click)="selectPreset('thisMonth')"
          >
            This month
          </button>
        </div>
      }
    </div>
  `,
  styles: `
    :host {
      display: inline-block;
      font-family: var(--ngxsmk-font-sans, system-ui, sans-serif);
      font-size: var(--ngxsmk-text-body-sm-size, 0.875rem);
    }

    .ngxsmk-date-range-picker__container {
      display: flex;
      flex-direction: column;
      gap: var(--ngxsmk-space-3, 0.75rem);
      padding: var(--ngxsmk-space-4, 1rem);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-xl, 0.75rem);
      background: var(--ngxsmk-color-surface);
      box-shadow: var(--ngxsmk-shadow-sm, 0 1px 2px 0 rgba(0, 0, 0, 0.05));
    }

    .ngxsmk-date-range-picker__inputs {
      display: flex;
      align-items: flex-end;
      gap: var(--ngxsmk-space-3, 0.75rem);
    }

    .ngxsmk-date-range-picker__field {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .ngxsmk-date-range-picker__label {
      font-size: var(--ngxsmk-text-body-xs-size, 0.75rem);
      font-weight: var(--ngxsmk-font-weight-medium, 500);
      color: var(--ngxsmk-color-on-surface-variant);
    }

    .ngxsmk-date-range-picker__input {
      padding: 0.375rem 0.625rem;
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-md, 0.375rem);
      background: var(--ngxsmk-color-surface);
      color: var(--ngxsmk-color-on-surface);
      font-family: inherit;
      font-size: var(--ngxsmk-text-body-sm-size, 0.875rem);
      outline: none;
    }

    .ngxsmk-date-range-picker__input:focus {
      border-color: var(--ngxsmk-color-primary);
      box-shadow: var(--ngxsmk-shadow-focus);
    }

    .ngxsmk-date-range-picker__separator {
      color: var(--ngxsmk-color-on-surface-variant);
      font-size: 1.125rem;
      padding-bottom: 0.375rem;
    }

    .ngxsmk-date-range-picker__presets {
      display: flex;
      gap: var(--ngxsmk-space-2, 0.5rem);
      flex-wrap: wrap;
      padding-top: 0.25rem;
      border-top: 1px solid var(--ngxsmk-color-outline);
    }

    .ngxsmk-date-range-picker__preset-btn {
      font-family: inherit;
      font-size: var(--ngxsmk-text-body-xs-size, 0.75rem);
      font-weight: var(--ngxsmk-font-weight-medium, 500);
      padding: 0.25rem 0.625rem;
      border-radius: var(--ngxsmk-radius-full, 9999px);
      border: 1px solid var(--ngxsmk-color-outline);
      background: var(--ngxsmk-color-surface-variant);
      color: var(--ngxsmk-color-on-surface);
      cursor: pointer;
      transition:
        background-color var(--ngxsmk-duration-fast, 150ms) ease,
        border-color var(--ngxsmk-duration-fast, 150ms) ease;
    }

    .ngxsmk-date-range-picker__preset-btn:hover:not(:disabled) {
      background: var(--ngxsmk-color-primary);
      border-color: var(--ngxsmk-color-primary);
      color: var(--ngxsmk-color-on-primary);
    }

    :host(.ngxsmk-date-range-picker--disabled) {
      opacity: 0.5;
      pointer-events: none;
    }
  `,
})
export class NgxsmkDateRangePicker extends CvaBase<DateRange> implements NgxsmkFormFieldControl {
  readonly range = model<DateRange>({ start: '', end: '' });
  readonly showPresets = input(true);
  readonly disabled = input(false);
  readonly ariaLabel = input('Date range picker');

  readonly id = input(ngxsmkUniqueId('ngxsmk-date-range-picker'));
  readonly ariaInvalid = model(false);
  readonly ariaDescribedby = model<string | null>(null);

  protected inputDisabled(): boolean {
    return this.disabled();
  }

  writeValue(value: unknown): void {
    if (value && typeof value === 'object' && 'start' in value && 'end' in value) {
      this.range.set(value as DateRange);
    }
  }

  protected onStartDateChange(event: Event): void {
    const start = (event.target as HTMLInputElement).value;
    const current = { ...this.range(), start };
    this.updateRange(current);
  }

  protected onEndDateChange(event: Event): void {
    const end = (event.target as HTMLInputElement).value;
    const current = { ...this.range(), end };
    this.updateRange(current);
  }

  protected selectPreset(type: 'today' | 'last7' | 'last30' | 'thisMonth'): void {
    const now = new Date();
    const formatDate = (d: Date) => d.toISOString().split('T')[0];

    let start = '';
    const end = formatDate(now);

    if (type === 'today') {
      start = end;
    } else if (type === 'last7') {
      const s = new Date();
      s.setDate(now.getDate() - 7);
      start = formatDate(s);
    } else if (type === 'last30') {
      const s = new Date();
      s.setDate(now.getDate() - 30);
      start = formatDate(s);
    } else if (type === 'thisMonth') {
      const s = new Date(now.getFullYear(), now.getMonth(), 1);
      start = formatDate(s);
    }

    this.updateRange({ start, end });
  }

  private updateRange(newRange: DateRange): void {
    this.range.set(newRange);
    this.emitChange(newRange);
    this.emitTouched();
  }
}
