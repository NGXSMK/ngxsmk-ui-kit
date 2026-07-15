import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { NgxsmkTableCell, NgxsmkTableHeaderCell, NgxsmkTableRow } from './table-cell';

@Component({
  standalone: true,
  imports: [NgxsmkTableCell, NgxsmkTableHeaderCell, NgxsmkTableRow],
  template: `
    <table class="ngxsmk-table">
      <thead>
        <tr ngxsmkTableRow>
          <th ngxsmkTableHeaderCell [sortable]="true" sortDirection="asc">Header</th>
        </tr>
      </thead>
      <tbody>
        <tr ngxsmkTableRow [selected]="true">
          <td ngxsmkTableCell>Cell Value</td>
        </tr>
      </tbody>
    </table>
  `,
})
class HostComponent {}

describe('NgxsmkComposedTableDirectives', () => {
  function setup() {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const row = fixture.nativeElement.querySelector('tr[ngxsmkTableRow]');
    const bodyRow = fixture.nativeElement.querySelector('tbody tr[ngxsmkTableRow]');
    const headerCell = fixture.nativeElement.querySelector('th[ngxsmkTableHeaderCell]');
    const cell = fixture.nativeElement.querySelector('td[ngxsmkTableCell]');
    return { fixture, row, bodyRow, headerCell, cell };
  }

  it('applies styling classes and attributes correctly', () => {
    const { row, bodyRow, headerCell, cell } = setup();

    expect(row.classList.contains('ngxsmk-table-row')).toBe(true);
    expect(bodyRow.getAttribute('data-selected')).toBe('');

    expect(headerCell.classList.contains('ngxsmk-table-header-cell')).toBe(true);
    expect(headerCell.getAttribute('aria-sort')).toBe('asc');
    expect(headerCell.style.cursor).toBe('pointer');

    expect(cell.classList.contains('ngxsmk-table-cell')).toBe(true);
    expect(cell.textContent.trim()).toBe('Cell Value');
  });
});
