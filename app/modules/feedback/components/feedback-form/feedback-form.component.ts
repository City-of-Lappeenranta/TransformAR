import { Component } from '@angular/core';
import { FeedbackFormStep } from './feedback-form-step.enum';
import { FormControl, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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

  public mainCategoryForm = new FormControl<string | null>(
    null,
    Validators.required
  );
  public subCategoryForm = new FormControl<string | null>(
    null,
    Validators.required
  );

  public constructor() {
    this.mainCategoryForm.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.currentFeedbackFormStep = FeedbackFormStep.SUB_CATEGORY;
      });
  }

  public canClickNextButton(): boolean {
    switch (this.currentFeedbackFormStep) {
      case FeedbackFormStep.MAIN_CATEGORY:
        return this.mainCategoryForm.valid;
      default: {
        return false;
      }
    }
  }

  public back(): void {
    this.currentFeedbackFormStep = FeedbackFormStep.MAIN_CATEGORY;
  }

  public next(): void {
    this.currentFeedbackFormStep = FeedbackFormStep.SUB_CATEGORY;
  }
}
