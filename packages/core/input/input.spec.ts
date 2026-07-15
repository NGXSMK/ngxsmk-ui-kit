import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { NgxsmkInput } from './input';

@Component({
  standalone: true,
  imports: [NgxsmkInput],
  template: `
    <ngxsmk-input
      [type]="type()"
      [placeholder]="placeholder()"
      [disabled]="disabled()"
      [id]="id()"
      [ariaInvalid]="ariaInvalid()"
      [ariaDescribedby]="ariaDescribedby()"
      [(value)]="value"
      (changed)="onChanged($event)"
    />
  `,
})
class HostComponent {
  readonly type = signal('text');
  readonly placeholder = signal('');
  readonly disabled = signal(false);
  readonly id = signal('test-input-id');
  readonly ariaInvalid = signal(false);
  readonly ariaDescribedby = signal<string | null>(null);
  value = '';
  lastChangedValue = '';

  onChanged(val: string) {
    this.lastChangedValue = val;
  }
}

describe('NgxsmkInput', () => {
  function setup() {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const hostEl: HTMLElement = fixture.nativeElement.querySelector('ngxsmk-input');
    const inputEl: HTMLInputElement = fixture.nativeElement.querySelector('.ngxsmk-input__control');
    return { fixture, hostEl, inputEl };
  }

  it('renders correctly with default values', () => {
    const { hostEl, inputEl } = setup();
    expect(hostEl).toBeTruthy();
    expect(inputEl).toBeTruthy();
    expect(inputEl.type).toBe('text');
    expect(inputEl.value).toBe('');
    expect(inputEl.disabled).toBe(false);
  });

  it('binds inputs to native input attributes', () => {
    const { fixture, inputEl, hostEl } = setup();

    fixture.componentInstance.type.set('email');
    fixture.componentInstance.placeholder.set('test@example.com');
    fixture.componentInstance.disabled.set(true);
    fixture.componentInstance.id.set('custom-id');
    fixture.componentInstance.ariaInvalid.set(true);
    fixture.componentInstance.ariaDescribedby.set('error-msg');

    fixture.detectChanges();

    expect(inputEl.type).toBe('email');
    expect(inputEl.getAttribute('placeholder')).toBe('test@example.com');
    expect(inputEl.disabled).toBe(true);
    expect(hostEl.getAttribute('id')).toBe('custom-id');
    expect(hostEl.getAttribute('aria-invalid')).toBe('true');
    expect(hostEl.getAttribute('aria-describedby')).toBe('error-msg');
    expect(hostEl.getAttribute('data-disabled')).toBe('');
  });

  it('updates value and emits changed output when typing', () => {
    const { fixture, inputEl } = setup();

    inputEl.value = 'hello';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(fixture.componentInstance.value).toBe('hello');
    expect(fixture.componentInstance.lastChangedValue).toBe('hello');
  });
});
