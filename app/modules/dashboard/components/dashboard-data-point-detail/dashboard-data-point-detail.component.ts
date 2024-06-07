import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, signal } from '@angular/core';
import {
  DATA_POINT_QUALITY_COLOR_CHART,
  DataPoint,
  DataPointQuality,
  DataPointType,
  WATERBAG_TESTKIT_METRIC_UNIT,
  WEATHER_CONDITIONS_METRIC_UNIT,
  WEATHER_STORM_WATER_METRIC_UNIT,
  WaterbagTestKitDataPointData,
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

  public getWeatherConditionMetricValue(value: string | number): string | number {
    if (typeof value === 'number') {
      return value;
    }

    return this.getDataPointTranslation(DataPointType.WEATHER_CONDITIONS, value);
  }

  public getWeatherAirQualityTranslationKey(quality: DataPointQuality): string {
    return `DASHBOARD.DATA_POINTS.QUALITY.${DataPointQuality[quality]}`;
  }

  public getWaterbagTestkitValue(value: WaterbagTestKitDataPointData): number {
    return value['calculatedValue'] ?? value['value'];
  }

  public getDataQualityBackgroundColor(quality: DataPointQuality): string {
    return DATA_POINT_QUALITY_COLOR_CHART[quality];
  }

  public getDataQualityTextColor(quality: DataPointQuality): string {
    return quality === DataPointQuality.DEFAULT ? 'white' : 'black';
  }

  public getMetricUnit(type: DataPointType, key: string): string | undefined {
    if (type === DataPointType.WEATHER_CONDITIONS) {
      return WEATHER_CONDITIONS_METRIC_UNIT[key as keyof typeof WEATHER_CONDITIONS_METRIC_UNIT] ?? '';
    }

    if (type === DataPointType.STORM_WATER) {
      return WEATHER_STORM_WATER_METRIC_UNIT[key as keyof typeof WEATHER_STORM_WATER_METRIC_UNIT] ?? '';
    }

    if (type === DataPointType.WATERBAG_TESTKIT) {
      return WATERBAG_TESTKIT_METRIC_UNIT[key as keyof typeof WATERBAG_TESTKIT_METRIC_UNIT] ?? '';
    }

    return undefined;
  }

  public getDataPointTranslation(type: DataPointType, key: string): string {
    const i18nKey = `DASHBOARD.DATA_POINTS.${type}.${key.toUpperCase()}`;
    const translation = this.translateService.instant(i18nKey);
    return translation === i18nKey ? capitalize(key) : translation;
  }

  private async setHeaderValues(): Promise<void> {
    const dataPointNames = this.dataPoints.map(({ name }) => name);
    this.name.set([...new Set(dataPointNames)].join(', '));

    const address = await this.radarService.reverseGeocode(this.dataPoints[0].location);
    this.address.set(address);
  }
}
