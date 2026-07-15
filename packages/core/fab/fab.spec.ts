import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { NgxsmkFab } from './fab';

@Component({
  standalone: true,
  imports: [NgxsmkFab],
  template: `
    <button
      ngxsmk-fab
      [size]="size()"
      [variant]="variant()"
      [extended]="extended()"
      [position]="position()"
      [disabled]="disabled()"
    >
      +
    </button>
  `,
})
class HostComponent {
  readonly size = signal<'sm' | 'md' | 'lg'>('md');
  readonly variant = signal<'primary' | 'secondary'>('primary');
  readonly extended = signal(false);
  readonly position = signal<'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'none'>(
    'none',
  );
  readonly disabled = signal(false);
}

describe('NgxsmkFab', () => {
  it('renders correctly and sets attributes', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const hostEl = fixture.nativeElement.querySelector('[ngxsmk-fab]');
    expect(hostEl).toBeTruthy();
    expect(hostEl.getAttribute('data-size')).toBe('md');
    expect(hostEl.getAttribute('data-variant')).toBe('primary');
  });

  it('sets position when defined', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.position.set('bottom-right');
    fixture.detectChanges();

    const hostEl = fixture.nativeElement.querySelector('[ngxsmk-fab]');
    expect(hostEl.getAttribute('data-position')).toBe('bottom-right');
  });

  it('sets disabled when true', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();

    const hostEl = fixture.nativeElement.querySelector('[ngxsmk-fab]');
    expect(hostEl.hasAttribute('disabled')).toBe(true);
  });
});
