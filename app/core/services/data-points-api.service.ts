import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataPointType, OpenWeatherDataResponse, WeatherDataPoint } from '@core/models/data-points-api';
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

      return {
        type: DataPointType.WEATHER,
        location: [latitudeValue, longitudeValue],
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
