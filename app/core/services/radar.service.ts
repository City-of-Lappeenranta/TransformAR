import { Injectable } from '@angular/core';
import { LocationSearchResult } from '@core/models/location';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RadarService {
  public async autocomplete(query: string): Promise<LocationSearchResult[]> {
    if (!environment.radarApiKey) {
      throw Error('Invalid or missing Radar API key');
    }

    if (!query) {
      return [];
    }

    try {
      const response = await fetch(`https://api.radar.io/v1/search/autocomplete?query=${query}`, {
        method: 'get',
        headers: new Headers({
          // eslint-disable-next-line @typescript-eslint/naming-convention
          Authorization: environment.radarApiKey,
        }),
      });
      const result = (await response.json()) as RadarSearchReponse;

      return result.addresses.map(({ latitude, longitude, formattedAddress }) => ({
        name: formattedAddress,
        latLong: [latitude, longitude],
      }));
    } catch (error) {
      console.error(error);
    }

    return [];
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
      county: string;
      distance: number;
      borough: string;
      city: string;
      number: string;
      neighborhood: string;
      postalCode: string;
      stateCode: string;
      state: string;
      street: string;
      layer: string;
      formattedAddress: string;
      placeLabel: string;
    },
  ];
}
