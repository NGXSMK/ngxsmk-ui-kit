import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';
import { NgxsmkCalendarHeatmap } from './calendar-heatmap';

describe('NgxsmkCalendarHeatmap', () => {
  it('renders heatmap grid cells', () => {
    const fixture = TestBed.createComponent(NgxsmkCalendarHeatmap);
    fixture.componentRef.setInput('values', [{ date: '2026-07-22', count: 5 }]);
    fixture.detectChanges();

    const cells = fixture.nativeElement.querySelectorAll(
      '.ngxsmk-heatmap__grid .ngxsmk-heatmap__cell',
    );
    expect(cells.length).toBeGreaterThan(0);
  });

  it('assigns correct data-level based on contribution count', () => {
    const fixture = TestBed.createComponent(NgxsmkCalendarHeatmap);
    const today = new Date().toISOString().split('T')[0];
    fixture.componentRef.setInput('values', [{ date: today, count: 8 }]);
    fixture.detectChanges();

    const cells = fixture.nativeElement.querySelectorAll(
      '.ngxsmk-heatmap__grid .ngxsmk-heatmap__cell',
    );
    expect(cells.length).toBeGreaterThan(0);
  });

  it('emits cellClick output when clicked', () => {
    const fixture = TestBed.createComponent(NgxsmkCalendarHeatmap);
    const spy = vi.fn();
    fixture.componentInstance.cellClick.subscribe(spy);
    fixture.componentRef.setInput('values', [{ date: '2026-07-22', count: 3 }]);
    fixture.detectChanges();

    const firstCell = fixture.nativeElement.querySelector(
      '.ngxsmk-heatmap__grid .ngxsmk-heatmap__cell',
    ) as HTMLElement;
    firstCell.click();

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ date: expect.any(String), count: expect.any(Number) }),
    );
  });

  it('emits cellClick output on Enter keydown', () => {
    const fixture = TestBed.createComponent(NgxsmkCalendarHeatmap);
    const spy = vi.fn();
    fixture.componentInstance.cellClick.subscribe(spy);
    fixture.detectChanges();

    const firstCell = fixture.nativeElement.querySelector(
      '.ngxsmk-heatmap__grid .ngxsmk-heatmap__cell',
    ) as HTMLElement;
    firstCell.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

    expect(spy).toHaveBeenCalled();
  });

  it('renders legend with Less and More labels', () => {
    const fixture = TestBed.createComponent(NgxsmkCalendarHeatmap);
    fixture.detectChanges();

    const legend = fixture.nativeElement.querySelector('.ngxsmk-heatmap__legend');
    expect(legend.textContent).toContain('Less');
    expect(legend.textContent).toContain('More');
  });
});
