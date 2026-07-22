import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { NgxsmkSignaturePad } from './signature-pad';

describe('NgxsmkSignaturePad', () => {
  it('renders canvas element with specified width and height', () => {
    const fixture = TestBed.createComponent(NgxsmkSignaturePad);
    fixture.componentRef.setInput('width', 300);
    fixture.componentRef.setInput('height', 150);
    fixture.detectChanges();

    const canvas = fixture.nativeElement.querySelector('canvas');
    expect(canvas).toBeTruthy();
    expect(canvas.getAttribute('width')).toBe('300');
    expect(canvas.getAttribute('height')).toBe('150');
  });
});
