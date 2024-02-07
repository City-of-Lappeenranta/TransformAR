import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardMapComponent } from './components/dashboard-map/dashboard-map.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardMapComponent,
  },
];

@NgModule({
  declarations: [DashboardMapComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
  providers: [],
})
export class DashboardModule {}
