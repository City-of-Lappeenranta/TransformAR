import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { DashboardMapComponent } from './components/dashboard-map/dashboard-map.component';
import { DashboardRoutingModule } from './dashboard.routing';
import { DashboardDataPointDetailComponent } from './components/dashboard-data-point-detail/dashboard-data-point-detail.component';

@NgModule({
  declarations: [DashboardMapComponent, DashboardDataPointDetailComponent],
  imports: [SharedModule, DashboardRoutingModule],
})
export class DashboardModule {}
