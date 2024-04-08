import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DataPointQuality, DataPointType, WeatherDataPoint } from '@core/models/data-point';
import { of } from 'rxjs';
import { Shallow } from 'shallow-render';
import { CoreModule } from '../core.module';
import { DataPointsApi, OpenWeatherDataResponse } from './datapoints-api.service';

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
          timestampUTC: 1711522746000,
          friction: 0.74,
          state: 'moist',
          ta: 0.4,
          tsurf: 2.0,
          tdew: -0.7,
          rh: 92.3,
          water: 0.131,
          tground: 1.94,
          ice: 0.0,
          pressure: 999.98,
          wspd: 4.1,
        },
      ],
    },
    {
      id: '70B3D5499ECE1E87_A84041EB41840B19',
      dataSourceId: 'MARJETAS_SENSOR',
      coordinates: {
        latitudeValue: 61.096656,
        longitudeValue: 28.137657,
      },
      sensors: [
        {
          version: 1,
          id: '70B3D5499ECE1E87',
          timestampUTC: 1696462288200,
          temperature15: 9.68,
          temperature10: 9.18,
          temperature5: 8.18,
          temperature0: 7.18,
        },
        {
          version: 1,
          id: 'A84041EB41840B19',
          timestampUTC: 1711524786787,
          batV: 2.0,
          tempCds: 2.62,
          tempCsht: 1.41,
          humSht: 92.8,
          dewPoint: 1.57,
        },
      ],
    },
  ],
  message: 'Weather data collected successfully!',
  success: true,
  responseCode: 200,
  totalSize: 6,
};

const WEATHER_DATA_POINTS: WeatherDataPoint[] = [
  {
    type: DataPointType.WEATHER,
    quality: DataPointQuality.DEFAULT,
    location: [61.06102, 28.181953],
    dataSourceId: 'TECONER',
    data: {
      state: 'moist',
      dewPoint: -0.7,
      windSpeed: 4.1,
      relativeHumidity: 92.3,
      airTemperature: 0.4,
      iceLayerThickness: 0.0,
      waterLayerThickness: 0.131,
    },
  },
  {
    type: DataPointType.WEATHER,
    quality: DataPointQuality.DEFAULT,
    location: [61.096656, 28.137657],
    dataSourceId: 'MARJETAS_SENSOR',
    data: {
      dewPoint: 1.57,
      humidity: 92.8,
      externalSensorTemperature: 2.62,
    },
  },
];
