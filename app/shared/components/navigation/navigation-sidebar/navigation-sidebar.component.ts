import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-navigation-sidebar',
  templateUrl: './navigation-sidebar.component.html',
  styleUrls: ['./navigation-sidebar.component.scss'],
})
export class NavigationSidebarComponent {
  @Input({ required: true }) public sidebarOpen!: boolean;
  @Output() public onSidebarClose = new EventEmitter<void>();

  public menuItems: {
    name: string;
    icon: string;
    route: string;
  }[] = [
    {
      name: 'NAVIGATION.SIDEBAR.HOME',
      icon: 'map',
      route: '',
    },
    {
      name: 'NAVIGATION.SIDEBAR.FEEDBACK',
      icon: 'feedback',
      route: 'feedback',
    },
  ];

  public constructor(private readonly translateService: TranslateService) {}
}
