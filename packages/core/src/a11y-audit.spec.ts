import { Component, provideZonelessChangeDetection, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, it } from 'vitest';
import { expectNoA11yViolations } from '@ngxsmk/cdk/testing';
import { NgxsmkButton } from '@ngxsmk/core/button';
import { NgxsmkBadge } from '@ngxsmk/core/badge';
import { NgxsmkAlert } from '@ngxsmk/core/alert';
import { NgxsmkCheckbox } from '@ngxsmk/core/checkbox';
import { NgxsmkSwitch } from '@ngxsmk/core/switch';
import { NgxsmkTab, NgxsmkTabs } from '@ngxsmk/core/tabs';
import { NgxsmkPagination } from '@ngxsmk/core/pagination';

// jsdom has no layout engine, so color-contrast cannot be computed here.
const AXE_OPTIONS = { rules: { 'color-contrast': { enabled: false } } };

@Component({
  imports: [
    NgxsmkButton,
    NgxsmkBadge,
    NgxsmkAlert,
    NgxsmkCheckbox,
    NgxsmkSwitch,
    NgxsmkTabs,
    NgxsmkTab,
    NgxsmkPagination,
  ],
  template: `
    <main>
      <button ngxsmk-button>Save</button>
      <ngxsmk-badge>New</ngxsmk-badge>
      <ngxsmk-alert>Something happened</ngxsmk-alert>
      <ngxsmk-checkbox>Accept terms</ngxsmk-checkbox>
      <ngxsmk-switch>Dark mode</ngxsmk-switch>
      <ngxsmk-tabs [(value)]="tab">
        <ngxsmk-tab value="a" label="Alpha">Alpha content</ngxsmk-tab>
        <ngxsmk-tab value="b" label="Beta">Beta content</ngxsmk-tab>
      </ngxsmk-tabs>
      <ngxsmk-pagination [total]="100" [pageSize]="10" />
    </main>
  `,
})
class A11yHost {
  readonly tab = signal('a');
}

describe('accessibility audit (axe-core)', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('renders core components without axe violations', async () => {
    const fixture = TestBed.createComponent(A11yHost);
    fixture.detectChanges();
    await fixture.whenStable();
    await expectNoA11yViolations(fixture.nativeElement, AXE_OPTIONS);
  });
});
