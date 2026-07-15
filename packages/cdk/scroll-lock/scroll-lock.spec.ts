import { TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';
import { describe, expect, it, beforeEach } from 'vitest';
import { NgxsmkScrollLock } from './scroll-lock';

describe('NgxsmkScrollLock', () => {
  let service: NgxsmkScrollLock;
  let doc: Document;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NgxsmkScrollLock]
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
