import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Sidebar } from 'primeng/sidebar';
import { IconComponent } from '@shared/components/icon/icon.component';
import { TranslatePipe } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import {PrimeTemplate} from 'primeng/api';
import {Drawer} from 'primeng/drawer';

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
  standalone: true,
  imports: [
    Sidebar,
    IconComponent,
    TranslatePipe,
    RouterLink,
    PrimeTemplate,
    Drawer,
  ],
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
      route: 'https://opendata.streetai.net/observation/water/',
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
}
