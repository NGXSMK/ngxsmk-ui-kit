import { signal, type Signal } from '@angular/core';

/** Transition table: from each state, which events lead where. */
export type MachineTransitions<S extends string, E extends string> = Partial<
  Record<S, Partial<Record<E, S>>>
>;

export interface CreateMachineConfig<S extends string, E extends string> {
  readonly initial: S;
  readonly states: MachineTransitions<S, E>;
}

export interface Machine<S extends string, E extends string> {
  readonly state: Signal<S>;
  send(event: E): boolean;
  matches(...states: S[]): boolean;
  can(event: E): boolean;
  snapshot(): S;
}

/**
 * Signal-backed finite state machine for mutually exclusive UI lifecycles.
 * Prefer over parallel booleans. For animated overlays, use {@link createPresence}.
 *
 * ```ts
 * const m = createMachine({
 *   initial: 'idle',
 *   states: {
 *     idle: { START: 'loading' },
 *     loading: { SUCCESS: 'success', FAIL: 'error' },
 *     success: { RESET: 'idle' },
 *     error: { RESET: 'idle' },
 *   },
 * });
 * m.send('START');
 * ```
 */
export function createMachine<S extends string, E extends string>(
  config: CreateMachineConfig<S, E>,
): Machine<S, E> {
  const current = signal(config.initial);

  const send = (event: E): boolean => {
    const from = current();
    const next = config.states[from]?.[event];
    if (next === undefined) {
      return false;
    }
    current.set(next);
    return true;
  };

  return {
    state: current.asReadonly(),
    send,
    matches: (...states: S[]) => states.includes(current()),
    can: (event: E) => config.states[current()]?.[event] !== undefined,
    snapshot: () => current(),
  };
}

/** Shared async UI status — prefer over parallel isLoading/isError flags. */
export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

/** Shared AI / tool-run status. */
export type AiRunStatus = 'pending' | 'running' | 'completed' | 'error' | 'cancelled';
