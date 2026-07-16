import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { NgxsmkMultiSelector } from './multi-selector';

@Component({
  standalone: true,
  imports: [NgxsmkMultiSelector],
  template: `
    <ngxsmk-multi-selector [options]="options" [disabled]="disabled()" [(value)]="value" />
  `,
})
class HostComponent {
  readonly disabled = signal(false);
  value: string[] = [];
  readonly options = [
    { value: 'red', label: 'Red' },
    { value: 'green', label: 'Green' },
    { value: 'blue', label: 'Blue' },
  ];
}

describe('NgxsmkMultiSelector', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(() => {
    HTMLElement.prototype.scrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = vi.fn();
  });

  afterEach(() => {
    // The dropdown is portalled to <body>; destroying the fixture tears it down.
    fixture?.destroy();
  });

  function setup() {
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const trigger: HTMLElement = fixture.nativeElement.querySelector(
      '.ngxsmk-multi-selector__trigger',
    );
    return { fixture, trigger };
  }

  function key(el: HTMLElement, k: string) {
    el.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true }));
  }

  function dropdownOptions(): HTMLElement[] {
    return Array.from(document.querySelectorAll<HTMLElement>('.ngxsmk-multi-selector__option'));
  }

  it('opens the dropdown with ArrowDown and highlights the first option', () => {
    const { fixture, trigger } = setup();
    key(trigger, 'ArrowDown');
    fixture.detectChanges();

    const options = dropdownOptions();
    expect(options.length).toBe(3);
    expect(options[0].classList).toContain('ngxsmk-multi-selector__option--active');
  });

  it('moves the highlight with ArrowDown', () => {
    const { fixture, trigger } = setup();
    key(trigger, 'ArrowDown'); // open + highlight Red
    fixture.detectChanges();
    key(trigger, 'ArrowDown'); // Green
    fixture.detectChanges();

    expect(dropdownOptions()[1].classList).toContain('ngxsmk-multi-selector__option--active');
  });

  it('toggles the highlighted option with Enter without closing', () => {
    const { fixture, trigger } = setup();
    key(trigger, 'ArrowDown'); // open, highlight Red
    fixture.detectChanges();
    key(trigger, 'ArrowDown'); // Green
    fixture.detectChanges();
    key(trigger, 'Enter'); // toggle Green on
    fixture.detectChanges();

    expect(fixture.componentInstance.value).toEqual(['green']);
    // Multi-select stays open for further picks.
    expect(document.querySelector('.ngxsmk-multi-selector__dropdown')).toBeTruthy();

    key(trigger, 'Enter'); // toggle Green off
    fixture.detectChanges();
    expect(fixture.componentInstance.value).toEqual([]);
  });

  it('closes the dropdown on Escape', () => {
    const { fixture, trigger } = setup();
    key(trigger, 'ArrowDown');
    fixture.detectChanges();
    expect(document.querySelector('.ngxsmk-multi-selector__dropdown')).toBeTruthy();

    key(trigger, 'Escape');
    fixture.detectChanges();
    expect(document.querySelector('.ngxsmk-multi-selector__dropdown')).toBeNull();
  });

  it('ignores keyboard interaction when disabled', () => {
    const { fixture, trigger } = setup();
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();

    key(trigger, 'ArrowDown');
    fixture.detectChanges();
    expect(document.querySelector('.ngxsmk-multi-selector__dropdown')).toBeNull();
  });
});
