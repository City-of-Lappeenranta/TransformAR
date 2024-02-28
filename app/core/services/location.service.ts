import { Injectable } from '@angular/core';
import { LatLong, LocationSearchResult } from '@core/models/location';
import { BehaviorSubject } from 'rxjs';
import { RadarService } from './radar.service';

export interface UserLocation {
  loading: boolean;
  available: boolean;
  location?: LatLong;
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

  public constructor(private readonly radarService: RadarService) {
    this.getCurrentUserLocation();
  }

  public async searchLocationByQuery(query: string): Promise<LocationSearchResult[]> {
    return this.radarService.autocomplete(query);
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
