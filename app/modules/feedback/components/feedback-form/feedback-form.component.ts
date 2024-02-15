import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FeedbackFormStep } from './feedback-form-step.enum';
import { BaseComponent } from '@shared/components/base.component';
import { merge, takeUntil } from 'rxjs';

@Component({
  selector: 'app-feedback-form',
  templateUrl: './feedback-form.component.html',
  styleUrls: ['./feedback-form.component.scss'],
})
export class FeedbackFormComponent extends BaseComponent implements OnInit {
  public feedbackFormStep = FeedbackFormStep;
  public currentFeedbackFormStep = FeedbackFormStep.REPORT_CATEGORY;

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

  public specificReasons = [
    'Customer service center Winkki',
    'Other customer service points',
    'Travel advice',
    'Online transaction',
    'Websites',
    'Other city communication and information',
    'General feedback',
  ];

  public feedbackReasons = [
    { value: 'Thank you', icon: 'thumbs-up' },
    { value: 'Reproach', icon: 'thumbs-down' },
    { value: 'Question', icon: 'question-mark' },
    { value: 'Action proposal', icon: 'call-to-action' },
  ];

  public categoryFormControl = new FormControl<string | null>(null);
  public specificReasonFormControl = new FormControl<string | null>(null);
  public feedbackReasonFormControl = new FormControl<string | null>(null);

  public get activeStep(): number {
    return this.currentFeedbackFormStep === FeedbackFormStep.REPORT_CATEGORY ||
      this.currentFeedbackFormStep === FeedbackFormStep.REPORT_SPECIFIC
      ? 0
      : this.currentFeedbackFormStep - 1;
  }

  public ngOnInit(): void {
    merge(
      this.categoryFormControl.valueChanges,
      this.specificReasonFormControl.valueChanges,
      this.feedbackReasonFormControl.valueChanges
    )
      .pipe(takeUntil(this.onDestroy))
      .subscribe(() => this.next());
  }

  public canClickNextButton(): boolean {
    switch (this.currentFeedbackFormStep) {
      case FeedbackFormStep.REPORT_CATEGORY:
        return !!this.categoryFormControl.value;
      case FeedbackFormStep.REPORT_SPECIFIC: {
        return !!this.specificReasonFormControl.value;
      }
      case FeedbackFormStep.REASON: {
        return !!this.feedbackReasonFormControl.value;
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
