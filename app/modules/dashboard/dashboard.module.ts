import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { DashboardMapComponent } from './components/dashboard-map/dashboard-map.component';
import { DashboardRoutingModule } from './dashboard.routing';
import { DashboardDataPointDetailComponent } from './components/dashboard-data-point-detail/dashboard-data-point-detail.component';
import { SkeletonModule } from 'primeng/skeleton';
import { IconComponent } from '@shared/components/icon/icon.component';

@NgModule({
  declarations: [DashboardMapComponent, DashboardDataPointDetailComponent],
  imports: [SharedModule, SkeletonModule, DashboardRoutingModule, IconComponent],
})
export class DashboardModule {}
