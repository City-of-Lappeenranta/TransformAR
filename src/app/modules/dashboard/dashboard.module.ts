import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IconComponent } from '@shared/components/icon/icon.component';
import { SearchLocationInputComponent } from '@shared/components/search-location-input/search-location-input.component';
import { MessageService } from 'primeng/api';
import { SkeletonModule } from 'primeng/skeleton';
import { ToastModule } from 'primeng/toast';
import { SharedModule } from '@shared/shared.module';
import { DashboardDataPointDetailComponent } from './components/dashboard-data-point-detail/dashboard-data-point-detail.component';
import { DashboardRoutingModule } from './dashboard.routing';
import { ChipModule } from 'primeng/chip';
import { DashboardFilterComponent } from './components/dashboard-filter/dashboard-filter.component';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [],
  imports: [
    SharedModule,
    SkeletonModule,
    ToastModule,
    DashboardRoutingModule,
    SearchLocationInputComponent,
    ReactiveFormsModule,
    ChipModule,
    IconComponent,
    DashboardDataPointDetailComponent,
    DashboardFilterComponent,
  ],
  providers: [MessageService, DatePipe],
  exports: [DashboardFilterComponent],
})
export class DashboardModule {}
