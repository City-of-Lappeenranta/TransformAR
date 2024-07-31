import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

interface MenuItem {
  name: string;
  icon: string;
  route: string;
  isExternal?: boolean;
}

@Component({
  selector: 'app-navigation-sidebar',
  templateUrl: './navigation-sidebar.component.html',
  styleUrls: ['./navigation-sidebar.component.scss'],
})
export class NavigationSidebarComponent {
  @Input({ required: true }) public sidebarOpen!: boolean;
  @Output() public onSidebarClose = new EventEmitter<void>();

  public menuItems: MenuItem[] = [
    {
      name: 'NAVIGATION.SIDEBAR.HOME',
      icon: 'map',
      route: '',
    },
    {
      name: 'NAVIGATION.SIDEBAR.INPUT_MEASUREMENTS',
      icon: 'waterbag-testkit',
      route: 'https://opendata.streetai.net/waterbag-testkit/',
      isExternal: true,
    },
    {
      name: 'NAVIGATION.SIDEBAR.FEEDBACK',
      icon: 'feedback',
      route: 'feedback',
    },
    {
      name: 'NAVIGATION.SIDEBAR.ABOUT',
      icon: 'info',
      route: 'about',
    },
  ];

  public constructor(private readonly translateService: TranslateService) {}
}
