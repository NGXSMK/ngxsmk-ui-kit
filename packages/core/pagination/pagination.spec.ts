import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { NgxsmkPagination } from './pagination';

@Component({
  standalone: true,
  imports: [NgxsmkPagination],
  template: `
    <ngxsmk-pagination [(page)]="page" [pageCount]="pageCount" [siblingCount]="siblings" />
  `,
})
class Host {
  page = signal(1);
  pageCount = 10;
  siblings = 1;
}

function setup(configure?: (h: Host) => void) {
  const fixture = TestBed.createComponent(Host);
  if (configure) configure(fixture.componentInstance);
  fixture.detectChanges();
  const host: HTMLElement = fixture.nativeElement.querySelector('ngxsmk-pagination');
  return { fixture, host };
}

function pageButtons(host: HTMLElement): string[] {
  return Array.from(host.querySelectorAll('.ngxsmk-pagination__btn'))
    .map((b) => (b.textContent ?? '').trim())
    .filter((t) => /^\d+$/.test(t));
}

describe('NgxsmkPagination', () => {
  it('lists every page when the count is small', () => {
    const { host } = setup((h) => (h.pageCount = 5));
    expect(pageButtons(host)).toEqual(['1', '2', '3', '4', '5']);
  });

  it('collapses distant pages with an ellipsis', () => {
    const { host } = setup((h) => {
      h.pageCount = 20;
      h.page.set(10);
    });
    expect(host.querySelectorAll('.ngxsmk-pagination__ellipsis').length).toBe(2);
    // Always shows first and last.
    const nums = pageButtons(host);
    expect(nums[0]).toBe('1');
    expect(nums[nums.length - 1]).toBe('20');
    expect(nums).toContain('10');
  });

  it('marks the active page with aria-current', () => {
    const { host } = setup((h) => h.page.set(3));
    const active = host.querySelector('[aria-current="page"]');
    expect(active?.textContent?.trim()).toBe('3');
  });

  it('navigates and clamps out-of-range requests', () => {
    const { fixture, host } = setup((h) => h.page.set(1));
    const next = host.querySelector<HTMLButtonElement>('[aria-label="Next page"]')!;
    next.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.page()).toBe(2);
  });

  it('disables prev on the first page and next on the last', () => {
    const { host } = setup((h) => h.page.set(1));
    expect(host.querySelector<HTMLButtonElement>('[aria-label="Previous page"]')!.disabled).toBe(
      true,
    );
  });
});
