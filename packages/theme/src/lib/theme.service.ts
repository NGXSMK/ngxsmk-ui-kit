import { DOCUMENT } from '@angular/common';
import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { NgxThemeInjectorService } from './theme-injector.service';
import { TokenOutputAdapter } from './token-adapter';
import { ThemeConfig } from './types';

export type ThemeMode = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'ngxsmk-theme-mode';

/**
 * Runtime theme control: dark-mode switching (class strategy) and dynamic
 * theme application by injecting generated token CSS into the document.
 *
 * CSS injection is delegated to {@link NgxThemeInjectorService} for
 * consumers who only need token injection without dark-mode logic.
 *
 * SSR-safe: all DOM access goes through the injected document and degrades
 * gracefully when `window`/`matchMedia` are unavailable.
 */
@Injectable({ providedIn: 'root' })
export class NgxsmkThemeService {
  private readonly document: Document;
  private readonly injector = inject(NgxThemeInjectorService);

  /** User preference: explicit light/dark or follow the OS. */
  readonly mode: ReturnType<typeof signal<ThemeMode>>;

  private readonly systemDark: ReturnType<typeof signal<boolean>>;

  /** Effective darkness after resolving `system` against the OS setting. */
  readonly isDark: ReturnType<typeof computed<boolean>>;

  constructor() {
    this.document = inject(DOCUMENT);

    this.mode = signal<ThemeMode>(this.restoreMode());
    this.systemDark = signal(this.matchSystemDark());
    this.isDark = computed(() =>
      this.mode() === 'system' ? this.systemDark() : this.mode() === 'dark',
    );

    const media = this.document.defaultView?.matchMedia?.('(prefers-color-scheme: dark)');
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

  /** @see NgxThemeInjectorService.applyTheme */
  applyTheme(config: ThemeConfig, adapter?: TokenOutputAdapter): void {
    this.injector.applyTheme(config, adapter);
  }

  /** @see NgxThemeInjectorService.applyIonicTheme */
  applyIonicTheme(config: ThemeConfig): void {
    this.injector.applyIonicTheme(config);
  }

  /** @see NgxThemeInjectorService.clearTheme */
  clearTheme(): void {
    this.injector.clearTheme();
  }

  /** @see NgxThemeInjectorService.clearIonicTheme */
  clearIonicTheme(): void {
    this.injector.clearIonicTheme();
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
    return this.document.defaultView?.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  }
}
