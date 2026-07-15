import { Component, signal, NO_ERRORS_SCHEMA } from '@angular/core';
import { ShowcaseExample } from '../../showcase/showcase-example';

/**
 * Isolated showcase for the date controls (`ngxsmk-date-picker` and
 * `ngxsmk-datepicker`).
 *
 * These components pull in heavy transitive peers (`ngxsmk-datepicker` +
 * `luxon`). `NO_ERRORS_SCHEMA` is scoped to THIS tiny component only so the
 * rest of the demo stays strictly type-checked, and the controls are loaded
 * lazily via `@defer` so their peers stay out of the main `forms` route chunk.
 */
@Component({
  selector: 'datepicker-showcase',
  standalone: true,
  imports: [ShowcaseExample],
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <showcase-example
      title="Date Picker"
      description="Native date field styled with theme tokens."
      [code]="codeDatePicker"
    >
      <div class="ngxsmk-sc-col" style="width: 100%; max-width: 220px">
        @defer (on viewport) {
          <ngxsmk-date-picker [(value)]="date" />
        } @placeholder (minimum 200ms) {
          <div style="height: 40px"></div>
        }
        <small>Date: {{ date() || '—' }}</small>
      </div>
    </showcase-example>

    <showcase-example
      title="Datepicker (calendar)"
      description="A feature-rich popover calendar powered by ngxsmk-datepicker — month navigation, ranges, time, i18n, and more."
      [code]="codeDatepicker"
    >
      <div class="ngxsmk-sc-col" style="width: 100%; max-width: 300px">
        @defer (on viewport) {
          <ngxsmk-datepicker
            [value]="calendarDate()"
            (valueChange)="onCalendarChange($event)"
            placeholder="Pick a date"
          />
        } @placeholder (minimum 200ms) {
          <div style="height: 40px"></div>
        }
        <small>Selected: {{ calendarDate() ? calendarDate()!.toLocaleDateString() : '—' }}</small>
      </div>
    </showcase-example>
  `,
})
export class DatepickerShowcase {
  date = signal<unknown>(null);
  calendarDate = signal<Date | null>(null);

  protected onCalendarChange(value: unknown): void {
    this.calendarDate.set(value instanceof Date ? value : null);
  }

  protected readonly codeDatePicker = `<ngxsmk-date-picker [(value)]="date" />`;
  protected readonly codeDatepicker = `<ngxsmk-datepicker [value]="calendarDate()" (valueChange)="onCalendarChange($event)" placeholder="Pick a date" />`;
}
