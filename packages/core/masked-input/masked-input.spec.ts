import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { NgxsmkMaskedInput, applyNgxsmkMask } from './masked-input';

describe('applyNgxsmkMask', () => {
  it('inserts literals between token characters', () => {
    expect(applyNgxsmkMask('4111111111111111', '#### #### #### ####').formatted).toBe(
      '4111 1111 1111 1111',
    );
  });

  it('never emits a trailing literal', () => {
    // "12/" would suggest the user has entered a separator they have not.
    expect(applyNgxsmkMask('12', '##/##').formatted).toBe('12');
    expect(applyNgxsmkMask('123', '##/##').formatted).toBe('12/3');
  });

  it('reports the unmasked value separately', () => {
    const { formatted, unmasked } = applyNgxsmkMask('1225', '##/##');
    expect(formatted).toBe('12/25');
    expect(unmasked).toBe('1225');
  });

  it('accepts an already-formatted value, so pasting works', () => {
    expect(applyNgxsmkMask('4111 1111', '#### #### #### ####').unmasked).toBe('41111111');
  });

  it('skips characters a slot cannot accept', () => {
    expect(applyNgxsmkMask('a1b2', '####').unmasked).toBe('12');
    expect(applyNgxsmkMask('1a2b', 'AAAA').unmasked).toBe('ab');
  });

  it('stops at the end of the mask', () => {
    expect(applyNgxsmkMask('123456', '###').formatted).toBe('123');
  });

  it('supports letter and alphanumeric tokens', () => {
    expect(applyNgxsmkMask('AB123', 'AA-###').formatted).toBe('AB-123');
    expect(applyNgxsmkMask('a1b2', '****').formatted).toBe('a1b2');
  });

  it('returns empty for empty input', () => {
    expect(applyNgxsmkMask('', '##/##')).toEqual({ formatted: '', unmasked: '' });
  });
});

@Component({
  standalone: true,
  imports: [NgxsmkMaskedInput, ReactiveFormsModule],
  template: ` <input [ngxsmkMask]="mask()" [unmask]="unmask()" [formControl]="control" /> `,
})
class HostComponent {
  readonly mask = signal('#### #### #### ####');
  readonly unmask = signal(true);
  readonly control = new FormControl('');
}

describe('NgxsmkMaskedInput', () => {
  function setup() {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    const type = (value: string) => {
      input.value = value;
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
    };
    return { fixture, input, type };
  }

  it('formats the field as the user types', () => {
    const { input, type } = setup();
    type('4111111111111111');
    expect(input.value).toBe('4111 1111 1111 1111');
  });

  it('writes the unmasked value to the form model by default', () => {
    const { fixture, type } = setup();
    type('4111111111111111');
    expect(fixture.componentInstance.control.value).toBe('4111111111111111');
  });

  it('writes the formatted value when unmask is false', () => {
    const { fixture, type } = setup();
    fixture.componentInstance.unmask.set(false);
    fixture.detectChanges();

    type('4111111111111111');
    expect(fixture.componentInstance.control.value).toBe('4111 1111 1111 1111');
  });

  it('formats a value pushed in from the form', () => {
    const { fixture, input } = setup();
    fixture.componentInstance.control.setValue('4111111111111111');
    fixture.detectChanges();

    expect(input.value).toBe('4111 1111 1111 1111');
  });

  it('reformats an existing value when the mask changes', () => {
    const { fixture, input, type } = setup();
    type('12252026');

    fixture.componentInstance.mask.set('##/##');
    fixture.detectChanges();
    expect(input.value).toBe('12/25');
  });

  it('keeps the caret after the character just typed', () => {
    const { input, type } = setup();

    input.value = '4111';
    input.setSelectionRange(4, 4);
    input.dispatchEvent(new Event('input'));

    // Four digits fill the first group exactly; the caret sits after them,
    // before the inserted space.
    expect(input.selectionStart).toBe(4);

    type('41111');
    expect(input.value).toBe('4111 1');
  });

  it('reflects the disabled state onto the native element', async () => {
    const { fixture, input } = setup();
    fixture.componentInstance.control.disable();
    fixture.detectChanges();
    // The directive mirrors disabled through an effect, which is flushed by
    // stability rather than synchronously by detectChanges under zoneless CD.
    await fixture.whenStable();

    expect(input.disabled).toBe(true);
  });

  it('marks the control touched on blur', () => {
    const { fixture, input } = setup();
    expect(fixture.componentInstance.control.touched).toBe(false);

    input.dispatchEvent(new Event('blur'));
    expect(fixture.componentInstance.control.touched).toBe(true);
  });
});
