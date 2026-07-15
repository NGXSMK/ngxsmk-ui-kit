import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { NgxsmkDialog, NgxsmkDialogFooter } from './dialog';
import { NgxsmkScrollLock } from '@ngxsmk/cdk';

vi.mock('motion', () => ({
  animate: vi.fn().mockReturnValue({ finished: Promise.resolve() }),
  style: vi.fn(),
}));

@Component({
  standalone: true,
  imports: [NgxsmkDialog, NgxsmkDialogFooter],
  template: `
    <ngxsmk-dialog [(open)]="open" [title]="title()" [dismissible]="dismissible()">
      Modal Content
      <div ngxsmkDialogFooter>
        <button id="close-btn" (click)="open.set(false)">Cancel</button>
      </div>
    </ngxsmk-dialog>
  `,
})
class HostComponent {
  readonly open = signal(false);
  readonly title = signal('Test Title');
  readonly dismissible = signal(true);
}

describe('NgxsmkDialog', () => {
  let scrollLockMock: { lock: any; unlock: any };

  beforeEach(() => {
    // Mock native dialog methods which JSDOM does not support
    HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
      this.setAttribute('open', '');
    });
    HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
      this.removeAttribute('open');
      const event = new Event('close');
      this.dispatchEvent(event);
    });

    scrollLockMock = {
      lock: vi.fn(),
      unlock: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [{ provide: NgxsmkScrollLock, useValue: scrollLockMock }],
    });
  });

  function setup() {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const dialogEl: HTMLDialogElement =
      fixture.nativeElement.querySelector('.ngxsmk-dialog__native');
    return { fixture, dialogEl };
  }

  it('renders correctly with given title and hides by default', () => {
    const { dialogEl } = setup();
    expect(dialogEl.hasAttribute('open')).toBe(false);
  });

  it('opens native dialog modal and locks scroll when open signal changes to true', async () => {
    const { fixture, dialogEl } = setup();

    fixture.componentInstance.open.set(true);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(dialogEl.hasAttribute('open')).toBe(true);
    expect(scrollLockMock.lock).toHaveBeenCalled();
  });

  it('closes dialog modal and unlocks scroll when close button is clicked', async () => {
    const { fixture } = setup();

    fixture.componentInstance.open.set(true);
    fixture.detectChanges();
    await fixture.whenStable();

    const closeBtn = fixture.nativeElement.querySelector('.ngxsmk-dialog__close');
    closeBtn.click();
    fixture.detectChanges();

    // Wait for the async animation and dialog close handler to run
    await new Promise((resolve) => setTimeout(resolve, 50));
    fixture.detectChanges();

    expect(fixture.componentInstance.open()).toBe(false);
    expect(scrollLockMock.unlock).toHaveBeenCalled();
  });
});
