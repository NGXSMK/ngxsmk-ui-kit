import {
  ENVIRONMENT_INITIALIZER,
  EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
} from '@angular/core';
import { NgxsmkThemeService } from './theme.service';
import { violetPreset } from './presets';
import { ThemeConfig } from './types';

/**
 * Standalone provider for Angular 18-22+ applications that automatically
 * synchronizes NGXSMK design tokens with Ionic 7/8 CSS variables on startup.
 *
 * @example
 * ```ts
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideIonicAngular(),
 *     provideNgxsmkIonicTheme(),
 *   ]
 * };
 * ```
 */
export function provideNgxsmkIonicTheme(config?: ThemeConfig): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useValue: () => {
        const theme = inject(NgxsmkThemeService);
        theme.applyIonicTheme(config ?? violetPreset);
      },
    },
  ]);
}
