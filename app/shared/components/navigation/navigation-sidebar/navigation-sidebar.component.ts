import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-navigation-sidebar',
  templateUrl: './navigation-sidebar.component.html',
  styleUrls: ['./navigation-sidebar.component.scss'],
})
export class NavigationSidebarComponent {
  @Input() public sidebarOpen: boolean = false;
  @Output() public sidebarOpenChange = new EventEmitter<boolean>();

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
    {
      name: 'Climate change',
      icon: 'climate-change',
      route: '',
    },
    {
      name: 'Citizen measurements',
      icon: 'bell',
      route: '',
    },
    {
      name: 'Notifications',
      icon: 'bell',
      route: '',
    },
  ];

  public closeSidebar(): void {
    this.sidebarOpen = false;
    this.sidebarOpenChange.emit(false);
  }
}
