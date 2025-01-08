import {
  DATA_POINT_QUALITY_COLOR_CHART,
  DataPoint,
  DataPointQuality,
  DataPointType,
  ParkingDataPoint,
  RoadWorksDataPoint,
  WaterbagTestKitDataPoint,
  WeatherAirQualityDataPoint,
  WeatherConditionDataPoint,
  WeatherStormWaterDataPoint,
} from '@core/models/data-point';
import { RadarService } from '@core/services/radar.service';
import { TranslateService } from '@ngx-translate/core';
import { SharedModule } from 'primeng/api';
import { Chip } from 'primeng/chip';
import { Shallow } from 'shallow-render';
import { DashboardModule } from '../../dashboard.module';
import { DashboardDataPointDetailComponent } from './dashboard-data-point-detail.component';

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

  describe('data points input', () => {
    it('should search and display address and name if data point is provided', async () => {
      const dataPoints = [
        {
          type: DataPointType.WEATHER_CONDITIONS,
          location: [123, 456],
          quality: DataPointQuality.GOOD,
          name: 'Point 1',
        },
        {
          type: DataPointType.STORM_WATER,
          location: [123, 456],
          quality: DataPointQuality.GOOD,
          name: 'Point 2',
          data: { fillLevel: 2 },
        },
      ];

      const { inject, fixture, find } = await shallow.render(
        '<app-dashboard-data-point-detail [dataPoints]="dataPoints"></app-dashboard-data-point-detail>',
        { bind: { dataPoints } },
      );
      const radarService = inject(RadarService);

      fixture.detectChanges();

      expect(radarService.reverseGeocode).toHaveBeenCalledWith([123, 456]);
      expect(find('p')[0].nativeElement.innerHTML).toBe(address);
      expect(find('h1').nativeElement.innerHTML).toBe('Point 1, Point 2');
    });

    describe('it should show the correct information by type', () => {
      it('when type is storm water point', async () => {
        const name = 'Lappeenranta Weather Station';

        const dataPoints: WeatherStormWaterDataPoint[] = [
          {
            name,
            type: DataPointType.STORM_WATER,
            quality: DataPointQuality.DEFAULT,
            data: {
              fillLevel: 3,
            },
            lastUpdatedOn: new Date(1711635283),
            location: [61.05871, 28.18871],
          },
        ];

        const { fixture, find } = await shallow.render(
          '<app-dashboard-data-point-detail [dataPoints]="dataPoints"></app-dashboard-data-point-detail>',
          { bind: { dataPoints } },
        );

        fixture.detectChanges();

        expect(find('.metric-container')).toHaveFound(1);
        expect(find('h1').nativeElement.innerHTML).toEqual(name);
        expect(find('p.body-xs').nativeElement.innerHTML).toEqual(address);
        expect(find('li').length).toEqual(3);
      });

      it('when type is weather condition', async () => {
        const name = 'Hurricane Delta';

        const dataPoints: WeatherConditionDataPoint[] = [
          {
            name,
            type: DataPointType.WEATHER_CONDITIONS,
            quality: DataPointQuality.DEFAULT,
            data: {
              humidity: 60,
              streetState: 'icy',
              temperature: -4,
            },
            lastUpdatedOn: new Date(1711635283),
            location: [61.05871, 28.18871],
          },
        ];

        const { fixture, find } = await shallow.render(
          '<app-dashboard-data-point-detail [dataPoints]="dataPoints"></app-dashboard-data-point-detail>',
          { bind: { dataPoints } },
        );

        fixture.detectChanges();

        expect(find('.metric-container')).toHaveFound(1);
        expect(find('h1').nativeElement.innerHTML).toEqual(name);
        expect(find('p.body-xs').nativeElement.innerHTML).toEqual(address);
        expect(find('li').length).toEqual(
          Object.keys(dataPoints[0].data).length + 1,
        );
      });

      it('when type is weather air quality', async () => {
        const name = 'Air Quality Station';
        const quality = DataPointQuality.GOOD;

        const dataPoints: WeatherAirQualityDataPoint[] = [
          {
            name,
            type: DataPointType.AIR_QUALITY,
            quality,
            lastUpdatedOn: new Date(1711635283),
            location: [61.05871, 28.18871],
          },
        ];

        const { fixture, find, findComponent } = await shallow.render(
          '<app-dashboard-data-point-detail [dataPoints]="dataPoints"></app-dashboard-data-point-detail>',
          { bind: { dataPoints } },
        );

        await fixture.whenStable();
        fixture.detectChanges();

        expect(find('.metric-container')).toHaveFound(1);
        expect(find('h1').nativeElement.innerHTML).toEqual(name);
        expect(find('p.body-xs').nativeElement.innerHTML).toEqual(address);
        expect(find('p.button-sm').length).toEqual(2);
        expect(findComponent(Chip)?.style?.['background-color']).toEqual(
          DATA_POINT_QUALITY_COLOR_CHART[quality],
        );
      });

      it('when type is waterbag testkit', async () => {
        const name = 'Testkit';
        const quality = DataPointQuality.GOOD;

        const dataPoints: WaterbagTestKitDataPoint[] = [
          {
            name,
            type: DataPointType.WATERBAG_TESTKIT,
            quality,
            lastUpdatedOn: new Date(1711635283),
            location: [61.05871, 28.18871],
            data: {
              airTemp: { value: 1, result: 1 },
              waterTemp: { value: 1, result: 1 },
              visibility: { value: 1, result: 1 },
              waterPh: { value: 1, result: 1 },
              turbidity: { value: 1, result: 1 },
              dissolvedOxygen: { value: 1, result: 1 },
              nitrate: { value: 1, result: 1 },
              phosphate: { value: 1, result: 1 },
            },
          },
        ];

        const { fixture, find, findComponent } = await shallow.render(
          '<app-dashboard-data-point-detail [dataPoints]="dataPoints"></app-dashboard-data-point-detail>',
          { bind: { dataPoints } },
        );

        await fixture.whenStable();
        fixture.detectChanges();

        expect(find('.metric-container')).toHaveFound(1);
        expect(find('h1').nativeElement.innerHTML).toEqual(
          'DASHBOARD.DATA_POINTS.WATERBAG_TESTKIT.TITLE',
        );
        expect(find('p.body-xs').nativeElement.innerHTML).toEqual(address);
        expect(findComponent(Chip).length).toEqual(8);
      });

      it('when type is parking', async () => {
        const name = 'City Parking';
        const quality = DataPointQuality.DEFAULT;

        const dataPoints: ParkingDataPoint[] = [
          {
            name,
            quality,
            type: DataPointType.PARKING,
            location: [61.05871, 28.18871],
            availableSpots: 1,
            lastUpdatedOn: new Date(1711635283000),
          },
        ];

        const { fixture, find } = await shallow.render(
          '<app-dashboard-data-point-detail [dataPoints]="dataPoints"></app-dashboard-data-point-detail>',
          { bind: { dataPoints } },
        );

        await fixture.whenStable();
        fixture.detectChanges();

        expect(find('.metric-container')).toHaveFound(1);
        expect(find('h1').nativeElement.innerHTML).toEqual(name);
        expect(find('p.body-xs').nativeElement.innerHTML).toEqual(address);
        expect(find('p.button-sm').length).toEqual(2);
        expect(find('small.body-sm').nativeElement.innerHTML).toEqual('1');
      });

      it('when type is road works', async () => {
        const name = 'Road works';
        const quality = DataPointQuality.DEFAULT;

        const dataPoints: RoadWorksDataPoint[] = [
          {
            name,
            quality,
            type: DataPointType.ROAD_WORKS,
            location: [61.05871, 28.18871],
            validFrom: '01.01.2024',
            validTo: '01.02.2024',
          },
        ];

        const { fixture, find } = await shallow.render(
          '<app-dashboard-data-point-detail [dataPoints]="dataPoints"></app-dashboard-data-point-detail>',
          { bind: { dataPoints } },
        );

        await fixture.whenStable();
        fixture.detectChanges();

        expect(find('.metric-container')).toHaveFound(1);
        expect(find('h1').nativeElement.innerHTML).toEqual(name);
        expect(find('p.body-xs').nativeElement.innerHTML).toEqual(address);
        expect(find('p.button-sm').length).toEqual(2);
      });

      it('should show multiple data points', async () => {
        const quality = DataPointQuality.DEFAULT;

        const dataPoints: DataPoint[] = [
          {
            name: 'Weather hub',
            quality,
            type: DataPointType.WEATHER_CONDITIONS,
            location: [61.05871, 28.18871],
            data: {},
            lastUpdatedOn: new Date(1711635283000),
          },
          {
            name: 'City Parking',
            quality,
            type: DataPointType.PARKING,
            location: [61.05871, 28.18871],
            availableSpots: 1,
            lastUpdatedOn: new Date(1731050040000),
          },
        ];

        const { fixture, find } = await shallow.render(
          '<app-dashboard-data-point-detail [dataPoints]="dataPoints"></app-dashboard-data-point-detail>',
          { bind: { dataPoints } },
        );

        await fixture.whenStable();
        fixture.detectChanges();

        expect(find('.metric-container')).toHaveFound(2);
        expect(find('h1').nativeElement.innerHTML).toEqual(
          'Weather hub, City Parking',
        );
        expect(find('p.body-xs').nativeElement.innerHTML).toEqual(address);
        expect(find('p.button-sm').length).toEqual(3);
        expect(find('small.body-sm')[0].nativeElement.innerHTML).toEqual('1');
      });
    });
  });
});
