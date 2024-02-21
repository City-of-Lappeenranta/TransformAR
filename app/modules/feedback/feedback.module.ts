import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FeedbackFormComponent } from './components/feedback-form/feedback-form.component';
import { FeedbackRoutingModule } from './feedback.routing';
import { FeedbackCategoryComponent } from './components/feedback-form/input-feedback-category/feedback-category/feedback-category.component';
import { InputFeedbackCategoryComponent } from './components/feedback-form/input-feedback-category/input-feedback-category.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StepsComponent } from '@shared/components/steps/steps.component';
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [
    FeedbackFormComponent,
    FeedbackCategoryComponent,
    InputFeedbackCategoryComponent,
  ],
  imports: [
    CommonModule,
    FeedbackRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    StepsComponent,
    ButtonModule,
  ],
  exports: [FeedbackCategoryComponent, InputFeedbackCategoryComponent],
})
export class FeedbackModule {}
