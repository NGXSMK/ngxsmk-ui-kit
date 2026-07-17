import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { UpperCasePipe } from '@angular/common';
import { NgxsmkTable, NgxsmkCellDef } from './table';

@Component({
  standalone: true,
  imports: [NgxsmkTable, NgxsmkCellDef, UpperCasePipe],
  template: `
    <ngxsmk-table [columns]="columns" [rows]="rows">
      <ng-template ngxsmkCell="role" let-value let-row="row">
        <span class="custom-badge">{{ value | uppercase }} ({{ row.name }})</span>
      </ng-template>
    </ngxsmk-table>
  `,
})
class HostComponent {
  readonly columns = [
    { key: 'name', label: 'Name' },
    { key: 'role', label: 'Role' },
  ];

  readonly rows = [
    { name: 'Sachin', role: 'admin' },
    { name: 'Dilshan', role: 'editor' },
  ];
}

describe('NgxsmkTable', () => {
  function setup() {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    return { fixture };
  }

  it('renders default text for columns without custom templates', () => {
    const { fixture } = setup();
    const cells = fixture.nativeElement.querySelectorAll('.ngxsmk-table__cell');
    
    // First row: Name cell (Sachin), Role cell (custom template)
    expect(cells[0].textContent?.trim()).toBe('Sachin');
  });

  it('renders custom template for columns with ngxsmkCell directive', () => {
    const { fixture } = setup();
    const customBadge = fixture.nativeElement.querySelector('.custom-badge');
    
    expect(customBadge).toBeTruthy();
    expect(customBadge.textContent?.trim()).toBe('ADMIN (Sachin)');
  });
});
