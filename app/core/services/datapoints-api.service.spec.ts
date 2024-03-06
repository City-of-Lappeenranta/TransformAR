import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ServiceDictionary } from '@core/models/service-api';
import { of } from 'rxjs';
import { Shallow } from 'shallow-render';
import { CoreModule } from '../core.module';
import { DataPointsApi, OpenWeatherDataResponse } from './datapoints-api.service';
import { DataPointType } from '@core/models/data-points-api';

describe('DataPointsApi', () => {
  let shallow: Shallow<DataPointsApi>;

  beforeEach(() => {
    shallow = new Shallow(DataPointsApi, CoreModule).replaceModule(HttpClientModule, HttpClientTestingModule);
  });

  describe('getWeatherDataPoints', () => {
    it('should return weather data points for every result', (done) => {
      const { instance } = shallow.mock(HttpClient, { get: () => of(MOCK_GET_WEATHER_DATA_RESPONSE) }).createService();

      instance.getWeatherDataPoints().subscribe((result) => {
        expect(result).toEqual(WEATHER_DATA_POINTS);
        done();
      });
    });
  });
});

const MOCK_GET_WEATHER_DATA_RESPONSE: OpenWeatherDataResponse = {
  result: [
    {
      id: 'S012',
      dataSourceId: 'TECONER',
      coordinates: {
        latitudeValue: 61.06102,
        longitudeValue: 28.181953,
      },
      sensors: [
        {
          version: 1,
          id: 'S012',
          timestampUTC: 1709718279000,
          friction: 0.81,
          state: 'dry',
          ta: 2.8,
          tsurf: 2.74,
          tdew: -2.1,
          rh: 70.2,
          water: 0.0,
          tground: -0.59,
          ice: 0.0,
          pressure: 1019.25,
          wspd: 3.6,
        },
      ],
    },
  ],
  message: 'Weather data collected successfully!',
  success: true,
  responseCode: 200,
  totalSize: 6,
};

const WEATHER_DATA_POINTS = [
  {
    type: DataPointType.WEATHER,
    airMoisture: 70.2,
    airTemperature: 2.8,
    dewPoint: -2.1,
    location: [61.06102, 28.181953],
    rainFall: 0,
    snowDepth: 0,
    wind: 3.6,
  },
];
