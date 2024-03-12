import { DataPointsApi } from '@core/services/datapoints-api.service';
import { Shallow } from 'shallow-render';
import { DashboardModule } from '../../dashboard.module';
import { DashboardMapComponent } from './dashboard-map.component';
import {
  DATA_POINT_QUALITY_COLOR_CHART,
  DATA_POINT_TYPE_ICON,
  DataPointQuality,
  DataPointType,
  WeatherDataPoint,
} from '@core/models/data-point';
import { of } from 'rxjs';
import { MapComponent } from '@shared/components/map/map.component';
import { DashboardDataPointDetailComponent } from '../dashboard-data-point-detail/dashboard-data-point-detail.component';
import { SharedModule } from 'primeng/api';

describe('DashboardMapComponent', () => {
  let shallow: Shallow<DashboardMapComponent>;

  beforeEach(() => {
    shallow = new Shallow(DashboardMapComponent, DashboardModule)
      .mock(DataPointsApi, {
        getWeatherDataPoints: jest.fn().mockReturnValue(of(WEATHER_DATA_POINTS)),
      })
      .provideMock(SharedModule);
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
