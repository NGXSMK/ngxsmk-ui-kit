import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '@ngxsmk/cdk/testing';
import { NgxsmkTimePicker, formatNgxsmkTime, parseNgxsmkTime } from './time-picker';

describe('parseNgxsmkTime', () => {
  it('parses HH:mm and HH:mm:ss', () => {
    expect(parseNgxsmkTime('09:30')).toEqual({ hours: 9, minutes: 30, seconds: 0 });
    expect(parseNgxsmkTime('23:59:58')).toEqual({ hours: 23, minutes: 59, seconds: 58 });
  });

  it('rejects out-of-range and malformed values', () => {
    expect(parseNgxsmkTime('24:00')).toBeNull();
    expect(parseNgxsmkTime('12:60')).toBeNull();
    expect(parseNgxsmkTime('noon')).toBeNull();
    expect(parseNgxsmkTime('')).toBeNull();
    expect(parseNgxsmkTime(null)).toBeNull();
  });
});

describe('formatNgxsmkTime', () => {
  it('pads and optionally includes seconds', () => {
    expect(formatNgxsmkTime({ hours: 9, minutes: 5, seconds: 3 })).toBe('09:05');
    expect(formatNgxsmkTime({ hours: 9, minutes: 5, seconds: 3 }, true)).toBe('09:05:03');
  });
});

@Component({
  standalone: true,
  imports: [NgxsmkTimePicker, ReactiveFormsModule],
  template: `
    <ngxsmk-time-picker
      [formControl]="control"
      [use12Hour]="use12Hour()"
      [showSeconds]="showSeconds()"
      [minuteStep]="minuteStep()"
    />
  `,
})
class HostComponent {
  readonly control = new FormControl('');
  readonly use12Hour = signal(false);
  readonly showSeconds = signal(false);
  readonly minuteStep = signal(1);
}

describe('NgxsmkTimePicker', () => {
  function setup(initial = '14:30') {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.control.setValue(initial);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const selects = () => root.querySelectorAll<HTMLSelectElement>('.ngxsmk-time-picker__field');
    const pick = (index: number, value: string) => {
      const select = selects()[index];
      select.value = value;
      select.dispatchEvent(new Event('change'));
      fixture.detectChanges();
    };
    return { fixture, root, selects, pick };
  }

  it('renders 24 hour options in 24-hour mode', () => {
    const { selects } = setup();
    expect(selects()[0].options).toHaveLength(24);
  });

  it('renders 12 hour options plus a meridiem select in 12-hour mode', () => {
    const { fixture, selects } = setup();
    fixture.componentInstance.use12Hour.set(true);
    fixture.detectChanges();

    expect(selects()[0].options).toHaveLength(12);
    // hour, minute, meridiem
    expect(selects()).toHaveLength(3);
  });

  it('shows 14:30 as 02:30 PM in 12-hour mode without changing the value', () => {
    const { fixture, selects } = setup('14:30');
    fixture.componentInstance.use12Hour.set(true);
    fixture.detectChanges();

    expect(selects()[0].value).toBe('2');
    expect(selects()[2].value).toBe('PM');
    expect(fixture.componentInstance.control.value).toBe('14:30');
  });

  it('writes a canonical 24-hour value when the hour changes', () => {
    const { fixture, pick } = setup('14:30');
    pick(0, '9');
    expect(fixture.componentInstance.control.value).toBe('09:30');
  });

  it('converts a 12-hour selection back to 24-hour', () => {
    const { fixture, pick } = setup('09:00');
    fixture.componentInstance.use12Hour.set(true);
    fixture.detectChanges();

    // Switch to PM: 9 AM becomes 21:00.
    pick(2, 'PM');
    expect(fixture.componentInstance.control.value).toBe('21:00');
  });

  it('treats 12 AM as midnight and 12 PM as noon', () => {
    const { fixture, pick } = setup('05:00');
    fixture.componentInstance.use12Hour.set(true);
    fixture.detectChanges();

    pick(0, '12');
    expect(fixture.componentInstance.control.value).toBe('00:00');

    pick(2, 'PM');
    expect(fixture.componentInstance.control.value).toBe('12:00');
  });

  it('honours the minute step', () => {
    const { fixture, selects } = setup();
    fixture.componentInstance.minuteStep.set(15);
    fixture.detectChanges();

    const minutes = Array.from(selects()[1].options).map((o) => o.value);
    expect(minutes).toEqual(['0', '15', '30', '45']);
  });

  it('adds seconds to the value only when enabled', () => {
    const { fixture, pick } = setup('14:30');
    expect(fixture.componentInstance.control.value).toBe('14:30');

    fixture.componentInstance.showSeconds.set(true);
    fixture.detectChanges();

    pick(2, '30');
    expect(fixture.componentInstance.control.value).toBe('14:30:30');
  });

  it('reflects a disabled form control onto every select', async () => {
    const { fixture, selects } = setup();
    fixture.componentInstance.control.disable();
    fixture.detectChanges();
    await fixture.whenStable();

    for (const select of Array.from(selects())) {
      expect(select.disabled).toBe(true);
    }
  });

  it('marks the control touched on blur', () => {
    const { fixture, selects } = setup();
    selects()[0].dispatchEvent(new Event('blur'));

    expect(fixture.componentInstance.control.touched).toBe(true);
  });

  it('has no accessibility violations', async () => {
    const { fixture, root } = setup();
    fixture.componentInstance.use12Hour.set(true);
    fixture.componentInstance.showSeconds.set(true);
    fixture.detectChanges();

    await expectNoA11yViolations(root, { rules: { 'color-contrast': { enabled: false } } });
  });
});
