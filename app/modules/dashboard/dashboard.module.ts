import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IconComponent } from '@shared/components/icon/icon.component';
import { SearchLocationInputComponent } from '@shared/components/search-location-input/search-location-input.component';
import { MessageService } from 'primeng/api';
import { SkeletonModule } from 'primeng/skeleton';
import { ToastModule } from 'primeng/toast';
import { SharedModule } from '../../shared/shared.module';
import { DashboardDataPointDetailComponent } from './components/dashboard-data-point-detail/dashboard-data-point-detail.component';
import { DashboardMapComponent } from './components/dashboard-map/dashboard-map.component';
import { DashboardRoutingModule } from './dashboard.routing';

@NgModule({
  declarations: [DashboardMapComponent, DashboardDataPointDetailComponent],
  imports: [
    SharedModule,
    SkeletonModule,
    ToastModule,
    DashboardRoutingModule,
    IconComponent,
    SearchLocationInputComponent,
    ReactiveFormsModule,
  ],
  providers: [MessageService],
})
export class DashboardModule {}
