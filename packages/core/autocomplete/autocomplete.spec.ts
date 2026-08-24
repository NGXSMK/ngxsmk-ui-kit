import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { NgxsmkAutocomplete } from './autocomplete';

@Component({
  standalone: true,
  imports: [NgxsmkAutocomplete],
  template: `
    <ngxsmk-autocomplete [options]="options" [placeholder]="placeholder()" [(value)]="value" />
  `,
})
class HostComponent {
  readonly placeholder = signal('Search…');
  value = '';
  readonly options = [
    { value: 'apple', label: 'Apple' },
    { value: 'apricot', label: 'Apricot' },
    { value: 'banana', label: 'Banana' },
  ];
}

describe('NgxsmkAutocomplete', () => {
  beforeEach(() => {
    HTMLElement.prototype.scrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = vi.fn();
  });

  function setup() {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.nativeElement.querySelector(
      '.ngxsmk-autocomplete__input',
    );
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
    type(input, 'ap');
    fixture.detectChanges();

    const options = fixture.nativeElement.querySelectorAll('.ngxsmk-autocomplete__option');
    expect(options.length).toBe(2); // Apple, Apricot
    expect(options[0].classList).toContain('ngxsmk-autocomplete__option--active');
  });

  it('moves the highlight with ArrowDown and wraps around', () => {
    const { fixture, input } = setup();
    type(input, 'ap');
    fixture.detectChanges();

    key(input, 'ArrowDown'); // -> Apricot (index 1)
    fixture.detectChanges();
    let options = fixture.nativeElement.querySelectorAll('.ngxsmk-autocomplete__option');
    expect(options[1].classList).toContain('ngxsmk-autocomplete__option--active');

    key(input, 'ArrowDown'); // wraps -> Apple (index 0)
    fixture.detectChanges();
    options = fixture.nativeElement.querySelectorAll('.ngxsmk-autocomplete__option');
    expect(options[0].classList).toContain('ngxsmk-autocomplete__option--active');
  });

  it('selects the highlighted option with Enter and closes', () => {
    const { fixture, input } = setup();
    type(input, 'ap');
    fixture.detectChanges();

    key(input, 'ArrowDown'); // Apricot
    fixture.detectChanges();
    key(input, 'Enter');
    fixture.detectChanges();

    expect(fixture.componentInstance.value).toBe('apricot');
    expect(fixture.nativeElement.querySelector('.ngxsmk-autocomplete__dropdown')).toBeNull();
  });

  it('closes the dropdown on Escape', () => {
    const { fixture, input } = setup();
    type(input, 'ap');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.ngxsmk-autocomplete__dropdown')).toBeTruthy();

    key(input, 'Escape');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.ngxsmk-autocomplete__dropdown')).toBeNull();
  });

  it('exposes aria-activedescendant pointing at the active option', () => {
    const { fixture, input } = setup();
    type(input, 'ap');
    fixture.detectChanges();

    const active = input.getAttribute('aria-activedescendant');
    const activeOption = fixture.nativeElement.querySelector(
      '.ngxsmk-autocomplete__option--active',
    );
    expect(active).toBeTruthy();
    expect(activeOption?.id).toBe(active);
  });

  it('integrates with Reactive Forms FormControl and handles writeValue / disabled state', () => {
    @Component({
      standalone: true,
      imports: [NgxsmkAutocomplete, ReactiveFormsModule],
      template: `<ngxsmk-autocomplete [options]="options" [formControl]="ctrl" />`,
    })
    class ReactiveHost {
      readonly ctrl = new FormControl('apple');
      readonly options = [
        { value: 'apple', label: 'Apple' },
        { value: 'banana', label: 'Banana' },
      ];
    }

    const fixture = TestBed.createComponent(ReactiveHost);
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('.ngxsmk-autocomplete__input');
    expect(input.value).toBe('apple');

    fixture.componentInstance.ctrl.setValue('banana');
    fixture.detectChanges();
    expect(input.value).toBe('banana');

    fixture.componentInstance.ctrl.disable();
    fixture.detectChanges();
    expect(input.disabled).toBe(true);
  });
});
