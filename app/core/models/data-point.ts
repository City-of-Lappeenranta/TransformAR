import { LatLong } from './location';

export enum DataPointType {
  WEATHER_CONDITIONS,
  AIR_QUALITY,
  STORM_WATER,
  PARKING,
  ROAD_WORKS,
  WATERBAG_TESTKIT,
}

interface BaseDataPoint<T extends DataPointType> {
  type: T;
  name: string;
  location: LatLong;
  quality: DataPointQuality;
  lastUpdatedOn?: Date;
}

export type WeatherConditionDataPoint = BaseDataPoint<DataPointType.WEATHER_CONDITIONS> & {
  data: Record<string, string | number>;
};

export type WeatherStormWaterDataPoint = BaseDataPoint<DataPointType.STORM_WATER> & {
  data: Record<string, string | number>;
};

export type WeatherAirQualityDataPoint = BaseDataPoint<DataPointType.AIR_QUALITY>;

export type ParkingDataPoint = BaseDataPoint<DataPointType.PARKING> & {
  availableSpots: number;
};

export type RoadWorksDataPoint = BaseDataPoint<DataPointType.ROAD_WORKS> & {
  validFrom: string;
  validTo: string;
};

export interface WaterbagTestKitDataPointData {
  value: number;
  result?: number;
  calculatedValue?: number;
}

export type WaterbagTestKitDataPoint = BaseDataPoint<DataPointType.WATERBAG_TESTKIT> & {
  imageUrl?: string;
  data: Record<string, WaterbagTestKitDataPointData>;
};

export type DataPoint =
  | WeatherConditionDataPoint
  | WeatherStormWaterDataPoint
  | WeatherAirQualityDataPoint
  | ParkingDataPoint
  | WaterbagTestKitDataPoint
  | RoadWorksDataPoint;

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
  [DataPointType.WATERBAG_TESTKIT]: 'waterbag-testkit.svg',
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

export const WEATHER_STORM_WATER_METRIC_UNIT = {
  waterLevel: ' mm',
  waterTemperature: '°C',
  electricalConductivity: ' µS/cm',
  turbidity: ' NTU',
  flowRate: ' l/s',
  fillLevel: '%',
};

export const WATERBAG_TESTKIT_METRIC_UNIT = {
  airTemp: '°C',
  waterTemp: '°C',
  visibility: ' cm',
  waterPh: ' pH',
  turbidity: ' JTU',
  dissolvedOxygen: '%',
  nitrate: ' ppm / (mg/l)',
  phosphate: ' ppm / (mg/l)',
};

export const QUALITY_CONVERSION: (DataPointQuality | null)[] = [
  null,
  DataPointQuality.GOOD,
  DataPointQuality.SATISFACTORY,
  DataPointQuality.FAIR,
  DataPointQuality.POOR,
  DataPointQuality.VERY_POOR,
];
