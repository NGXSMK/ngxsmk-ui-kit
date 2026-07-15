import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { NgxsmkAlert, NgxsmkAlertVariant } from './alert';

@Component({
  standalone: true,
  imports: [NgxsmkAlert],
  template: `
    <ngxsmk-alert
      [variant]="variant()"
      [title]="title()"
      [dismissible]="dismissible()"
      (dismissed)="onDismissed()"
    >
      Alert details here
    </ngxsmk-alert>
  `,
})
class HostComponent {
  readonly variant = signal<NgxsmkAlertVariant>('info');
  readonly title = signal('Info Alert');
  readonly dismissible = signal(false);
  dismissedCalled = false;

  onDismissed() {
    this.dismissedCalled = true;
  }
}

describe('NgxsmkAlert', () => {
  function setup() {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const alertEl: HTMLElement = fixture.nativeElement.querySelector('ngxsmk-alert');
    return { fixture, alertEl };
  }

  it('renders correctly with title and content', () => {
    const { alertEl } = setup();
    expect(alertEl).toBeTruthy();
    expect(alertEl.textContent).toContain('Info Alert');
    expect(alertEl.textContent).toContain('Alert details here');
  });

  it('sets role based on variant', () => {
    const { fixture, alertEl } = setup();
    
    // info -> status
    expect(alertEl.getAttribute('role')).toBe('status');

    // success -> status
    fixture.componentInstance.variant.set('success');
    fixture.detectChanges();
    expect(alertEl.getAttribute('role')).toBe('status');

    // warning -> alert
    fixture.componentInstance.variant.set('warning');
    fixture.detectChanges();
    expect(alertEl.getAttribute('role')).toBe('alert');

    // error -> alert
    fixture.componentInstance.variant.set('error');
    fixture.detectChanges();
    expect(alertEl.getAttribute('role')).toBe('alert');
  });

  it('hides and emits on dismiss button click when dismissible', () => {
    const { fixture, alertEl } = setup();
    expect(alertEl.querySelector('.ngxsmk-alert__close')).toBeNull();

    fixture.componentInstance.dismissible.set(true);
    fixture.detectChanges();

    const closeBtn = alertEl.querySelector('.ngxsmk-alert__close') as HTMLButtonElement;
    expect(closeBtn).toBeTruthy();

    closeBtn.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.dismissedCalled).toBe(true);
    expect(alertEl.getAttribute('data-hidden')).toBe('');
  });
});
