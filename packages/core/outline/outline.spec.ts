import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { NgxsmkOutline, OutlineItem } from './outline';

@Component({
  imports: [NgxsmkOutline],
  template: `
    <ngxsmk-outline [items]="items" [(activeId)]="activeId" />
  `,
})
class HostComponent {
  items: OutlineItem[] = [
    { id: 'sec1', label: 'Section 1', depth: 0 },
    { id: 'sec2', label: 'Section 2', depth: 1 },
  ];
  readonly activeId = signal('');
}

describe('NgxsmkOutline', () => {
  function setup() {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const outline = fixture.nativeElement.querySelector('ngxsmk-outline');
    const links = fixture.nativeElement.querySelectorAll('.ngxsmk-outline__nav a');
    return { fixture, outline, links, host: fixture.componentInstance };
  }

  it('renders all outline links with depth padding', () => {
    const { links } = setup();
    expect(links.length).toBe(2);
    expect(links[0].textContent.trim()).toBe('Section 1');
    expect(links[1].textContent.trim()).toBe('Section 2');
    
    // Depth checks
    expect(links[0].style.paddingLeft).toBe('16px'); // 0 * 16 + 16
    expect(links[1].style.paddingLeft).toBe('32px'); // 1 * 16 + 16
  });

  it('sets active class matching the activeId model', () => {
    const { fixture, links, host } = setup();
    expect(links[0].classList.contains('ngxsmk-outline__link--active')).toBe(false);
    expect(links[1].classList.contains('ngxsmk-outline__link--active')).toBe(false);

    host.activeId.set('sec1');
    fixture.detectChanges();

    expect(links[0].classList.contains('ngxsmk-outline__link--active')).toBe(true);
    expect(links[1].classList.contains('ngxsmk-outline__link--active')).toBe(false);
  });

  it('updates the activeId model on link click', () => {
    const { fixture, links, host } = setup();
    expect(host.activeId()).toBe('');

    links[1].click();
    fixture.detectChanges();

    expect(host.activeId()).toBe('sec2');
  });
});
