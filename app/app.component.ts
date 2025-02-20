import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { TraceService } from '@sentry/angular-ivy';
import { PrimeNGConfig } from 'primeng/api';
import { SharedModule } from './shared/shared.module';
import { getCountryCodeFromLanguageCode } from '@shared/utils/i18n-utils';
import { GoogleAnalyticsService } from 'ngx-google-analytics';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SharedModule],
  providers: [GoogleAnalyticsService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  @ViewChild(RouterOutlet) public outlet: RouterOutlet | undefined;

  public title = 'CitySen';

  private readonly googleAnalyticsService: GoogleAnalyticsService = inject(
    GoogleAnalyticsService,
  );

  public constructor(
    private readonly traceService: TraceService,
    private readonly primengConfig: PrimeNGConfig,
    private readonly translateService: TranslateService,
  ) {
    translateService.use(getCountryCodeFromLanguageCode(navigator.language));
  }

  public get navigationHeaderTitle(): string {
    return this.outlet?.activatedRouteData?.['navigationHeaderTitle'];
  }

  public ngOnInit(): void {
    this.primengConfig.ripple = true;

    this.gaTracked();
  }

  private gaTracked(): void {
    if (!sessionStorage.getItem('ga-tracked')) {
      this.googleAnalyticsService.pageView(
        window.location.pathname,
        'citizen-webapp',
      );

      sessionStorage.setItem('ga-tracked', 'true');
    }
  }
}
