import { TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach } from 'vitest';
import { NgxsmkTransfer, TransferItem } from './transfer';

describe('NgxsmkTransfer', () => {
  let items: TransferItem[];

  beforeEach(() => {
    items = [
      { key: '1', title: 'Item 1' },
      { key: '2', title: 'Item 2' },
      { key: '3', title: 'Item 3' },
    ];
  });

  it('renders source and target list columns', () => {
    const fixture = TestBed.createComponent(NgxsmkTransfer);
    fixture.componentRef.setInput('dataSource', items);
    fixture.componentRef.setInput('targetKeys', ['2']);
    fixture.detectChanges();

    const lists = fixture.nativeElement.querySelectorAll('.ngxsmk-transfer__list');
    expect(lists.length).toBe(2);
  });
});
