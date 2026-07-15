import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { NgxsmkDivider } from './divider';

@Component({
  standalone: true,
  imports: [NgxsmkDivider],
  template: `
    <ngxsmk-divider [orientation]="orientation()" />
  `,
})
class HostComponent {
  readonly orientation = signal<'horizontal' | 'vertical'>('horizontal');
}

describe('NgxsmkDivider', () => {
  function setup() {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const dividerEl: HTMLElement = fixture.nativeElement.querySelector('ngxsmk-divider');
    return { fixture, dividerEl };
  }

  it('renders with separator role and horizontal orientation by default', () => {
    const { dividerEl } = setup();
    expect(dividerEl).toBeTruthy();
    expect(dividerEl.getAttribute('role')).toBe('separator');
    expect(dividerEl.getAttribute('aria-orientation')).toBe('horizontal');
    expect(dividerEl.getAttribute('data-orientation')).toBe('horizontal');
  });

  it('updates aria-orientation and data-orientation attributes when input changes', () => {
    const { fixture, dividerEl } = setup();

    fixture.componentInstance.orientation.set('vertical');
    fixture.detectChanges();

    expect(dividerEl.getAttribute('aria-orientation')).toBe('vertical');
    expect(dividerEl.getAttribute('data-orientation')).toBe('vertical');
  });
});
