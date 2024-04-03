/* eslint-disable @typescript-eslint/no-empty-interface */

export enum DataPointEndpoint {
  WEATHER_CONDITIONS = 'weather/conditions',
  WEATHER_AIR_QUALITY = 'weather/air-quality',
  WEATHER_STORM_WATER = 'weather/storm-water',
  PARKING = 'parking',
  ROAD_WORKS = 'road-works',
}

export type WeatherConditionsResponse = {
  name: string;
  latitude: number;
  longitude: number;
  dataRetrievedTimestamp: number;
  temperature?: number | null;
  humidity?: number | null;
  visibility?: number | null;
  pressure?: number | null;
  dewPoint?: number | null;
  windDirection?: number | null;
  windSpeed?: number | null;
  windGust?: number | null;
  cloudCover?: number | null;
  snowDepth?: number | null;
  friction?: number | null;
  streetState?: 'dry' | 'moist' | 'wet' | 'slushy' | 'snowy' | 'icy' | null;
  ice?: number | null;
}[];

export type WeatherAirQualityResponse = {
  name: string;
  latitude: number;
  longitude: number;
  dataRetrievedTimestamp: number;
  measurementIndex: number;
}[];

export type WeatherStormWaterResponse = {
  name: string;
  latitude: number;
  longitude: number;
  waterLevel?: number | null;
  waterTemperature?: number | null;
  electricalConductivity?: number | null;
  turbidity?: number | null;
  flowRate?: number | null;
  fillLevel?: number | null;
}[];
export type ParkingResponse = unknown[];
export type RoadWorksResponse = unknown[];

export type StreetAiResponse =
  | WeatherConditionsResponse
  | WeatherAirQualityResponse
  | WeatherStormWaterResponse
  | ParkingResponse
  | RoadWorksResponse;
