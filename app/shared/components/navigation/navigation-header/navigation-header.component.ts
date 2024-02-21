import { Component, Input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationHeaderAction } from './navigation-header-action.interface';
import { NavigationHeaderService } from './navigation-header.service';

@Component({
  selector: 'app-navigation-header',
  templateUrl: './navigation-header.component.html',
  styleUrls: ['./navigation-header.component.scss'],
})
export class NavigationHeaderComponent {
  @Input({ required: true }) public title: string | undefined;

  public sidebarOpen = false;
  public action: NavigationHeaderAction | null | undefined;

  public constructor(private readonly navigationHeaderService: NavigationHeaderService) {
    this.navigationHeaderService.action$.pipe(takeUntilDestroyed()).subscribe((action: NavigationHeaderAction | null) => {
      this.action = action;
    });
  }

  public onActionClick(): void {
    this.navigationHeaderService.actionClick();
  }
}
