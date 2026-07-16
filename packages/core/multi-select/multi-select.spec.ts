import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { NgxsmkMultiSelect } from './multi-select';

@Component({
  standalone: true,
  imports: [NgxsmkMultiSelect],
  template: `
    <ngxsmk-multi-select [options]="options" [disabled]="disabled()" [(value)]="value" />
  `,
})
class HostComponent {
  readonly disabled = signal(false);
  value: string[] = [];
  readonly options = [
    { value: 'red', label: 'Red' },
    { value: 'green', label: 'Green' },
    { value: 'blue', label: 'Blue' },
  ];
}

describe('NgxsmkMultiSelect', () => {
  beforeEach(() => {
    HTMLElement.prototype.scrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = vi.fn();
  });

  function setup() {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const trigger: HTMLElement = fixture.nativeElement.querySelector(
      '.ngxsmk-multi-select__trigger',
    );
    return { fixture, trigger };
  }

  function key(el: HTMLElement, k: string) {
    el.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true }));
  }

  it('opens the listbox with ArrowDown and highlights the first option', () => {
    const { fixture, trigger } = setup();
    key(trigger, 'ArrowDown');
    fixture.detectChanges();

    const options = fixture.nativeElement.querySelectorAll('.ngxsmk-multi-select__option');
    expect(options.length).toBe(3);
    expect(options[0].classList).toContain('ngxsmk-multi-select__option--active');
  });

  it('selects the highlighted option with Enter and removes it from the list', () => {
    const { fixture, trigger } = setup();
    key(trigger, 'ArrowDown'); // open, highlight Red
    fixture.detectChanges();
    key(trigger, 'ArrowDown'); // Green
    fixture.detectChanges();
    key(trigger, 'Enter'); // pick Green
    fixture.detectChanges();

    expect(fixture.componentInstance.value).toEqual(['green']);
    const options = fixture.nativeElement.querySelectorAll('.ngxsmk-multi-select__option');
    expect(options.length).toBe(2); // Green now a tag, gone from remaining
  });

  it('closes the listbox on Escape', () => {
    const { fixture, trigger } = setup();
    key(trigger, 'ArrowDown');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.ngxsmk-multi-select__listbox')).toBeTruthy();

    key(trigger, 'Escape');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.ngxsmk-multi-select__listbox')).toBeNull();
  });

  it('ignores keyboard interaction when disabled', () => {
    const { fixture, trigger } = setup();
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();

    key(trigger, 'ArrowDown');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.ngxsmk-multi-select__listbox')).toBeNull();
  });
});
