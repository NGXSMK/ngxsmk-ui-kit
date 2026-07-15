import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { NgxsmkResizeObserver } from './resize-observer';

@Component({
  standalone: true,
  imports: [NgxsmkResizeObserver],
  template: ` <div id="target" ngxsmkResizeObserver (resized)="resized.set(true)">Target</div> `,
})
class HostComponent {
  readonly resized = signal(false);
}

describe('NgxsmkResizeObserver', () => {
  let originalResizeObserver: any;
  let observeSpy: any;
  let disconnectSpy: any;
  let callback: any;

  beforeEach(() => {
    observeSpy = vi.fn();
    disconnectSpy = vi.fn();
    originalResizeObserver = (globalThis as any).ResizeObserver;

    class MockResizeObserver {
      constructor(cb: any) {
        callback = cb;
      }
      observe = observeSpy;
      disconnect = disconnectSpy;
    }

    (globalThis as any).ResizeObserver = MockResizeObserver;
  });

  afterEach(() => {
    (globalThis as any).ResizeObserver = originalResizeObserver;
  });

  it('sets up resize observer and responds to changes', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    expect(observeSpy).toHaveBeenCalled();

    // Trigger resize callback
    callback([{}]);
    fixture.detectChanges();
    expect(fixture.componentInstance.resized()).toBe(true);
  });
});
