import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { NgxsmkPinInput } from './pin-input';

@Component({
  imports: [NgxsmkPinInput],
  template: `
    <ngxsmk-pin-input
      [(value)]="value"
      [length]="length"
      [type]="type"
      (completed)="last.set($event)"
    />
  `,
})
class Host {
  value = signal('');
  length = 4;
  type: 'numeric' | 'text' | 'alphanumeric' = 'numeric';
  last = signal<string | null>(null);
}

function setup(configure?: (h: Host) => void) {
  const fixture = TestBed.createComponent(Host);
  if (configure) configure(fixture.componentInstance);
  fixture.detectChanges();
  const cells: HTMLInputElement[] = Array.from(
    fixture.nativeElement.querySelectorAll('.ngxsmk-pin-input__cell'),
  );
  return { fixture, cells };
}

function type(cell: HTMLInputElement, char: string, fixture: { detectChanges(): void }) {
  cell.value = char;
  cell.dispatchEvent(new Event('input'));
  fixture.detectChanges();
}

describe('NgxsmkPinInput', () => {
  it('renders one cell per length', () => {
    const { cells } = setup();
    expect(cells.length).toBe(4);
  });

  it('rejects characters that fail the numeric pattern', () => {
    const { fixture, cells } = setup();
    type(cells[0], 'a', fixture);
    expect(fixture.componentInstance.value()).toBe('');
  });

  it('accumulates value and emits completed when full', () => {
    const { fixture, cells } = setup();
    type(cells[0], '1', fixture);
    type(cells[1], '2', fixture);
    type(cells[2], '3', fixture);
    type(cells[3], '4', fixture);
    expect(fixture.componentInstance.value()).toBe('1234');
    expect(fixture.componentInstance.last()).toBe('1234');
  });

  it('distributes a pasted code across cells', () => {
    const { fixture, cells } = setup();
    const dt = new DataTransfer();
    dt.setData('text', '9876');
    cells[0].dispatchEvent(
      new ClipboardEvent('paste', { clipboardData: dt, bubbles: true }),
    );
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe('9876');
  });

  it('clears the previous cell on backspace when empty', () => {
    const { fixture, cells } = setup((h) => h.value.set('12'));
    cells[2].dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }),
    );
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe('1');
  });
});
