import { Component } from '@angular/core';
import { FeedbackFormStep } from './feedback-form-step.enum';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { merge } from 'rxjs';

@Component({
  selector: 'app-feedback-form',
  templateUrl: './feedback-form.component.html',
  styleUrls: ['./feedback-form.component.scss'],
})
export class FeedbackFormComponent {
  public feedbackFormStep = FeedbackFormStep;
  public currentFeedbackFormStep = FeedbackFormStep.MAIN_CATEGORY;

  public mainCategories = [
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
  });

  public constructor() {
    merge(
      this.feedbackForm.controls.mainCategory.valueChanges,
      this.feedbackForm.controls.subCategory.valueChanges
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
