import { TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';
import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { NGXSMK_PLATFORM_ADAPTER } from '@ngxsmk/cdk/platform';
import { NgxsmkScrollLock } from './scroll-lock';

describe('NgxsmkScrollLock', () => {
  let service: NgxsmkScrollLock;
  let doc: Document;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NgxsmkScrollLock],
    });
    service = TestBed.inject(NgxsmkScrollLock);
    doc = TestBed.inject(DOCUMENT);
    // Reset body style to default before each test
    doc.body.style.overflow = '';
    doc.body.style.paddingRight = '';
  });

  it('locks overflow on body on first lock call', () => {
    service.lock();
    expect(doc.body.style.overflow).toBe('hidden');
    service.unlock();
    expect(doc.body.style.overflow).toBe('');
  });

  it('supports reference counting for nested locking', () => {
    service.lock(); // locks = 1
    service.lock(); // locks = 2
    expect(doc.body.style.overflow).toBe('hidden');

    service.unlock(); // locks = 1
    expect(doc.body.style.overflow).toBe('hidden'); // should still be locked

    service.unlock(); // locks = 0
    expect(doc.body.style.overflow).toBe(''); // should be restored
  });

  it('does not throw or reset below 0 on extra unlocks', () => {
    service.unlock();
    expect(doc.body.style.overflow).toBe('');

    service.lock();
    expect(doc.body.style.overflow).toBe('hidden');
    service.unlock();
    expect(doc.body.style.overflow).toBe('');
    service.unlock();
    expect(doc.body.style.overflow).toBe('');
  });
});

describe('NgxsmkScrollLock with a custom platform adapter', () => {
  let scroller: HTMLElement;
  let service: NgxsmkScrollLock;
  let doc: Document;

  beforeEach(() => {
    scroller = document.createElement('div');
    document.body.appendChild(scroller);

    TestBed.configureTestingModule({
      providers: [
        NgxsmkScrollLock,
        {
          provide: NGXSMK_PLATFORM_ADAPTER,
          useValue: {
            scrollContainer: () => scroller,
            overlayContainer: () => scroller,
          },
        },
      ],
    });
    service = TestBed.inject(NgxsmkScrollLock);
    doc = TestBed.inject(DOCUMENT);
    doc.body.style.overflow = '';
  });

  afterEach(() => scroller.remove());

  it('locks the adapter-provided container instead of the body', () => {
    service.lock();

    expect(scroller.style.overflow).toBe('hidden');
    // The body must be untouched — locking it is the bug this seam fixes.
    expect(doc.body.style.overflow).toBe('');

    service.unlock();
    expect(scroller.style.overflow).toBe('');
  });

  it('restores the element it locked even if the adapter later points elsewhere', () => {
    service.lock();
    const original = scroller;

    // Simulate the shell swapping its scroll container mid-overlay.
    scroller = document.createElement('div');
    document.body.appendChild(scroller);

    service.unlock();

    expect(original.style.overflow).toBe('');
    original.remove();
  });

  it('preserves a pre-existing inline overflow on restore', () => {
    scroller.style.overflow = 'auto';

    service.lock();
    expect(scroller.style.overflow).toBe('hidden');

    service.unlock();
    expect(scroller.style.overflow).toBe('auto');
  });

  it('falls back to the body when the adapter has no scroll container yet', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        NgxsmkScrollLock,
        {
          provide: NGXSMK_PLATFORM_ADAPTER,
          useValue: { scrollContainer: () => null, overlayContainer: () => document.body },
        },
      ],
    });
    const fallback = TestBed.inject(NgxsmkScrollLock);
    const body = TestBed.inject(DOCUMENT).body;
    body.style.overflow = '';

    fallback.lock();
    expect(body.style.overflow).toBe('hidden');
    fallback.unlock();
    expect(body.style.overflow).toBe('');
  });
});
