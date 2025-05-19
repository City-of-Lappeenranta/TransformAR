import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { environment } from '@environments/environment';
import * as sentry from '@sentry/angular';

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
    tracesSampleRate: 0.1,
    // Session Replay
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
