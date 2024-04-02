import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { MockHttpClient } from '../mock-http-client';
import { Observable, map } from 'rxjs';
import { DataPointQuality, DataPointType, WeatherConditionDataPoint } from '@core/models/data-point';
import { DataPointEndpoint, WeatherConditionsResponse } from './models';
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
}
