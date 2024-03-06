import { DataPointsApi } from '@core/services/datapoints-api.service';
import { Shallow } from 'shallow-render';
import { DashboardModule } from '../../dashboard.module';
import { DashboardMapComponent } from './dashboard-map.component';
import { DataPointType, WeatherDataPoint } from '@core/models/data-points-api';
import { of } from 'rxjs';
import { MapComponent } from '@shared/components/map/map.component';
import { DashboardDataPointDetailComponent } from '../dashboard-data-point-detail/dashboard-data-point-detail.component';

describe('DashboardMapComponent', () => {
  let shallow: Shallow<DashboardMapComponent>;

  beforeEach(() => {
    shallow = new Shallow(DashboardMapComponent, DashboardModule).mock(DataPointsApi, {
      getWeatherDataPoints: jest.fn().mockReturnValue(of(WEATHER_DATA_POINTS)),
    });
  });

  describe('markers', () => {
    it('should show marker detail on click and close on close', async () => {
      const { findComponent, fixture } = await shallow.render();
      expect(findComponent(DashboardDataPointDetailComponent)).toHaveFound(0);

      findComponent(MapComponent).markerClick.emit([1, 1]);
      fixture.detectChanges();

      expect(findComponent(DashboardDataPointDetailComponent).dataPoint).toBe(WEATHER_DATA_POINTS[0]);
      findComponent(DashboardDataPointDetailComponent).close.emit();
      fixture.detectChanges();

      expect(findComponent(DashboardDataPointDetailComponent)).toHaveFound(0);
    });
  });

  describe('weather data points', () => {
    it('should create markers for every point', async () => {
      const { findComponent } = await shallow.render();
      expect(findComponent(MapComponent).markers).toEqual([{ location: [1, 1] }, { location: [2, 2] }]);
    });
  });
});

const WEATHER_DATA_POINTS: WeatherDataPoint[] = [
  {
    location: [1, 1],
    type: DataPointType.WEATHER,
    airTemperature: 0,
    airMoisture: 0,
    dewPoint: 0,
    wind: 0,
    rainFall: 0,
    snowDepth: 0,
  },
  {
    location: [2, 2],
    type: DataPointType.WEATHER,
    airTemperature: 0,
    airMoisture: 0,
    dewPoint: 0,
    wind: 0,
    rainFall: 0,
    snowDepth: 0,
  },
];
