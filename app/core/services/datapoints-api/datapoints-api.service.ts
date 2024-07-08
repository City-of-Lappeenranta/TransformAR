import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  QUALITY_CONVERSION,
  DataPointQuality,
  DataPointType,
  ParkingDataPoint,
  WaterbagTestKitDataPoint,
  WeatherAirQualityDataPoint,
  WeatherConditionDataPoint,
  WeatherStormWaterDataPoint,
  RoadWorksDataPoint,
} from '@core/models/data-point';
import { environment } from '@environments/environment';
import { removeEmpty } from '@shared/utils/object-utils';
import { Observable, map } from 'rxjs';
import {
  DataPointEndpoint,
  ParkingResponse,
  RoadWorksResponse,
  WaterbagTestKitResponse,
  WeatherAirQualityResponse,
  WeatherConditionsResponse,
  WeatherStormWaterResponse,
} from './models';

@Injectable({ providedIn: 'root' })
export class DataPointsApi {
  private baseUrl = `${environment.streetAiApiUrl}/${environment.streetAiApiJurisdictionId}`;
  private apiKey = environment.streetAiApiKey;
  private defaultHeaders = new HttpHeaders().append('X-Api-Key', this.apiKey);

  public constructor(private readonly httpClient: HttpClient) {}

  public getWeatherConditions(): Observable<WeatherConditionDataPoint[]> {
    return this.httpClient
      .get<WeatherConditionsResponse>(`${this.baseUrl}/${DataPointEndpoint.WEATHER_CONDITIONS}`, {
        headers: this.defaultHeaders,
      })
      .pipe(
        map((response) =>
          response.map(({ name, latitude, longitude, dataRetrievedTimestamp, ...rest }) => ({
            name: name,
            location: [latitude, longitude],
            lastUpdateOn: dataRetrievedTimestamp,
            type: DataPointType.WEATHER_CONDITIONS,
            quality: DataPointQuality.DEFAULT,
            data: { ...removeEmpty(rest) },
          })),
        ),
      );
  }

  public getWeatherStormWater(): Observable<WeatherStormWaterDataPoint[]> {
    return this.httpClient
      .get<WeatherStormWaterResponse>(`${this.baseUrl}/${DataPointEndpoint.WEATHER_STORM_WATER}`, {
        headers: this.defaultHeaders,
      })
      .pipe(
        map((response) =>
          response.map(({ name, latitude, longitude, waterQuality, fillLevel }) => ({
            name: name,
            location: [latitude, longitude],
            type: DataPointType.STORM_WATER,
            quality: waterQuality,
            data: {
              fillLevel: fillLevel.result,
            },
          })),
        ),
      );
  }

  public getWeatherAirQuality(): Observable<WeatherAirQualityDataPoint[]> {
    return this.httpClient
      .get<WeatherAirQualityResponse>(`${this.baseUrl}/${DataPointEndpoint.WEATHER_AIR_QUALITY}`, {
        headers: this.defaultHeaders,
      })
      .pipe(
        map((response) =>
          response.map(({ name, latitude, longitude, measurementIndex }) => ({
            name: name,
            location: [latitude, longitude],
            type: DataPointType.AIR_QUALITY,
            quality: QUALITY_CONVERSION[measurementIndex] ?? DataPointQuality.DEFAULT,
          })),
        ),
      );
  }

  public getParking(): Observable<ParkingDataPoint[]> {
    return this.httpClient
      .get<ParkingResponse>(`${this.baseUrl}/${DataPointEndpoint.PARKING}`, {
        headers: this.defaultHeaders,
      })
      .pipe(
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

  public getWaterbagTestKits(): Observable<WaterbagTestKitDataPoint[]> {
    return this.httpClient
      .get<WaterbagTestKitResponse>(`${this.baseUrl}/${DataPointEndpoint.WATERBAG_TESTKIT}`, {
        headers: this.defaultHeaders,
      })
      .pipe(
        map((response) =>
          response.map(({ id, coords, ...rest }) => {
            const { dataRetrievedTimestamp, imageUrl, ...data } = rest;

            return {
              name: id,
              location: [coords.latitudeValue, coords.longitudeValue],
              type: DataPointType.WATERBAG_TESTKIT,
              quality: DataPointQuality.DEFAULT,
              data: Object.fromEntries(
                Object.entries(data).filter(([_, metric]) => {
                  return metric.value !== null;
                }),
              ),
            };
          }),
        ),
      );
  }

  public getRoadWorks(): Observable<RoadWorksDataPoint[]> {
    return this.httpClient
      .get<RoadWorksResponse>(`${this.baseUrl}/${DataPointEndpoint.ROAD_WORKS}`, {
        headers: this.defaultHeaders,
      })
      .pipe(
        map((response) =>
          response.map(({ name, latitude, longitude, validityPeriod }) => {
            const [from, to] = validityPeriod.split(' - ');

            return {
              name,
              location: [latitude, longitude],
              type: DataPointType.ROAD_WORKS,
              quality: DataPointQuality.DEFAULT,
              validFrom: from,
              validTo: to,
            };
          }),
        ),
      );
  }
}
