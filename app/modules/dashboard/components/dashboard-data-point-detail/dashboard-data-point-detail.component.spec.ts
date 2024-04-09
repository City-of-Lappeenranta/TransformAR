import {
  DATA_POINT_QUALITY_COLOR_CHART,
  DataPoint,
  DataPointQuality,
  DataPointType,
  ParkingDataPoint,
  WeatherAirQualityDataPoint,
  WeatherConditionDataPoint,
  WeatherStormWaterDataPoint,
} from '@core/models/data-point';
import { RadarService } from '@core/services/radar.service';
import { Shallow } from 'shallow-render';
import { DashboardModule } from '../../dashboard.module';
import { DashboardDataPointDetailComponent } from './dashboard-data-point-detail.component';
import { SharedModule } from 'primeng/api';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Chip } from 'primeng/chip';

jest.useFakeTimers();

describe('DashboardDataPointDetailComponent', () => {
  let shallow: Shallow<DashboardDataPointDetailComponent>;

  const address = 'Huopatehtaankatu 4';

  beforeEach(() => {
    shallow = new Shallow(DashboardDataPointDetailComponent, DashboardModule)
      .mock(TranslateService, { instant: jest.fn((key) => key) })
      .mock(RadarService, {
        reverseGeocode: jest.fn().mockReturnValue(address),
      })
      .provideMock(SharedModule);
  });

  describe('data point input', () => {
    it('should search and display address if data point is provided', async () => {
      const dataPoint: DataPoint = {
        type: DataPointType.WEATHER_CONDITIONS,
        location: [123, 456],
        quality: DataPointQuality.GOOD,
      } as DataPoint;

      const { inject, fixture, find } = await shallow.render(
        '<app-dashboard-data-point-detail [dataPoint]="dataPoint"></app-dashboard-data-point-detail>',
        { bind: { dataPoint } },
      );
      const radarService = inject(RadarService);

      fixture.detectChanges();

      expect(radarService.reverseGeocode).toHaveBeenCalledWith([123, 456]);
      expect(find('p').nativeElement.innerHTML).toBe(address);
    });

    describe('it should show the correct information by type', () => {
      it('when type is storm water point', async () => {
        const name = 'Lappeenranta Weather Station';

        const dataPoint: WeatherStormWaterDataPoint = {
          name,
          type: DataPointType.STORM_WATER,
          quality: DataPointQuality.DEFAULT,
          data: {
            humidity: 60,
            streetState: 'icy',
            temperature: -4,
          },
          lastUpdateOn: 1711635283,
          location: [61.05871, 28.18871],
        };

        const { fixture, find } = await shallow.render(
          '<app-dashboard-data-point-detail [dataPoint]="dataPoint"></app-dashboard-data-point-detail>',
          { bind: { dataPoint } },
        );

        fixture.detectChanges();

        expect(find('.metric-container')).toHaveFound(1);
        expect(find('h1').nativeElement.innerHTML).toEqual(name);
        expect(find('p.body-xs').nativeElement.innerHTML).toEqual(address);
        expect(find('li').length).toEqual(Object.keys(dataPoint.data).length);
      });

      it('when type is weather condition', async () => {
        const name = 'Hurricane Delta';

        const dataPoint: WeatherConditionDataPoint = {
          name,
          type: DataPointType.WEATHER_CONDITIONS,
          quality: DataPointQuality.DEFAULT,
          data: {
            humidity: 60,
            streetState: 'icy',
            temperature: -4,
          },
          lastUpdateOn: 1711635283,
          location: [61.05871, 28.18871],
        };

        const { fixture, find } = await shallow.render(
          '<app-dashboard-data-point-detail [dataPoint]="dataPoint"></app-dashboard-data-point-detail>',
          { bind: { dataPoint } },
        );

        fixture.detectChanges();

        expect(find('.metric-container')).toHaveFound(1);
        expect(find('h1').nativeElement.innerHTML).toEqual(name);
        expect(find('p.body-xs').nativeElement.innerHTML).toEqual(address);
        expect(find('li').length).toEqual(Object.keys(dataPoint.data).length);
      });

      it('when type is weather air quality', async () => {
        const name = 'Air Quality Station';
        const quality = DataPointQuality.GOOD;

        const dataPoint: WeatherAirQualityDataPoint = {
          name,
          type: DataPointType.AIR_QUALITY,
          quality,
          lastUpdateOn: 1711635283,
          location: [61.05871, 28.18871],
        };

        const { fixture, find, findComponent } = await shallow.render(
          '<app-dashboard-data-point-detail [dataPoint]="dataPoint"></app-dashboard-data-point-detail>',
          { bind: { dataPoint } },
        );

        await fixture.whenStable();
        fixture.detectChanges();

        expect(find('.metric-container')).toHaveFound(1);
        expect(find('h1').nativeElement.innerHTML).toEqual(name);
        expect(find('p.body-xs').nativeElement.innerHTML).toEqual(address);
        expect(find('p.button-sm').length).toEqual(1);
        expect(findComponent(Chip)?.style?.['background-color']).toEqual(DATA_POINT_QUALITY_COLOR_CHART[quality]);
      });

      it('when type is parking', async () => {
        const name = 'City Parking';
        const quality = DataPointQuality.DEFAULT;

        const dataPoint: ParkingDataPoint = {
          name,
          quality,
          type: DataPointType.PARKING,
          location: [61.05871, 28.18871],
          availableSpots: 1,
        };

        const { fixture, find } = await shallow.render(
          '<app-dashboard-data-point-detail [dataPoint]="dataPoint"></app-dashboard-data-point-detail>',
          { bind: { dataPoint } },
        );

        await fixture.whenStable();
        fixture.detectChanges();

        expect(find('.metric-container')).toHaveFound(1);
        expect(find('h1').nativeElement.innerHTML).toEqual(name);
        expect(find('p.body-xs').nativeElement.innerHTML).toEqual(address);
        expect(find('p.button-sm').length).toEqual(1);
        expect(find('.body-sm').nativeElement.innerHTML).toEqual('1');
      });
    });
  });
});
