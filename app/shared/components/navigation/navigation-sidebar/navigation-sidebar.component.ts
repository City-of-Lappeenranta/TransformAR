import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navigation-sidebar',
  templateUrl: './navigation-sidebar.component.html',
  styleUrls: ['./navigation-sidebar.component.scss'],
})
export class NavigationSidebarComponent {
  @Input({ required: true }) public sidebarOpen!: boolean;
  @Output() public onSidebarClose = new EventEmitter<void>();

  public menuItems: {
    name$: Observable<string>;
    icon: string;
    route: string;
  }[] = [
    {
      name$: this.translateService.get('NAVIGATION.SIDEBAR.HOME'),
      icon: 'map',
      route: '',
    },
    {
      name$: this.translateService.get('NAVIGATION.SIDEBAR.FEEDBACK'),
      icon: 'feedback',
      route: 'feedback',
    },
  ];

  public constructor(private readonly translateService: TranslateService) {}
}
