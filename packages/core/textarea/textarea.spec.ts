import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { NgxsmkTextarea } from './textarea';

@Component({
  standalone: true,
  imports: [NgxsmkTextarea],
  template: `
    <ngxsmk-textarea
      [placeholder]="placeholder()"
      [disabled]="disabled()"
      [rows]="rows()"
      [(value)]="value"
      (changed)="onChanged($event)"
    />
  `,
})
class HostComponent {
  readonly placeholder = signal('');
  readonly disabled = signal(false);
  readonly rows = signal(4);
  value = '';
  lastChangedValue = '';

  onChanged(val: string) {
    this.lastChangedValue = val;
  }
}

describe('NgxsmkTextarea', () => {
  function setup() {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const hostEl: HTMLElement = fixture.nativeElement.querySelector('ngxsmk-textarea');
    const textareaEl: HTMLTextAreaElement = fixture.nativeElement.querySelector(
      '.ngxsmk-textarea__control',
    );
    return { fixture, hostEl, textareaEl };
  }

  it('renders correctly with default values', () => {
    const { hostEl, textareaEl } = setup();
    expect(hostEl).toBeTruthy();
    expect(textareaEl).toBeTruthy();
    expect(textareaEl.rows).toBe(4);
    expect(textareaEl.value).toBe('');
    expect(textareaEl.disabled).toBe(false);
  });

  it('binds inputs to native textarea attributes', () => {
    const { fixture, textareaEl } = setup();

    fixture.componentInstance.placeholder.set('Type here...');
    fixture.componentInstance.rows.set(8);
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();

    expect(textareaEl.getAttribute('placeholder')).toBe('Type here...');
    expect(textareaEl.rows).toBe(8);
    expect(textareaEl.disabled).toBe(true);
  });

  it('updates value and emits changed output when typing', () => {
    const { fixture, textareaEl } = setup();

    textareaEl.value = 'multiple\nlines\nof\ntext';
    textareaEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(fixture.componentInstance.value).toBe('multiple\nlines\nof\ntext');
    expect(fixture.componentInstance.lastChangedValue).toBe('multiple\nlines\nof\ntext');
  });
});
