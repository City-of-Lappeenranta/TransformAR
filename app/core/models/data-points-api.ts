import { LatLong } from './location';

export interface OpenWeatherDataResponse {
  message: string;
  responseCode: number;
  result: {
    id: string;
    dataSourceId: string;
    coordinates: {
      latitudeValue: number;
      longitudeValue: number;
    };
    sensors: [
      {
        version: number;
        id: string;
        timestampUTC: number;
        friction: number;
        state: string;
        ta: number;
        tsurf: number;
        tdew: number;
        rh: number;
        water: number;
        tground: number;
        ice: number;
        pressure: number;
        wspd: number;
      },
    ];
  }[];
  success: boolean;
  totalSize: number;
}

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
