import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { describe, expect, it } from 'vitest';
import { NgxsmkCheckbox } from './checkbox';

@Component({
  standalone: true,
  imports: [NgxsmkCheckbox, ReactiveFormsModule],
  template: `<ngxsmk-checkbox [formControl]="control">Accept</ngxsmk-checkbox>`,
})
class HostComponent {
  readonly control = new FormControl(false, { nonNullable: true });
}

describe('NgxsmkCheckbox', () => {
  function setup() {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.nativeElement.querySelector(
      'input[type="checkbox"]',
    );
    return { fixture, input, control: fixture.componentInstance.control };
  }

  it('propagates user toggles to the form control', () => {
    const { input, control } = setup();
    input.click();
    expect(control.value).toBe(true);
    input.click();
    expect(control.value).toBe(false);
  });

  it('reflects programmatic form control writes', () => {
    const { fixture, input, control } = setup();
    control.setValue(true);
    fixture.detectChanges();
    expect(input.checked).toBe(true);
  });

  it('honors form control disabling', () => {
    const { fixture, input, control } = setup();
    control.disable();
    fixture.detectChanges();
    expect(input.disabled).toBe(true);
  });
});
