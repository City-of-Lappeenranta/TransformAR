import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LatLong, LocationSearchResult } from '@core/models/location';
import { environment } from '@environments/environment';
import { firstValueFrom, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RadarService {
  private baseUrl = 'https://api.radar.io/v1';

  public constructor(private readonly httpClient: HttpClient) {}

  public async reverseGeocode(latLong: LatLong): Promise<string> {
    if (!environment.radarApiKey) {
      throw Error('Invalid or missing Radar API key');
    }

    return await firstValueFrom(
      this.httpClient
        .get<RadarSearchReponse>(`${this.baseUrl}/geocode/reverse?coordinates=${latLong.join(',')}`, {
          headers: new HttpHeaders().set('Authorization', environment.radarApiKey),
        })
        .pipe(map((response) => response.addresses[0]?.addressLabel ?? '')),
    );
  }

  public async autocomplete(query: string): Promise<LocationSearchResult[]> {
    if (!environment.radarApiKey) {
      throw Error('Invalid or missing Radar API key');
    }

    if (!query) {
      return [];
    }

    return await firstValueFrom(
      this.httpClient
        .get<RadarSearchReponse>(`${this.baseUrl}/search/autocomplete?query=${query}`, {
          headers: new HttpHeaders().set('Authorization', environment.radarApiKey),
        })
        .pipe(
          map((result) =>
            result.addresses.map(({ latitude, longitude, formattedAddress }) => ({
              address: formattedAddress,
              latLong: [latitude, longitude],
            })),
          ),
        ),
    );
  }
}

export interface RadarSearchReponse {
  meta: {
    code: number;
  };
  addresses: [
    {
      latitude: number;
      longitude: number;
      geometry: {
        type: string;
        coordinates: [number, number];
      };
      country: string;
      countryCode: string;
      countryFlag: string;
      county?: string;
      distance: number;
      borough?: string;
      city: string;
      number?: string;
      neighborhood?: string;
      postalCode?: string;
      stateCode?: string;
      state?: string;
      street: string;
      layer: string;
      formattedAddress: string;
      addressLabel: string;
    },
  ];
}
