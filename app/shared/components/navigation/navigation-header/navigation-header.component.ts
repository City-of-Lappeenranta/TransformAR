import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { NavigationHeaderService } from './navigation-header.service';
import { BaseComponent } from '@shared/components/base.component';
import { takeUntil } from 'rxjs';
import { NavigationHeaderAction } from './navigation-header-action.interface';

@Component({
  selector: 'app-navigation-header',
  templateUrl: './navigation-header.component.html',
  styleUrls: ['./navigation-header.component.scss'],
})
export class NavigationHeaderComponent extends BaseComponent implements OnInit {
  @Input({ required: true }) public title: string | undefined;

  public sidebarOpen = false;
  public action: NavigationHeaderAction | null | undefined;

  constructor(
    private readonly navigationHeaderService: NavigationHeaderService
  ) {
    super();
  }

  public ngOnInit(): void {
    this.navigationHeaderService.action$
      .pipe(takeUntil(this.onDestroy))
      .subscribe((action: NavigationHeaderAction | null) => {
        this.action = action;
      });
  }

  public onActionClick(): void {
    this.navigationHeaderService.actionClick();
  }
}
