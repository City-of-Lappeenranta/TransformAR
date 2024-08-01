import { Observable, delay, of } from 'rxjs';
import {
  DataPointEndpoint,
  ParkingResponse,
  RoadWorksResponse,
  StreetAiResponse,
  WaterbagTestKitResponse,
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

    return of(mockResponses[match] as T).pipe(
      delay(Math.floor((crypto.getRandomValues(new Uint32Array(1))[0] / (0xffffffff + 1)) * 1501) + 500),
    );
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

const WEATHER_AIR_QUALITY: WeatherAirQualityResponse = [
  {
    name: 'Air Quality Station',
    latitude: 61.05871,
    longitude: 28.18871,
    dataRetrievedTimestamp: 1711635283,
    measurementIndex: 1,
  },
  {
    name: 'Air Quality Station 2',
    latitude: 61.056871,
    longitude: 28.183503,
    dataRetrievedTimestamp: 1711635283,
    measurementIndex: 5,
  },
];

const WEATHER_STORM_WATER: WeatherStormWaterResponse = [
  {
    name: 'Storm water well',
    latitude: 61.06343,
    longitude: 28.18027,
    waterLevel: 3.5,
    waterTemperature: 28.6,
    electricalConductivity: 210,
    turbidity: 25,
    flowRate: 1200,
    fillLevel: {
      value: 90,
      result: 2,
    },
    waterQuality: 3,
  },
];

const PARKING: ParkingResponse = [
  {
    name: 'Lappeenranta City Parking',
    latitude: 61.05619,
    longitude: 28.19263,
    dataSource: 'PARKING_AIMOPARK',
    capacity: null,
    dataRetrievedTimestamp: 1711635283,
    availableSpots: 40,
  },
];

const WATERBAG_TESTKITS: WaterbagTestKitResponse = [
  {
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
    imageUrl: 'img-url',
    dissolvedOxygen: {
      result: 3,
      calculatedValue: 90,
      dataRetrievedTimestamp: 1717155485,
      value: 8,
    },
    coords: {
      latitudeValue: 61.06433,
      longitudeValue: 28.19235,
    },
    id: 'test-2',
    phosphate: {
      dataRetrievedTimestamp: 1717155485,
      result: 3,
      value: 1,
    },
    dataRetrievedTimestamp: 1717155485,
  },
];

const ROAD_WORKS: RoadWorksResponse = [
  {
    name: 'Filling potholes',
    latitude: 61.05619,
    longitude: 28.19263,
    validityPeriod: '01.06.2024 - 28.06.2024',
  },
];

export const mockResponses: Record<DataPointEndpoint, StreetAiResponse> = {
  [DataPointEndpoint.WEATHER_CONDITIONS]: WEATHER_CONDITIONS,
  [DataPointEndpoint.WEATHER_AIR_QUALITY]: WEATHER_AIR_QUALITY,
  [DataPointEndpoint.WEATHER_STORM_WATER]: WEATHER_STORM_WATER,
  [DataPointEndpoint.PARKING]: PARKING,
  [DataPointEndpoint.ROAD_WORKS]: ROAD_WORKS,
  [DataPointEndpoint.WATERBAG_TESTKIT]: WATERBAG_TESTKITS,
};
