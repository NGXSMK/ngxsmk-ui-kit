/**
 * Safe View Transitions guard.
 *
 * Browsers abort native `document.startViewTransition()` with an `InvalidStateError`
 * ("Transition was aborted because of invalid state. Document hidden") whenever
 * navigation occurs while the tab or window is hidden (e.g. user switched tabs,
 * minimized window, or background tab pre-render).
 *
 * This utility prevents unhandled errors by:
 * 1. Directly executing the DOM update when the document is hidden.
 * 2. Intercepting and gracefully resolving benign 'Document hidden' abort rejections
 *    on the returned ViewTransition object.
 */
const noop = (): void => {
  // no-op fallback for synthetic view transition
};

export function initSafeViewTransitions(): void {
  if (typeof document === 'undefined' || !('startViewTransition' in document)) {
    return;
  }

  const origStartViewTransition = document.startViewTransition.bind(document);

  document.startViewTransition = function (
    updateCallback?: () => Promise<unknown> | void,
  ): ViewTransition {
    // If the document is currently hidden, skip the native transition animation
    // and directly invoke the update callback to prevent browser InvalidStateError.
    if (document.hidden) {
      const updatePromise = Promise.resolve().then(() => updateCallback?.());
      return {
        ready: Promise.resolve(),
        finished: updatePromise,
        updateCallbackDone: updatePromise,
        skipTransition: noop,
        types: new Set<string>(),
      } as unknown as ViewTransition;
    }

    try {
      const transition = origStartViewTransition(updateCallback);

      // Wrap the native transition in a Proxy to swallow benign 'Document hidden'
      // rejections if the user switches tabs while the transition is inflight.
      return new Proxy(transition, {
        get(target, prop, receiver) {
          if (prop === 'ready' || prop === 'finished') {
            const p = Reflect.get(target, prop, receiver) as Promise<unknown>;
            return p.catch((err: unknown) => {
              if (
                err instanceof DOMException &&
                (err.name === 'InvalidStateError' || err.name === 'AbortError') &&
                String(err.message).toLowerCase().includes('hidden')
              ) {
                return;
              }
              return Promise.reject(err);
            });
          }
          return Reflect.get(target, prop, receiver);
        },
      });
    } catch (err) {
      if (
        err instanceof DOMException &&
        (err.name === 'InvalidStateError' || err.name === 'AbortError') &&
        String(err.message).toLowerCase().includes('hidden')
      ) {
        const updatePromise = Promise.resolve().then(() => updateCallback?.());
        return {
          ready: Promise.resolve(),
          finished: updatePromise,
          updateCallbackDone: updatePromise,
          skipTransition: noop,
          types: new Set<string>(),
        } as unknown as ViewTransition;
      }
      throw err;
    }
  };
}
