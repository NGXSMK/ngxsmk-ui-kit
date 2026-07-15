import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { describe, expect, it } from 'vitest';
import { NgxsmkRadio, NgxsmkRadioGroup } from './radio';

@Component({
  standalone: true,
  imports: [NgxsmkRadioGroup, NgxsmkRadio, ReactiveFormsModule],
  template: `
    <ngxsmk-radio-group
      [formControl]="control"
      [disabled]="groupDisabled()"
      [orientation]="orientation()"
    >
      <ngxsmk-radio value="free" id="free-opt">Free</ngxsmk-radio>
      <ngxsmk-radio value="pro" id="pro-opt" [disabled]="proDisabled()">Pro</ngxsmk-radio>
    </ngxsmk-radio-group>
  `,
})
class HostComponent {
  readonly control = new FormControl('free');
  readonly groupDisabled = signal(false);
  readonly proDisabled = signal(false);
  readonly orientation = signal<'horizontal' | 'vertical'>('vertical');
}

describe('NgxsmkRadio', () => {
  function setup() {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const groupEl: HTMLElement = fixture.nativeElement.querySelector('ngxsmk-radio-group');
    const freeEl: HTMLElement = fixture.nativeElement.querySelector('#free-opt');
    const proEl: HTMLElement = fixture.nativeElement.querySelector('#pro-opt');
    const freeInput: HTMLInputElement = freeEl.querySelector('.ngxsmk-radio__native')!;
    const proInput: HTMLInputElement = proEl.querySelector('.ngxsmk-radio__native')!;
    return { fixture, groupEl, freeEl, proEl, freeInput, proInput };
  }

  it('initializes value and selects correct radio option', () => {
    const { freeEl, proEl, freeInput, proInput } = setup();
    expect(freeInput.checked).toBe(true);
    expect(proInput.checked).toBe(false);
    expect(freeEl.getAttribute('data-checked')).toBe('');
    expect(proEl.getAttribute('data-checked')).toBeNull();
  });

  it('updates form control on radio option selection', () => {
    const { fixture, proInput } = setup();

    proInput.checked = true;
    proInput.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(fixture.componentInstance.control.value).toBe('pro');
  });

  it('supports cascading disabled state from group to child options', () => {
    const { fixture, freeInput, proInput } = setup();

    fixture.componentInstance.groupDisabled.set(true);
    fixture.detectChanges();

    expect(freeInput.disabled).toBe(true);
    expect(proInput.disabled).toBe(true);
  });

  it('supports individual disabled state for a specific radio option', () => {
    const { fixture, freeInput, proInput } = setup();

    fixture.componentInstance.proDisabled.set(true);
    fixture.detectChanges();

    expect(freeInput.disabled).toBe(false);
    expect(proInput.disabled).toBe(true);
  });

  it('reflects orientation layout in host attributes', () => {
    const { fixture, groupEl } = setup();
    expect(groupEl.getAttribute('data-orientation')).toBe('vertical');

    fixture.componentInstance.orientation.set('horizontal');
    fixture.detectChanges();
    expect(groupEl.getAttribute('data-orientation')).toBe('horizontal');
  });
});
