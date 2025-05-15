import { provideHttpClient } from '@angular/common/http';
import {
  ApplicationConfig,
  ErrorHandler,
  importProvidersFrom,
  isDevMode,
} from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, Router } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import * as sentry from '@sentry/angular';
import { routes } from './app.routes';
import { providei18n } from './providers/i18n';
import {
  NgxGoogleAnalyticsModule,
  NgxGoogleAnalyticsRouterModule,
} from 'ngx-google-analytics';
import { environment } from '@environments/environment';
import { providePrimeNG } from 'primeng/config';

// eslint-disable-next-line @typescript-eslint/naming-convention
import Aura from '@primeng/themes/aura';

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
    importProvidersFrom([
      NgxGoogleAnalyticsModule.forRoot(environment.trackingCode),
      NgxGoogleAnalyticsRouterModule,
    ]),
    providePrimeNG({
      theme: {
        preset: Aura,
      },
      ripple: true,
    }),
  ],
};
