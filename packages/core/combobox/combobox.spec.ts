import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { NgxsmkCombobox } from './combobox';

@Component({
  standalone: true,
  imports: [NgxsmkCombobox],
  template: ` <ngxsmk-combobox [options]="options" [(value)]="value" /> `,
})
class HostComponent {
  value = '';
  readonly options = [
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'ca', label: 'Canada' },
  ];
}

describe('NgxsmkCombobox', () => {
  beforeEach(() => {
    HTMLElement.prototype.scrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = vi.fn();
  });

  function setup() {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('.ngxsmk-combobox__input');
    return { fixture, input };
  }

  function type(input: HTMLInputElement, text: string) {
    input.value = text;
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }

  function key(input: HTMLInputElement, k: string) {
    input.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true }));
  }

  it('highlights the first match after typing', () => {
    const { fixture, input } = setup();
    type(input, 'united');
    fixture.detectChanges();

    const options = fixture.nativeElement.querySelectorAll('.ngxsmk-combobox__option');
    expect(options.length).toBe(2); // United States, United Kingdom
    expect(options[0].classList).toContain('ngxsmk-combobox__option--active');
  });

  it('navigates with arrows and selects with Enter', () => {
    const { fixture, input } = setup();
    type(input, 'united');
    fixture.detectChanges();

    key(input, 'ArrowDown'); // United Kingdom
    fixture.detectChanges();
    key(input, 'Enter');
    fixture.detectChanges();

    expect(fixture.componentInstance.value).toBe('uk');
    expect(fixture.nativeElement.querySelector('.ngxsmk-combobox__dropdown')).toBeNull();
    expect(input.value).toBe('United Kingdom');
  });

  it('opens with ArrowDown when closed', () => {
    const { fixture, input } = setup();
    // Closed initially (no focus/input yet).
    expect(fixture.nativeElement.querySelector('.ngxsmk-combobox__dropdown')).toBeNull();

    key(input, 'ArrowDown');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.ngxsmk-combobox__dropdown')).toBeTruthy();
  });

  it('closes on Escape', () => {
    const { fixture, input } = setup();
    type(input, 'u');
    fixture.detectChanges();
    key(input, 'Escape');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.ngxsmk-combobox__dropdown')).toBeNull();
  });
});
