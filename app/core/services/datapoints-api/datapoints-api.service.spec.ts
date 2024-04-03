import { firstValueFrom } from 'rxjs';
import { Shallow } from 'shallow-render';
import { CoreModule } from '../../core.module';
import { DataPointsApi } from './datapoints-api.service';
import { DataPointQuality, DataPointType } from '@core/models/data-point';

describe('DataPointsApi', () => {
  let shallow: Shallow<DataPointsApi>;

  beforeEach(() => {
    shallow = new Shallow(DataPointsApi, CoreModule);
  });

  describe('weather conditions', () => {
    it('should return an observable of weather conditions', async () => {
      const { instance } = shallow.createService();

      const response = await firstValueFrom(instance.getWeatherConditions());

      expect(response).toEqual([
        {
          data: expect.anything(),
          lastUpdateOn: 1711635283,
          location: [61.05871, 28.18871],
          name: 'Lappeenranta Weather Station',
          quality: DataPointQuality.DEFAULT,
          type: DataPointType.WEATHER_CONDITIONS,
        },
      ]);
    });
  });

  describe('parking', () => {
    it('should return an observable of parking data points', async () => {
      const { instance } = shallow.createService();

      const response = await firstValueFrom(instance.getParking());

      expect(response).toEqual([
        {
          location: [61.05619, 28.19263],
          name: 'Lappeenranta City Parking',
          quality: DataPointQuality.DEFAULT,
          type: DataPointType.PARKING,
          availableSpots: 40,
        },
      ]);
    });
  });
});
