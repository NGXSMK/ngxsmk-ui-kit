import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { NgxsmkSelect, NgxsmkSelectOption } from './select';

@Component({
  standalone: true,
  imports: [NgxsmkSelect],
  template: `
    <ngxsmk-select
      [placeholder]="placeholder()"
      [options]="options"
      [disabled]="disabled()"
      [(value)]="value"
      (changed)="onChanged($event)"
    />
  `,
})
class HostComponent {
  readonly placeholder = signal('Select an option');
  readonly disabled = signal(false);
  value = '';
  lastChangedValue = '';

  readonly options: NgxsmkSelectOption[] = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana', disabled: true },
    { value: 'cherry', label: 'Cherry' },
  ];

  onChanged(val: string) {
    this.lastChangedValue = val;
  }
}

describe('NgxsmkSelect', () => {
  beforeEach(() => {
    const mockScroll = vi.fn();
    Element.prototype.scrollIntoView = mockScroll;
    HTMLElement.prototype.scrollIntoView = mockScroll;
    if (typeof window !== 'undefined') {
      if ((window as any).Element) (window as any).Element.prototype.scrollIntoView = mockScroll;
      if ((window as any).HTMLElement)
        (window as any).HTMLElement.prototype.scrollIntoView = mockScroll;
    }
  });

  function setup() {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const triggerBtn: HTMLButtonElement =
      fixture.nativeElement.querySelector('.ngxsmk-select__trigger');
    const valueEl: HTMLElement = fixture.nativeElement.querySelector('.ngxsmk-select__value');
    return { fixture, triggerBtn, valueEl };
  }

  it('renders trigger with placeholder initially', () => {
    const { triggerBtn, valueEl } = setup();
    expect(triggerBtn).toBeTruthy();
    expect(valueEl.textContent?.trim()).toBe('Select an option');
  });

  it('opens and closes dropdown on click', () => {
    const { fixture, triggerBtn } = setup();
    expect(document.querySelector('.ngxsmk-select__listbox')).toBeNull();

    triggerBtn.click();
    fixture.detectChanges();

    const listbox = document.querySelector('.ngxsmk-select__listbox');
    expect(listbox).toBeTruthy();

    triggerBtn.click();
    fixture.detectChanges();
    expect(document.querySelector('.ngxsmk-select__listbox')).toBeNull();
  });

  it('selects option on click and closes dropdown', () => {
    const { fixture, triggerBtn, valueEl } = setup();
    triggerBtn.click();
    fixture.detectChanges();

    const options = document.querySelectorAll('.ngxsmk-select__option');
    // Cherry is third option (placeholder is first if defined, but wait, placeholder option has separate class)
    // Options loop: Apple (idx 0), Banana (idx 1), Cherry (idx 2)
    // Plus Placeholder at the top (since placeholder() is defined)
    // So options list should have Placeholder, Apple, Banana (disabled), Cherry.
    expect(options.length).toBe(4);

    const cherryOpt = options[3] as HTMLElement; // Cherry
    cherryOpt.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.value).toBe('cherry');
    expect(fixture.componentInstance.lastChangedValue).toBe('cherry');
    expect(valueEl.textContent?.trim()).toBe('Cherry');
    expect(document.querySelector('.ngxsmk-select__listbox')).toBeNull();
  });

  it('does not select disabled options', () => {
    const { fixture, triggerBtn } = setup();
    triggerBtn.click();
    fixture.detectChanges();

    const options = document.querySelectorAll('.ngxsmk-select__option');
    const bananaOpt = options[2] as HTMLElement; // Banana is disabled
    bananaOpt.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.value).toBe('');
    expect(document.querySelector('.ngxsmk-select__listbox')).toBeTruthy(); // listbox remains open
  });

  it('handles keyboard navigation: ArrowDown and Enter to select', () => {
    const { fixture, triggerBtn, valueEl } = setup();

    // Trigger keydown ArrowDown to open listbox and move active
    const arrowDownEvent = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true });
    triggerBtn.dispatchEvent(arrowDownEvent);
    fixture.detectChanges();

    const listbox = document.querySelector('.ngxsmk-select__listbox') as HTMLElement;
    expect(listbox).toBeTruthy();

    // Send another ArrowDown to move to first option (Apple)
    listbox.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    fixture.detectChanges();

    // Send Enter key to select Apple
    listbox.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.value).toBe('apple');
    expect(valueEl.textContent?.trim()).toBe('Apple');
    expect(document.querySelector('.ngxsmk-select__listbox')).toBeNull();
  });
});
