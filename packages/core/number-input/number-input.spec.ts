import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { NgxsmkNumberInput } from './number-input';

@Component({
  standalone: true,
  imports: [NgxsmkNumberInput],
  template: `
    <ngxsmk-number-input
      [min]="min()"
      [max]="max()"
      [step]="step()"
      [disabled]="disabled()"
      [(value)]="value"
      (changed)="onChanged($event)"
    />
  `,
})
class HostComponent {
  readonly min = signal(0);
  readonly max = signal(10);
  readonly step = signal(1);
  readonly disabled = signal(false);
  readonly value = signal(5);
  lastChangedValue = 5;

  onChanged(val: number) {
    this.lastChangedValue = val;
  }
}

describe('NgxsmkNumberInput', () => {
  function setup() {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const decBtn: HTMLButtonElement = fixture.nativeElement.querySelectorAll(
      '.ngxsmk-number-input__btn',
    )[0];
    const incBtn: HTMLButtonElement = fixture.nativeElement.querySelectorAll(
      '.ngxsmk-number-input__btn',
    )[1];
    const field: HTMLInputElement = fixture.nativeElement.querySelector(
      '.ngxsmk-number-input__field',
    );
    return { fixture, decBtn, incBtn, field };
  }

  it('renders correctly with initial values', () => {
    const { decBtn, incBtn, field } = setup();
    expect(field.value).toBe('5');
    expect(decBtn.disabled).toBe(false);
    expect(incBtn.disabled).toBe(false);
  });

  it('bumps value on button click', () => {
    const { fixture, decBtn, incBtn, field } = setup();

    incBtn.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe(6);
    expect(field.value).toBe('6');

    decBtn.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe(5);
    expect(field.value).toBe('5');
  });

  it('disables buttons when bounds are reached', () => {
    const { fixture, decBtn, incBtn } = setup();

    fixture.componentInstance.value.set(0);
    fixture.detectChanges();
    expect(decBtn.disabled).toBe(true);
    expect(incBtn.disabled).toBe(false);

    fixture.componentInstance.value.set(10);
    fixture.detectChanges();
    expect(decBtn.disabled).toBe(false);
    expect(incBtn.disabled).toBe(true);
  });

  it('clamps value on blur/commit', () => {
    const { fixture, field } = setup();

    // Type value out of bounds
    field.value = '15';
    field.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    // Clamping shouldn't happen yet on input (allows typing)
    expect(fixture.componentInstance.value()).toBe(15);

    // Commit change (change/blur event)
    field.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    // Now it should be clamped to max (10)
    expect(fixture.componentInstance.value()).toBe(10);
    expect(field.value).toBe('10');
  });
});
