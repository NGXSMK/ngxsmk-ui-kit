import { Component, OnInit, provideZonelessChangeDetection, signal } from '@angular/core';
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
import { NgxsmkInputDirective } from '@ngxsmk/core/input';
import { NgxsmkFormField } from '@ngxsmk/core/form-field';
import { NgxsmkSelect } from '@ngxsmk/core/select';
import { NgxsmkDialog } from '@ngxsmk/core/dialog';
import { NgxsmkSheet } from '@ngxsmk/core/sheet';
import { NgxsmkToast, NgxsmkToaster } from '@ngxsmk/core/toast';
import { NgxsmkDataTable } from '@ngxsmk/core/data-table';
import { NgxsmkMenubar } from '@ngxsmk/core/menubar';
import { NgxsmkAutocomplete } from '@ngxsmk/core/autocomplete';
import { NgxsmkCard, NgxsmkCardContent } from '@ngxsmk/core/card';
import { NgxsmkBreadcrumb } from '@ngxsmk/core/breadcrumb';
import { NgxsmkRadio, NgxsmkRadioGroup } from '@ngxsmk/core/radio';
import { NgxsmkProgress } from '@ngxsmk/core/progress';
import { NgxsmkDatePicker } from '@ngxsmk/core/date-picker';

/** jsdom cannot compute contrast — disable that rule in unit tests. */
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
    NgxsmkInputDirective,
    NgxsmkFormField,
    NgxsmkSelect,
    NgxsmkDialog,
    NgxsmkSheet,
    NgxsmkToaster,
    NgxsmkDataTable,
    NgxsmkMenubar,
    NgxsmkAutocomplete,
    NgxsmkCard,
    NgxsmkCardContent,
    NgxsmkBreadcrumb,
    NgxsmkRadioGroup,
    NgxsmkRadio,
    NgxsmkProgress,
    NgxsmkDatePicker,
  ],
  providers: [NgxsmkToast],
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
      <ngxsmk-form-field label="Email">
        <input ngxsmkInput type="email" />
      </ngxsmk-form-field>
      <ngxsmk-select
        placeholder="Pick a color"
        [options]="selectOptions"
        [(value)]="color"
      />
      <ngxsmk-dialog [(open)]="dialogOpen" title="Confirm delete">
        This action cannot be undone.
      </ngxsmk-dialog>
      <ngxsmk-sheet [(open)]="sheetOpen" title="Filters">Filter panel</ngxsmk-sheet>
      <ngxsmk-toaster />
      <ngxsmk-data-table [columns]="columns" [rows]="rows" [pageSize]="5" />
      <ngxsmk-menubar [items]="menuItems" />
      <ngxsmk-autocomplete [options]="acOptions" placeholder="Search" />
      <ngxsmk-card>
        <div ngxsmkCardContent>Card body</div>
      </ngxsmk-card>
      <ngxsmk-breadcrumb
        [items]="[
          { label: 'Home', href: '/' },
          { label: 'Docs' },
        ]"
      />
      <ngxsmk-radio-group [(value)]="plan">
        <ngxsmk-radio value="free">Free</ngxsmk-radio>
        <ngxsmk-radio value="pro">Pro</ngxsmk-radio>
      </ngxsmk-radio-group>
      <ngxsmk-progress [value]="64" label="Upload progress" />
      <ngxsmk-form-field label="Ship date">
        <ngxsmk-date-picker [(value)]="date" />
      </ngxsmk-form-field>
    </main>
  `,
})
class Top20A11yHost implements OnInit {
  readonly tab = signal('a');
  readonly color = signal('teal');
  readonly dialogOpen = signal(true);
  readonly sheetOpen = signal(false);
  readonly plan = signal('pro');
  readonly date = signal('2026-09-07');

  readonly selectOptions = [
    { value: 'teal', label: 'Teal' },
    { value: 'ink', label: 'Ink' },
  ];
  readonly columns = [
    { key: 'name', label: 'Name' },
    { key: 'role', label: 'Role' },
  ];
  readonly rows = [
    { id: 1, name: 'Ada', role: 'Engineer' },
    { id: 2, name: 'Grace', role: 'Lead' },
  ];
  readonly menuItems = [
    { label: 'File', children: [{ label: 'New' }, { label: 'Open' }] },
    { label: 'Edit', children: [{ label: 'Copy' }] },
  ];
  readonly acOptions = [
    { value: 'a', label: 'Alpha' },
    { value: 'b', label: 'Beta' },
  ];

  private readonly toast = TestBed.inject(NgxsmkToast);

  ngOnInit(): void {
    this.toast.show({ title: 'Saved', description: 'Preferences updated', duration: 0 });
  }
}

describe('top-20 accessibility audit (axe-core)', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('renders the top-20 host without axe violations', async () => {
    const fixture = TestBed.createComponent(Top20A11yHost);
    fixture.detectChanges();
    await fixture.whenStable();
    await expectNoA11yViolations(fixture.nativeElement, AXE_OPTIONS);
  });
});
