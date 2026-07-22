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

  it('renders custom column titles', () => {
    const fixture = TestBed.createComponent(NgxsmkTransfer);
    fixture.componentRef.setInput('dataSource', items);
    fixture.componentRef.setInput('titles', ['Available Items', 'Assigned Items']);
    fixture.detectChanges();

    const titles = fixture.nativeElement.querySelectorAll('.ngxsmk-transfer__header-title');
    expect(titles[0].textContent).toBe('Available Items');
    expect(titles[1].textContent).toBe('Assigned Items');
  });

  it('moves items from source to target when right button is clicked', () => {
    const fixture = TestBed.createComponent(NgxsmkTransfer);
    fixture.componentRef.setInput('dataSource', items);
    fixture.componentRef.setInput('targetKeys', []);
    fixture.detectChanges();

    // Select Item 1 on the left
    const leftItems = fixture.nativeElement
      .querySelectorAll('.ngxsmk-transfer__list')[0]
      .querySelectorAll('.ngxsmk-transfer__item');
    (leftItems[0] as HTMLElement).click();
    fixture.detectChanges();

    // Click move right button
    const moveRightBtn = fixture.nativeElement.querySelector(
      '.ngxsmk-transfer__btn',
    ) as HTMLButtonElement;
    expect(moveRightBtn.disabled).toBe(false);
    moveRightBtn.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.targetKeys()).toContain('1');
  });

  it('filters items when search query is typed', () => {
    const fixture = TestBed.createComponent(NgxsmkTransfer);
    fixture.componentRef.setInput('dataSource', items);
    fixture.componentRef.setInput('showSearch', true);
    fixture.detectChanges();

    const searchInput = fixture.nativeElement.querySelector(
      '.ngxsmk-transfer__search-input',
    ) as HTMLInputElement;
    searchInput.value = 'Item 1';
    searchInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const leftItems = fixture.nativeElement
      .querySelectorAll('.ngxsmk-transfer__list')[0]
      .querySelectorAll('.ngxsmk-transfer__item');
    expect(leftItems.length).toBe(1);
  });
});
