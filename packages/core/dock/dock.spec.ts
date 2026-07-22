import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { NgxsmkDock, DockItem } from './dock';

describe('NgxsmkDock', () => {
  it('renders list of dock items', () => {
    const items: DockItem[] = [
      { id: 'home', label: 'Home', icon: '<svg></svg>' },
      { id: 'settings', label: 'Settings', icon: '<svg></svg>' },
    ];
    const fixture = TestBed.createComponent(NgxsmkDock);
    fixture.componentRef.setInput('items', items);
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('.ngxsmk-dock__item');
    expect(buttons.length).toBe(2);
  });
});
