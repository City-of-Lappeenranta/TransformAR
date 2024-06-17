import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, signal } from '@angular/core';
import {
  DATA_POINT_QUALITY_COLOR_CHART,
  DataPoint,
  DataPointQuality,
  DataPointType,
  WEATHER_CONDITIONS_METRIC_UNIT,
} from '@core/models/data-point';
import { RadarService } from '@core/services/radar.service';
import { TranslateService } from '@ngx-translate/core';
import { capitalize } from '@shared/utils/string-utils';

@Component({
  selector: 'app-dashboard-data-point-detail',
  templateUrl: './dashboard-data-point-detail.component.html',
  styleUrls: ['./dashboard-data-point-detail.component.scss'],
})
export class DashboardDataPointDetailComponent implements OnInit, OnChanges {
  @Input({ required: true }) public dataPoints: DataPoint[] = [];

  @Output() public close: EventEmitter<void> = new EventEmitter<void>();

  public address = signal<string | null>(null);
  public name = signal<string | null>(null);

  public DATA_POINT_TYPE = DataPointType;

  public constructor(
    private readonly translateService: TranslateService,
    private readonly radarService: RadarService,
  ) {}

  public ngOnInit(): void {
    this.setHeaderValues();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['dataPoints']) {
      this.address.set(null);
      this.name.set(null);

      if (changes['dataPoints'].currentValue) {
        this.setHeaderValues();
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

  public getQualityTranslation(quality: DataPointQuality): string {
    return `DASHBOARD.DATA_POINTS.QUALITY.${DataPointQuality[quality]}`;
  }

  public getDataQualityBackgroundColor(quality: DataPointQuality): string {
    return DATA_POINT_QUALITY_COLOR_CHART[quality];
  }

  private async setHeaderValues(): Promise<void> {
    const dataPointNames = this.dataPoints.map(({ name }) => name);
    this.name.set([...new Set(dataPointNames)].join(', '));

    const address = await this.radarService.reverseGeocode(this.dataPoints[0].location);
    this.address.set(address);
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
