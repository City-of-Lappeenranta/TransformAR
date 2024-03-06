import { LatLong } from './location';

export enum DataPointType {
  WEATHER,
  AIR_QUALITY,
  PARKING,
  ROAD_WORKS,
  FLOOD_WATER_LEVEL,
  FLOOD_WATER_QUALITY,
}

interface BaseDataPoint {
  type: DataPointType;
  location: LatLong;
}

export type WeatherDataPoint = BaseDataPoint & {
  type: DataPointType.WEATHER;
  airTemperature: number;
  airMoisture: number;
  dewPoint: number;
  wind: number;
  rainFall: number;
  snowDepth: number;
};

export type DataPoint = WeatherDataPoint; // | AirQualityDataPoint...
