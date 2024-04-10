import { provideHttpClient } from '@angular/common/http';
import { APP_INITIALIZER, ApplicationConfig, ErrorHandler, isDevMode } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { Router, provideRouter } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { providei18n } from './providers/i18n';
import { routes } from './app.routes';
import * as sentry from '@sentry/angular-ivy';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    providei18n(),
    provideAnimations(),
    provideRouter(routes),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    {
      provide: ErrorHandler,
      useValue: sentry.createErrorHandler({
        showDialog: false,
      }),
    },
    {
      provide: sentry.TraceService,
      deps: [Router],
    },
  ],
};
