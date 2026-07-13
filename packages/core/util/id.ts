let nextId = 0;

/** Workspace-unique DOM id with the given prefix, e.g. `ngxsmk-input-3`. */
export function ngxsmkUniqueId(prefix: string): string {
  return `${prefix}-${nextId++}`;
}
