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
});
