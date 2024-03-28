import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { MockHttpClient } from '../mock-http-client';

@Injectable({ providedIn: 'root' })
export class DataPointsApi {
  private baseUrl = `${environment.streetAiApiUrl}/${environment.streetAiApiJurisdictionId}`;

  public constructor(private readonly httpClient: MockHttpClient) {}
}
