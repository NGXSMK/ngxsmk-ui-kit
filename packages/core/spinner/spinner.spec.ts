import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { NgxsmkSpinner, NgxsmkSpinnerSize } from './spinner';

@Component({
  standalone: true,
  imports: [NgxsmkSpinner],
  template: `
    <ngxsmk-spinner [size]="size()" [label]="label()" />
  `,
})
class HostComponent {
  readonly size = signal<NgxsmkSpinnerSize>('md');
  readonly label = signal('Loading items');
}

describe('NgxsmkSpinner', () => {
  function setup() {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const spinnerEl: HTMLElement = fixture.nativeElement.querySelector('ngxsmk-spinner');
    return { fixture, spinnerEl };
  }

  it('sets standard accessibility attributes', () => {
    const { spinnerEl } = setup();
    expect(spinnerEl).toBeTruthy();
    expect(spinnerEl.getAttribute('role')).toBe('status');
    expect(spinnerEl.getAttribute('aria-label')).toBe('Loading items');
  });

  it('updates aria-label and data-size attributes when inputs change', () => {
    const { fixture, spinnerEl } = setup();
    expect(spinnerEl.getAttribute('data-size')).toBe('md');

    fixture.componentInstance.size.set('lg');
    fixture.componentInstance.label.set('Please wait');
    fixture.detectChanges();

    expect(spinnerEl.getAttribute('data-size')).toBe('lg');
    expect(spinnerEl.getAttribute('aria-label')).toBe('Please wait');
  });
});
