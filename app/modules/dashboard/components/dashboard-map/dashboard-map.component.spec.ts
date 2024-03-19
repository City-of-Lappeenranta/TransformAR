import {
  DATA_POINT_QUALITY_COLOR_CHART,
  DATA_POINT_TYPE_ICON,
  DataPointQuality,
  DataPointType,
  WeatherDataPoint,
} from '@core/models/data-point';
import { LatLong } from '@core/models/location';
import { DataPointsApi } from '@core/services/datapoints-api.service';
import { LocationService, UserLocation } from '@core/services/location.service';
import { MapComponent } from '@shared/components/map/map.component';
import { MessageService, SharedModule } from 'primeng/api';
import { delay, firstValueFrom, of, take } from 'rxjs';
import { Shallow } from 'shallow-render';
import { DashboardModule } from '../../dashboard.module';
import { DashboardDataPointDetailComponent } from '../dashboard-data-point-detail/dashboard-data-point-detail.component';
import { DashboardMapComponent } from './dashboard-map.component';

describe('DashboardMapComponent', () => {
  let shallow: Shallow<DashboardMapComponent>;

  beforeEach(() => {
    shallow = new Shallow(DashboardMapComponent, DashboardModule)
      .mock(MessageService, { add: jest.fn(), clear: jest.fn() })
      .mock(DataPointsApi, {
        getWeatherDataPoints: jest.fn().mockReturnValue(of(WEATHER_DATA_POINTS)),
      })
      .provideMock(SharedModule);
  });

  describe('data fetching', () => {
    it('should show a loader when fetching data and clear when all data has been loaded', async () => {
      jest.useFakeTimers();
      const { inject } = await shallow
        .mock(DataPointsApi, {
          getWeatherDataPoints: jest.fn().mockReturnValue(of(WEATHER_DATA_POINTS).pipe(delay(2000))),
        })
        .render();

      const messageService = inject(MessageService);
      expect(messageService.add).toHaveBeenNthCalledWith(1, expect.objectContaining({ key: 'loading' }));

      jest.advanceTimersByTime(2000);

      expect(messageService.clear).toHaveBeenNthCalledWith(1, 'loading');
    });
  });

  describe('markers', () => {
    it('should show marker detail on click and close on close', async () => {
      const { findComponent, fixture } = await shallow.render();
      expect(findComponent(DashboardDataPointDetailComponent)).toHaveFound(0);

      findComponent(MapComponent).markerClick.emit([1, 1]);
      fixture.detectChanges();

      expect(findComponent(MapComponent).markers.map(({ active }) => active)).toEqual([true, false]);
      expect(findComponent(DashboardDataPointDetailComponent).dataPoint).toBe(WEATHER_DATA_POINTS[0]);
      findComponent(DashboardDataPointDetailComponent).close.emit();
      fixture.detectChanges();

      expect(findComponent(MapComponent).markers.map(({ active }) => active)).toEqual([false, false]);
      expect(findComponent(DashboardDataPointDetailComponent)).toHaveFound(0);
    });
  });

  describe('weather data points', () => {
    it('should create markers for every point', async () => {
      const { findComponent } = await shallow.render();

      expect(findComponent(MapComponent).markers).toEqual([
        {
          location: [1, 1],
          icon: DATA_POINT_TYPE_ICON[DataPointType.WEATHER],
          color: DATA_POINT_QUALITY_COLOR_CHART[DataPointQuality.GOOD],
        },
        {
          location: [2, 2],
          icon: DATA_POINT_TYPE_ICON[DataPointType.WEATHER],
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

      expect(window.alert).toHaveBeenCalledWith(
        'Allow the app to determine your location. You can do this in your device settings',
      );
    });
  });
});

const WEATHER_DATA_POINTS: WeatherDataPoint[] = [
  {
    location: [1, 1],
    type: DataPointType.WEATHER,
    quality: DataPointQuality.GOOD,
    data: {
      airTemperature: 0,
      airMoisture: 0,
      dewPoint: 0,
      wind: 0,
      rainFall: 0,
      snowDepth: 0,
    },
  },
  {
    location: [2, 2],
    type: DataPointType.WEATHER,
    quality: DataPointQuality.FAIR,
    data: {
      airTemperature: 0,
      airMoisture: 0,
      dewPoint: 0,
      wind: 0,
      rainFall: 0,
      snowDepth: 0,
    },
  },
];
