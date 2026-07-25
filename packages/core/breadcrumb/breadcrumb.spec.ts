import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '@ngxsmk/cdk/testing';
import { NgxsmkBreadcrumbItem } from '@ngxsmk/core/breadcrumb-item';
import { NgxsmkBreadcrumb } from './breadcrumb';

@Component({
  standalone: true,
  imports: [NgxsmkBreadcrumb, NgxsmkBreadcrumbItem],
  template: `
    <ngxsmk-breadcrumb [separator]="separator()" [ariaLabel]="label()">
      <ngxsmk-breadcrumb-item href="/">Home</ngxsmk-breadcrumb-item>
      <ngxsmk-breadcrumb-item href="/docs">Docs</ngxsmk-breadcrumb-item>
      <ngxsmk-breadcrumb-item [separator]="itemSeparator()">Current</ngxsmk-breadcrumb-item>
    </ngxsmk-breadcrumb>
  `,
})
class HostComponent {
  readonly separator = signal('/');
  readonly label = signal('Breadcrumb');
  readonly itemSeparator = signal('');
}

describe('NgxsmkBreadcrumb', () => {
  function setup() {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    return { fixture, root: fixture.nativeElement as HTMLElement };
  }

  it('exposes a named navigation landmark containing a list', () => {
    const { root } = setup();
    const nav = root.querySelector('ngxsmk-breadcrumb')!;

    expect(nav.getAttribute('role')).toBe('navigation');
    expect(nav.getAttribute('aria-label')).toBe('Breadcrumb');
    expect(nav.querySelector('ol')!.getAttribute('role')).toBe('list');
  });

  it('marks each item as a listitem so the trail announces as a list', () => {
    const { root } = setup();
    const items = root.querySelectorAll('ngxsmk-breadcrumb-item');

    expect(items).toHaveLength(3);
    for (const item of Array.from(items)) {
      expect(item.getAttribute('role')).toBe('listitem');
    }
  });

  it('marks only the item without an href as the current page', () => {
    const { root } = setup();
    const links = root.querySelectorAll('.ngxsmk-breadcrumb-item__link');

    expect(links[0].getAttribute('aria-current')).toBeNull();
    expect(links[1].getAttribute('aria-current')).toBeNull();
    expect(links[2].getAttribute('aria-current')).toBe('page');
  });

  it('shares its separator with every item', () => {
    const { fixture, root } = setup();
    fixture.componentInstance.separator.set('>');
    fixture.detectChanges();

    const seps = Array.from(root.querySelectorAll('.ngxsmk-breadcrumb-item__sep'));
    expect(seps.length).toBeGreaterThan(0);
    for (const sep of seps) {
      expect(sep.textContent?.trim()).toBe('>');
    }
  });

  it('lets an item override the inherited separator', () => {
    const { fixture, root } = setup();
    fixture.componentInstance.separator.set('>');
    fixture.componentInstance.itemSeparator.set('|');
    fixture.detectChanges();

    const seps = Array.from(root.querySelectorAll('.ngxsmk-breadcrumb-item__sep'));
    expect(seps[seps.length - 1].textContent?.trim()).toBe('|');
  });

  it('reflects the overflow mode for styling', () => {
    const { root } = setup();
    // Default; the scroll variant is exercised through the data attribute the
    // stylesheet keys off.
    expect(root.querySelector('ngxsmk-breadcrumb')!.getAttribute('data-overflow')).toBe('wrap');
  });

  it('has no accessibility violations', async () => {
    const { root } = setup();
    await expectNoA11yViolations(root, { rules: { 'color-contrast': { enabled: false } } });
  });
});

@Component({
  standalone: true,
  imports: [NgxsmkBreadcrumbItem],
  template: `<ngxsmk-breadcrumb-item href="/">Home</ngxsmk-breadcrumb-item>`,
})
class BareItemHost {}

describe('NgxsmkBreadcrumbItem outside a breadcrumb', () => {
  it('falls back to the default separator', () => {
    const fixture = TestBed.createComponent(BareItemHost);
    fixture.detectChanges();

    const sep = fixture.nativeElement.querySelector('.ngxsmk-breadcrumb-item__sep');
    expect(sep.textContent?.trim()).toBe('/');
  });
});
