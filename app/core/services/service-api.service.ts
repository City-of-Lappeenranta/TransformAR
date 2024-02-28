/* eslint-disable @typescript-eslint/naming-convention */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Service, ServiceDictionary, ServiceListApiResponse } from '@core/models/service-api';
import { environment } from '@environments/environment';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServiceApi {
  private baseUrl = environment.serviceApiUrl;
  private jurisdictionId = environment.serviceApiJurisdictionId;

  public constructor(private readonly httpClient: HttpClient) {}

  public getServices(): Observable<ServiceDictionary> {
    /* TODO: cache data */
    return this.httpClient
      .get<ServiceListApiResponse>(`${this.baseUrl}/services.json?jurisdiction_id=${this.jurisdictionId}`)
      .pipe(map(this.mapServiceListApiResponseToServiceDictionary));
  }

  private mapServiceListApiResponseToServiceDictionary(response: ServiceListApiResponse): ServiceDictionary {
    const serviceDictionary: ServiceDictionary = {};

    response.forEach(({ service_code, service_name, description, group }) => {
      const service: Service = {
        id: service_code,
        name: service_name,
      };

      if (!serviceDictionary[description]) {
        serviceDictionary[description] = {};
      }

      if (!serviceDictionary[description][group]) {
        serviceDictionary[description][group] = [];
      }

      serviceDictionary[description][group].push(service);
    });

    return serviceDictionary;
  }
}
