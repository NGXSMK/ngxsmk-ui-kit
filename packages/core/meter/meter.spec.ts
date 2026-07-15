import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { NgxsmkMeter } from './meter';

@Component({
  standalone: true,
  imports: [NgxsmkMeter],
  template: `
    <ngxsmk-meter
      [value]="value"
      [min]="min"
      [max]="max"
      [low]="low"
      [high]="high"
      [optimum]="optimum"
    />
  `,
})
class Host {
  value = 50;
  min = 0;
  max = 100;
  low: number | null = null;
  high: number | null = null;
  optimum: number | null = null;
}

function setup(configure?: (h: Host) => void) {
  const fixture = TestBed.createComponent(Host);
  if (configure) configure(fixture.componentInstance);
  fixture.detectChanges();
  const host: HTMLElement = fixture.nativeElement.querySelector('ngxsmk-meter');
  return { fixture, host };
}

describe('NgxsmkMeter', () => {
  it('exposes meter role and aria value attributes', () => {
    const { host } = setup((h) => (h.value = 40));
    expect(host.getAttribute('role')).toBe('meter');
    expect(host.getAttribute('aria-valuenow')).toBe('40');
    expect(host.getAttribute('aria-valuemax')).toBe('100');
  });

  it('computes fill percentage against min/max', () => {
    const { host } = setup((h) => {
      h.value = 25;
      h.min = 0;
      h.max = 50;
    });
    const fill = host.querySelector<HTMLElement>('.ngxsmk-meter__fill')!;
    expect(fill.style.inlineSize).toBe('50%');
  });

  it('clamps out-of-range values', () => {
    const { host } = setup((h) => (h.value = 150));
    expect(host.getAttribute('aria-valuenow')).toBe('100');
  });

  it('flags a poor reading on the far side of optimum', () => {
    const { host } = setup((h) => {
      h.value = 10; // in the low region
      h.low = 20;
      h.high = 80;
      h.optimum = 90; // optimum sits in the high region
    });
    expect(host.getAttribute('data-level')).toBe('poor');
  });

  it('flags an optimal reading in the optimum region', () => {
    const { host } = setup((h) => {
      h.value = 85;
      h.low = 20;
      h.high = 80;
      h.optimum = 90;
    });
    expect(host.getAttribute('data-level')).toBe('optimal');
  });
});
