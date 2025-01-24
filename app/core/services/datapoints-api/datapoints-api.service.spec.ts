import { HttpClient } from '@angular/common/http';
import { DataPointQuality, DataPointType } from '@core/models/data-point';
import { firstValueFrom } from 'rxjs';
import { Shallow } from 'shallow-render';
import { CoreModule } from '../../core.module';
import { MockHttpClient } from '../mock-http-client';
import { DataPointsApi } from './datapoints-api.service';

describe('DataPointsApi', () => {
  let shallow: Shallow<DataPointsApi>;

  beforeEach(() => {
    shallow = new Shallow(DataPointsApi, CoreModule).mock(HttpClient, { get: new MockHttpClient().get });
  });

  it('should return an observable of weather conditions', async () => {
    const { instance } = shallow.createService();

    const response = await firstValueFrom(instance.getWeatherConditions());

    expect(response).toEqual([
      {
        data: expect.anything(),
        lastUpdatedOn: new Date(1711635283 * 1000),
        location: [61.05871, 28.18871],
        name: 'Lappeenranta Weather Station',
        quality: DataPointQuality.DEFAULT,
        type: DataPointType.WEATHER_CONDITIONS,
      },
    ]);
  });

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
        lastUpdatedOn: new Date(1711635283 * 1000),
      },
    ]);
  });

  it('should return an observable of road works data points', async () => {
    const { instance } = shallow.createService();

    const response = await firstValueFrom(instance.getRoadWorks());

    expect(response).toEqual([
      {
        location: [61.05619, 28.19263],
        name: 'Filling potholes',
        quality: DataPointQuality.DEFAULT,
        type: DataPointType.ROAD_WORKS,
        validFrom: '01.06.2024',
        validTo: '28.06.2024',
      },
    ]);
  });

  it('should return an observable of the storm water', async () => {
    const { instance } = shallow.createService();

    const response = await firstValueFrom(instance.getWeatherStormWater());

    expect(response).toEqual([
      {
        data: {
          fillLevel: 2,
        },
        location: [61.06343, 28.18027],
        name: 'Storm water well',
        quality: 3,
        type: 2,
        lastUpdatedOn: new Date(1711635283 * 1000)
      },
    ]);
  });

  it('should return an observable of the air quality', async () => {
    const { instance } = shallow.createService();

    const response = await firstValueFrom(instance.getWeatherAirQuality());

    expect(response).toEqual([
      { location: [61.05871, 28.18871], name: 'Air Quality Station', quality: 1, type: 1, lastUpdatedOn: new Date(1711635283 * 1000) },
      { location: [61.056871, 28.183503], name: 'Air Quality Station 2', quality: 5, type: 1, lastUpdatedOn: new Date(1711635283 * 1000) },
    ]);
  });

  it('should return an observable of waterbag testkits', async () => {
    const { instance } = shallow.createService();

    const response = await firstValueFrom(instance.getWaterbagTestKits());

    expect(response).toEqual([
      {
        location: [61.06433, 28.19235],
        imageUrl: 'img-url',
        name: 'test-2',
        lastUpdatedOn: new Date(1717155485 * 1000),
        quality: DataPointQuality.DEFAULT,
        type: DataPointType.WATERBAG_TESTKIT,
        data: {
          algae: {
            dataRetrievedTimestamp: 1717155485,
            value: 1,
          },
          airTemp: {
            dataRetrievedTimestamp: 1717155485,
            value: 27.3,
          },
          visibility: {
            dataRetrievedTimestamp: 1717155485,
            value: 155,
          },
          nitrate: {
            dataRetrievedTimestamp: 1717155485,
            result: 2,
            value: 5,
          },
          turbidity: {
            dataRetrievedTimestamp: 1717155485,
            result: 3,
            value: 0,
          },
          waterTemp: {
            dataRetrievedTimestamp: 1717155485,
            value: 21,
          },
          waterPh: {
            dataRetrievedTimestamp: 1717155485,
            result: 4,
            value: 7,
          },
          phosphate: {
            dataRetrievedTimestamp: 1717155485,
            result: 3,
            value: 1,
          },
          dissolvedOxygen: {
            result: 3,
            calculatedValue: 90,
            dataRetrievedTimestamp: 1717155485,
            value: 8,
          },
        },
      },
    ]);
  });
});
