import { Component, Input, ViewChild } from '@angular/core';
import { AutoComplete, AutoCompleteCompleteEvent, AutoCompleteModule, AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { IconComponent } from '../icon/icon.component';
import { LatLong, LocationSearchResult } from '@core/models/location';
import { CommonModule } from '@angular/common';
import { LocationService, UserLocation } from '@core/services/location.service';
import { RadarService } from '@core/services/radar.service';
import { Subject, BehaviorSubject, Observable, combineLatest, map } from 'rxjs';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ControlValueAccessorHelper } from '@shared/abstract-control-value-accessor';

export interface LocationSuggestion {
  address: string;
  latLong: LatLong;
  isCurrentLocation?: boolean;
  disabled?: boolean;
}

@Component({
  standalone: true,
  selector: 'app-search-location-input',
  templateUrl: './search-location-input.component.html',
  styleUrls: ['./search-location-input.component.scss'],
  imports: [CommonModule, AutoCompleteModule, IconComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SearchLocationInputComponent,
      multi: true,
    },
  ],
})
export class SearchLocationInputComponent extends ControlValueAccessorHelper<LatLong> {
  @ViewChild(AutoComplete) public autoComplete: AutoComplete | undefined;

  @Input() public withCurrentLocation = true;

  public locationSuggestions$: Observable<LocationSuggestion[]> | undefined;

  private _locationSearchResults$: Subject<LocationSearchResult[]> = new BehaviorSubject([] as LocationSearchResult[]);

  public constructor(
    private readonly locationService: LocationService,
    private readonly radarService: RadarService,
  ) {
    super();
  }

  public async onSearchLocation(event: AutoCompleteCompleteEvent): Promise<void> {
    const { query } = event;

    const results = await this.radarService.autocomplete(query);
    this._locationSearchResults$.next(results);
  }

  public onSelectLocation(event: AutoCompleteSelectEvent): void {
    const locationSuggestion = event.value as LocationSuggestion;
    const latLong = locationSuggestion?.latLong;

    this.writeValue(latLong);
  }

  public onAutocompleteFocus(): void {
    const locationSuggestionsObservables$: (
      | Observable<LocationSearchResult[]>
      | Observable<UserLocation>
      | Observable<PermissionState>
    )[] = [this._locationSearchResults$.asObservable()];

    if (this.withCurrentLocation) {
      this.autoComplete?.show();

      locationSuggestionsObservables$.push(
        this.locationService.userLocation$,
        this.locationService.locationPermissionState$,
      );
    }

    this.locationSuggestions$ = combineLatest(locationSuggestionsObservables$).pipe(
      map(([locationSearchResults, currentUserLocation, locationPermissionState]) =>
        this.mapCurrentUserLocationAndLocationSearchResultToLocationOptions(
          currentUserLocation as UserLocation,
          locationPermissionState as PermissionState,
          locationSearchResults as LocationSearchResult[],
        ),
      ),
    );
  }

  private mapCurrentUserLocationAndLocationSearchResultToLocationOptions(
    currentUserLocation: UserLocation,
    locationPermissionState: PermissionState,
    results: LocationSearchResult[],
  ): LocationSuggestion[] {
    if (!this.withCurrentLocation) {
      return results;
    }

    let currentUserLocationName = 'Fetching your location...';

    if (!currentUserLocation.loading) {
      if (currentUserLocation.location) {
        currentUserLocationName = 'Your current location';
      } else {
        currentUserLocationName = 'We could not determine your location';
      }
    }

    const currentUserLocationOption: LocationSuggestion = {
      latLong: currentUserLocation.location ?? [0, 0],
      address: currentUserLocationName,
      isCurrentLocation: true,
      disabled: currentUserLocation.loading || locationPermissionState !== 'granted',
    };

    return [currentUserLocationOption, ...results];
  }
}
