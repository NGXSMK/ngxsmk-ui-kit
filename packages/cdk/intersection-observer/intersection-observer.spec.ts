import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { NgxsmkIntersectionObserver } from './intersection-observer';

@Component({
  standalone: true,
  imports: [NgxsmkIntersectionObserver],
  template: `
    <div id="target" ngxsmkIntersectionObserver (intersecting)="intersected.set($event)">
      Target
    </div>
  `,
})
class HostComponent {
  readonly intersected = signal(false);
}

describe('NgxsmkIntersectionObserver', () => {
  let originalIntersectionObserver: any;
  let observeSpy: any;
  let disconnectSpy: any;
  let callback: any;

  beforeEach(() => {
    observeSpy = vi.fn();
    disconnectSpy = vi.fn();
    originalIntersectionObserver = (globalThis as any).IntersectionObserver;

    class MockIntersectionObserver {
      constructor(cb: any) {
        callback = cb;
      }
      observe = observeSpy;
      disconnect = disconnectSpy;
    }

    (globalThis as any).IntersectionObserver = MockIntersectionObserver;
  });

  afterEach(() => {
    (globalThis as any).IntersectionObserver = originalIntersectionObserver;
  });

  it('sets up intersection observer and responds to changes', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    expect(observeSpy).toHaveBeenCalled();

    // Trigger intersection callback
    callback([{ isIntersecting: true }]);
    fixture.detectChanges();
    expect(fixture.componentInstance.intersected()).toBe(true);

    callback([{ isIntersecting: false }]);
    fixture.detectChanges();
    expect(fixture.componentInstance.intersected()).toBe(false);
  });
});
