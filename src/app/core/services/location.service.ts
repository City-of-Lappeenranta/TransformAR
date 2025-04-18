import { Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LatLong } from '../models/location';
import { BehaviorSubject, Observable, from } from 'rxjs';

export interface UserLocation {
  loading: boolean;
  location?: LatLong;
}

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private _userLocation$ = new BehaviorSubject<UserLocation>({
    loading: true,
  });

  private _locationPermissionStateSubject$ = new BehaviorSubject<PermissionState>('prompt');
  public locationPermissionState$ = this._locationPermissionStateSubject$.asObservable();

  public constructor() {
    if (navigator.permissions) {
      from(navigator.permissions.query({ name: 'geolocation' }))
        .pipe(takeUntilDestroyed())
        .subscribe((permissionStatus) => this._locationPermissionStateSubject$.next(permissionStatus.state));
    }
  }

  public get userLocation$(): Observable<UserLocation> {
    navigator.geolocation.getCurrentPosition(
      this.onGetCurrentPositionSuccess.bind(this),
      this.onGetCurrentPositionError.bind(this),
    );

    return this._userLocation$;
  }

  private onGetCurrentPositionSuccess(position: GeolocationPosition): void {
    this._locationPermissionStateSubject$.next('granted');
    const { latitude, longitude } = position.coords;
    this._userLocation$.next({
      loading: false,
      location: [latitude, longitude],
    });
  }

  private onGetCurrentPositionError(): void {
    this._locationPermissionStateSubject$.next('denied');
    this._userLocation$.next({
      loading: false,
      location: undefined,
    });
  }
}
