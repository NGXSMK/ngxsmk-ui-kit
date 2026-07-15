import { Component, signal, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { NgxsmkStep, NgxsmkStepper } from './stepper';

@Component({
  standalone: true,
  imports: [NgxsmkStepper],
  template: ` <ngxsmk-stepper [steps]="steps" [(activeIndex)]="index" [linear]="linear" /> `,
})
class Host {
  readonly stepper = viewChild.required(NgxsmkStepper);
  steps: NgxsmkStep[] = [{ label: 'Account' }, { label: 'Profile' }, { label: 'Confirm' }];
  index = signal(0);
  linear = false;
}

function setup(configure?: (h: Host) => void) {
  const fixture = TestBed.createComponent(Host);
  if (configure) configure(fixture.componentInstance);
  fixture.detectChanges();
  const host: HTMLElement = fixture.nativeElement.querySelector('ngxsmk-stepper');
  return { fixture, host };
}

describe('NgxsmkStepper', () => {
  it('renders a marker per step and marks the active one', () => {
    const { host } = setup((h) => h.index.set(1));
    expect(host.querySelectorAll('.ngxsmk-stepper__item').length).toBe(3);
    const active = host.querySelector('[data-state="active"]');
    expect(active?.textContent).toContain('Profile');
  });

  it('marks earlier steps complete', () => {
    const { host } = setup((h) => h.index.set(2));
    expect(host.querySelectorAll('[data-state="complete"]').length).toBe(2);
  });

  it('selecting a reachable step updates activeIndex', () => {
    const { fixture, host } = setup((h) => h.index.set(2));
    const triggers = host.querySelectorAll<HTMLButtonElement>('.ngxsmk-stepper__trigger');
    triggers[0].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.index()).toBe(0);
  });

  it('blocks jumping ahead in linear mode', () => {
    const { fixture, host } = setup((h) => {
      h.linear = true;
      h.index.set(0);
    });
    const triggers = host.querySelectorAll<HTMLButtonElement>('.ngxsmk-stepper__trigger');
    expect(triggers[2].disabled).toBe(true);
    triggers[2].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.index()).toBe(0);
  });

  it('next()/previous() move between steps', () => {
    const { fixture } = setup();
    const stepper = fixture.componentInstance.stepper();
    stepper.next();
    fixture.detectChanges();
    expect(fixture.componentInstance.index()).toBe(1);
    stepper.previous();
    fixture.detectChanges();
    expect(fixture.componentInstance.index()).toBe(0);
    // Cannot step before the first.
    stepper.previous();
    fixture.detectChanges();
    expect(fixture.componentInstance.index()).toBe(0);
  });
});
