import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconComponent } from '@shared/components/icon/icon.component';
import { StepsComponent } from '@shared/components/steps/steps.component';
import { SharedModule } from '@shared/shared.module';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { Textarea } from 'primeng/inputtextarea';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { FeedbackConfirmationComponent } from './components/feedback-confirmation/feedback-confirmation.component';
import { FeedbackContactComponent } from './components/feedback-form/feedback-contact/feedback-contact.component';
import { FeedbackFormComponent } from './components/feedback-form/feedback-form.component';
import { FeedbackLocationComponent } from './components/feedback-form/feedback-location/feedback-location.component';
import { FeedbackAttachmentFileComponent } from './components/feedback-form/feedback-message-and-attachments/feedback-attachment-file/feedback-attachment-file.component';
import { FeedbackMessageAndAttachmentComponent } from './components/feedback-form/feedback-message-and-attachments/feedback-message-and-attachments.component';
import { FeedbackCategoryComponent } from './components/feedback-form/input-feedback-category/feedback-category/feedback-category.component';
import { InputFeedbackCategoryComponent } from './components/feedback-form/input-feedback-category/input-feedback-category.component';
import { FeedbackRoutingModule } from './feedback.routing';
import { SkeletonModule } from 'primeng/skeleton';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    FeedbackRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    StepsComponent,
    ButtonModule,
    IconComponent,
    Textarea,
    CheckboxModule,
    FileUploadModule,
    ProgressBarModule,
    InputTextModule,
    CheckboxModule,
    InputTextModule,
    DividerModule,
    ToastModule,
    SkeletonModule,
    FeedbackMessageAndAttachmentComponent,
    FeedbackFormComponent,
    FeedbackCategoryComponent,
    InputFeedbackCategoryComponent,
    FeedbackLocationComponent,
    FeedbackAttachmentFileComponent,
    FeedbackContactComponent,
    FeedbackConfirmationComponent,
  ],
  exports: [
    FeedbackCategoryComponent,
    InputFeedbackCategoryComponent,
    FeedbackMessageAndAttachmentComponent,
    FeedbackLocationComponent,
  ],
  providers: [MessageService],
})
export class FeedbackModule {}
