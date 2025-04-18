import { Component, Signal } from '@angular/core';
import { Observable } from 'rxjs';
import { FeedbackFormChildComponent } from './feedback-form-child-component.enum';
import { FeedbackFormService } from './feedback-form.service';
import {
  Category,
  InputFeedbackCategoryComponent,
} from './input-feedback-category/input-feedback-category.component';
import { TranslatePipe } from '@ngx-translate/core';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FeedbackContactComponent } from './feedback-contact/feedback-contact.component';
import { StepsComponent } from '@shared/components/steps/steps.component';
import { Button } from 'primeng/button';
import { IconComponent } from '@shared/components/icon/icon.component';
import { FeedbackMessageAndAttachmentComponent } from './feedback-message-and-attachments/feedback-message-and-attachments.component';
import { FeedbackLocationComponent } from './feedback-location/feedback-location.component';

@Component({
  selector: 'app-feedback-form',
  templateUrl: './feedback-form.component.html',
  styleUrls: ['./feedback-form.component.scss'],
  providers: [FeedbackFormService],
  imports: [
    TranslatePipe,
    AsyncPipe,
    ReactiveFormsModule,
    FeedbackContactComponent,
    StepsComponent,
    Button,
    IconComponent,
    InputFeedbackCategoryComponent,
    FeedbackMessageAndAttachmentComponent,
    FeedbackLocationComponent,
    NgIf,
    NgForOf,
  ],
  standalone: true,
})
export class FeedbackFormComponent {
  public FEEDBACK_FORM_COMPONENT = FeedbackFormChildComponent;
  public feedbackForm = this.feedbackFormService.feedbackForm;

  public amountOfSteps: number = this.feedbackFormService.amountOfSteps;
  public currentStep$: Observable<number> =
    this.feedbackFormService.currentStep$;
  public currentChildComponent$: Observable<FeedbackFormChildComponent> =
    this.feedbackFormService.currentChildComponent$;
  public isNextEnabled$: Observable<boolean> =
    this.feedbackFormService.isNextEnabled$;

  public parentCategory: Signal<string | null | undefined> =
    this.feedbackFormService.parentCategory;
  public categories: Signal<Category[]> = this.feedbackFormService.categories;
  public categorySteps = this.feedbackFormService.categorySteps;

  public isNextInProgress$: Observable<boolean> =
    this.feedbackFormService.isNextInProgress$;
  public nextButtonLabel = '';

  public constructor(
    private readonly feedbackFormService: FeedbackFormService,
  ) {
    this.currentStep$.subscribe(
      (currentStep) =>
        (this.nextButtonLabel =
          currentStep === this.amountOfSteps - 1
            ? 'FEEDBACK.FOOTER.SEND_FEEDBACK'
            : 'FEEDBACK.FOOTER.NEXT'),
    );
  }

  public onClickBack(): void {
    this.feedbackFormService.back();
  }

  public onClickNext(): void {
    this.feedbackFormService.next();
  }
}
