import { DataPoint, DataPointType, WeatherDataPoint } from '@core/models/data-point';
import { RadarService } from '@core/services/radar.service';
import { Shallow } from 'shallow-render';
import { DashboardModule } from '../../dashboard.module';
import { DashboardDataPointDetailComponent } from './dashboard-data-point-detail.component';
import { SharedModule } from 'primeng/api';

jest.useFakeTimers();

describe('DashboardDataPointDetailComponent', () => {
  let shallow: Shallow<DashboardDataPointDetailComponent>;

  beforeEach(() => {
    shallow = new Shallow(DashboardDataPointDetailComponent, DashboardModule)
      .mock(RadarService, {
        reverseGeocodeLocationToAddressLabel: jest.fn().mockReturnValue('Lappeenranta'),
      })
      .provideMock(SharedModule);
  });

  describe('data point input', () => {
    it('should search and display address if data point is provided', async () => {
      const dataPoint: DataPoint = {
        type: DataPointType.WEATHER,
        location: [123, 456],
      } as DataPoint;

      const { inject, fixture, find } = await shallow.render(
        `<app-dashboard-data-point-detail [dataPoint]="dataPoint"></app-dashboard-data-point-detail>`,
        { bind: { dataPoint } },
      );
      const radarService = inject(RadarService);

      fixture.detectChanges();

      expect(radarService.reverseGeocodeLocationToAddressLabel).toHaveBeenCalledWith([123, 456]);
      expect(find('h1').nativeElement.innerHTML).toBe('Lappeenranta');
    });

    describe('it should show the correct information by type', () => {
      it('when type is weather data point', async () => {
        const dataPoint: WeatherDataPoint = {
          location: [123, 456],
          type: DataPointType.WEATHER,
          airTemperature: 0,
          airMoisture: 0,
          dewPoint: 0,
          wind: 0,
          rainFall: 0,
          snowDepth: 0,
        };

        const { fixture, find } = await shallow.render(
          `<app-dashboard-data-point-detail [dataPoint]="dataPoint"></app-dashboard-data-point-detail>`,
          { bind: { dataPoint } },
        );

        fixture.detectChanges();
        expect(find('.weather-data-container')).toHaveFound(1);
        expect(fixture).toMatchSnapshot();
      });
    });
  });
});
