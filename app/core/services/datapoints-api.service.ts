import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataPointType, WeatherDataPoint } from '@core/models/data-points-api';
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
    return response.result.map((data) => {
      const { coordinates, sensors } = data;
      const { latitudeValue, longitudeValue } = coordinates;
      const { tdew, ta, wspd, water, ice, rh } = sensors[0];
      const location = [latitudeValue, longitudeValue] as LatLong;

      return {
        type: DataPointType.WEATHER,
        location,
        airTemperature: ta,
        dewPoint: tdew,
        wind: wspd,
        rainFall: water,
        snowDepth: ice,
        airMoisture: rh,
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
