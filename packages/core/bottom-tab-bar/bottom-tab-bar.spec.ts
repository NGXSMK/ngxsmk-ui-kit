import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '@ngxsmk/cdk/testing';
import { NgxsmkBottomTab, NgxsmkBottomTabBar } from './bottom-tab-bar';

@Component({
  standalone: true,
  imports: [NgxsmkBottomTabBar, NgxsmkBottomTab],
  template: `
    <ngxsmk-bottom-tab-bar [fixed]="fixed()">
      <ngxsmk-bottom-tab href="/" [active]="true"><span slot="icon">H</span>Home</ngxsmk-bottom-tab>
      <ngxsmk-bottom-tab href="/inbox" badge="3"><span slot="icon">I</span>Inbox</ngxsmk-bottom-tab>
      <ngxsmk-bottom-tab [disabled]="true" href="/off"
        ><span slot="icon">O</span>Off</ngxsmk-bottom-tab
      >
      <ngxsmk-bottom-tab (selected)="onSelect()"
        ><span slot="icon">A</span>Action</ngxsmk-bottom-tab
      >
    </ngxsmk-bottom-tab-bar>
  `,
})
class HostComponent {
  readonly fixed = signal(true);
  readonly onSelect = vi.fn();
}

describe('NgxsmkBottomTabBar', () => {
  function setup() {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    return { fixture, root: fixture.nativeElement as HTMLElement };
  }

  it('exposes a named navigation landmark', () => {
    const { root } = setup();
    const bar = root.querySelector('ngxsmk-bottom-tab-bar')!;

    expect(bar.getAttribute('role')).toBe('navigation');
    expect(bar.getAttribute('aria-label')).toBe('Bottom navigation');
  });

  it('reflects the fixed/static position for styling', () => {
    const { fixture, root } = setup();
    const bar = root.querySelector('ngxsmk-bottom-tab-bar')!;
    expect(bar.getAttribute('data-position')).toBe('fixed');

    fixture.componentInstance.fixed.set(false);
    fixture.detectChanges();
    expect(bar.getAttribute('data-position')).toBe('static');
  });

  it('renders a link when href is set and a button when it is not', () => {
    const { root } = setup();
    const tabs = root.querySelectorAll('ngxsmk-bottom-tab');

    expect(tabs[0].querySelector('a')).not.toBeNull();
    expect(tabs[0].querySelector('button')).toBeNull();
    // Last tab has no href — it is an action, so it must be a button.
    expect(tabs[3].querySelector('button')).not.toBeNull();
    expect(tabs[3].querySelector('a')).toBeNull();
  });

  it('marks only the active tab as the current page', () => {
    const { root } = setup();
    const targets = root.querySelectorAll('.ngxsmk-bottom-tab__target');

    expect(targets[0].getAttribute('aria-current')).toBe('page');
    expect(targets[1].getAttribute('aria-current')).toBeNull();
  });

  it('projects icon and label content', () => {
    const { root } = setup();
    const first = root.querySelector('ngxsmk-bottom-tab')!;

    expect(first.querySelector('.ngxsmk-bottom-tab__icon')!.textContent).toContain('H');
    expect(first.querySelector('.ngxsmk-bottom-tab__label')!.textContent).toContain('Home');
  });

  it('renders a badge only when one is supplied', () => {
    const { root } = setup();
    const tabs = root.querySelectorAll('ngxsmk-bottom-tab');

    expect(tabs[0].querySelector('.ngxsmk-bottom-tab__badge')).toBeNull();
    expect(tabs[1].querySelector('.ngxsmk-bottom-tab__badge')!.textContent?.trim()).toBe('3');
  });

  it('strips href and marks aria-disabled on a disabled link tab', () => {
    const { root } = setup();
    const disabled = root.querySelectorAll('ngxsmk-bottom-tab')[2].querySelector('a')!;

    expect(disabled.getAttribute('aria-disabled')).toBe('true');
    // Removing href keeps it out of the tab order rather than only visually
    // disabling it.
    expect(disabled.getAttribute('href')).toBeNull();
  });

  it('emits selected on activation', () => {
    const { fixture, root } = setup();
    const action = root.querySelectorAll('ngxsmk-bottom-tab')[3].querySelector('button')!;

    action.click();
    expect(fixture.componentInstance.onSelect).toHaveBeenCalledTimes(1);
  });

  it('has no accessibility violations', async () => {
    const { root } = setup();
    await expectNoA11yViolations(root, { rules: { 'color-contrast': { enabled: false } } });
  });
});
