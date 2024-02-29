import { Component, Input } from '@angular/core';
import { NavigationHeaderService } from './navigation-header.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-navigation-header',
  templateUrl: './navigation-header.component.html',
  styleUrls: ['./navigation-header.component.scss'],
})
export class NavigationHeaderComponent {
  @Input({ required: true }) public title: string | undefined;

  public sidebarOpen = false;
  public showSkip = false;

  public constructor(public readonly navigationHeaderService: NavigationHeaderService) {
    this.navigationHeaderService.skip$.pipe(takeUntilDestroyed()).subscribe((showSkip) => (this.showSkip = showSkip));
  }
}
