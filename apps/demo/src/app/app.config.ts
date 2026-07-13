import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideBrowserGlobalErrorListeners(), 
    provideRouter(
      routes, 
      withInMemoryScrolling({ 
        anchorScrolling: 'enabled', 
        scrollPositionRestoration: 'enabled' 
      })
    )
  ],
};
