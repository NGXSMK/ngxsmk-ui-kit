import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { NgxsmkAccordion, NgxsmkAccordionItem } from './accordion';

@Component({
  standalone: true,
  imports: [NgxsmkAccordion, NgxsmkAccordionItem],
  template: `
    <ngxsmk-accordion [multiple]="multiple()">
      <ngxsmk-accordion-item label="Item 1" value="item1" id="item1">
        Content 1
      </ngxsmk-accordion-item>
      <ngxsmk-accordion-item label="Item 2" value="item2" id="item2" [disabled]="item2Disabled()">
        Content 2
      </ngxsmk-accordion-item>
    </ngxsmk-accordion>
  `,
})
class HostComponent {
  readonly multiple = signal(false);
  readonly item2Disabled = signal(false);
}

describe('NgxsmkAccordion', () => {
  function setup() {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const item1Trigger: HTMLButtonElement = fixture.nativeElement.querySelector(
      '#item1 .ngxsmk-accordion-item__trigger',
    );
    const item2Trigger: HTMLButtonElement = fixture.nativeElement.querySelector(
      '#item2 .ngxsmk-accordion-item__trigger',
    );
    const item1Host: HTMLElement = fixture.nativeElement.querySelector('#item1');
    const item2Host: HTMLElement = fixture.nativeElement.querySelector('#item2');
    return { fixture, item1Trigger, item2Trigger, item1Host, item2Host };
  }

  it('renders elements and sets ARIA attributes correctly', () => {
    const { item1Trigger, item1Host } = setup();
    expect(item1Trigger).toBeTruthy();
    expect(item1Trigger.getAttribute('aria-expanded')).toBe('false');
    expect(item1Host.getAttribute('data-expanded')).toBeNull();
  });

  it('toggles accordion items open and closed exclusively by default', () => {
    const { fixture, item1Trigger, item2Trigger, item1Host, item2Host } = setup();

    // Click item 1 to open
    item1Trigger.click();
    fixture.detectChanges();
    expect(item1Trigger.getAttribute('aria-expanded')).toBe('true');
    expect(item1Host.getAttribute('data-expanded')).toBe('');
    expect(item2Trigger.getAttribute('aria-expanded')).toBe('false');

    // Click item 2 to open (should close item 1)
    item2Trigger.click();
    fixture.detectChanges();
    expect(item1Trigger.getAttribute('aria-expanded')).toBe('false');
    expect(item1Host.getAttribute('data-expanded')).toBeNull();
    expect(item2Trigger.getAttribute('aria-expanded')).toBe('true');
    expect(item2Host.getAttribute('data-expanded')).toBe('');
  });

  it('allows multiple items to be open simultaneously when multiple is true', () => {
    const { fixture, item1Trigger, item2Trigger, item1Host, item2Host } = setup();

    fixture.componentInstance.multiple.set(true);
    fixture.detectChanges();

    // Click item 1
    item1Trigger.click();
    fixture.detectChanges();
    expect(item1Host.getAttribute('data-expanded')).toBe('');

    // Click item 2 (both should remain open)
    item2Trigger.click();
    fixture.detectChanges();
    expect(item1Host.getAttribute('data-expanded')).toBe('');
    expect(item2Host.getAttribute('data-expanded')).toBe('');
  });

  it('ignores clicks on disabled accordion items', () => {
    const { fixture, item2Trigger, item2Host } = setup();

    fixture.componentInstance.item2Disabled.set(true);
    fixture.detectChanges();

    expect(item2Trigger.disabled).toBe(true);
    expect(item2Host.getAttribute('data-disabled')).toBe('');

    item2Trigger.click();
    fixture.detectChanges();

    expect(item2Trigger.getAttribute('aria-expanded')).toBe('false');
    expect(item2Host.getAttribute('data-expanded')).toBeNull();
  });
});
