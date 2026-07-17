import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { NgxsmkInputDirective } from './input';

@Component({
  standalone: true,
  imports: [NgxsmkInputDirective],
  template: `
    <input
      ngxsmkInput
      [id]="id()"
      [ariaInvalid]="ariaInvalid()"
      [ariaDescribedby]="ariaDescribedby()"
    />
  `,
})
class HostComponent {
  readonly id = signal('test-input-id');
  readonly ariaInvalid = signal(false);
  readonly ariaDescribedby = signal<string | null>(null);
}

describe('NgxsmkInputDirective', () => {
  function setup() {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const inputEl: HTMLInputElement = fixture.nativeElement.querySelector('input[ngxsmkInput]');
    return { fixture, inputEl };
  }

  it('renders correctly with default values', () => {
    const { inputEl } = setup();
    expect(inputEl).toBeTruthy();
  });

  it('binds inputs to native input attributes', () => {
    const { fixture, inputEl } = setup();

    fixture.componentInstance.id.set('custom-id');
    fixture.componentInstance.ariaInvalid.set(true);
    fixture.componentInstance.ariaDescribedby.set('error-msg');

    fixture.detectChanges();

    expect(inputEl.getAttribute('id')).toBe('custom-id');
    expect(inputEl.getAttribute('aria-invalid')).toBe('true');
    expect(inputEl.getAttribute('aria-describedby')).toBe('error-msg');
  });
});
