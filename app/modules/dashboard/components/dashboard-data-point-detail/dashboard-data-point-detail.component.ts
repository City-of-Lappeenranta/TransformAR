import { Component, Input } from '@angular/core';
import { DataPoint, DataPointType } from '@core/models/data-points-api';

@Component({
  selector: 'app-dashboard-data-point-detail',
  templateUrl: './dashboard-data-point-detail.component.html',
  styleUrls: ['./dashboard-data-point-detail.component.scss'],
})
export class DashboardDataPointDetailComponent {
  @Input() public dataPoint: DataPoint | null = null;

  public DATA_POINT_TYPE = DataPointType;
}
