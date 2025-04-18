import { Component, inject, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { getCountryCodeFromLanguageCode } from '@shared/utils/i18n-utils';
import { SharedModule } from '@shared/shared.module';
import { GoogleAnalyticsService } from 'ngx-google-analytics';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SharedModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  @ViewChild(RouterOutlet) public outlet: RouterOutlet | undefined;

  public title = 'CitySen';

  private readonly googleAnalyticsService: GoogleAnalyticsService = inject(
    GoogleAnalyticsService,
  );

  public constructor(private readonly translateService: TranslateService) {
    translateService.use(getCountryCodeFromLanguageCode(navigator.language));
  }

  public get navigationHeaderTitle(): string {
    return this.outlet?.activatedRouteData?.['navigationHeaderTitle'];
  }

  public ngOnInit(): void {
    this.gaTracked();
  }

  private gaTracked(): void {
    if (!sessionStorage.getItem('ga-tracked')) {
      this.googleAnalyticsService.pageView(
        window.location.pathname,
        'CitySen.app',
      );

      sessionStorage.setItem('ga-tracked', 'true');
    }
  }
}
