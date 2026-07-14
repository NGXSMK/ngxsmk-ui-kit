import { DOCUMENT } from '@angular/common';
import {
  Injectable,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { buildThemeCss } from './css';
import { ThemeConfig } from './types';

export type ThemeMode = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'ngxsmk-theme-mode';
const STYLE_ID = 'ngxsmk-theme';

/**
 * Runtime theme control: dark-mode switching (class strategy) and dynamic
 * theme application by injecting generated token CSS into the document.
 *
 * SSR-safe: all DOM access goes through the injected document and degrades
 * gracefully when `window`/`matchMedia` are unavailable.
 */
@Injectable({ providedIn: 'root' })
export class NgxsmkThemeService {
  private readonly document = inject(DOCUMENT);

  /** User preference: explicit light/dark or follow the OS. */
  readonly mode = signal<ThemeMode>(this.restoreMode());

  private readonly systemDark = signal(this.matchSystemDark());

  /** Effective darkness after resolving `system` against the OS setting. */
  readonly isDark = computed(() =>
    this.mode() === 'system' ? this.systemDark() : this.mode() === 'dark',
  );

  constructor() {
    const media = this.document.defaultView?.matchMedia?.(
      '(prefers-color-scheme: dark)',
    );
    media?.addEventListener('change', (e) => this.systemDark.set(e.matches));

    effect(() => {
      this.document.documentElement.classList.toggle('dark', this.isDark());
    });
  }

  setMode(mode: ThemeMode): void {
    this.mode.set(mode);
    try {
      this.document.defaultView?.localStorage?.setItem(STORAGE_KEY, mode);
    } catch {
      // Storage unavailable (SSR, privacy mode) — preference is session-only.
    }
  }

  toggle(): void {
    this.setMode(this.isDark() ? 'light' : 'dark');
  }

  /**
   * Apply a theme at runtime. Generates token CSS from the config and swaps
   * it into a dedicated `<style>` element, overriding the build-time theme.
   */
  applyTheme(config: ThemeConfig): void {
    const head = this.document.head;
    let style = this.document.getElementById(STYLE_ID) as HTMLStyleElement | null;
    if (!style) {
      style = this.document.createElement('style');
      style.id = STYLE_ID;
      head.appendChild(style);
    }
    style.textContent = buildThemeCss(config);
  }

  /** Remove a runtime-applied theme, falling back to the build-time CSS. */
  clearTheme(): void {
    this.document.getElementById(STYLE_ID)?.remove();
  }

  private restoreMode(): ThemeMode {
    try {
      const stored = this.document.defaultView?.localStorage?.getItem(STORAGE_KEY);
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        return stored;
      }
    } catch {
      // Fall through to default.
    }
    return 'system';
  }

  private matchSystemDark(): boolean {
    return (
      this.document.defaultView?.matchMedia?.('(prefers-color-scheme: dark)')
        .matches ?? false
    );
  }
}
