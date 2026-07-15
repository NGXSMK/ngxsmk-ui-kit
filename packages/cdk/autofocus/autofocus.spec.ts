import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';
import { NgxsmkAutofocus } from './autofocus';

@Component({
  standalone: true,
  imports: [NgxsmkAutofocus],
  template: ` <input id="input" [ngxsmkAutofocus]="shouldFocus()" /> `,
})
class HostComponent {
  readonly shouldFocus = signal(true);
}

describe('NgxsmkAutofocus', () => {
  it('focuses the target element automatically', async () => {
    const focusSpy = vi.spyOn(HTMLInputElement.prototype, 'focus');

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    await fixture.whenStable();

    expect(focusSpy).toHaveBeenCalled();
    focusSpy.mockRestore();
  });
});
