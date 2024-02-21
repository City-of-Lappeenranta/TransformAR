import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { DashboardMapComponent } from './components/dashboard-map/dashboard-map.component';
import { DashboardRoutingModule } from './dashboard.routing';

@NgModule({
  declarations: [DashboardMapComponent],
  imports: [SharedModule, DashboardRoutingModule],
})
export class DashboardModule {}
