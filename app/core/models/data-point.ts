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

export const DATA_POINT_QUALITY_COLOR_CHART: Record<DataPointQuality, string> = {
  [DataPointQuality.DEFAULT]: '#275D38',
  [DataPointQuality.GOOD]: '#7AC143',
  [DataPointQuality.SATISFACTORY]: '#A5D580',
  [DataPointQuality.FAIR]: '#FEDF89',
  [DataPointQuality.POOR]: '#FDA29B',
  [DataPointQuality.VERY_POOR]: '#F04438',
  [DataPointQuality.NO_DATA_AVAILABLE]: '#D0D5DD',
};
