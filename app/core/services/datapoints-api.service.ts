import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataPointQuality, DataPointType, WeatherDataPoint } from '@core/models/data-point';
import { LatLong } from '@core/models/location';
import { environment } from '@environments/environment';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DataPointsApi {
  private baseUrl = environment.weatherApiUrl;

  public constructor(private readonly httpClient: HttpClient) {}

  public getWeatherDataPoints(): Observable<WeatherDataPoint[]> {
    return this.httpClient
      .get<OpenWeatherDataResponse>(this.baseUrl)
      .pipe(map(this.mapOpenWeatherDataResponseToWeatherDataPoints));
  }

  private mapOpenWeatherDataResponseToWeatherDataPoints(response: OpenWeatherDataResponse): WeatherDataPoint[] {
    return response.result.map((result) => {
      const { coordinates, sensors } = result;
      const { latitudeValue, longitudeValue } = coordinates;
      const location = [latitudeValue, longitudeValue] as LatLong;

      let data: Record<string, string | number> = {};
      sensors.forEach((sensor) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { version, id, timestampUTC, ...rest } = sensor;
        data = { ...data, ...rest };
      });

      return {
        type: DataPointType.WEATHER,
        quality: DataPointQuality.GOOD,
        location,
        data,
      };
    });
  }
}

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
      } & Record<string, string | number>,
    ];
  }[];
  success: boolean;
  totalSize: number;
}
