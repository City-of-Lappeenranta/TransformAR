import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { LatLong, LocationSearchResult } from '@core/models/location';
import { LocationService, UserLocation } from '@core/services/location.service';
import { RadarService } from '@core/services/radar.service';
import { environment } from '@environments/environment';
import { AutoCompleteCompleteEvent, AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';

interface LocationSuggestion {
  address: string;
  latLong: LatLong;
  isCurrentLocation?: boolean;
  disabled?: boolean;
}

@Component({
  selector: 'app-feedback-location',
  templateUrl: './feedback-location.component.html',
  styleUrls: ['./feedback-location.component.scss'],
})
export class FeedbackLocationComponent {
  @Input({ required: true }) public locationFormControl!: FormControl<LatLong | null>;

  private _locationSearchResults$ = new BehaviorSubject([] as LocationSearchResult[]);

  public locationSuggestions$: Observable<LocationSuggestion[]> | undefined;

  private _mapCenterSubject$ = new BehaviorSubject<LatLong>(environment.defaultLocation as LatLong);
  public mapCenter$ = this._mapCenterSubject$.asObservable();

  public constructor(
    private readonly locationService: LocationService,
    private readonly radarService: RadarService,
  ) {}

  public async onSearchLocation(event: AutoCompleteCompleteEvent): Promise<void> {
    const { query } = event;

    const results = await this.radarService.autocomplete(query);
    this._locationSearchResults$.next(results);
  }

  public onSelectLocation(event: AutoCompleteSelectEvent): void {
    const latLong = (event.value as LocationSuggestion).latLong;
    this._mapCenterSubject$.next(latLong);
    this.locationFormControl.setValue(latLong);
  }

  public onAutocompleteFocus(): void {
    this.locationSuggestions$ = combineLatest([
      this.locationService.userLocation$,
      this.locationService.locationPermissionState$,
      this._locationSearchResults$,
    ]).pipe(
      map(([currentUserLocation, locationPermissionState, locationSearchResults]) =>
        this.mapCurrentUserLocationAndLocationSearchResultToLocationOptions(
          currentUserLocation,
          locationPermissionState,
          locationSearchResults,
        ),
      ),
    );
  }

  private mapCurrentUserLocationAndLocationSearchResultToLocationOptions(
    currentUserLocation: UserLocation,
    locationPermissionState: PermissionState,
    results: LocationSearchResult[],
  ): LocationSuggestion[] {
    let currentUserLocationName = 'Fetching your location...';

    if (!currentUserLocation.loading) {
      if (locationPermissionState === 'granted') {
        currentUserLocationName = 'Your current location';
      } else {
        currentUserLocationName = 'We could not determine your location';
      }
    }

    const currentUserLocationOption: LocationSuggestion = {
      latLong: currentUserLocation.location ?? [0, 0],
      address: currentUserLocationName,
      isCurrentLocation: true,
    };

    return [currentUserLocationOption, ...results];
  }
}
