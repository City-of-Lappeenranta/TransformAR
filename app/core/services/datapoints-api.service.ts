import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  DataPointQuality,
  DataPointType,
  MarjetaSensorData,
  TeconerSensorData,
  WeatherDataPoint,
} from "@core/models/data-point";
import { LatLong } from "@core/models/location";
import { environment } from "@environments/environment";
import { Observable, map } from "rxjs";

@Injectable({ providedIn: "root" })
export class DataPointsApi {
  private baseUrl = environment.weatherApiUrl;

  public constructor(private readonly httpClient: HttpClient) {}

  public getWeatherDataPoints(): Observable<WeatherDataPoint[]> {
    return this.httpClient
      .get<OpenWeatherDataResponse>(this.baseUrl)
      .pipe(map(this.mapOpenWeatherDataResponseToWeatherDataPoints.bind(this)));
  }

  private mapOpenWeatherDataResponseToWeatherDataPoints(
    response: OpenWeatherDataResponse,
  ): WeatherDataPoint[] {
    return response.result.map((result) => {
      const { coordinates, sensors, dataSourceId } = result;
      const { latitudeValue, longitudeValue } = coordinates;
      const location = [latitudeValue, longitudeValue] as LatLong;

      const base: Pick<WeatherDataPoint, "type" | "location"> = {
        type: DataPointType.WEATHER,
        location,
      };

      return dataSourceId === "TECONER"
        ? {
            ...base,
            dataSourceId,
            ...this.mapTeconerSensorToWeatherDataPoint(sensors[0]),
          }
        : {
            ...base,
            dataSourceId,
            ...this.mapMarjetaSensorToWeatherDataPoint(sensors[1]),
          };
    });
  }

  private mapTeconerSensorToWeatherDataPoint(data: TeconerSensorResultData): {
    quality: DataPointQuality;
    data: TeconerSensorData;
  } {
    const { state, tdew, wspd, rh, ta, ice, water } = data;

    return {
      quality: DataPointQuality.DEFAULT,
      data: {
        state,
        dewPoint: tdew,
        windSpeed: wspd,
        relativeHumidity: rh,
        airTemperature: ta,
        iceLayerThickness: ice,
        waterLayerThickness: water,
      },
    };
  }

  private mapMarjetaSensorToWeatherDataPoint(data: DraginoSensorResultData): {
    quality: DataPointQuality;
    data: MarjetaSensorData;
  } {
    const { tempCds, humSht, dewPoint } = data;

    return {
      quality: DataPointQuality.DEFAULT,
      data: {
        dewPoint,
        humidity: humSht,
        externalSensorTemperature: tempCds,
      },
    };
  }
}

// Docs: https://opendata.streetai.net/#tag/Weather/operation/getOpenWeatherData

export interface OpenWeatherDataResponse {
  message: string;
  responseCode: number;
  result: (TeconerSensorResult | MarjetaSensorResult)[];
  success: boolean;
  totalSize: number;
}

interface BaseResult {
  id: string;
  coordinates: {
    latitudeValue: number;
    longitudeValue: number;
  };
}

type TeconerSensorResult = BaseResult & {
  dataSourceId: "TECONER";
  sensors: [TeconerSensorResultData];
};

type MarjetaSensorResult = BaseResult & {
  dataSourceId: "MARJETAS_SENSOR";
  sensors: [MarjetaSensorResultData, DraginoSensorResultData];
};

interface BaseSensorResultData {
  version: number;
  id: string;
  timestampUTC: number;
}

type TeconerSensorResultData = BaseSensorResultData & {
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
};

type MarjetaSensorResultData = BaseSensorResultData & {
  temperature0: number;
  temperature5: number;
  temperature10: number;
  temperature15: number;
};

type DraginoSensorResultData = BaseSensorResultData & {
  batV: number;
  tempCds: number;
  tempCsht: number;
  humSht: number;
  dewPoint: number;
};
