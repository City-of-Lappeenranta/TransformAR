export enum DataPointEndpoint {
  WEATHER_CONDITIONS = 'weather/conditions',
  WEATHER_AIR_QUALITY = 'weather/air-quality',
  WEATHER_STORM_WATER = 'weather/storm-water',
  PARKING = 'parking',
  ROAD_WORKS = 'road-works',
  WATERBAG_TESTKIT = 'waterbag-testkit',
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
  waterLevel: number;
  waterTemperature: number;
  electricalConductivity?: number | null;
  turbidity?: number | null;
  flowRate: number;
  fillLevel: {
    value: number;
    result: number;
  };
  waterQuality: number;
}[];

export type ParkingResponse = {
  name: string;
  latitude: number;
  longitude: number;
  dataSource: 'PARKING_FINNPARK' | 'PARKING_AIMOPARK';
  dataRetrievedTimestamp: number;
  availableSpots: number;
  capacity: number | null;
}[];

export type RoadWorksResponse = unknown[];

interface WaterbagTestKitResponseData {
  value: number;
  dataRetrievedTimestamp: number;
}

type WaterbagTestKitResponseDataWithResult = WaterbagTestKitResponseData & {
  result: number;
};

export type WaterbagTestKitResponse = {
  id: string;
  coords: {
    latitudeValue: number;
    longitudeValue: number;
  };
  dataRetrievedTimestamp: number;
  imageUrl: string;
  airTemp: WaterbagTestKitResponseData;
  waterTemp: WaterbagTestKitResponseData;
  visibility: WaterbagTestKitResponseData;
  algae: WaterbagTestKitResponseData;
  waterPh: WaterbagTestKitResponseDataWithResult;
  turbidity: WaterbagTestKitResponseDataWithResult;
  dissolvedOxygen: WaterbagTestKitResponseDataWithResult & { calculatedValue: number };
  nitrate: WaterbagTestKitResponseDataWithResult;
  phosphate: WaterbagTestKitResponseDataWithResult;
}[];

export type StreetAiResponse =
  | WeatherConditionsResponse
  | WeatherAirQualityResponse
  | WeatherStormWaterResponse
  | ParkingResponse
  | RoadWorksResponse
  | WaterbagTestKitResponse;
