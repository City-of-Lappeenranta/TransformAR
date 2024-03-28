import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import {
  DataPoint,
  DataPointType,
  MarjetaSensorData,
  TeconerSensorData,
  WEATHER_DATA_POINT_METRIC_UNIT,
} from '@core/models/data-point';
import { RadarService } from '@core/services/radar.service';
import { Observable, Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { capitalize } from '@shared/utils/string-utils';

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

  public constructor(
    private readonly radarService: RadarService,
    private readonly translateService: TranslateService,
  ) {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['dataPoint']) {
      this._addressSubject$.next(null);

      if (changes['dataPoint'].currentValue) {
        this.reverseGeocodeDataPointLocation(changes['dataPoint'].currentValue);
      }
    }
  }

  public getWeatherMetricLabel(key: string): string {
    const i18nKey = `DASHBOARD.DATA_POINTS.WEATHER.${key.toUpperCase()}`;
    const translation = this.translateService.instant(i18nKey);
    return translation === i18nKey ? capitalize(key) : translation;
  }

  public getWeatherMetricUnit(key: string): string | undefined {
    if (Object.hasOwn(WEATHER_DATA_POINT_METRIC_UNIT, key)) {
      return WEATHER_DATA_POINT_METRIC_UNIT[key as keyof typeof WEATHER_DATA_POINT_METRIC_UNIT];
    }

    return undefined;
  }

  // @for can't seem to handle Union types
  public castDataPointData(data: TeconerSensorData | MarjetaSensorData): Partial<TeconerSensorData & MarjetaSensorData> {
    return data as Partial<TeconerSensorData & MarjetaSensorData>;
  }

  private async reverseGeocodeDataPointLocation(dataPoint: DataPoint): Promise<void> {
    const address = await this.radarService.reverseGeocode(dataPoint.location);
    this._addressSubject$.next(address);
  }
}
