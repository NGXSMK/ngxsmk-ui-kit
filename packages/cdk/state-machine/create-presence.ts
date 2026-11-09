import { computed, type Signal } from '@angular/core';
import { createMachine } from './create-machine';

export type PresenceState = 'closed' | 'open' | 'closing';

export type PresenceEvent = 'OPEN' | 'CLOSE' | 'CLOSED';

export interface PresenceController {
  readonly state: Signal<PresenceState>;
  readonly mounted: Signal<boolean>;
  readonly isClosing: Signal<boolean>;
  readonly isOpen: Signal<boolean>;
  /** Opens and cancels any in-flight exit. */
  open(): void;
  /**
   * Plays exit, then settles to `closed` only if this close was not superseded.
   * @returns `true` when this generation settled to closed
   */
  close(playExit: () => Promise<void>): Promise<boolean>;
  forceClose(): void;
}

/**
 * Animated presence: `closed → open → closing → closed`.
 * Re-open during exit cancels the pending settle (no phantom close).
 *
 * ```ts
 * const presence = createPresence();
 * presence.open();
 * await presence.close(() => playExit(el, motion));
 * ```
 */
export function createPresence(): PresenceController {
  const machine = createMachine<PresenceState, PresenceEvent>({
    initial: 'closed',
    states: {
      closed: { OPEN: 'open' },
      open: { CLOSE: 'closing', OPEN: 'open' },
      closing: { OPEN: 'open', CLOSE: 'closing', CLOSED: 'closed' },
    },
  });

  let generation = 0;

  const open = (): void => {
    generation += 1;
    machine.send('OPEN');
  };

  const close = async (playExit: () => Promise<void>): Promise<boolean> => {
    if (machine.matches('closed')) {
      return true;
    }
    if (machine.matches('closing')) {
      return false;
    }
    if (!machine.send('CLOSE')) {
      return false;
    }
    const gen = (generation += 1);
    try {
      await playExit();
    } catch {
      /* animation abort */
    }
    if (gen !== generation) {
      return false;
    }
    machine.send('CLOSED');
    return machine.matches('closed');
  };

  const forceClose = (): void => {
    generation += 1;
    if (machine.matches('closed')) {
      return;
    }
    if (machine.matches('open')) {
      machine.send('CLOSE');
    }
    machine.send('CLOSED');
  };

  return {
    state: machine.state,
    mounted: computed(() => machine.matches('open', 'closing')),
    isClosing: computed(() => machine.matches('closing')),
    isOpen: computed(() => machine.matches('open')),
    open,
    close,
    forceClose,
  };
}
