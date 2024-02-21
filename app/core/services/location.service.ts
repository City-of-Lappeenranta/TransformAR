import { Injectable } from '@angular/core';
import { LatLong, RadarSearchReponse } from '@core/models/location';
import { environment } from '@environments/environment';
import { BehaviorSubject } from 'rxjs';

export interface UserLocation {
  loading: boolean;
  available: boolean;
  location?: LatLong;
}

export interface LocationSearchResult {
  name: string;
  latLong: LatLong;
}

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private _userLocation$ = new BehaviorSubject<UserLocation>({
    loading: true,
    available: false,
  });

  public userLocation$ = this._userLocation$.asObservable();

  public constructor() {
    this.getCurrentUserLocation();
  }

  public async searchLocationByQuery(query: string): Promise<LocationSearchResult[]> {
    if (!query) {
      return [];
    }

    if (!environment.radarApiKey) {
      throw Error('Invalid or missing Radar API key');
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

  private getCurrentUserLocation(): void {
    navigator.geolocation.getCurrentPosition(
      this.onGetCurrentPositionSuccess.bind(this),
      this.onGetCurrentPositionError.bind(this),
    );
  }

  private onGetCurrentPositionSuccess(position: GeolocationPosition): void {
    const { latitude, longitude } = position.coords;
    this._userLocation$.next({
      loading: false,
      available: true,
      location: [latitude, longitude],
    });
  }

  private onGetCurrentPositionError(): void {
    this._userLocation$.next({
      loading: false,
      available: false,
      location: undefined,
    });
  }
}
