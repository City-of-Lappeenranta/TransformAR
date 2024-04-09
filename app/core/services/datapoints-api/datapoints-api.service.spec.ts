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

  describe('weather', () => {
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

    it('should return an observable of the storm water', async () => {
      const { instance } = shallow.createService();

      const response = await firstValueFrom(instance.getWeatherStormWater());

      expect(response).toEqual([
        {
          data: {
            electricalConductivity: 210,
            fillLevel: 90,
            flowRate: 1200,
            turbidity: 25,
            waterLevel: 3.5,
            waterTemperature: 28.6,
          },
          location: [61.06343, 28.18027],
          name: 'Storm water well',
          quality: 0,
          type: 2,
        },
      ]);
    });

    it('should return an observable of the air quality', async () => {
      const { instance } = shallow.createService();

      const response = await firstValueFrom(instance.getWeatherAirQuality());

      expect(response).toEqual([
        { location: [61.05871, 28.18871], name: 'Air Quality Station', quality: 1, type: 1 },
        { location: [61.056871, 28.183503], name: 'Air Quality Station 2', quality: 5, type: 1 },
      ]);
    });
  });
});
