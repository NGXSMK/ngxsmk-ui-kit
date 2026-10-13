/**
 * Shared smoke-test harness for @ngxsmk entry points.
 *
 * Generated `<entry>/<entry>.smoke.spec.ts` files call `smokeTestEntryPoint()`
 * with everything their `index.ts` exports. For each export the harness asserts:
 *
 * - components: standalone metadata + mounts via `TestBed.createComponent()`
 *   and survives two change-detection passes with no thrown error, no error
 *   routed to `ErrorHandler`, and no `console.error`.
 * - directives / pipes: standalone metadata.
 * - `providedIn: 'root'` services: resolvable from the root injector.
 *
 * Components that cannot exist on their own (required inputs with no value,
 * or a parent-component provider that is missing) are *skipped* with the
 * reason attached, so they show up as skipped in the report instead of as
 * silent passes. Any other failure is a real smoke failure.
 *
 * Regenerate the spec files with `npm run test:smoke:gen`. Delete the smoke
 * spec once a hand-written spec exists for the entry point; the generator
 * does this automatically.
 */
/* eslint-disable @typescript-eslint/no-empty-function -- intentional no-op browser shims */
import { ErrorHandler, type Type } from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

interface AngularDefs {
  ɵcmp?: { standalone?: boolean };
  ɵdir?: { standalone?: boolean };
  ɵpipe?: { standalone?: boolean };
  ɵprov?: { providedIn?: unknown };
}

type Ctor = Type<unknown> & AngularDefs;

const isFn = (v: unknown): v is Ctor => typeof v === 'function';
const isComponent = (v: unknown): v is Ctor => isFn(v) && 'ɵcmp' in v;
const isDirective = (v: unknown): v is Ctor => isFn(v) && 'ɵdir' in v && !('ɵcmp' in v);
const isPipe = (v: unknown): v is Ctor => isFn(v) && 'ɵpipe' in v;
const isInjectable = (v: unknown): v is Ctor =>
  isFn(v) && 'ɵprov' in v && !('ɵcmp' in v) && !('ɵdir' in v) && !('ɵpipe' in v);

const errorText = (e: unknown): string =>
  e instanceof Error ? `${e.name}: ${e.message}` : String(e);

/**
 * Errors that mean "this component needs a host context" rather than
 * "this component is broken": required signal inputs/models without a value
 * (NG0950 / NG0952) and missing providers that a parent component normally
 * supplies (NG0201 / NullInjectorError).
 */
const needsHostContext = (e: unknown): boolean => {
  const text = errorText(e);
  return /NG0950|NG0952|NG0201|NullInjectorError|No provider for/.test(text);
};

/** jsdom lacks a few browser APIs that components can reasonably assume exist. */
function installBrowserShims(): void {
  const g = globalThis as Record<string, unknown>;
  class ObserverShim {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
    takeRecords(): unknown[] {
      return [];
    }
  }
  g['ResizeObserver'] ??= ObserverShim;
  g['IntersectionObserver'] ??= ObserverShim;
  g['MutationObserver'] ??= ObserverShim;

  const win = globalThis as unknown as Window;
  if (typeof win.matchMedia !== 'function') {
    Object.defineProperty(win, 'matchMedia', {
      configurable: true,
      writable: true,
      value: (query: string): MediaQueryList =>
        ({
          matches: false,
          media: query,
          onchange: null,
          addEventListener: () => {},
          removeEventListener: () => {},
          addListener: () => {},
          removeListener: () => {},
          dispatchEvent: () => false,
        }) as unknown as MediaQueryList,
    });
  }

  // jsdom logs "Not implemented" through console.error for these; make them
  // inert instead so a component using them is not flagged as erroring.
  const elProto = globalThis.HTMLElement?.prototype as HTMLElement | undefined;
  if (elProto && typeof elProto.scrollIntoView !== 'function') {
    elProto.scrollIntoView = () => {};
  }
  const canvasProto = globalThis.HTMLCanvasElement?.prototype as HTMLCanvasElement | undefined;
  if (canvasProto) {
    const original = canvasProto.getContext;
    canvasProto.getContext = function (this: HTMLCanvasElement, ...args: unknown[]) {
      try {
        return (original as (...a: unknown[]) => unknown).apply(this, args) as null;
      } catch {
        return null;
      }
    } as typeof canvasProto.getContext;
  }
  const mediaProto = globalThis.HTMLMediaElement?.prototype as HTMLMediaElement | undefined;
  if (mediaProto) {
    mediaProto.play = () => Promise.resolve();
    mediaProto.pause = () => {};
    mediaProto.load = () => {};
  }
}

export interface SmokeOptions {
  /** Export names to skip entirely (e.g. re-exported third-party classes). */
  skip?: string[];
}

/**
 * Register smoke tests for every Angular artefact exported by an entry point.
 *
 * @param entryPoint  Human-readable entry point name, e.g. `'agent-card'`.
 * @param exports     `import * as entry from './index'`.
 */
export function smokeTestEntryPoint(
  entryPoint: string,
  exports: Record<string, unknown>,
  options: SmokeOptions = {},
): void {
  const skip = new Set(options.skip ?? []);
  const entries = Object.entries(exports).filter(([name]) => !skip.has(name));

  const components = entries.filter(([, v]) => isComponent(v)) as [string, Ctor][];
  const directives = entries.filter(([, v]) => isDirective(v)) as [string, Ctor][];
  const pipes = entries.filter(([, v]) => isPipe(v)) as [string, Ctor][];
  const services = entries.filter(([, v]) => isInjectable(v)) as [string, Ctor][];

  describe(`@ngxsmk/core/${entryPoint} (smoke)`, () => {
    beforeAll(() => installBrowserShims());

    let fixture: ComponentFixture<unknown> | undefined;
    afterEach(() => {
      fixture?.destroy();
      fixture = undefined;
      vi.restoreAllMocks();
    });

    it('exports at least one public symbol', () => {
      expect(Object.keys(exports).length).toBeGreaterThan(0);
    });

    for (const [name, cls] of components) {
      it(`${name} is a standalone component`, () => {
        expect(cls.ɵcmp?.standalone ?? true).toBe(true);
      });

      it(`${name} mounts standalone without errors`, (ctx) => {
        const handled: unknown[] = [];
        TestBed.configureTestingModule({
          providers: [
            { provide: ErrorHandler, useValue: { handleError: (e: unknown) => handled.push(e) } },
          ],
        });
        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

        try {
          fixture = TestBed.createComponent(cls);
          fixture.detectChanges();
          fixture.detectChanges();
        } catch (e) {
          if (needsHostContext(e)) {
            ctx.skip(`needs host context — ${errorText(e)}`);
          }
          throw e;
        }

        const contextual = handled.filter(needsHostContext);
        if (contextual.length > 0 && contextual.length === handled.length) {
          ctx.skip(`needs host context — ${errorText(contextual[0])}`);
        }

        expect(handled.map(errorText)).toEqual([]);
        expect(consoleError.mock.calls.map((args) => args.map(errorText).join(' '))).toEqual([]);
      });
    }

    for (const [name, cls] of directives) {
      it(`${name} is a standalone directive`, () => {
        expect(cls.ɵdir?.standalone ?? true).toBe(true);
      });
    }

    for (const [name, cls] of pipes) {
      it(`${name} is a standalone pipe`, () => {
        expect(cls.ɵpipe?.standalone ?? true).toBe(true);
      });
    }

    for (const [name, cls] of services) {
      if (cls.ɵprov?.providedIn !== 'root') continue;
      it(`${name} resolves from the root injector`, () => {
        expect(TestBed.inject(cls)).toBeTruthy();
      });
    }
  });
}
