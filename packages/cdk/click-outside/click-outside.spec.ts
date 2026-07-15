import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { NgxsmkClickOutside } from './click-outside';

@Component({
  standalone: true,
  imports: [NgxsmkClickOutside],
  template: `
    <div id="outside">Outside</div>
    <div id="inside" (ngxsmkClickOutside)="clickedOutside.set(true)">Inside</div>
  `,
})
class HostComponent {
  readonly clickedOutside = signal(false);
}

describe('NgxsmkClickOutside', () => {
  function setup() {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const outsideEl = fixture.nativeElement.querySelector('#outside');
    const insideEl = fixture.nativeElement.querySelector('#inside');
    return { fixture, outsideEl, insideEl };
  }

  it('does not emit when clicking inside the host element', () => {
    const { fixture, insideEl } = setup();
    const event = new PointerEvent('pointerdown', { bubbles: true });
    insideEl.dispatchEvent(event);
    fixture.detectChanges();
    expect(fixture.componentInstance.clickedOutside()).toBe(false);
  });

  it('emits when clicking outside the host element', () => {
    const { fixture, outsideEl } = setup();
    const event = new PointerEvent('pointerdown', { bubbles: true });
    outsideEl.dispatchEvent(event);
    fixture.detectChanges();
    expect(fixture.componentInstance.clickedOutside()).toBe(true);
  });
});
