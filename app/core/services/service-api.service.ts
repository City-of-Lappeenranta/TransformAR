/* eslint-disable @typescript-eslint/naming-convention */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LatLong } from '@core/models/location';
import { Service, ServiceDictionary, ServiceListApiResponse } from '@core/models/service-api';
import { environment } from '@environments/environment';
import { Observable, map, of, timeout } from 'rxjs';

export interface PostServiceProperties {
  serviceCode: string | null | undefined;
  description: string | null | undefined;
  files: File[] | null | undefined;
  location: LatLong | null | undefined;
  email: string | null | undefined;
  firstName: string | null | undefined;
  lastName: string | null | undefined;
  phone: string | null | undefined;
}

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

  public postService({
    serviceCode,
    description,
    files,
    location,
    email,
    firstName,
    lastName,
    phone,
  }: PostServiceProperties): Observable<string | undefined> {
    const formData = new FormData();

    if (!serviceCode || !description) {
      throw new Error('service_code and description are missing');
    }

    formData.append('service_code', serviceCode);
    formData.append('description', description);

    files?.forEach((file) => formData.append('media[]', file));

    if (location) {
      formData.append('lat', location[0].toString());
      formData.append('lon', location[1].toString());
    }

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

    // return this.httpClient
    //   .post<string>(`${this.baseUrl}/requests.json`, formData)
    //   .pipe(map(() => formData.get('email') as string));

    return of(email ?? '').pipe(timeout(2000));
  }

  private mapServiceListApiResponseToServiceDictionary(response: ServiceListApiResponse): ServiceDictionary {
    const serviceDictionary: ServiceDictionary = {};

    response.forEach(({ service_code, service_name, description, group }) => {
      const service: Service = {
        code: service_code,
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
