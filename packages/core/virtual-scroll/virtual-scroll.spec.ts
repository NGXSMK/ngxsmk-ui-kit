import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { NgxsmkVirtualScroll } from './virtual-scroll';

describe('NgxsmkVirtualScroll', () => {
  it('renders virtual scroll viewport and calculates spacer height', () => {
    const fixture = TestBed.createComponent(NgxsmkVirtualScroll);
    const items = Array.from({ length: 100 }, (_, i) => `Item ${i}`);
    fixture.componentRef.setInput('items', items);
    fixture.componentRef.setInput('itemHeight', 40);
    fixture.detectChanges();

    const spacer = fixture.nativeElement.querySelector('.ngxsmk-virtual-scroll__spacer');
    expect(spacer).toBeTruthy();
    expect(spacer.style.height).toBe('4000px');
  });

  it('renders only a subset of total items for performance', () => {
    const fixture = TestBed.createComponent(NgxsmkVirtualScroll);
    const items = Array.from({ length: 1000 }, (_, i) => `Row ${i}`);
    fixture.componentRef.setInput('items', items);
    fixture.componentRef.setInput('itemHeight', 30);
    fixture.detectChanges();

    const renderedRows = fixture.nativeElement.querySelectorAll('.ngxsmk-virtual-scroll__item');
    expect(renderedRows.length).toBeLessThan(1000);
  });

  it('updates total height dynamically when items array changes', () => {
    const fixture = TestBed.createComponent(NgxsmkVirtualScroll);
    fixture.componentRef.setInput('items', ['A', 'B', 'C']);
    fixture.componentRef.setInput('itemHeight', 50);
    fixture.detectChanges();

    const spacer = fixture.nativeElement.querySelector('.ngxsmk-virtual-scroll__spacer');
    expect(spacer.style.height).toBe('150px');
  });
});
