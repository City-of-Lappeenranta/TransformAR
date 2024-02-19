import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FeedbackFormComponent } from './components/feedback-form/feedback-form.component';
import { FeedbackRoutingModule } from './feedback.routing';
import { FeedbackCategoryComponent } from './components/feedback-form/input-feedback-category/feedback-category/feedback-category.component';
import { InputFeedbackCategoryComponent } from './components/feedback-form/input-feedback-category/input-feedback-category.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StepsComponent } from '@shared/components/steps/steps.component';
import { ButtonModule } from 'primeng/button';
import { IconComponent } from '@shared/components/icon/icon.component';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FeedbackReasonContentComponent } from './components/feedback-form/feedback-reason-content/feedback-reason-content.component';
import { CheckboxModule } from 'primeng/checkbox';
import { FileUploadModule } from 'primeng/fileupload';
import { FeedbackReasonContentFileComponent } from './components/feedback-form/feedback-reason-content/feedback-reason-content-file/feedback-reason-content-file.component';
import { ProgressBarModule } from 'primeng/progressbar';
import { InputTextModule } from 'primeng/inputtext';
import { FeedbackLocationComponent } from './components/feedback-form/feedback-location/feedback-location.component';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [
    FeedbackFormComponent,
    FeedbackCategoryComponent,
    InputFeedbackCategoryComponent,
    FeedbackReasonContentComponent,
    FeedbackReasonContentFileComponent,
    FeedbackLocationComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    FeedbackRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    StepsComponent,
    ButtonModule,
    IconComponent,
    InputTextareaModule,
    CheckboxModule,
    FileUploadModule,
    ProgressBarModule,
    InputTextModule,
  ],
})
export class FeedbackModule {}
