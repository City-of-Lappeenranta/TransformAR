import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { environment } from '@environments/environment';
import * as sentry from '@sentry/angular-ivy';

if (environment.production) {
  sentry.init({
    dsn: environment.sentryDsn,
    integrations: [
      sentry.browserTracingIntegration(),
      sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    // Performance Monitoring
    tracesSampleRate: 0.1, //  Capture 100% of the transactions
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  });
}

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
