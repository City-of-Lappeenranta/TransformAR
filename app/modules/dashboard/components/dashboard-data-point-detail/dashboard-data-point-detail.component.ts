import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DataPoint, DataPointType, WEATHER_CONDITIONS_METRIC_UNIT } from '@core/models/data-point';
import { TranslateService } from '@ngx-translate/core';
import { capitalize } from '@shared/utils/string-utils';

// TODO: get rid of magic strings

@Component({
  selector: 'app-dashboard-data-point-detail',
  templateUrl: './dashboard-data-point-detail.component.html',
  styleUrls: ['./dashboard-data-point-detail.component.scss'],
})
export class DashboardDataPointDetailComponent {
  @Input({ required: true }) public dataPoint!: DataPoint;

  @Output() public close: EventEmitter<void> = new EventEmitter<void>();

  public DATA_POINT_TYPE = DataPointType;

  public constructor(private readonly translateService: TranslateService) {}

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

  private getMetricUnit(type: string, key: string): string | undefined {
    if (type === 'WEATHER_CONDITION') {
      return WEATHER_CONDITIONS_METRIC_UNIT[key as keyof typeof WEATHER_CONDITIONS_METRIC_UNIT];
    }

    return undefined;
  }

  private getDataPointTranslation(type: string, key: string): string {
    const i18nKey = `DASHBOARD.DATA_POINTS.${type}.${key.toUpperCase()}`;
    const translation = this.translateService.instant(i18nKey);
    return translation === i18nKey ? capitalize(key) : translation;
  }
}
