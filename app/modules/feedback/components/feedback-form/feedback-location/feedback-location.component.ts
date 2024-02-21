import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NavigationHeaderAction } from '@shared/components/navigation/navigation-header/navigation-header-action.interface';
import { NavigationHeaderService } from '@shared/components/navigation/navigation-header/navigation-header.service';

@Component({
  selector: 'app-feedback-location',
  templateUrl: './feedback-location.component.html',
  styleUrls: ['./feedback-location.component.scss'],
})
export class FeedbackLocationComponent implements OnInit, OnDestroy {
  @Input({ required: true }) public locationFormControl!: FormControl<
    string | null
  >;

  public constructor(
    private readonly navigationHeaderService: NavigationHeaderService
  ) {}

  public ngOnInit(): void {
    this.navigationHeaderService.setAction({
      type: 'text',
      value: 'Skip',
    } as NavigationHeaderAction);
  }

  public ngOnDestroy(): void {
    this.navigationHeaderService.setAction(null);
  }
}
