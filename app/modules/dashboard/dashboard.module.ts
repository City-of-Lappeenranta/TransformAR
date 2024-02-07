import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardMapComponent } from './components/dashboard-map/dashboard-map.component';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: DashboardMapComponent,
  },
];

@NgModule({
  declarations: [DashboardMapComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
  providers: [],
})
export class DashboardModule {}
