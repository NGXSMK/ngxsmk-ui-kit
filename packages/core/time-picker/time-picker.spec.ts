import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { NgxsmkTimePicker } from './time-picker';

@Component({
  standalone: true,
  imports: [NgxsmkTimePicker],
  template: `<ngxsmk-time-picker [(value)]="value" />`,
})
class HostComponent {
  readonly value = signal('10:15');
}

describe('NgxsmkTimePicker', () => {
  it('renders a native time input', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input[type="time"]');
    expect(input).toBeTruthy();
    expect(input.value).toBe('10:15');
  });
});
