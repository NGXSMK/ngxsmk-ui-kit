import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { NgxsmkSplitButton } from './split-button';

@Component({
  standalone: true,
  imports: [NgxsmkSplitButton],
  template: `
    <ngxsmk-split-button
      [label]="label()"
      [variant]="variant()"
      [size]="size()"
      [disabled]="disabled()"
      [loading]="loading()"
      (action)="actionFired.set(true)"
    >
      <div id="item">Option 1</div>
    </ngxsmk-split-button>
    <div id="outside">Outside</div>
  `,
})
class HostComponent {
  readonly label = signal('Save');
  readonly variant = signal<'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'>(
    'primary',
  );
  readonly size = signal<'sm' | 'md' | 'lg'>('md');
  readonly disabled = signal(false);
  readonly loading = signal(false);
  readonly actionFired = signal(false);
}

describe('NgxsmkSplitButton', () => {
  it('renders labels and responds to main click', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const mainBtn = fixture.nativeElement.querySelector(
      '.ngxsmk-split-button__main',
    ) as HTMLButtonElement;
    expect(mainBtn).toBeTruthy();
    expect(mainBtn.textContent.trim()).toBe('Save');

    mainBtn.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.actionFired()).toBe(true);
  });

  it('toggles dropdown menu when trigger is clicked', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const triggerBtn = fixture.nativeElement.querySelector(
      '.ngxsmk-split-button__trigger',
    ) as HTMLButtonElement;
    expect(triggerBtn).toBeTruthy();

    let menu = fixture.nativeElement.querySelector('.ngxsmk-split-button__menu');
    expect(menu).toBeNull();

    triggerBtn.click();
    fixture.detectChanges();

    menu = fixture.nativeElement.querySelector('.ngxsmk-split-button__menu');
    expect(menu).toBeTruthy();
    expect(menu.querySelector('#item')).toBeTruthy();
  });
});
