import { RouterModule, Routes } from '@angular/router';
import { FeedbackFormComponent } from './components/feedback-form/feedback-form.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: FeedbackFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeedbackRoutingModule {}
