import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/feedback-form/feedback-form.component').then(
        (c) => c.FeedbackFormComponent,
      ),
  },
  {
    path: 'confirmed',
    loadComponent: () =>
      import(
        './components/feedback-confirmation/feedback-confirmation.component'
      ).then((c) => c.FeedbackConfirmationComponent),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeedbackRoutingModule {}
