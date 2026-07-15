import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { NgxsmkVisuallyHidden } from './visually-hidden';

@Component({
  standalone: true,
  imports: [NgxsmkVisuallyHidden],
  template: `
    <span ngxsmkVisuallyHidden id="target">Screen Reader Text</span>
  `,
})
class HostComponent {}

describe('NgxsmkVisuallyHidden', () => {
  it('applies visually hidden styles to the host element', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const target = fixture.nativeElement.querySelector('#target') as HTMLElement;
    expect(target).not.toBeNull();
    
    // Check key styles
    expect(target.style.position).toBe('absolute');
    expect(target.style.width).toBe('1px');
    expect(target.style.height).toBe('1px');
    expect(target.style.overflow).toBe('hidden');
    expect(target.style.whiteSpace).toBe('nowrap');
  });
});
