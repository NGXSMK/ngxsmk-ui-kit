import { TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { injectMediaQuery } from './media-query';
import { EnvironmentInjector, createEnvironmentInjector } from '@angular/core';

describe('injectMediaQuery', () => {
  let originalMatchMedia: any;
  let doc: Document;

  beforeEach(() => {
    doc = TestBed.inject(DOCUMENT);
    if (doc.defaultView) {
      originalMatchMedia = doc.defaultView.matchMedia;
    }
  });

  afterEach(() => {
    if (doc.defaultView && originalMatchMedia) {
      doc.defaultView.matchMedia = originalMatchMedia;
    }
  });

  it('reactively tracks media query changes', () => {
    let changeListener: ((e: any) => void) | null = null;
    const mockMediaQueryList = {
      matches: true,
      addEventListener: vi.fn((_event: string, callback: any) => {
        changeListener = callback;
      }),
      removeEventListener: vi.fn(),
    };

    if (doc.defaultView) {
      doc.defaultView.matchMedia = vi.fn().mockReturnValue(mockMediaQueryList);
    }

    TestBed.runInInjectionContext(() => {
      const isMobile = injectMediaQuery('(max-width: 768px)');
      expect(isMobile()).toBe(true);

      // Simulate media query change
      if (changeListener) {
        changeListener({ matches: false } as any);
      }
      expect(isMobile()).toBe(false);
    });
  });

  it('cleans up the listener on destroy', () => {
    const mockMediaQueryList = {
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };

    if (doc.defaultView) {
      doc.defaultView.matchMedia = vi.fn().mockReturnValue(mockMediaQueryList);
    }

    const parentInjector = TestBed.inject(EnvironmentInjector);
    const childInjector = createEnvironmentInjector([], parentInjector);

    childInjector.runInContext(() => {
      injectMediaQuery('(max-width: 768px)');
    });

    childInjector.destroy();

    expect(mockMediaQueryList.removeEventListener).toHaveBeenCalled();
  });
});
