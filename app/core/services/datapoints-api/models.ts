/* eslint-disable @typescript-eslint/no-empty-interface */

export enum DataPointEndpoint {
  WEATHER_CONDITIONS = 'weather/conditions',
  WEATHER_AIR_QUALITY = 'weather/air-quality',
  WEATHER_STORM_WATER = 'weather/storm-water',
  PARKING = 'parking',
  ROAD_WORKS = 'road-works',
}

export type WeatherConditionsResponse = {
  key: string;
}[];
export type WeatherAirQualityResponse = unknown[];
export type WeatherStormWaterResponse = unknown[];
export type ParkingResponse = unknown[];
export type RoadWorksResponse = unknown[];

export type StreetAiResponse =
  | WeatherConditionsResponse
  | WeatherAirQualityResponse
  | WeatherStormWaterResponse
  | ParkingResponse
  | RoadWorksResponse;
