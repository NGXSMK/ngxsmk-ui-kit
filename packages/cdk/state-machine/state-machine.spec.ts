import { describe, expect, it, vi } from 'vitest';
import { createMachine } from './create-machine';
import { createPresence } from './create-presence';

describe('createMachine', () => {
  it('starts at the initial state and accepts defined transitions', () => {
    const m = createMachine({
      initial: 'idle',
      states: {
        idle: { START: 'loading' },
        loading: { SUCCESS: 'success', FAIL: 'error' },
        success: { RESET: 'idle' },
        error: { RESET: 'idle' },
      },
    });

    expect(m.snapshot()).toBe('idle');
    expect(m.can('START')).toBe(true);
    expect(m.send('START')).toBe(true);
    expect(m.matches('loading')).toBe(true);
    expect(m.send('SUCCESS')).toBe(true);
    expect(m.state()).toBe('success');
  });

  it('rejects undefined transitions without changing state', () => {
    const m = createMachine({
      initial: 'idle',
      states: {
        idle: { START: 'loading' },
        loading: { DONE: 'idle' },
      },
    });

    expect(m.send('DONE')).toBe(false);
    expect(m.snapshot()).toBe('idle');
    expect(m.can('DONE')).toBe(false);
  });
});

describe('createPresence', () => {
  it('opens and closes through closing', async () => {
    const presence = createPresence();
    expect(presence.state()).toBe('closed');

    presence.open();
    expect(presence.isOpen()).toBe(true);
    expect(presence.mounted()).toBe(true);

    const playExit = vi.fn(async () => undefined);
    const settled = await presence.close(playExit);
    expect(playExit).toHaveBeenCalledOnce();
    expect(settled).toBe(true);
    expect(presence.state()).toBe('closed');
    expect(presence.mounted()).toBe(false);
  });

  it('cancels an in-flight exit when re-opened', async () => {
    const presence = createPresence();
    presence.open();

    let resolveExit!: () => void;
    const exitPromise = new Promise<void>((resolve) => {
      resolveExit = resolve;
    });

    const closePromise = presence.close(() => exitPromise);
    expect(presence.isClosing()).toBe(true);

    presence.open();
    expect(presence.isOpen()).toBe(true);
    expect(presence.isClosing()).toBe(false);

    resolveExit();
    const settled = await closePromise;
    expect(settled).toBe(false);
    expect(presence.state()).toBe('open');
  });

  it('forceClose cancels exit and lands on closed', async () => {
    const presence = createPresence();
    presence.open();

    let resolveExit!: () => void;
    const exitPromise = new Promise<void>((resolve) => {
      resolveExit = resolve;
    });
    const closePromise = presence.close(() => exitPromise);

    presence.forceClose();
    expect(presence.state()).toBe('closed');

    resolveExit();
    expect(await closePromise).toBe(false);
    expect(presence.state()).toBe('closed');
  });

  it('ignores duplicate close while already closing', async () => {
    const presence = createPresence();
    presence.open();

    let resolveExit!: () => void;
    const exitPromise = new Promise<void>((resolve) => {
      resolveExit = resolve;
    });
    const first = presence.close(() => exitPromise);
    const second = await presence.close(async () => undefined);

    expect(second).toBe(false);
    resolveExit();
    expect(await first).toBe(true);
    expect(presence.state()).toBe('closed');
  });

  it('survives rapid open/close/open races without phantom closed', async () => {
    const presence = createPresence();
    const exits: Array<() => void> = [];

    presence.open();
    const close1 = presence.close(
      () =>
        new Promise<void>((resolve) => {
          exits.push(resolve);
        }),
    );

    presence.open();
    const close2 = presence.close(
      () =>
        new Promise<void>((resolve) => {
          exits.push(resolve);
        }),
    );

    presence.open();
    expect(presence.isOpen()).toBe(true);
    expect(presence.mounted()).toBe(true);

    // Resolve every pending exit; only the latest generation may settle.
    for (const resolve of exits) resolve();
    expect(await close1).toBe(false);
    expect(await close2).toBe(false);
    expect(presence.state()).toBe('open');

    const settled = await presence.close(async () => undefined);
    expect(settled).toBe(true);
    expect(presence.state()).toBe('closed');
  });
});
