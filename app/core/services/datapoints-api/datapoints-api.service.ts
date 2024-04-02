import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { MockHttpClient } from '../mock-http-client';
import { Observable, map } from 'rxjs';
import {
  DataPointQuality,
  DataPointType,
  WeatherConditionDataPoint,
  WeatherStormWaterDataPoint,
} from '@core/models/data-point';
import { DataPointEndpoint, WeatherConditionsResponse, WeatherStormWaterResponse } from './models';
import { removeNil } from '@shared/utils/object-utils';

@Injectable({ providedIn: 'root' })
export class DataPointsApi {
  private baseUrl = `${environment.streetAiApiUrl}/${environment.streetAiApiJurisdictionId}`;

  public constructor(private readonly httpClient: MockHttpClient) {}

  public getWeatherConditions(): Observable<WeatherConditionDataPoint[]> {
    return this.httpClient.get<WeatherConditionsResponse>(`${this.baseUrl}/${DataPointEndpoint.WEATHER_CONDITIONS}`).pipe(
      map((response) =>
        response.map(({ name, latitude, longitude, dataRetrievedTimestamp, ...rest }) => ({
          name: name,
          location: [latitude, longitude],
          lastUpdateOn: dataRetrievedTimestamp,
          type: DataPointType.WEATHER_CONDITIONS,
          quality: DataPointQuality.DEFAULT,
          data: { ...removeNil(rest) },
        })),
      ),
    );
  }

  public getWeatherStormWater(): Observable<WeatherStormWaterDataPoint[]> {
    return this.httpClient.get<WeatherStormWaterResponse>(`${this.baseUrl}/${DataPointEndpoint.WEATHER_STORM_WATER}`).pipe(
      map((response) =>
        response.map(({ name, latitude, longitude, dataRetrievedTimestamp, ...rest }) => ({
          name: name,
          location: [latitude, longitude],
          lastUpdateOn: dataRetrievedTimestamp,
          type: DataPointType.STORM_WATER,
          quality: DataPointQuality.DEFAULT,
          data: { ...removeNil(rest) },
        })),
      ),
    );
  }
}
