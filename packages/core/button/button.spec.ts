import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { NgxsmkButton, NgxsmkButtonVariant } from './button';

@Component({
  standalone: true,
  imports: [NgxsmkButton],
  template: `
    <button ngxsmk-button [variant]="variant" size="sm" [loading]="loading()">Save</button>
  `,
})
class HostComponent {
  variant: NgxsmkButtonVariant = 'outline';
  readonly loading = signal(false);
}

describe('NgxsmkButton', () => {
  function setup() {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    return { fixture, button };
  }

  it('reflects variant and size as data attributes', () => {
    const { button } = setup();
    expect(button.getAttribute('data-variant')).toBe('outline');
    expect(button.getAttribute('data-size')).toBe('sm');
    expect(button.classList).toContain('ngxsmk-button');
  });

  it('disables the native button and shows a spinner while loading', () => {
    const { fixture, button } = setup();
    expect(button.disabled).toBe(false);
    expect(button.querySelector('.ngxsmk-button__spinner')).toBeNull();

    fixture.componentInstance.loading.set(true);
    fixture.detectChanges();

    expect(button.disabled).toBe(true);
    expect(button.getAttribute('aria-busy')).toBe('true');
    expect(button.querySelector('.ngxsmk-button__spinner')).not.toBeNull();
  });
});
