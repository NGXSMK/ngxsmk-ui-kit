import { Injectable } from '@angular/core';

let nextId = 0;

/**
 * Resets the global ID counter. Useful in SSR request hooks or unit test teardown
 * to ensure deterministic, hydration-stable IDs across SSR request boundaries.
 */
export function resetNgxsmkUniqueId(start = 0): void {
  nextId = start;
}

/** Workspace-unique DOM id with the given prefix, e.g. `ngxsmk-input-3`. */
export function ngxsmkUniqueId(prefix: string): string {
  return `${prefix}-${nextId++}`;
}

/**
 * Injectable service for generating scoped, deterministic unique element IDs.
 */
@Injectable({
  providedIn: 'root',
})
export class NgxsmkIdGenerator {
  private idCounter = 0;

  nextId(prefix = 'ngxsmk'): string {
    return `${prefix}-${this.idCounter++}`;
  }

  reset(start = 0): void {
    this.idCounter = start;
  }
}
