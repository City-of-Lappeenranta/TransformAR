import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { DashboardMapComponent } from './components/dashboard-map/dashboard-map.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardMapComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
