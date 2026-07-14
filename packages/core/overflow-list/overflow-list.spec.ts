import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { NgxsmkOverflowList } from './overflow-list';

@Component({
  standalone: true,
  imports: [NgxsmkOverflowList],
  template: `
    <ngxsmk-overflow-list [max]="2" [total]="4">
      <span item id="item1">Design</span>
      <span item id="item2">Engineering</span>
      <span item id="item3">Product</span>
      <span item id="item4">Research</span>
    </ngxsmk-overflow-list>
  `,
})
class HostComponent {}

describe('NgxsmkOverflowList', () => {
  function setup() {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const list = fixture.nativeElement.querySelector('ngxsmk-overflow-list');
    const items = fixture.nativeElement.querySelectorAll('[item]');
    const moreBtn = fixture.nativeElement.querySelector('.ngxsmk-overflow-list__more');
    return { fixture, list, items, moreBtn };
  }

  it('hides items that exceed the max threshold by default', () => {
    const { items, moreBtn } = setup();
    expect(items.length).toBe(4);
    
    // Max is 2, so the first 2 should be visible
    expect(window.getComputedStyle(items[0]).display).not.toBe('none');
    expect(window.getComputedStyle(items[1]).display).not.toBe('none');
    
    // The next 2 should be hidden
    expect(window.getComputedStyle(items[2]).display).toBe('none');
    expect(window.getComputedStyle(items[3]).display).toBe('none');

    // More button should be rendered showing "+2 more"
    expect(moreBtn).toBeTruthy();
    expect(moreBtn.textContent.trim()).toBe('+2 more');
  });

  it('displays all items when more button is clicked', () => {
    const { fixture, items, moreBtn } = setup();
    expect(window.getComputedStyle(items[2]).display).toBe('none');

    moreBtn.click();
    fixture.detectChanges();

    // All should be visible
    expect(window.getComputedStyle(items[0]).display).not.toBe('none');
    expect(window.getComputedStyle(items[1]).display).not.toBe('none');
    expect(window.getComputedStyle(items[2]).display).not.toBe('none');
    expect(window.getComputedStyle(items[3]).display).not.toBe('none');

    // More button text should change to "Show less" (or disappear if total <= max, but here expanded is true)
    const updatedMoreBtn = fixture.nativeElement.querySelector('.ngxsmk-overflow-list__more');
    expect(updatedMoreBtn.textContent.trim()).toBe('Show less');
  });
});
