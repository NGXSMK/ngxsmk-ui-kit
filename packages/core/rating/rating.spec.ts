import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { NgxsmkRating } from './rating';

@Component({
  standalone: true,
  imports: [NgxsmkRating],
  template: `<ngxsmk-rating [(value)]="value" [max]="max" [allowHalf]="half" />`,
})
class Host {
  value = signal(0);
  max = 5;
  half = false;
}

function setup(configure?: (h: Host) => void) {
  const fixture = TestBed.createComponent(Host);
  if (configure) configure(fixture.componentInstance);
  fixture.detectChanges();
  const host: HTMLElement =
    fixture.nativeElement.querySelector('ngxsmk-rating');
  return { fixture, host };
}

describe('NgxsmkRating', () => {
  it('renders `max` stars with slider semantics', () => {
    const { host } = setup();
    expect(host.querySelectorAll('.ngxsmk-rating__star').length).toBe(5);
    expect(host.getAttribute('role')).toBe('slider');
    expect(host.getAttribute('aria-valuemax')).toBe('5');
  });

  it('increments with ArrowRight and clamps at max', () => {
    const { fixture, host } = setup((h) => (h.value.set(4)));
    host.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe(5);
    host.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe(5);
  });

  it('steps by 0.5 when allowHalf is set', () => {
    const { fixture, host } = setup((h) => {
      h.half = true;
      h.value.set(3);
    });
    host.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe(2.5);
  });

  it('Home/End jump to bounds', () => {
    const { fixture, host } = setup((h) => h.value.set(3));
    host.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home' }));
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe(0);
    host.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe(5);
  });

  it('exposes aria-valuetext', () => {
    const { host } = setup((h) => h.value.set(2));
    expect(host.getAttribute('aria-valuetext')).toBe('2 of 5 stars');
  });
});
