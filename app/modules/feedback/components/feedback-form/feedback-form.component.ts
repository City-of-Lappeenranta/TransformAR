import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { FeedbackFormChildComponent } from './feedback-form-child-component.enum';
import { FeedbackFormService } from './feedback-form.service';
import { Category } from './input-feedback-category/input-feedback-category.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-feedback-form',
  templateUrl: './feedback-form.component.html',
  styleUrls: ['./feedback-form.component.scss'],
  providers: [FeedbackFormService],
})
export class FeedbackFormComponent {
  public FEEDBACK_FORM_COMPONENT = FeedbackFormChildComponent;
  public feedbackForm = this.feedbackFormService.feedbackForm;

  public amountOfSteps: number = this.feedbackFormService.amountOfSteps;
  public currentStep$: Observable<number> = this.feedbackFormService.currentStep$;
  public currentChildComponent$: Observable<FeedbackFormChildComponent> = this.feedbackFormService.currentChildComponent$;
  public isNextEnabled$: Observable<boolean> = this.feedbackFormService.isNextEnabled$;

  public parentCategory$: Observable<string | null> = this.feedbackFormService.parentCategory$;
  public categories$: Observable<Category[]> = this.feedbackFormService.categories$;
  public categorySteps = this.feedbackFormService.categorySteps;

  public isNextInProgress$: Observable<boolean> = this.feedbackFormService.isNextInProgress$;
  public nextButtonLabel = '';

  public constructor(
    private readonly feedbackFormService: FeedbackFormService,
    private readonly translateService: TranslateService,
  ) {
    const sendFeedbackLabel = this.translateService.instant('FEEDBACK.FOOTER.SEND_FEEDBACK');
    const nextLabel = this.translateService.instant('FEEDBACK.FOOTER.NEXT');

    this.currentStep$.subscribe(
      (currentStep) => (this.nextButtonLabel = currentStep === this.amountOfSteps - 1 ? sendFeedbackLabel : nextLabel),
    );
  }

  public onClickBack(): void {
    this.feedbackFormService.back();
  }

  public onClickNext(): void {
    this.feedbackFormService.next();
  }
}
