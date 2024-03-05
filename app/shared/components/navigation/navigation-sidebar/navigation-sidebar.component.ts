import { Component, EventEmitter, Input, Output } from '@angular/core';

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
      name: 'Home',
      icon: 'map',
      route: '',
    },
    {
      name: 'Give feedback',
      icon: 'feedback',
      route: 'feedback',
    },
    // {
    //   name: 'Climate change',
    //   icon: 'climate-change',
    //   route: '',
    // },
    // {
    //   name: 'Citizen measurements',
    //   icon: 'bell',
    //   route: '',
    // },
    // {
    //   name: 'Notifications',
    //   icon: 'bell',
    //   route: '',
    // },
  ];
}
