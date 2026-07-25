import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  forwardRef,
  input,
  numberAttribute,
  output,
  signal,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CvaBase } from '@ngxsmk/cdk/cva-base';

/** Parsed time-of-day. */
export interface NgxsmkTimeParts {
  hours: number;
  minutes: number;
  seconds: number;
}

/** Parses `HH:mm` or `HH:mm:ss`; returns `null` for anything else. */
export function parseNgxsmkTime(value: string | null | undefined): NgxsmkTimeParts | null {
  if (!value) return null;
  const match = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(value.trim());
  if (!match) return null;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  const seconds = match[3] ? Number(match[3]) : 0;

  if (hours > 23 || minutes > 59 || seconds > 59) return null;
  return { hours, minutes, seconds };
}

/** Formats parts back to the canonical 24-hour string. */
export function formatNgxsmkTime(parts: NgxsmkTimeParts, withSeconds = false): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  const base = `${pad(parts.hours)}:${pad(parts.minutes)}`;
  return withSeconds ? `${base}:${pad(parts.seconds)}` : base;
}

/**
 * Time-of-day picker built from native `<select>`s.
 *
 * The kit had `date-picker`, `date-range-picker`, and `scheduler` but no way to
 * pick a time on its own. Selects are deliberate: they give keyboard support,
 * screen-reader semantics, and native mobile pickers for free, which a custom
 * popup would have to reimplement and usually gets wrong.
 *
 * The value is always canonical 24-hour `HH:mm` (or `HH:mm:ss`) regardless of
 * whether it is displayed as 12-hour, so it round-trips to a server unchanged.
 *
 * ```html
 * <ngxsmk-time-picker [(value)]="startsAt" />
 * <ngxsmk-time-picker [(value)]="startsAt" use12Hour [minuteStep]="15" />
 * <ngxsmk-time-picker [formControl]="time" showSeconds />
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-time-picker',
  template: `
    <div class="ngxsmk-time-picker__group" role="group" [attr.aria-label]="ariaLabel()">
      <select
        class="ngxsmk-time-picker__field"
        [attr.aria-label]="hourLabel()"
        [disabled]="isDisabled()"
        (change)="onHour($event)"
        (blur)="onTouched()"
      >
        @for (hour of hourOptions(); track hour.value) {
          <option [value]="hour.value" [selected]="hour.value === displayHour()">
            {{ hour.label }}
          </option>
        }
      </select>

      <span class="ngxsmk-time-picker__sep" aria-hidden="true">:</span>

      <select
        class="ngxsmk-time-picker__field"
        [attr.aria-label]="minuteLabel()"
        [disabled]="isDisabled()"
        (change)="onMinute($event)"
        (blur)="onTouched()"
      >
        @for (minute of minuteOptions(); track minute) {
          <option [value]="minute" [selected]="minute === parts().minutes">
            {{ pad(minute) }}
          </option>
        }
      </select>

      @if (showSeconds()) {
        <span class="ngxsmk-time-picker__sep" aria-hidden="true">:</span>
        <select
          class="ngxsmk-time-picker__field"
          [attr.aria-label]="secondLabel()"
          [disabled]="isDisabled()"
          (change)="onSecond($event)"
          (blur)="onTouched()"
        >
          @for (second of secondOptions(); track second) {
            <option [value]="second" [selected]="second === parts().seconds">
              {{ pad(second) }}
            </option>
          }
        </select>
      }

      @if (use12Hour()) {
        <select
          class="ngxsmk-time-picker__field ngxsmk-time-picker__meridiem"
          [attr.aria-label]="meridiemLabel()"
          [disabled]="isDisabled()"
          (change)="onMeridiem($event)"
          (blur)="onTouched()"
        >
          <option value="AM" [selected]="meridiem() === 'AM'">AM</option>
          <option value="PM" [selected]="meridiem() === 'PM'">PM</option>
        </select>
      }
    </div>
  `,
  host: {
    class: 'ngxsmk-time-picker',
    '[attr.data-disabled]': 'isDisabled() ? "" : null',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxsmkTimePicker),
      multi: true,
    },
  ],
  styles: `
    :host {
      display: inline-block;
      font-family: var(--ngxsmk-font-sans);
    }
    .ngxsmk-time-picker__group {
      display: inline-flex;
      align-items: center;
      gap: var(--ngxsmk-space-1);
      padding: var(--ngxsmk-space-1) var(--ngxsmk-space-2);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-md);
      background: var(--ngxsmk-color-surface);
      color: var(--ngxsmk-color-on-surface);
    }
    .ngxsmk-time-picker__group:focus-within {
      box-shadow: var(--ngxsmk-focus-ring);
      border-color: var(--ngxsmk-color-primary);
    }
    .ngxsmk-time-picker__field {
      border: 0;
      background: none;
      color: inherit;
      font: inherit;
      font-variant-numeric: tabular-nums;
      cursor: pointer;
      appearance: none;
      text-align: center;
    }
    .ngxsmk-time-picker__field:focus-visible {
      outline: none;
    }
    .ngxsmk-time-picker__meridiem {
      margin-inline-start: var(--ngxsmk-space-1);
    }
    .ngxsmk-time-picker__sep {
      color: var(--ngxsmk-color-on-surface-variant);
    }
    :host([data-disabled]) .ngxsmk-time-picker__group {
      opacity: var(--ngxsmk-opacity-disabled, 0.5);
      pointer-events: none;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkTimePicker extends CvaBase<string> {
  /** Canonical 24-hour value, `HH:mm` or `HH:mm:ss`. */
  readonly value = input<string>('');

  readonly disabled = input(false, { transform: booleanAttribute });

  /** Display as 12-hour with an AM/PM select. The value stays 24-hour. */
  readonly use12Hour = input(false, { transform: booleanAttribute });

  /** Add a seconds select, and seconds to the emitted value. */
  readonly showSeconds = input(false, { transform: booleanAttribute });

  /** Granularity of the minute select. */
  readonly minuteStep = input(1, { transform: numberAttribute });

  /** Granularity of the seconds select, when shown. */
  readonly secondStep = input(1, { transform: numberAttribute });

  readonly ariaLabel = input('Time');
  readonly hourLabel = input('Hours');
  readonly minuteLabel = input('Minutes');
  readonly secondLabel = input('Seconds');
  readonly meridiemLabel = input('AM or PM');

  readonly valueChange = output<string>();

  /** Internal state, seeded from `value` and updated by the selects. */
  private readonly internal = signal<NgxsmkTimeParts>({ hours: 0, minutes: 0, seconds: 0 });
  /** Set once a form writes a value, so `value` no longer overrides it. */
  private readonly formDriven = signal(false);

  protected readonly parts = computed(() =>
    this.formDriven() ? this.internal() : (parseNgxsmkTime(this.value()) ?? this.internal()),
  );

  protected readonly meridiem = computed(() => (this.parts().hours < 12 ? 'AM' : 'PM'));

  /** In 12-hour display, midnight and noon both show as 12. */
  protected readonly displayHour = computed(() => {
    const hours = this.parts().hours;
    if (!this.use12Hour()) return hours;
    return hours % 12 === 0 ? 12 : hours % 12;
  });

  protected readonly hourOptions = computed(() => {
    if (this.use12Hour()) {
      return Array.from({ length: 12 }, (_, i) => {
        const display = i === 0 ? 12 : i;
        return { value: display, label: this.pad(display) };
      });
    }
    return Array.from({ length: 24 }, (_, i) => ({ value: i, label: this.pad(i) }));
  });

  protected readonly minuteOptions = computed(() => range(60, Math.max(1, this.minuteStep())));
  protected readonly secondOptions = computed(() => range(60, Math.max(1, this.secondStep())));

  protected override inputDisabled(): boolean {
    return this.disabled();
  }

  override writeValue(value: unknown): void {
    this.formDriven.set(true);
    this.internal.set(
      parseNgxsmkTime(value == null ? '' : String(value)) ?? {
        hours: 0,
        minutes: 0,
        seconds: 0,
      },
    );
  }

  protected pad(value: number): string {
    return String(value).padStart(2, '0');
  }

  protected onTouched(): void {
    this.emitTouched();
  }

  protected onHour(event: Event): void {
    const selected = Number((event.target as HTMLSelectElement).value);
    const hours = this.use12Hour() ? to24Hour(selected, this.meridiem()) : selected;
    this.commit({ ...this.parts(), hours });
  }

  protected onMinute(event: Event): void {
    this.commit({ ...this.parts(), minutes: Number((event.target as HTMLSelectElement).value) });
  }

  protected onSecond(event: Event): void {
    this.commit({ ...this.parts(), seconds: Number((event.target as HTMLSelectElement).value) });
  }

  protected onMeridiem(event: Event): void {
    const meridiem = (event.target as HTMLSelectElement).value as 'AM' | 'PM';
    this.commit({ ...this.parts(), hours: to24Hour(this.displayHour(), meridiem) });
  }

  private commit(parts: NgxsmkTimeParts): void {
    this.internal.set(parts);
    this.formDriven.set(true);

    const formatted = formatNgxsmkTime(parts, this.showSeconds());
    this.emitChange(formatted);
    this.valueChange.emit(formatted);
  }
}

/** `0, step, 2*step, …` below `limit`. */
function range(limit: number, step: number): number[] {
  const out: number[] = [];
  for (let i = 0; i < limit; i += step) out.push(i);
  return out;
}

/** 12-hour display hour + meridiem -> 24-hour hour. */
function to24Hour(displayHour: number, meridiem: 'AM' | 'PM'): number {
  const base = displayHour % 12;
  return meridiem === 'PM' ? base + 12 : base;
}
