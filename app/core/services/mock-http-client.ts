import { Observable, delay, of } from 'rxjs';
import {
  DataPointEndpoint,
  ParkingResponse,
  RoadWorksResponse,
  StreetAiResponse,
  WeatherAirQualityResponse,
  WeatherConditionsResponse,
  WeatherStormWaterResponse,
} from './datapoints-api/models';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MockHttpClient {
  public get<T extends StreetAiResponse>(url: string): Observable<T> {
    const match = Object.values(DataPointEndpoint).find((endpoint) => url.includes(endpoint));

    if (!match) {
      throw Error(`${url} doesn't match an endpoint`);
    }

    return of(mockResponses[match] as T).pipe(delay(1000));
  }
}

const WEATHER_CONDITIONS: WeatherConditionsResponse = [
  {
    name: 'Lappeenranta Weather Station',
    latitude: 61.05871,
    longitude: 28.18871,
    dataRetrievedTimestamp: 1711635283,
    temperature: -4,
    humidity: 60,
    streetState: 'icy',
  },
];

const WEATHER_AIR_QUALITY: WeatherAirQualityResponse = [];

const WEATHER_STORM_WATER: WeatherStormWaterResponse = [];

const PARKING: ParkingResponse = [];

const ROAD_WORKS: RoadWorksResponse = [];

export const mockResponses: Record<DataPointEndpoint, StreetAiResponse> = {
  [DataPointEndpoint.WEATHER_CONDITIONS]: WEATHER_CONDITIONS,
  [DataPointEndpoint.WEATHER_AIR_QUALITY]: WEATHER_AIR_QUALITY,
  [DataPointEndpoint.WEATHER_STORM_WATER]: WEATHER_STORM_WATER,
  [DataPointEndpoint.PARKING]: PARKING,
  [DataPointEndpoint.ROAD_WORKS]: ROAD_WORKS,
};
