import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';
import { NgxsmkDock, DockItem } from './dock';

describe('NgxsmkDock', () => {
  const sampleItems: DockItem[] = [
    { id: 'home', label: 'Home', icon: '<svg></svg>' },
    { id: 'mail', label: 'Mail', icon: '<svg></svg>', badge: 5 },
    { id: 'disabled-app', label: 'Disabled App', icon: '<svg></svg>', disabled: true },
  ];

  it('renders list of dock items', () => {
    const fixture = TestBed.createComponent(NgxsmkDock);
    fixture.componentRef.setInput('items', sampleItems);
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('.ngxsmk-dock__item');
    expect(buttons.length).toBe(3);
  });

  it('emits itemClick output when an enabled item is clicked', () => {
    const fixture = TestBed.createComponent(NgxsmkDock);
    const spy = vi.fn();
    fixture.componentInstance.itemClick.subscribe(spy);
    fixture.componentRef.setInput('items', sampleItems);
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('.ngxsmk-dock__item');
    (buttons[0] as HTMLButtonElement).click();

    expect(spy).toHaveBeenCalledWith(sampleItems[0]);
  });

  it('does not emit itemClick when a disabled item is clicked', () => {
    const fixture = TestBed.createComponent(NgxsmkDock);
    const spy = vi.fn();
    fixture.componentInstance.itemClick.subscribe(spy);
    fixture.componentRef.setInput('items', sampleItems);
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('.ngxsmk-dock__item');
    (buttons[2] as HTMLButtonElement).click();

    expect(spy).not.toHaveBeenCalled();
  });

  it('renders notification badge with aria-label', () => {
    const fixture = TestBed.createComponent(NgxsmkDock);
    fixture.componentRef.setInput('items', sampleItems);
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelector('.ngxsmk-dock__badge');
    expect(badge).toBeTruthy();
    expect(badge.textContent).toBe('5');
    expect(badge.getAttribute('aria-label')).toBe('5 notifications');
  });

  it('sets position attribute on host', () => {
    const fixture = TestBed.createComponent(NgxsmkDock);
    fixture.componentRef.setInput('items', []);
    fixture.componentRef.setInput('position', 'top');
    fixture.detectChanges();

    expect(fixture.nativeElement.getAttribute('data-position')).toBe('top');
  });
});
