import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NgxsmkThemeService, ThemeConfig, ThemeMode, DarkModeStrategy, ResolvedTheme } from '@ngxsmk/theme';

export interface ThemeContext {
  theme: ResolvedTheme | null;
  mode: ThemeMode;
  isDark: boolean;
  direction: 'ltr' | 'rtl';
  resolvedTheme: ResolvedTheme | null;
}

export interface ThemeOverride {
  light?: Record<string, string>;
  dark?: Record<string, string>;
}

@Injectable({ providedIn: 'root' })
export class ThemeContextService {
  private readonly document = inject(DOCUMENT);
  private readonly themeService = inject(NgxsmkThemeService);

  private readonly _mode = signal<ThemeMode>('system');
  private readonly _direction = signal<'ltr' | 'rtl'>('ltr');
  private readonly _customOverrides = signal<ThemeOverride>({});
  private readonly _resolvedTheme = signal<ResolvedTheme | null>(null);

  readonly mode = this._mode.asReadonly();
  readonly direction = this._direction.asReadonly();
  readonly customOverrides = this._customOverrides.asReadonly();
  readonly resolvedTheme = this._resolvedTheme.asReadonly();

  readonly isDark = computed(() => {
    const mode = this._mode();
    if (mode === 'dark') return true;
    if (mode === 'light') return false;
    return this.themeService.isDark();
  });

  readonly isRTL = computed(() => this._direction() === 'rtl');

  readonly resolvedDir = computed(() => this._direction());

  constructor() {
    effect(() => {
      const dir = this._direction();
      this.document.documentElement.dir = dir;
      this.document.documentElement.lang = dir === 'rtl' ? 'ar' : 'en';
    });

    effect(() => {
      const dark = this.isDark();
      this.document.documentElement.classList.toggle('dark', dark);
    });

    this.loadPersistedPreferences();
  }

  private loadPersistedPreferences(): void {
    try {
      const storedMode = this.document.defaultView?.localStorage?.getItem('ngxsmk-theme-mode');
      if (storedMode === 'light' || storedMode === 'dark' || storedMode === 'system') {
        this._mode.set(storedMode);
      }

      const storedDir = this.document.defaultView?.localStorage?.getItem('ngxsmk-direction');
      if (storedDir === 'ltr' || storedDir === 'rtl') {
        this._direction.set(storedDir);
      }
    } catch {
      // Ignore storage errors
    }
  }

  setMode(mode: ThemeMode): void {
    this._mode.set(mode);
    this.themeService.setMode(mode);
    try {
      this.document.defaultView?.localStorage?.setItem('ngxsmk-theme-mode', mode);
    } catch {}
  }

  toggleMode(): void {
    const modes: ThemeMode[] = ['light', 'dark', 'system'];
    const current = this._mode();
    const next = modes[(modes.indexOf(current) + 1) % modes.length];
    this.setMode(next);
  }

  setDirection(dir: 'ltr' | 'rtl'): void {
    this._direction.set(dir);
    try {
      this.document.defaultView?.localStorage?.setItem('ngxsmk-direction', dir);
    } catch {}
  }

  toggleDirection(): void {
    this.setDirection(this._direction() === 'ltr' ? 'rtl' : 'ltr');
  }

  applyTheme(config: ThemeConfig): void {
    this.themeService.applyTheme(config);
  }

  clearTheme(): void {
    this.themeService.clearTheme();
  }

  setCustomOverrides(overrides: ThemeOverride): void {
    this._customOverrides.set(overrides);
    this.applyOverrides();
  }

  private applyOverrides(): void {
    const overrides = this._customOverrides();
    const isDark = this.isDark();
    const relevant = isDark ? overrides.dark : overrides.light;
    if (!relevant) return;

    const style = this.document.getElementById('ngxsmk-custom-overrides') as HTMLStyleElement | null;
    const css = Object.entries(relevant)
      .map(([prop, value]) => `${prop}: ${value};`)
      .join('\n');

    if (style) {
      style.textContent = `:root { ${css} }`;
    } else {
      const newStyle = this.document.createElement('style');
      newStyle.id = 'ngxsmk-custom-overrides';
      newStyle.textContent = `:root { ${css} }`;
      this.document.head.appendChild(newStyle);
    }
  }

  getThemeContext(): ThemeContext {
    return {
      theme: this._resolvedTheme(),
      mode: this._mode(),
      isDark: this.isDark(),
      direction: this._direction(),
      resolvedTheme: this._resolvedTheme(),
    };
  }

  updateResolvedTheme(theme: ResolvedTheme): void {
    this._resolvedTheme.set(theme);
  }
}

@Injectable({ providedIn: 'root' })
export class ThemeDirectionService {
  private readonly document = inject(DOCUMENT);
  private readonly direction = signal<'ltr' | 'rtl'>('ltr');

  readonly currentDirection = this.direction.asReadonly();
  readonly isRTL = computed(() => this.direction() === 'rtl');

  constructor() {
    effect(() => {
      const dir = this.direction();
      this.document.documentElement.dir = dir;
      this.document.documentElement.lang = dir === 'rtl' ? 'ar' : 'en';
    });
  }

  setDirection(dir: 'ltr' | 'rtl'): void {
    this.direction.set(dir);
    try {
      this.document.defaultView?.localStorage?.setItem('ngxsmk-direction', dir);
    } catch {}
  }

  toggle(): void {
    this.setDirection(this.direction() === 'ltr' ? 'rtl' : 'ltr');
  }
}