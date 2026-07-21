import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { buildThemeCss } from './css';
import { resolveTheme } from './define-config';
import { TokenOutputAdapter, ionicVarsAdapter } from './token-adapter';
import { ThemeConfig } from './types';

const STYLE_ID = 'ngxsmk-theme';
const IONIC_STYLE_ID = 'ngxsmk-ionic-theme';

/**
 * Injects generated theme CSS into the document at runtime.
 *
 * Decoupled from dark-mode switching so consumers who only need
 * token injection (e.g. the CLI theme-preview) don't pull in
 * class-toggle / localStorage / matchMedia logic.
 *
 * SSR-safe: all DOM access goes through the injected document.
 */
@Injectable({ providedIn: 'root' })
export class NgxThemeInjectorService {
  private readonly document = inject(DOCUMENT);

  /**
   * Apply a theme at runtime. Generates token CSS from the config and swaps
   * it into a dedicated `<style>` element, overriding the build-time theme.
   *
   * @param adapter Optional output adapter. Defaults to the standard NGXSMK
   *   `--ngxsmk-*` CSS variables. Pass `ionicVarsAdapter` to also generate
   *   `--ion-*` variables for Ionic components.
   */
  applyTheme(config: ThemeConfig, adapter?: TokenOutputAdapter): void {
    const head = this.document.head;
    let style = this.document.getElementById(STYLE_ID) as HTMLStyleElement | null;
    if (!style) {
      style = this.document.createElement('style');
      style.id = STYLE_ID;
      head.appendChild(style);
    }

    let css = buildThemeCss(config);

    if (adapter) {
      const resolved = resolveTheme(config);
      const platformVars = adapter.vars(resolved);
      css += '\n' + this.buildAdapterCss(adapter.name, platformVars);
    }

    style.textContent = css;
  }

  /**
   * Apply Ionic-specific token variables alongside the standard NGXSMK theme.
   * Generates `--ion-*` variables derived from the same `ThemeConfig`.
   */
  applyIonicTheme(config: ThemeConfig): void {
    const head = this.document.head;
    let style = this.document.getElementById(IONIC_STYLE_ID) as HTMLStyleElement | null;
    if (!style) {
      style = this.document.createElement('style');
      style.id = IONIC_STYLE_ID;
      head.appendChild(style);
    }

    const resolved = resolveTheme(config);
    const vars = ionicVarsAdapter.vars(resolved);
    style.textContent = this.buildAdapterCss('ionic', vars);
  }

  /** Remove a runtime-applied theme, falling back to the build-time CSS. */
  clearTheme(): void {
    this.document.getElementById(STYLE_ID)?.remove();
  }

  /** Remove the Ionic adapter stylesheet. */
  clearIonicTheme(): void {
    this.document.getElementById(IONIC_STYLE_ID)?.remove();
  }

  private buildAdapterCss(adapterName: string, vars: Record<string, string>): string {
    const lines = Object.entries(vars).map(([k, v]) => `  ${k}: ${v};`);
    return `/* @ngxsmk/theme — ${adapterName} adapter */\n:root {\n${lines.join('\n')}\n}`;
  }
}
