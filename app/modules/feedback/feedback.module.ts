import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeedbackFormComponent } from './components/feedback-form/feedback-form.component';

const routes: Routes = [
  {
    path: '',
    component: FeedbackFormComponent,
  },
];

@NgModule({
  declarations: [FeedbackFormComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
  providers: [],
})
export class FeedbackModule {}
