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
import { CheckboxModule } from 'primeng/checkbox';
import { FileUploadModule } from 'primeng/fileupload';
import { ProgressBarModule } from 'primeng/progressbar';
import { FeedbackLocationComponent } from './components/feedback-form/feedback-location/feedback-location.component';
import { SharedModule } from '@shared/shared.module';
import { FeedbackAttachmentFileComponent } from './components/feedback-form/feedback-message-and-attachments/feedback-attachment-file/feedback-attachment-file.component';
import { FeedbackMessageAndAttachmentComponent } from './components/feedback-form/feedback-message-and-attachments/feedback-message-and-attachments.component';
import { InputTextModule } from 'primeng/inputtext';
import { FeedbackContactComponent } from './components/feedback-form/feedback-contact/feedback-contact.component';
import { FeedbackConfirmationComponent } from './components/feedback-confirmation/feedback-confirmation.component';
import { DividerModule } from 'primeng/divider';

@NgModule({
  declarations: [
    FeedbackFormComponent,
    FeedbackCategoryComponent,
    InputFeedbackCategoryComponent,
    FeedbackMessageAndAttachmentComponent,
    FeedbackAttachmentFileComponent,
    FeedbackLocationComponent,
    FeedbackContactComponent,
    FeedbackConfirmationComponent,
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
    CheckboxModule,
    InputTextModule,
    DividerModule,
  ],
  exports: [FeedbackCategoryComponent, InputFeedbackCategoryComponent],
})
export class FeedbackModule {}
