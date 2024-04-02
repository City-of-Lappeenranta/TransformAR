import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import {
  DataPoint,
  DataPointType,
  WEATHER_CONDITIONS_METRIC_UNIT,
  WEATHER_STORM_WATER_METRIC_UNIT,
} from '@core/models/data-point';
import { RadarService } from '@core/services/radar.service';
import { TranslateService } from '@ngx-translate/core';
import { capitalize } from '@shared/utils/string-utils';
import { Observable, Subject } from 'rxjs';

// TODO: get rid of magic strings

@Component({
  selector: 'app-dashboard-data-point-detail',
  templateUrl: './dashboard-data-point-detail.component.html',
  styleUrls: ['./dashboard-data-point-detail.component.scss'],
})
export class DashboardDataPointDetailComponent implements OnChanges {
  @Input({ required: true }) public dataPoint!: DataPoint;
  @Output() public close: EventEmitter<void> = new EventEmitter<void>();

  private _addressSubject$: Subject<string | null> = new Subject<string | null>();
  public address$: Observable<string | null> = this._addressSubject$.asObservable();

  public DATA_POINT_TYPE = DataPointType;

  public constructor(
    private readonly translateService: TranslateService,
    private readonly radarService: RadarService,
  ) {}

  public async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes['dataPoint']) {
      this._addressSubject$.next(null);

      if (changes['dataPoint'].currentValue) {
        const address = await this.radarService.reverseGeocode(this.dataPoint.location);
        this._addressSubject$.next(address);
      }
    }
  }

  public getWeatherConditionMetricLabel(key: string): string {
    return this.getDataPointTranslation('WEATHER_CONDITION', key);
  }

  public getWeatherConditionMetricValue(value: string | number): string | number {
    if (typeof value === 'number') {
      return value;
    }

    return this.getDataPointTranslation('WEATHER_CONDITION', value);
  }

  public getWeatherConditionMetricUnit(key: string): string | undefined {
    return this.getMetricUnit('WEATHER_CONDITION', key);
  }

  public getStormWaterMetricLabel(key: string): string {
    return this.getDataPointTranslation('STORM_WATER', key);
  }

  public getStormWaterMetricUnit(key: string): string | undefined {
    return this.getMetricUnit('STORM_WATER', key);
  }

  private getMetricUnit(type: string, key: string): string | undefined {
    if (type === 'WEATHER_CONDITION') {
      return WEATHER_CONDITIONS_METRIC_UNIT[key as keyof typeof WEATHER_CONDITIONS_METRIC_UNIT];
    } else if (type === 'STORM_WATER') {
      return WEATHER_STORM_WATER_METRIC_UNIT[key as keyof typeof WEATHER_STORM_WATER_METRIC_UNIT];
    }

    return undefined;
  }

  private getDataPointTranslation(type: string, key: string): string {
    const i18nKey = `DASHBOARD.DATA_POINTS.${type}.${key.toUpperCase()}`;
    const translation = this.translateService.instant(i18nKey);
    return translation === i18nKey ? capitalize(key) : translation;
  }
}
