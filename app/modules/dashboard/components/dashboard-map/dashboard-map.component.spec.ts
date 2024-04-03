import {
  DATA_POINT_QUALITY_COLOR_CHART,
  DATA_POINT_TYPE_ICON,
  DataPointQuality,
  DataPointType,
  WEATHER_STORM_WATER_METRIC_UNIT,
  WeatherAirQualityDataPoint,
  WeatherConditionDataPoint,
  WeatherStormWaterDataPoint,
} from '@core/models/data-point';
import { LatLong } from '@core/models/location';
import { DataPointsApi } from '@core/services/datapoints-api/datapoints-api.service';
import { LocationService, UserLocation } from '@core/services/location.service';
import { TranslateService } from '@ngx-translate/core';
import { MapComponent } from '@shared/components/map/map.component';
import { MessageService, SharedModule } from 'primeng/api';
import { delay, firstValueFrom, of, take } from 'rxjs';
import { Shallow } from 'shallow-render';
import { DashboardModule } from '../../dashboard.module';
import { DashboardDataPointDetailComponent } from '../dashboard-data-point-detail/dashboard-data-point-detail.component';
import { DashboardMapComponent } from './dashboard-map.component';

const NETWORK_REQUEST_TIME = 50;

describe('DashboardMapComponent', () => {
  let shallow: Shallow<DashboardMapComponent>;

  beforeEach(() => {
    shallow = new Shallow(DashboardMapComponent, DashboardModule)
      .mock(TranslateService, { instant: jest.fn })
      .mock(MessageService, { add: jest.fn(), clear: jest.fn() })
      .mock(DataPointsApi, {
        getWeatherConditions: jest.fn().mockReturnValue(of(WEATHER_CONDITION_DATA_POINTS).pipe(delay(NETWORK_REQUEST_TIME))),
        getWeatherStormWater: jest
          .fn()
          .mockReturnValue(of(WEATHER_STORM_WATER_DATA_POINTS).pipe(delay(NETWORK_REQUEST_TIME / 2))),
        getWeatherAirQuality: jest
          .fn()
          .mockReturnValue(of(WEATHER_AIR_QUALITY_DATA_POINTS).pipe(delay(NETWORK_REQUEST_TIME / 3))),
      })
      .provideMock(SharedModule);
  });

  describe('data fetching', () => {
    it('should show a loader when fetching data and clear when all data has been loaded', async () => {
      const { inject } = await shallow.render();

      const messageService = inject(MessageService);
      expect(messageService.add).toHaveBeenNthCalledWith(1, expect.objectContaining({ key: 'loading' }));

      jest.advanceTimersByTime(NETWORK_REQUEST_TIME);

      expect(messageService.clear).toHaveBeenNthCalledWith(1, 'loading');
    });
  });

  describe('markers', () => {
    it('should show marker detail on click and close on close', async () => {
      const { fixture, findComponent } = await shallow.render();

      jest.advanceTimersByTime(NETWORK_REQUEST_TIME);

      expect(findComponent(DashboardDataPointDetailComponent)).toHaveFound(0);

      findComponent(MapComponent).markerClick.emit([1, 1]);

      await fixture.whenStable();
      fixture.detectChanges();

      expect(findComponent(MapComponent).markers.map(({ active }) => active)).toEqual([
        false,
        false,
        false,
        false,
        true,
        false,
      ]);
      expect(findComponent(DashboardDataPointDetailComponent).dataPoint).toBe(WEATHER_CONDITION_DATA_POINTS[0]);
      findComponent(DashboardDataPointDetailComponent).close.emit();

      await fixture.whenStable();
      fixture.detectChanges();

      expect(findComponent(MapComponent).markers.map(({ active }) => active)).toEqual([
        false,
        false,
        false,
        false,
        false,
        false,
      ]);
      expect(findComponent(DashboardDataPointDetailComponent)).toHaveFound(0);
    });
  });

  describe('weather condition data points', () => {
    it('should create markers for every point', async () => {
      const { findComponent, fixture } = await shallow.render();

      jest.advanceTimersByTime(NETWORK_REQUEST_TIME);
      fixture.detectChanges();

      expect(findComponent(MapComponent).markers).toEqual([
        {
          location: [5, 5],
          icon: DATA_POINT_TYPE_ICON[DataPointType.AIR_QUALITY],
          color: DATA_POINT_QUALITY_COLOR_CHART[DataPointQuality.GOOD],
        },
        {
          location: [6, 6],
          icon: DATA_POINT_TYPE_ICON[DataPointType.AIR_QUALITY],
          color: DATA_POINT_QUALITY_COLOR_CHART[DataPointQuality.VERY_POOR],
        },
        {
          location: [3, 3],
          icon: DATA_POINT_TYPE_ICON[DataPointType.STORM_WATER],
          color: DATA_POINT_QUALITY_COLOR_CHART[DataPointQuality.GOOD],
        },
        {
          location: [4, 4],
          icon: DATA_POINT_TYPE_ICON[DataPointType.STORM_WATER],
          color: DATA_POINT_QUALITY_COLOR_CHART[DataPointQuality.FAIR],
        },
        {
          location: [1, 1],
          icon: DATA_POINT_TYPE_ICON[DataPointType.WEATHER_CONDITIONS],
          color: DATA_POINT_QUALITY_COLOR_CHART[DataPointQuality.GOOD],
        },
        {
          location: [2, 2],
          icon: DATA_POINT_TYPE_ICON[DataPointType.WEATHER_CONDITIONS],
          color: DATA_POINT_QUALITY_COLOR_CHART[DataPointQuality.FAIR],
        },
      ]);
    });
  });

  describe('focus location', () => {
    it('should set center off map to search bar address', async () => {
      const location = [4, 4] as LatLong;

      const { instance } = await shallow
        .mock(LocationService, {
          locationPermissionState$: of('granted' as PermissionState),
          userLocation$: of({
            loading: false,
            location: [0, 0],
          } as UserLocation),
        })
        .render();

      instance.locationFormControl.setValue(location);

      instance.mapCenter$.pipe(take(1)).subscribe((center) => expect(center).toBe(location));
    });

    it('should set center on map when user location is available', async () => {
      const currentLocation = [4, 4] as LatLong;

      const { find, instance } = await shallow
        .mock(LocationService, {
          locationPermissionState$: of('granted' as PermissionState),
          userLocation$: of({
            loading: false,
            location: currentLocation,
          } as UserLocation),
        })
        .render();

      find('.focus-location').triggerEventHandler('click');

      expect(await firstValueFrom(instance.mapCenter$)).toEqual(currentLocation);
    });

    it('should show alert when permission state is "denied"', async () => {
      const { find, fixture } = await shallow
        .mock(LocationService, {
          locationPermissionState$: of('denied' as PermissionState),
          userLocation$: of({
            loading: false,
            location: undefined,
          }),
        })
        .render();

      jest.spyOn(window, 'alert').mockImplementation(jest.fn);

      find('.focus-location').triggerEventHandler('click');
      await fixture.whenStable();

      expect(window.alert).toHaveBeenCalled();
    });
  });
});

const WEATHER_CONDITION_DATA_POINTS: WeatherConditionDataPoint[] = [
  {
    location: [1, 1],
    type: DataPointType.WEATHER_CONDITIONS,
    quality: DataPointQuality.GOOD,
    name: 'Lappeenranta Weather Station',
    data: {},
  },
  {
    location: [2, 2],
    type: DataPointType.WEATHER_CONDITIONS,
    quality: DataPointQuality.FAIR,
    name: 'Lappeenranta Weather Hub',
    data: {},
  },
];

const WEATHER_STORM_WATER_DATA_POINTS: WeatherStormWaterDataPoint[] = [
  {
    location: [3, 3],
    type: DataPointType.STORM_WATER,
    quality: DataPointQuality.GOOD,
    name: 'Lappeenranta Weather Station',
    data: {},
  },
  {
    location: [4, 4],
    type: DataPointType.STORM_WATER,
    quality: DataPointQuality.FAIR,
    name: 'Lappeenranta Weather Hub',
    data: {},
  },
];

const WEATHER_AIR_QUALITY_DATA_POINTS: WeatherAirQualityDataPoint[] = [
  {
    location: [5, 5],
    type: DataPointType.AIR_QUALITY,
    quality: DataPointQuality.GOOD,
    name: 'Air Quality Station 1',
  },
  {
    location: [6, 6],
    type: DataPointType.AIR_QUALITY,
    quality: DataPointQuality.VERY_POOR,
    name: 'Air Quality Station 2',
  },
];
