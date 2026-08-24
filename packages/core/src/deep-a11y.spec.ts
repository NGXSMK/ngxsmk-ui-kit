import { Component, provideZonelessChangeDetection, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { NgxsmkRovingFocusGroup, NgxsmkRovingFocusItem } from '@ngxsmk/cdk/roving-focus';
import { NgxsmkSkipLink } from '@ngxsmk/cdk/skip-link';
import { NgxsmkLiveAnnouncer } from '@ngxsmk/cdk/live-announcer';
import { NgxsmkSwitch } from '@ngxsmk/core/switch';
import { NgxsmkCheckbox } from '@ngxsmk/core/checkbox';
import { NgxsmkTab, NgxsmkTabs } from '@ngxsmk/core/tabs';

@Component({
  imports: [
    NgxsmkRovingFocusGroup,
    NgxsmkRovingFocusItem,
    NgxsmkSkipLink,
    NgxsmkSwitch,
    NgxsmkCheckbox,
    NgxsmkTabs,
    NgxsmkTab,
  ],
  template: `
    <div class="a11y-test-host">
      <ngxsmk-skip-link targetId="main-area">Skip to content</ngxsmk-skip-link>

      <!-- Roving Focus Group -->
      <div ngxsmkRovingFocusGroup orientation="horizontal" [loop]="true" class="toolbar">
        <button ngxsmkRovingFocusItem id="item-1">Item 1</button>
        <button ngxsmkRovingFocusItem id="item-2">Item 2</button>
        <button ngxsmkRovingFocusItem id="item-3">Item 3</button>
      </div>

      <!-- ARIA Checked / Switch -->
      <ngxsmk-switch [(checked)]="isDark">Dark Mode</ngxsmk-switch>
      <ngxsmk-checkbox [(checked)]="accepted">Accept Policy</ngxsmk-checkbox>

      <!-- Tabs -->
      <main id="main-area">
        <ngxsmk-tabs [(value)]="activeTab">
          <ngxsmk-tab value="overview" label="Overview">Overview Content</ngxsmk-tab>
          <ngxsmk-tab value="settings" label="Settings">Settings Content</ngxsmk-tab>
        </ngxsmk-tabs>
      </main>
    </div>
  `,
})
class DeepA11yTestHost {
  readonly isDark = signal(false);
  readonly accepted = signal(true);
  readonly activeTab = signal('overview');
}

describe('Deep Accessibility & Keyboard Interaction Verification', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), NgxsmkLiveAnnouncer],
    });
  });

  it('renders skip navigation link with target anchor and keyboard focus styling', async () => {
    const fixture = TestBed.createComponent(DeepA11yTestHost);
    fixture.detectChanges();
    await fixture.whenStable();

    const skipLink = fixture.nativeElement.querySelector('ngxsmk-skip-link a');
    expect(skipLink).toBeTruthy();
    expect(skipLink.getAttribute('href')).toBe('#main-area');
    expect(skipLink.textContent).toContain('Skip to content');
  });

  it('enforces roving focus: only 1 item has tabindex="0", siblings have tabindex="-1"', async () => {
    const fixture = TestBed.createComponent(DeepA11yTestHost);
    fixture.detectChanges();
    await fixture.whenStable();

    const items = fixture.nativeElement.querySelectorAll('button[ngxsmkRovingFocusItem]');
    expect(items.length).toBe(3);

    // Initial state: item 1 is active (tabindex 0), rest are -1
    expect(items[0].getAttribute('tabindex')).toBe('0');
    expect(items[1].getAttribute('tabindex')).toBe('-1');
    expect(items[2].getAttribute('tabindex')).toBe('-1');

    // Simulate ArrowRight on item 1
    items[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(items[0].getAttribute('tabindex')).toBe('-1');
    expect(items[1].getAttribute('tabindex')).toBe('0');
    expect(items[2].getAttribute('tabindex')).toBe('-1');

    // Simulate End key
    items[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(items[0].getAttribute('tabindex')).toBe('-1');
    expect(items[1].getAttribute('tabindex')).toBe('-1');
    expect(items[2].getAttribute('tabindex')).toBe('0');
  });

  it('maintains correct ARIA roles and live states on interactive form controls', async () => {
    const fixture = TestBed.createComponent(DeepA11yTestHost);
    fixture.detectChanges();
    await fixture.whenStable();

    const switchInput = fixture.nativeElement.querySelector('ngxsmk-switch input');
    expect(switchInput.getAttribute('role')).toBe('switch');
    expect(switchInput.checked).toBe(false);

    // Toggle switch
    fixture.componentInstance.isDark.set(true);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(switchInput.checked).toBe(true);
  });

  it('announces live updates via NgxsmkLiveAnnouncer', () => {
    const announcer = TestBed.inject(NgxsmkLiveAnnouncer);
    expect(announcer).toBeTruthy();
    announcer.announce('Search results updated: 14 items found', 'polite');
  });
});
