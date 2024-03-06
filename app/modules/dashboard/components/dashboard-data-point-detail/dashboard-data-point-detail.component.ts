import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { DataPoint, DataPointType } from '@core/models/data-point';
import { RadarService } from '@core/services/radar.service';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-dashboard-data-point-detail',
  templateUrl: './dashboard-data-point-detail.component.html',
  styleUrls: ['./dashboard-data-point-detail.component.scss'],
})
export class DashboardDataPointDetailComponent implements OnChanges {
  @Input({ required: true }) public dataPoint!: DataPoint;

  @Output() public close: EventEmitter<void> = new EventEmitter<void>();

  public DATA_POINT_TYPE = DataPointType;

  private _addressSubject$: Subject<string | null> = new Subject<string | null>();
  public address$: Observable<string | null> = this._addressSubject$.asObservable();

  public constructor(private readonly radarService: RadarService) {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['dataPoint']) {
      this._addressSubject$.next(null);

      if (changes['dataPoint'].currentValue) {
        this.reverseGeocodeDataPointLocation(changes['dataPoint'].currentValue);
      }
    }
  }

  private async reverseGeocodeDataPointLocation(dataPoint: DataPoint): Promise<void> {
    const address = await this.radarService.reverseGeocodeLocationToAddressLabel(dataPoint.location);
    this._addressSubject$.next(address);
  }
}
