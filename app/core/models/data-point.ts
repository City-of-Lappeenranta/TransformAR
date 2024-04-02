import { LatLong } from './location';

export enum DataPointType {
  WEATHER_CONDITIONS,
  AIR_QUALITY,
  STORM_WATER,
  PARKING,
  ROAD_WORKS,
}

interface BaseDataPoint<T extends DataPointType> {
  type: T;
  name: string;
  location: LatLong;
  quality: DataPointQuality;
  lastUpdateOn?: number;
}

export type WeatherConditionDataPoint = BaseDataPoint<DataPointType.WEATHER_CONDITIONS> & {
  data: Record<string, string | number>;
};

export type DataPoint = WeatherConditionDataPoint;

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

export const DATA_POINT_TYPE_ICON: Record<DataPointType, string> = {
  [DataPointType.WEATHER_CONDITIONS]: 'weather-icon.svg',
  [DataPointType.AIR_QUALITY]: 'air-quality-icon.svg',
  [DataPointType.PARKING]: 'parking-icon.svg',
  [DataPointType.ROAD_WORKS]: 'road-works-icon.svg',
  [DataPointType.STORM_WATER]: 'flood-water-level-icon.svg',
};

export const WEATHER_CONDITIONS_METRIC_UNIT = {
  temperature: '°C',
  humidity: '%',
  visibility: ' km',
  pressure: ' hPa',
  dewPoint: '°C',
  windDirection: '°',
  windSpeed: ' m/s',
  windGust: ' m/s',
  cloudCover: '%',
  snowDepth: ' cm',
  ice: ' mm',
};
