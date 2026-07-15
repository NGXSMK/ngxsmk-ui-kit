import { TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';
import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { NgxsmkLiveAnnouncer } from './live-announcer';

describe('NgxsmkLiveAnnouncer', () => {
  let announcer: NgxsmkLiveAnnouncer;
  let doc: Document;

  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({
      providers: [NgxsmkLiveAnnouncer]
    });
    announcer = TestBed.inject(NgxsmkLiveAnnouncer);
    doc = TestBed.inject(DOCUMENT);
  });

  afterEach(() => {
    announcer.ngOnDestroy();
    vi.useRealTimers();
  });

  it('creates a visually hidden live announcer region on first announcement', () => {
    announcer.announce('Hello World');
    vi.advanceTimersByTime(0);

    const region = doc.body.querySelector('.ngxsmk-live-announcer');
    expect(region).not.toBeNull();
    expect(region?.getAttribute('aria-live')).toBe('polite');
    expect(region?.getAttribute('aria-atomic')).toBe('true');
    expect(region?.textContent).toBe('Hello World');
  });

  it('updates politeness setting', () => {
    announcer.announce('Alert!', 'assertive');
    vi.advanceTimersByTime(0);

    const region = doc.body.querySelector('.ngxsmk-live-announcer');
    expect(region?.getAttribute('aria-live')).toBe('assertive');
    expect(region?.textContent).toBe('Alert!');
  });

  it('clears text content after 10 seconds', () => {
    announcer.announce('Going away');
    vi.advanceTimersByTime(0);
    const region = doc.body.querySelector('.ngxsmk-live-announcer');
    expect(region?.textContent).toBe('Going away');

    vi.advanceTimersByTime(10000);
    expect(region?.textContent).toBe('');
  });

  it('removes region on destroy', () => {
    announcer.announce('Destroy me');
    vi.advanceTimersByTime(0);
    expect(doc.body.querySelector('.ngxsmk-live-announcer')).not.toBeNull();

    announcer.ngOnDestroy();
    expect(doc.body.querySelector('.ngxsmk-live-announcer')).toBeNull();
  });
});
