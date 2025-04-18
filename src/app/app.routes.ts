import { Routes } from '@angular/router';
import { environment } from '@environments/environment';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./modules/dashboard/dashboard.module').then((m) => m.DashboardModule),
    data: { navigationHeaderTitle: environment.jurisdiction },
  },
  {
    path: 'feedback',
    loadChildren: () => import('./modules/feedback/feedback.module').then((m) => m.FeedbackModule),
    data: { navigationHeaderTitle: 'NAVIGATION.HEADER.FEEDBACK' },
  },
  {
    path: 'about',
    loadChildren: () => import('./modules/about/about.module').then((m) => m.AboutModule),
    data: { navigationHeaderTitle: 'NAVIGATION.HEADER.ABOUT' },
  },
  {
    path: '**',
    redirectTo: '',
  },
];
