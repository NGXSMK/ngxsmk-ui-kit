import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { NgxsmkSafeArea, NgxsmkSafeAreaSide } from './safe-area';

@Component({
  standalone: true,
  imports: [NgxsmkSafeArea],
  template: `<div id="target" [ngxsmkSafeArea]="sides()" [mode]="mode()">content</div>`,
})
class HostComponent {
  readonly sides = signal<string | readonly NgxsmkSafeAreaSide[]>('');
  readonly mode = signal<'padding' | 'margin'>('padding');
}

describe('NgxsmkSafeArea', () => {
  function setup() {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement.querySelector('#target');
    return { fixture, el };
  }

  it('pads every edge when no sides are given', () => {
    const { el } = setup();

    for (const side of ['top', 'right', 'bottom', 'left']) {
      expect(el.style.getPropertyValue(`padding-${side}`)).toBe(`var(--ngxsmk-safe-area-${side})`);
    }
  });

  it('pads only the named edges from a space-separated string', () => {
    const { fixture, el } = setup();
    fixture.componentInstance.sides.set('top bottom');
    fixture.detectChanges();

    expect(el.style.getPropertyValue('padding-top')).toBe('var(--ngxsmk-safe-area-top)');
    expect(el.style.getPropertyValue('padding-bottom')).toBe('var(--ngxsmk-safe-area-bottom)');
    expect(el.style.getPropertyValue('padding-left')).toBe('');
    expect(el.style.getPropertyValue('padding-right')).toBe('');
  });

  it('accepts an array of sides', () => {
    const { fixture, el } = setup();
    fixture.componentInstance.sides.set(['left', 'right']);
    fixture.detectChanges();

    expect(el.style.getPropertyValue('padding-left')).toBe('var(--ngxsmk-safe-area-left)');
    expect(el.style.getPropertyValue('padding-right')).toBe('var(--ngxsmk-safe-area-right)');
    expect(el.style.getPropertyValue('padding-top')).toBe('');
  });

  it('ignores unknown side names rather than emitting bad CSS', () => {
    const { fixture, el } = setup();
    fixture.componentInstance.sides.set('top sideways');
    fixture.detectChanges();

    expect(el.style.getPropertyValue('padding-top')).toBe('var(--ngxsmk-safe-area-top)');
    expect(el.style.cssText).not.toContain('sideways');
  });

  it('applies margin instead of padding in margin mode', () => {
    const { fixture, el } = setup();
    fixture.componentInstance.sides.set('bottom');
    fixture.componentInstance.mode.set('margin');
    fixture.detectChanges();

    expect(el.style.getPropertyValue('margin-bottom')).toBe('var(--ngxsmk-safe-area-bottom)');
    // Only one of the two is ever set, so the modes cannot double up.
    expect(el.style.getPropertyValue('padding-bottom')).toBe('');
  });
});
