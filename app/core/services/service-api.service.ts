/* eslint-disable @typescript-eslint/naming-convention */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PostServiceRequestProperties, Service, ServiceDictionary } from '@core/models/service-api';
import { environment } from '@environments/environment';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServiceApi {
  private baseUrl = environment.serviceApiUrl;
  private jurisdictionId = environment.serviceApiJurisdictionId;
  private apiKey = environment.serviceApiApiKey;

  public constructor(private readonly httpClient: HttpClient) {}

  public getServices(): Observable<ServiceDictionary> {
    /* TODO: cache data */
    return this.httpClient
      .get<ServiceListApiResponse>(`${this.baseUrl}/services.json?jurisdiction_id=${this.jurisdictionId}`)
      .pipe(map(this.mapServiceListApiResponseToServiceDictionary));
  }

  public postServiceRequest({
    serviceCode,
    message,
    files,
    location,
    email,
    firstName,
    lastName,
    phone,
  }: PostServiceRequestProperties): Observable<string | undefined> {
    const formData = new FormData();

    if (!serviceCode) {
      throw new Error('service_code is missing');
    }

    if (!location) {
      throw new Error('location is missing');
    }

    formData.append('api_key', this.apiKey);
    formData.append('service_code', serviceCode);
    formData.append('lat', location[0].toString());
    formData.append('long', location[1].toString());

    if (email) {
      formData.append('email', email);
    }
    if (firstName) {
      formData.append('first_name', firstName);
    }
    if (lastName) {
      formData.append('last_name', lastName);
    }
    if (phone) {
      formData.append('phone', phone);
    }
    if (message) {
      formData.append('description', message);
    }
    if (files) {
      files.forEach((file) => formData.append('media[]', file));
    }

    return this.httpClient
      .post<string>(`${this.baseUrl}/requests.json?jurisdiction_id=${this.jurisdictionId}`, formData)
      .pipe(map(() => formData.get('email') as string));
  }

  private mapServiceListApiResponseToServiceDictionary(response: ServiceListApiResponse): ServiceDictionary {
    const serviceDictionary: ServiceDictionary = {};

    response.forEach((serviceDTO) => {
      const { service_code, service_name } = serviceDTO;
      const categoryKeys = environment.feedbackCategoryLevels;
      const mainCategory = serviceDTO[categoryKeys[0]];
      const subCategory = serviceDTO[categoryKeys[1]];

      const service: Service = {
        code: service_code,
        name: service_name,
      };

      if (!serviceDictionary[mainCategory]) {
        serviceDictionary[mainCategory] = {};
      }

      if (!serviceDictionary[mainCategory][subCategory]) {
        serviceDictionary[mainCategory][subCategory] = [];
      }

      serviceDictionary[mainCategory][subCategory].push(service);
    });

    return serviceDictionary;
  }
}

export type ServiceListApiResponse = {
  service_code: string;
  service_name: string;
  description: string;
  metadata: boolean;
  type: string;
  keywords: string;
  group: string;
}[];
