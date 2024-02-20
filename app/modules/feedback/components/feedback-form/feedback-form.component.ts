import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FeedbackFormStep } from './feedback-form-step.enum';
import { BaseComponent } from '@shared/components/base.component';
import { merge, takeUntil } from 'rxjs';
import { NavigationHeaderService } from '@shared/components/navigation/navigation-header/navigation-header.service';
import { LatLong } from '../../../../core/models/location';

@Component({
  selector: 'app-feedback-form',
  templateUrl: './feedback-form.component.html',
  styleUrls: ['./feedback-form.component.scss'],
})
export class FeedbackFormComponent extends BaseComponent implements OnInit {
  public feedbackFormStep = FeedbackFormStep;
  public currentFeedbackFormStep = FeedbackFormStep.LOCATION;

  public categories = [
    'Transactions, customer service, communication and general feedback',
    'Exercise and outdoor activities',
    'Zoning, construction and housing',
    'Streets and traffic',
    'Urban environment and accessibility and nature',
    'Library, cultural institutions and cultural events',
    'Early childhood education, teaching and youth',
    'Employment and business services',
  ];

  public subCategories = [
    'Customer service center Winkki',
    'Other customer service points',
    'Travel advice',
    'Online transaction',
    'Websites',
    'Other city communication and information',
    'General feedback',
  ];

  public reasons = [
    { value: 'Thank you', icon: 'thumbs-up' },
    { value: 'Reproach', icon: 'thumbs-down' },
    { value: 'Question', icon: 'question-mark' },
    { value: 'Action proposal', icon: 'call-to-action' },
  ];

  public feedbackForm = new FormGroup({
    category: new FormControl<string | null>(null, Validators.required),
    subCategory: new FormControl<string | null>(null, Validators.required),
    type: new FormControl<string | null>(null, Validators.required),
    reason: new FormGroup({
      message: new FormControl<string | null>(null, Validators.required),
      publish: new FormControl<boolean | null>(null),
    }),
    location: new FormControl<LatLong | null>(null, Validators.required),
  });

  public constructor(
    private readonly navigationHeaderService: NavigationHeaderService
  ) {
    super();
  }

  public get activeStep(): number {
    return this.currentFeedbackFormStep === FeedbackFormStep.CATEGORY ||
      this.currentFeedbackFormStep === FeedbackFormStep.REPORT_SPECIFIC
      ? 0
      : this.currentFeedbackFormStep - 1;
  }

  public ngOnInit(): void {
    merge(
      this.feedbackForm.controls.category.valueChanges,
      this.feedbackForm.controls.subCategory.valueChanges,
      this.feedbackForm.controls.type.valueChanges,
      this.navigationHeaderService.onActionClick$
    )
      .pipe(takeUntil(this.onDestroy))
      .subscribe(() => this.next());
  }

  public canClickNextButton(): boolean {
    switch (this.currentFeedbackFormStep) {
      case FeedbackFormStep.CATEGORY:
        return this.feedbackForm.controls.category.valid;
      case FeedbackFormStep.REPORT_SPECIFIC: {
        return this.feedbackForm.controls.subCategory.valid;
      }
      case FeedbackFormStep.TYPE: {
        return this.feedbackForm.controls.type.valid;
      }
      case FeedbackFormStep.REASON: {
        return this.feedbackForm.controls.reason.valid;
      }
      case FeedbackFormStep.LOCATION: {
        return this.feedbackForm.controls.location.valid;
      }
      default: {
        return false;
      }
    }
  }

  public back(): void {
    this.currentFeedbackFormStep -= 1;
  }

  public next(): void {
    this.currentFeedbackFormStep += 1;
  }
}
