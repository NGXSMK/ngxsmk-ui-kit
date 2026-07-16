import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { NgxsmkBreadcrumbItem } from './breadcrumb-item';

@Component({
  standalone: true,
  imports: [NgxsmkBreadcrumbItem],
  template: `
    <nav>
      <ngxsmk-breadcrumb-item href="/">Home</ngxsmk-breadcrumb-item>
      <ngxsmk-breadcrumb-item href="/docs">Docs</ngxsmk-breadcrumb-item>
      <ngxsmk-breadcrumb-item>Components</ngxsmk-breadcrumb-item>
    </nav>
  `,
})
class HostComponent {}

describe('NgxsmkBreadcrumbItem', () => {
  function setup() {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const items: HTMLElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('ngxsmk-breadcrumb-item'),
    );
    return { fixture, items };
  }

  it('projects content into every item, including link items', () => {
    const { items } = setup();

    expect(items[0].textContent).toContain('Home');
    expect(items[1].textContent).toContain('Docs');
    expect(items[2].textContent).toContain('Components');
  });

  it('renders links with href and the current item with aria-current', () => {
    const { items } = setup();

    const firstLink = items[0].querySelector('a');
    expect(firstLink?.getAttribute('href')).toBe('/');
    expect(firstLink?.hasAttribute('aria-current')).toBe(false);

    const current = items[2].querySelector('a');
    expect(current?.hasAttribute('href')).toBe(false);
    expect(current?.getAttribute('aria-current')).toBe('page');
  });

  it('renders a separator element inside every item', () => {
    const { items } = setup();

    expect(items[0].querySelector('.ngxsmk-breadcrumb-item__sep')?.textContent).toBe('/');
    expect(items[1].querySelector('.ngxsmk-breadcrumb-item__sep')?.textContent).toBe('/');
    expect(items[2].querySelector('.ngxsmk-breadcrumb-item__sep')?.textContent).toBe('/');
  });
});
