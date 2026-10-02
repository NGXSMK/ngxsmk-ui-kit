import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { NgxsmkInputMask } from './input-mask';

@Component({
  standalone: true,
  imports: [NgxsmkInputMask],
  template: `<input ngxsmkInputMask mask="(000) 000-0000" [(value)]="value" />`,
})
class HostComponent {
  readonly value = signal('');
}

describe('NgxsmkInputMask', () => {
  it('formats digits to the mask pattern', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    input.value = '5551234567';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe('(555) 123-4567');
  });
});
