import { Type, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expectNoA11yViolations } from './a11y';

/**
 * jsdom has no layout engine, so `color-contrast` cannot be computed. Contrast
 * is covered by the theme's own token tests and the visual-regression suite.
 */
export const CONFORMANCE_AXE_OPTIONS = { rules: { 'color-contrast': { enabled: false } } };

/**
 * Outcome of a conformance mount, for assertion by the caller.
 *
 * The caller owns `fixture` and **must** destroy it. A component left mounted
 * keeps its timers, observers, and event listeners alive for the rest of the
 * worker, which shows up later as unrelated tests failing at random.
 */
export interface ConformanceResult {
  /** The live fixture. Destroy it when finished. */
  readonly fixture: ComponentFixture<unknown>;
  /** The mounted host element. */
  readonly element: HTMLElement;
  /** Anything the component wrote to `console.error`/`console.warn` while mounting. */
  readonly consoleErrors: readonly string[];
}

/**
 * Mounts a standalone component in isolation and reports what happened.
 *
 * This is the floor every component should clear: it renders without throwing,
 * emits no console errors, and produces no axe violations. It is deliberately
 * shallow — it proves a component is wired up at all, which is the gap a
 * hand-written suite leaves when a library has hundreds of components. It does
 * not replace behavior tests.
 *
 * Components that require a parent (a tab inside a tab group) or a required
 * input cannot be mounted this way; those are tracked as explicit exclusions
 * rather than silently skipped.
 */
export async function mountForConformance<T>(component: Type<T>): Promise<ConformanceResult> {
  const consoleErrors: string[] = [];
  const originalError = console.error;
  const originalWarn = console.warn;

  console.error = (...args: unknown[]) => {
    consoleErrors.push(args.map(String).join(' '));
  };
  console.warn = (...args: unknown[]) => {
    consoleErrors.push(args.map(String).join(' '));
  };

  try {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    const fixture = TestBed.createComponent(component);
    fixture.detectChanges();
    await fixture.whenStable();
    return { fixture, element: fixture.nativeElement, consoleErrors };
  } finally {
    console.error = originalError;
    console.warn = originalWarn;
  }
}

function assertNoConsoleErrors(consoleErrors: readonly string[]): void {
  if (consoleErrors.length) {
    throw new Error(
      `Component logged ${consoleErrors.length} console error(s) while mounting:\n` +
        consoleErrors.map((e) => `  - ${e}`).join('\n'),
    );
  }
}

/**
 * Mounts and asserts the component rendered without throwing and without
 * logging. Use for components that project content: their accessible name comes
 * from the caller, so an axe audit of the empty state measures nothing useful.
 */
export async function expectMountsCleanly<T>(component: Type<T>): Promise<void> {
  const { fixture, consoleErrors } = await mountForConformance(component);
  try {
    assertNoConsoleErrors(consoleErrors);
  } finally {
    fixture.destroy();
  }
}

/**
 * The full conformance check: mount, assert no console errors, assert no axe
 * violations. Throws with the offending detail on failure.
 */
export async function expectConformance<T>(component: Type<T>): Promise<void> {
  const { fixture, element, consoleErrors } = await mountForConformance(component);
  try {
    assertNoConsoleErrors(consoleErrors);
    await expectNoA11yViolations(element, CONFORMANCE_AXE_OPTIONS);
  } finally {
    // Always tear down, including when an assertion throws — otherwise one
    // failing component leaks its timers into every test that follows.
    fixture.destroy();
  }
}
