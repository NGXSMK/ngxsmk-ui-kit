import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { NgxsmkBadge, NgxsmkBadgeVariant } from './badge';

@Component({
  standalone: true,
  imports: [NgxsmkBadge],
  template: ` <ngxsmk-badge [variant]="variant()">{{ label() }}</ngxsmk-badge> `,
})
class HostComponent {
  readonly variant = signal<NgxsmkBadgeVariant>('primary');
  readonly label = signal('New');
}

describe('NgxsmkBadge', () => {
  function setup() {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const badgeEl: HTMLElement = fixture.nativeElement.querySelector('ngxsmk-badge');
    return { fixture, badgeEl };
  }

  it('projects label content correctly', () => {
    const { badgeEl } = setup();
    expect(badgeEl).toBeTruthy();
    expect(badgeEl.textContent).toBe('New');
  });

  it('updates host data-variant attribute based on input variant', () => {
    const { fixture, badgeEl } = setup();
    expect(badgeEl.getAttribute('data-variant')).toBe('primary');

    fixture.componentInstance.variant.set('success');
    fixture.detectChanges();
    expect(badgeEl.getAttribute('data-variant')).toBe('success');

    fixture.componentInstance.variant.set('error');
    fixture.detectChanges();
    expect(badgeEl.getAttribute('data-variant')).toBe('error');
  });
});
