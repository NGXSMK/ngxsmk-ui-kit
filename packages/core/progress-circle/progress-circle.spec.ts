import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { NgxsmkProgressCircle } from './progress-circle';

@Component({
  standalone: true,
  imports: [NgxsmkProgressCircle],
  template: `
    <ngxsmk-progress-circle
      [value]="value()"
      [max]="max()"
      [size]="size()"
      [variant]="variant()"
      [indeterminate]="indeterminate()"
      [showValue]="showValue()"
    />
  `,
})
class HostComponent {
  readonly value = signal(25);
  readonly max = signal(100);
  readonly size = signal<'sm' | 'md' | 'lg'>('md');
  readonly variant = signal<'default' | 'primary' | 'success' | 'warning' | 'error'>('default');
  readonly indeterminate = signal(false);
  readonly showValue = signal(false);
}

describe('NgxsmkProgressCircle', () => {
  it('renders correctly and reflects value changes', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const hostEl = fixture.nativeElement.querySelector('ngxsmk-progress-circle');
    expect(hostEl).toBeTruthy();
    expect(hostEl.getAttribute('role')).toBe('progressbar');
    expect(hostEl.getAttribute('aria-valuenow')).toBe('25');

    fixture.componentInstance.value.set(50);
    fixture.detectChanges();
    expect(hostEl.getAttribute('aria-valuenow')).toBe('50');
  });

  it('hides aria-valuenow when indeterminate is true', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const hostEl = fixture.nativeElement.querySelector('ngxsmk-progress-circle');
    fixture.componentInstance.indeterminate.set(true);
    fixture.detectChanges();
    expect(hostEl.getAttribute('aria-valuenow')).toBeNull();
  });

  it('renders value text if showValue is true', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    fixture.componentInstance.showValue.set(true);
    fixture.detectChanges();
    const textEl = fixture.nativeElement.querySelector('.ngxsmk-progress-circle__text');
    expect(textEl).toBeTruthy();
    expect(textEl.textContent).toBe('25%');
  });
});
