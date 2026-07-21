import { ElementRef, signal } from '@angular/core';

/**
 * Configuration for listbox keyboard navigation.
 *
 * @property optionSelector - CSS selector for option elements
 * @property options - Function returning the current option list
 * @property host - Optional host element for scroll queries (defaults to inject(ElementRef))
 * @property placeholderIndex - Index for the placeholder item (-1 if none)
 * @property skipDisabled - Whether to skip disabled options during navigation
 */
export interface ListboxKeyboardConfig {
  optionSelector: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options: () => any[];
  host?: ElementRef<HTMLElement>;
  placeholderIndex?: number;
  skipDisabled?: boolean;
}

/**
 * Shared arrow-key navigation for dropdown listboxes.
 *
 * Encapsulates `activeIndex`, `move(delta)`, `scrollActiveIntoView()`, and the
 * full `onKeydown()` handler. Components provide only their option list and
 * CSS selector.
 *
 * ```ts
 * private readonly kb = new ListboxKeyboard({
 *   optionSelector: '.ngxsmk-combobox__option',
 *   options: () => this.filtered(),
 *   host: this.host,
 * });
 * ```
 */
export class ListboxKeyboard {
  readonly activeIndex = signal(-1);

  private readonly config: ListboxKeyboardConfig;

  constructor(config: ListboxKeyboardConfig) {
    this.config = config;
  }

  /** Override the host element used for scroll queries (e.g. for portals). */
  setHost(host: ElementRef<HTMLElement>): void {
    this.config.host = host;
  }

  /** Move the active index by `delta` positions, wrapping around. */
  move(delta: number): void {
    const opts = this.config.options();
    if (!opts.length) return;

    let next = this.activeIndex() + delta;
    const min = this.config.placeholderIndex ?? 0;

    for (let guard = 0; guard <= opts.length; guard++) {
      if (next < min) {
        next = opts.length - 1;
      } else if (next > opts.length - 1) {
        next = min;
      }
      if (!this.config.skipDisabled || next === min || !opts[next]?.disabled) {
        break;
      }
      next += delta;
    }

    this.activeIndex.set(next);
    this.scrollActiveIntoView();
  }

  /** Scroll the active option into view within the host element. */
  scrollActiveIntoView(): void {
    requestAnimationFrame(() => {
      const host = this.config.host?.nativeElement;
      if (!host) return;
      const items = host.querySelectorAll<HTMLElement>(this.config.optionSelector);
      let idx = this.activeIndex();
      // Offset by 1 if there's a placeholder before the options
      if (this.config.placeholderIndex !== undefined && idx >= 0) {
        idx += 1;
      }
      items[idx]?.scrollIntoView({ block: 'nearest' });
    });
  }

  /** Jump to the first enabled option. */
  home(): void {
    const opts = this.config.options();
    if (!opts.length) return;
    const min = this.config.placeholderIndex ?? 0;
    if (this.config.skipDisabled) {
      const first = opts.findIndex((o) => !o.disabled);
      this.activeIndex.set(first >= 0 ? first : min);
    } else {
      this.activeIndex.set(min);
    }
    this.scrollActiveIntoView();
  }

  /** Jump to the last option. */
  end(): void {
    const opts = this.config.options();
    if (!opts.length) return;
    this.activeIndex.set(opts.length - 1);
    this.scrollActiveIntoView();
  }

  /**
   * Handle a keyboard event for listbox navigation.
   *
   * @returns `true` if the event was handled, `false` if the caller should
   *   handle it (e.g. for typeahead or open/close toggling).
   */
  handleKeydown(
    event: KeyboardEvent,
    callbacks: {
      onSelect?: (index: number) => void;
      onOpen?: () => void;
      onClose?: () => void;
      isOpen?: () => boolean;
    } = {},
  ): boolean {
    const opts = this.config.options();
    const isOpen = callbacks.isOpen?.() ?? true;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!isOpen) {
          callbacks.onOpen?.();
        } else {
          this.move(1);
        }
        return true;

      case 'ArrowUp':
        event.preventDefault();
        if (isOpen) {
          this.move(-1);
        }
        return true;

      case 'Home':
        if (isOpen && opts.length) {
          event.preventDefault();
          this.home();
        }
        return true;

      case 'End':
        if (isOpen && opts.length) {
          event.preventDefault();
          this.end();
        }
        return true;

      case 'Enter':
      case ' ':
      case 'Spacebar':
        if (isOpen) {
          event.preventDefault();
          const idx = this.activeIndex();
          if (idx >= 0 && opts[idx]) {
            callbacks.onSelect?.(idx);
          }
        }
        return true;

      case 'Escape':
        if (isOpen) {
          event.preventDefault();
          callbacks.onClose?.();
        }
        return true;

      default:
        return false;
    }
  }
}
