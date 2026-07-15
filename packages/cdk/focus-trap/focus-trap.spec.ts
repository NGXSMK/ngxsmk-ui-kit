import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { NgxsmkFocusTrap } from './focus-trap';

@Component({
  standalone: true,
  imports: [NgxsmkFocusTrap],
  template: `
    <button id="external-button">External</button>
    <div [ngxsmkFocusTrap]="active()" [ngxsmkFocusTrapAutoCapture]="autoCapture()">
      <button id="first">First</button>
      <input id="second" type="text" />
      <button id="third">Third</button>
    </div>
  `,
})
class HostComponent {
  readonly active = signal(true);
  readonly autoCapture = signal(false);
}

describe('NgxsmkFocusTrap', () => {
  let originalOffsetParent: any;

  beforeEach(() => {
    originalOffsetParent = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetParent');
    Object.defineProperty(HTMLElement.prototype, 'offsetParent', {
      configurable: true,
      get() {
        return this.style.display === 'none' ? null : this.parentElement;
      },
    });
  });

  afterEach(() => {
    if (originalOffsetParent) {
      Object.defineProperty(HTMLElement.prototype, 'offsetParent', originalOffsetParent);
    } else {
      delete (HTMLElement.prototype as any).offsetParent;
    }
  });

  function setup() {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const external = fixture.nativeElement.querySelector('#external-button') as HTMLButtonElement;
    const first = fixture.nativeElement.querySelector('#first') as HTMLButtonElement;
    const second = fixture.nativeElement.querySelector('#second') as HTMLInputElement;
    const third = fixture.nativeElement.querySelector('#third') as HTMLButtonElement;
    return { fixture, external, first, second, third };
  }

  it('traps Tab focus cycling correctly', async () => {
    const { fixture, first, third } = setup();

    // Focus last element
    third.focus();
    expect(document.activeElement).toBe(third);

    // Press Tab on last element, should wrap to first
    const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true });
    third.dispatchEvent(tabEvent);
    fixture.detectChanges();

    expect(document.activeElement).toBe(first);
  });

  it('traps Shift+Tab focus cycling correctly', async () => {
    const { fixture, first, third } = setup();

    // Focus first element
    first.focus();
    expect(document.activeElement).toBe(first);

    // Press Shift+Tab on first element, should wrap to last
    const shiftTabEvent = new KeyboardEvent('keydown', {
      key: 'Tab',
      shiftKey: true,
      bubbles: true,
    });
    first.dispatchEvent(shiftTabEvent);
    fixture.detectChanges();

    expect(document.activeElement).toBe(third);
  });

  it('does not trap focus when active input is false', async () => {
    const { fixture, third } = setup();
    fixture.componentInstance.active.set(false);
    fixture.detectChanges();

    third.focus();

    // Press Tab on last element, should NOT prevent default or wrap
    const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true });
    const preventDefaultSpy = vi.spyOn(tabEvent, 'preventDefault');
    third.dispatchEvent(tabEvent);
    fixture.detectChanges();

    // Shouldn't warp back to first since we bypassed trap
    expect(document.activeElement).toBe(third);
    expect(preventDefaultSpy).not.toHaveBeenCalled();
  });
});
