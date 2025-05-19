import { Component, Input } from '@angular/core';
import { NavigationHeaderService } from './navigation-header.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationSidebarComponent } from '@shared/components/navigation/navigation-sidebar/navigation-sidebar.component';
import { IconComponent } from '@shared/components/icon/icon.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-navigation-header',
  templateUrl: './navigation-header.component.html',
  styleUrls: ['./navigation-header.component.scss'],
  imports: [NavigationSidebarComponent, IconComponent, TranslatePipe],
  standalone: true,
})
export class NavigationHeaderComponent {
  @Input({ required: true }) public title!: string;

  public sidebarOpen = false;
  public showSkip = false;

  public constructor(
    public readonly navigationHeaderService: NavigationHeaderService,
  ) {
    this.navigationHeaderService.skip$
      .pipe(takeUntilDestroyed())
      .subscribe((showSkip) => (this.showSkip = showSkip));
  }
}
