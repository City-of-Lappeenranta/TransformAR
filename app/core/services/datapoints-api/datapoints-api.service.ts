import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { MockHttpClient } from '../mock-http-client';
import { Observable, map } from 'rxjs';
import {
  AIR_QUALITY_CONVERSION,
  DataPointQuality,
  DataPointType,
  ParkingDataPoint,
  WeatherAirQualityDataPoint,
  WeatherConditionDataPoint,
  WeatherStormWaterDataPoint,
} from '@core/models/data-point';
import {
  DataPointEndpoint,
  ParkingResponse,
  WeatherAirQualityResponse,
  WeatherConditionsResponse,
  WeatherStormWaterResponse,
} from './models';
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
        response.map(({ name, latitude, longitude, ...rest }) => ({
          name: name,
          location: [latitude, longitude],
          type: DataPointType.STORM_WATER,
          quality: DataPointQuality.DEFAULT,
          data: { ...removeNil(rest) },
        })),
      ),
    );
  }

  public getWeatherAirQuality(): Observable<WeatherAirQualityDataPoint[]> {
    return this.httpClient.get<WeatherAirQualityResponse>(`${this.baseUrl}/${DataPointEndpoint.WEATHER_AIR_QUALITY}`).pipe(
      map((response) =>
        response.map(({ name, latitude, longitude, measurementIndex }) => ({
          name: name,
          location: [latitude, longitude],
          type: DataPointType.AIR_QUALITY,
          quality: AIR_QUALITY_CONVERSION[measurementIndex],
        })),
      ),
    );
  }

  public getParking(): Observable<ParkingDataPoint[]> {
    return this.httpClient.get<ParkingResponse>(`${this.baseUrl}/${DataPointEndpoint.PARKING}`).pipe(
      map((response) =>
        response.map(({ name, latitude, longitude, availableSpots }) => ({
          name: name,
          location: [latitude, longitude],
          type: DataPointType.PARKING,
          quality: DataPointQuality.DEFAULT,
          availableSpots,
        })),
      ),
    );
  }
}
