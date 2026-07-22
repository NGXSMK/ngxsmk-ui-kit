import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { NgxsmkDateRangePicker } from './date-range-picker';

describe('NgxsmkDateRangePicker', () => {
  it('renders start and end date input fields', () => {
    const fixture = TestBed.createComponent(NgxsmkDateRangePicker);
    fixture.componentRef.setInput('range', { start: '2026-07-01', end: '2026-07-22' });
    fixture.detectChanges();

    const inputs = fixture.nativeElement.querySelectorAll('input[type="date"]');
    expect(inputs.length).toBe(2);
    expect((inputs[0] as HTMLInputElement).value).toBe('2026-07-01');
    expect((inputs[1] as HTMLInputElement).value).toBe('2026-07-22');
  });

  it('renders quick preset buttons when showPresets is true', () => {
    const fixture = TestBed.createComponent(NgxsmkDateRangePicker);
    fixture.componentRef.setInput('showPresets', true);
    fixture.detectChanges();

    const presets = fixture.nativeElement.querySelectorAll('.ngxsmk-date-range-picker__preset-btn');
    expect(presets.length).toBe(4);
  });

  it('updates range when a preset pill is clicked', () => {
    const fixture = TestBed.createComponent(NgxsmkDateRangePicker);
    fixture.detectChanges();

    const presets = fixture.nativeElement.querySelectorAll('.ngxsmk-date-range-picker__preset-btn');
    (presets[0] as HTMLButtonElement).click(); // Click "Today"

    const currentRange = fixture.componentInstance.range();
    expect(currentRange.start).toBeTruthy();
    expect(currentRange.end).toBeTruthy();
  });
});
