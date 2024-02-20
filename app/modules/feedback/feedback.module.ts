import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FeedbackFormComponent } from './components/feedback-form/feedback-form.component';
import { FeedbackRoutingModule } from './feedback.routing';

@NgModule({
  declarations: [FeedbackFormComponent],
  imports: [CommonModule, FeedbackRoutingModule],
})
export class FeedbackModule {}
