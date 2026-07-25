import { DOCUMENT } from '@angular/common';
import {
  ENVIRONMENT_INITIALIZER,
  EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
} from '@angular/core';
import { NGXSMK_PLATFORM_ADAPTER } from '@ngxsmk/cdk/platform';
import { NGXSMK_BUTTON_RENDERER_CLASS, IonicButtonRenderer } from '@ngxsmk/core/button';
import { NgxsmkIonicPlatformAdapter } from './ionic-platform';

const SAFE_AREA_STYLE_ID = 'ngxsmk-ionic-safe-area';

/**
 * Bridges NGXSMK's safe-area tokens onto Ionic's.
 *
 * The tokens already read `env(safe-area-inset-*)` directly, which is correct
 * in a browser. Inside a Capacitor/Cordova WebView the platform frequently
 * reports nothing through `env()` while Ionic publishes real numbers on
 * `--ion-safe-area-*`, so prefer Ionic's value and keep `env()` as the
 * fallback.
 */
const SAFE_AREA_BRIDGE = `:root {
  --ngxsmk-safe-area-top: var(--ion-safe-area-top, env(safe-area-inset-top, 0px));
  --ngxsmk-safe-area-right: var(--ion-safe-area-right, env(safe-area-inset-right, 0px));
  --ngxsmk-safe-area-bottom: var(--ion-safe-area-bottom, env(safe-area-inset-bottom, 0px));
  --ngxsmk-safe-area-left: var(--ion-safe-area-left, env(safe-area-inset-left, 0px));
}`;

/**
 * Configures NGXSMK to run correctly inside an Ionic app.
 *
 * Wires three things:
 *  - the {@link NgxsmkIonicPlatformAdapter}, so overlays lock `ion-content`'s
 *    scroller and attach inside `ion-app` rather than the body;
 *  - {@link IonicButtonRenderer}, so button loading states render an
 *    `<ion-spinner>` in the platform's own style;
 *  - the safe-area bridge, so edge-anchored components honor the insets Ionic
 *    reports on devices where `env()` alone comes back empty.
 *
 * ```ts
 * bootstrapApplication(AppComponent, {
 *   providers: [provideIonicAngular(), provideNgxsmkIonic()],
 * });
 * ```
 *
 * Color theming is separate and opt-in — call
 * `NgxThemeInjectorService.applyIonicTheme(config)` to drive Ionic's `--ion-*`
 * variables from the same NGXSMK theme.
 */
export function provideNgxsmkIonic(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: NGXSMK_PLATFORM_ADAPTER, useExisting: NgxsmkIonicPlatformAdapter },
    { provide: NGXSMK_BUTTON_RENDERER_CLASS, useValue: IonicButtonRenderer },
    {
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useValue: () => {
        const document = inject(DOCUMENT);
        if (document.getElementById(SAFE_AREA_STYLE_ID)) {
          return;
        }
        const style = document.createElement('style');
        style.id = SAFE_AREA_STYLE_ID;
        style.textContent = SAFE_AREA_BRIDGE;
        document.head.appendChild(style);
      },
    },
  ]);
}
