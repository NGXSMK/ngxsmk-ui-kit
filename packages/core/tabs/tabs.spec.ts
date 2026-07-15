import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { NgxsmkTab, NgxsmkTabs } from './tabs';

@Component({
  standalone: true,
  imports: [NgxsmkTabs, NgxsmkTab],
  template: `
    <ngxsmk-tabs [(value)]="active">
      <ngxsmk-tab value="a" label="Alpha">Alpha content</ngxsmk-tab>
      <ngxsmk-tab value="b" label="Beta">Beta content</ngxsmk-tab>
      <ngxsmk-tab value="c" label="Gamma" disabled>Gamma content</ngxsmk-tab>
    </ngxsmk-tabs>
  `,
})
class HostComponent {
  readonly active = signal('');
}

describe('NgxsmkTabs', () => {
  function setup() {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    return { fixture, element, host: fixture.componentInstance };
  }

  it('activates the first enabled tab by default and renders only its panel', () => {
    const { element } = setup();
    const panel = element.querySelector('[role="tabpanel"]')!;
    expect(panel.textContent).toContain('Alpha content');
    expect(element.querySelectorAll('[role="tabpanel"]')).toHaveLength(1);
  });

  it('switches panels on trigger click and updates the model', () => {
    const { fixture, element, host } = setup();
    const triggers = element.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    triggers[1].click();
    fixture.detectChanges();

    expect(host.active()).toBe('b');
    expect(element.querySelector('[role="tabpanel"]')!.textContent).toContain('Beta content');
    expect(triggers[1].getAttribute('aria-selected')).toBe('true');
    expect(triggers[0].getAttribute('aria-selected')).toBe('false');
  });

  it('moves selection with arrow keys, skipping disabled tabs', () => {
    const { fixture, element, host } = setup();
    const list = element.querySelector<HTMLElement>('[role="tablist"]')!;

    list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();
    expect(host.active()).toBe('b');

    // Gamma is disabled, so ArrowRight wraps back to Alpha.
    list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();
    expect(host.active()).toBe('a');
  });
});
