import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { NgxsmkProgress } from './progress';

@Component({
  standalone: true,
  imports: [NgxsmkProgress],
  template: `
    <ngxsmk-progress [value]="value()" [label]="label()" />
  `,
})
class HostComponent {
  readonly value = signal<number | null>(45);
  readonly label = signal('Uploading file');
}

describe('NgxsmkProgress', () => {
  function setup() {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const progressEl: HTMLElement = fixture.nativeElement.querySelector('ngxsmk-progress');
    const barEl: HTMLElement = fixture.nativeElement.querySelector('.ngxsmk-progress__bar');
    return { fixture, progressEl, barEl };
  }

  it('renders with progressbar role and clamps value', () => {
    const { fixture, progressEl, barEl } = setup();
    expect(progressEl).toBeTruthy();
    expect(progressEl.getAttribute('role')).toBe('progressbar');
    expect(progressEl.getAttribute('aria-valuenow')).toBe('45');
    expect(progressEl.getAttribute('aria-label')).toBe('Uploading file');
    expect(barEl.style.width).toBe('45%');

    // Clamps value below 0
    fixture.componentInstance.value.set(-20);
    fixture.detectChanges();
    expect(progressEl.getAttribute('aria-valuenow')).toBe('0');
    expect(barEl.style.width).toBe('0%');

    // Clamps value above 100
    fixture.componentInstance.value.set(150);
    fixture.detectChanges();
    expect(progressEl.getAttribute('aria-valuenow')).toBe('100');
    expect(barEl.style.width).toBe('100%');
  });

  it('handles indeterminate mode correctly when value is null', () => {
    const { fixture, progressEl, barEl } = setup();

    fixture.componentInstance.value.set(null);
    fixture.detectChanges();

    expect(progressEl.getAttribute('data-indeterminate')).toBe('');
    expect(progressEl.getAttribute('aria-valuenow')).toBeNull();
    expect(barEl.style.width).toBe('');
  });
});
