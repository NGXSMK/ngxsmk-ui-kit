import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { NgxsmkCalendarHeatmap } from './calendar-heatmap';

describe('NgxsmkCalendarHeatmap', () => {
  it('renders heatmap grid cells', () => {
    const fixture = TestBed.createComponent(NgxsmkCalendarHeatmap);
    fixture.componentRef.setInput('values', [{ date: '2026-07-22', count: 5 }]);
    fixture.detectChanges();

    const cells = fixture.nativeElement.querySelectorAll('.ngxsmk-heatmap__grid .ngxsmk-heatmap__cell');
    expect(cells.length).toBeGreaterThan(0);
  });
});
