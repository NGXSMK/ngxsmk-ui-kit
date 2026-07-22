import { TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { NgxsmkToast, NgxsmkToaster } from './toast';
import { NgxsmkLiveAnnouncer } from '@ngxsmk/cdk';

describe('Toast and Toaster', () => {
  let toastService: NgxsmkToast;
  let announcerMock: { announce: any };

  beforeEach(() => {
    vi.useFakeTimers();

    announcerMock = {
      announce: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [NgxsmkToast, { provide: NgxsmkLiveAnnouncer, useValue: announcerMock }],
    });

    toastService = TestBed.inject(NgxsmkToast);
  });

  afterEach(() => {
    vi.useRealTimers();
    toastService.clear();
  });

  it('should announce toast message and add to toasts list', () => {
    toastService.show({
      title: 'Upload success',
      description: 'File is ready',
      variant: 'success',
    });

    expect(announcerMock.announce).toHaveBeenCalledWith('Upload success. File is ready', 'polite');
    expect(toastService.toasts().length).toBe(1);
    expect(toastService.toasts()[0].title).toBe('Upload success');
  });

  it('should automatically dismiss after duration', () => {
    const id = toastService.show({ title: 'Auto close', duration: 3000 });
    expect(toastService.toasts().length).toBe(1);

    // Advance time past 3000ms
    vi.advanceTimersByTime(3000);
    expect(toastService.isLeaving(id)).toBe(true);
  });

  it('should render items in NgxsmkToaster and dismiss on click', () => {
    const fixture = TestBed.createComponent(NgxsmkToaster);
    fixture.detectChanges();

    const id = toastService.show({ title: 'Toaster Message', description: 'Desc text' });
    fixture.detectChanges();

    const toastEl = fixture.nativeElement.querySelector('.ngxsmk-toaster__toast');
    expect(toastEl).toBeTruthy();
    expect(toastEl.querySelector('.ngxsmk-toaster__title').textContent).toBe('Toaster Message');
    expect(toastEl.querySelector('.ngxsmk-toaster__description').textContent).toBe('Desc text');

    // Click close button
    const closeBtn = toastEl.querySelector('.ngxsmk-toaster__close');
    closeBtn.click();
    fixture.detectChanges();

    expect(toastService.isLeaving(id)).toBe(true);

    // Simulate animationend for ngxsmk-toast-out to clear it completely
    const animEvent = new Event('animationend');
    Object.defineProperty(animEvent, 'animationName', { value: 'ngxsmk-toast-out' });
    toastEl.dispatchEvent(animEvent);
    fixture.detectChanges();

    expect(toastService.toasts().length).toBe(0);
  });
});
