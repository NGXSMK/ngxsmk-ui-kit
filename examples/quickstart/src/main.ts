import { bootstrapApplication } from '@angular/platform-browser';
import { provideZonelessChangeDetection } from '@angular/core';
import { App } from './app/app';

bootstrapApplication(App, {
  // No zone.js — NGXSMK components are signals-native.
  providers: [provideZonelessChangeDetection()],
}).catch((err) => console.error(err));
