import { Injectable } from '@angular/core';
import { LatLong } from '@core/models/location';
import { BehaviorSubject } from 'rxjs';

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

  public constructor() {
    this.getCurrentUserLocation();
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
