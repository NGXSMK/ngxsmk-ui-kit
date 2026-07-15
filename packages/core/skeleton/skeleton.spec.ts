import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { NgxsmkSkeleton } from './skeleton';

@Component({
  standalone: true,
  imports: [NgxsmkSkeleton],
  template: ` <ngxsmk-skeleton [width]="width()" [height]="height()" [shape]="shape()" /> `,
})
class HostComponent {
  readonly width = signal('200px');
  readonly height = signal('40px');
  readonly shape = signal<'rounded' | 'circle' | 'rect'>('rounded');
}

describe('NgxsmkSkeleton', () => {
  function setup() {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const skeletonEl: HTMLElement = fixture.nativeElement.querySelector('ngxsmk-skeleton');
    return { fixture, skeletonEl };
  }

  it('renders with correct accessibility features and style bindings', () => {
    const { skeletonEl } = setup();
    expect(skeletonEl).toBeTruthy();
    expect(skeletonEl.getAttribute('aria-hidden')).toBe('true');
    expect(skeletonEl.style.width).toBe('200px');
    expect(skeletonEl.style.height).toBe('40px');
    expect(skeletonEl.getAttribute('data-shape')).toBe('rounded');
  });

  it('updates styles and shape data-attribute when inputs change', () => {
    const { fixture, skeletonEl } = setup();

    fixture.componentInstance.width.set('50px');
    fixture.componentInstance.height.set('50px');
    fixture.componentInstance.shape.set('circle');
    fixture.detectChanges();

    expect(skeletonEl.style.width).toBe('50px');
    expect(skeletonEl.style.height).toBe('50px');
    expect(skeletonEl.getAttribute('data-shape')).toBe('circle');
  });
});
