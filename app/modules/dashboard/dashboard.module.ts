import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardMapComponent } from './components/dashboard-map/dashboard-map.component';
import { SharedModule } from '../../shared/shared.module';
import { DashboardRoutingModule } from './dashboard.routing';

@NgModule({
  declarations: [DashboardMapComponent],
  imports: [SharedModule, DashboardRoutingModule],
})
export class DashboardModule {}
