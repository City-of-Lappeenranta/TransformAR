import { Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { merge } from 'rxjs';
import { LatLong } from '../../../../core/models/location';
import { FeedbackFormStep } from './feedback-form-step.enum';

@Component({
  selector: 'app-feedback-form',
  templateUrl: './feedback-form.component.html',
  styleUrls: ['./feedback-form.component.scss'],
})
export class FeedbackFormComponent {
  public feedbackFormStep = FeedbackFormStep;
  public currentFeedbackFormStep = FeedbackFormStep.LOCATION;

  public mainCategories = [
    {
      value: 'Transactions, customer service, communication and general feedback',
    },
    { value: 'Exercise and outdoor activities' },
    { value: 'Zoning, construction and housing' },
    { value: 'Streets and traffic' },
    { value: 'Urban environment and accessibility and nature' },
    { value: 'Library, cultural institutions and cultural events' },
    { value: 'Early childhood education, teaching and youth' },
    { value: 'Employment and business services' },
  ];

  public subCategories = [
    { value: 'Customer service center Winkki' },
    { value: 'Other customer service points' },
    { value: 'Travel advice' },
    { value: 'Online transaction' },
    { value: 'Websites' },
    { value: 'Other city communication and information' },
    { value: 'General feedback' },
  ];

  public motivations = [
    { value: 'Thank you', icon: 'thumbs-up' },
    { value: 'Reproach', icon: 'thumbs-down' },
    { value: 'Question', icon: 'question-mark' },
    { value: 'Action proposal', icon: 'call-to-action' },
  ];

  public feedbackForm = new FormGroup({
    mainCategory: new FormControl<string | null>(null, Validators.required),
    subCategory: new FormControl<string | null>(null, Validators.required),
    motivation: new FormControl<string | null>(null, Validators.required),
    message: new FormGroup({
      message: new FormControl<string | null>(null, Validators.required),
      publish: new FormControl<boolean | null>(null),
    }),
    location: new FormControl<LatLong | null>(null, Validators.required),
  });

  public constructor() {
    merge(
      this.feedbackForm.controls.mainCategory.valueChanges,
      this.feedbackForm.controls.subCategory.valueChanges,
      this.feedbackForm.controls.motivation.valueChanges,
    )
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.next());
  }

  public get activeStep(): number {
    return this.currentFeedbackFormStep === FeedbackFormStep.MAIN_CATEGORY ||
      this.currentFeedbackFormStep === FeedbackFormStep.SUB_CATEGORY
      ? 0
      : this.currentFeedbackFormStep - 1;
  }

  public canClickNextButton(): boolean {
    switch (this.currentFeedbackFormStep) {
      case FeedbackFormStep.MAIN_CATEGORY:
        return this.feedbackForm.controls.mainCategory.valid;
      case FeedbackFormStep.SUB_CATEGORY:
        return this.feedbackForm.controls.subCategory.valid;
      case FeedbackFormStep.MOTIVATION: {
        return this.feedbackForm.controls.motivation.valid;
      }
      case FeedbackFormStep.MESSAGE_AND_ATTACHMENTS: {
        return this.feedbackForm.controls.message.valid;
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
