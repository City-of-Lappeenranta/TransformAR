import { RouterModule, Routes } from '@angular/router';
import { FeedbackFormComponent } from './components/feedback-form/feedback-form.component';
import { NgModule } from '@angular/core';
import { FeedbackConfirmationComponent } from './components/feedback-confirmation/feedback-confirmation.component';

const routes: Routes = [
  {
    path: '',
    component: FeedbackFormComponent,
  },
  {
    path: 'confirmed',
    component: FeedbackConfirmationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeedbackRoutingModule {}
