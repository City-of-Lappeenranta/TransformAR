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
  quality: DataPointQuality;
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

export enum DataPointQuality {
  DEFAULT,
  GOOD,
  SATISFACTORY,
  FAIR,
  POOR,
  VERY_POOR,
  NO_DATA_AVAILABLE,
}

export const DATA_POINT_TYPE_ICON: Record<DataPointType, string> = {
  [DataPointType.WEATHER]: 'weather-icon.svg',
  [DataPointType.AIR_QUALITY]: 'air-quality-icon.svg',
  [DataPointType.PARKING]: 'parking-icon.svg',
  [DataPointType.ROAD_WORKS]: 'road-works-icon.svg',
  [DataPointType.FLOOD_WATER_LEVEL]: 'flood-water-level-icon.svg',
  [DataPointType.FLOOD_WATER_QUALITY]: 'flood-water-quality-icon.svg',
};
