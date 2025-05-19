import { MockHttpClient, mockResponses } from './mock-http-client';
import { DataPointEndpoint, WeatherConditionsResponse } from './datapoints-api/models';

describe('MockHttpClient', () => {
  const client = new MockHttpClient();

  it('should return a mock response if the endpoint is known', (done) => {
    client.get<WeatherConditionsResponse>('api.url/weather/conditions').subscribe((response) => {
      expect(response).toEqual(mockResponses[DataPointEndpoint.WEATHER_CONDITIONS]);
      done();
    });
  });

  it('should throw if the endpoint is not known', () => {
    const execution = () => client.get<WeatherConditionsResponse>('api.url/weather/new-endpoint').subscribe();
    expect(execution).toThrow();
  });
});
