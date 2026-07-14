import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling, withViewTransitions } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideBrowserGlobalErrorListeners(), 
    provideRouter(
      routes, 
      withViewTransitions(),
      withInMemoryScrolling({ 
        anchorScrolling: 'enabled', 
        scrollPositionRestoration: 'enabled' 
      })
    )
  ],
};
