/* eslint-disable @typescript-eslint/no-empty-function --
 * Every method below is deliberately inert: these stubs exist to let a
 * component construct and tear down an observer, not to simulate one. A body
 * that did anything would make mount tests depend on fake observer timing.
 */

/**
 * jsdom implements neither observer API nor `matchMedia`, so any component that
 * uses them throws on mount and cannot be tested at all. These are minimal
 * inert stubs: they satisfy construction and teardown without firing
 * callbacks, which is what a mount-level test needs. Tests that assert on
 * observer *behavior* should install their own controllable fake.
 *
 * Only installed when absent, so a real browser runner is left untouched.
 */

class InertObserver {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
  takeRecords(): unknown[] {
    return [];
  }
}

const globalRef = globalThis as unknown as Record<string, unknown>;

if (!globalRef['IntersectionObserver']) {
  globalRef['IntersectionObserver'] = class extends InertObserver {
    readonly root = null;
    readonly rootMargin = '0px';
    readonly thresholds: readonly number[] = [0];
  };
}

if (!globalRef['ResizeObserver']) {
  globalRef['ResizeObserver'] = InertObserver;
}

if (typeof window !== 'undefined' && typeof window.matchMedia !== 'function') {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    // Deprecated pair, still used by some libraries.
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as typeof window.matchMedia;
}
