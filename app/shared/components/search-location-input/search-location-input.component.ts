import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { LatLong, LocationSearchResult } from '@core/models/location';
import { LocationService, UserLocation } from '@core/services/location.service';
import { RadarService } from '@core/services/radar.service';
import { ControlValueAccessorHelper } from '@shared/abstract-control-value-accessor';
import { AutoComplete, AutoCompleteCompleteEvent, AutoCompleteModule, AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { BehaviorSubject, Observable, Subject, combineLatest, map } from 'rxjs';
import { IconComponent } from '../icon/icon.component';

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
    const userLocation$: Observable<UserLocation> = this.locationService.userLocation$;
    const locationSearchResults$: Observable<LocationSearchResult[]> = this._locationSearchResults$.asObservable();

    this.locationSuggestions$ = combineLatest([userLocation$, locationSearchResults$]).pipe(
      map(([currentUserLocation, locationSearchResults]) =>
        this.mapCurrentUserLocationAndLocationSearchResultToLocationOptions(locationSearchResults, currentUserLocation),
      ),
    );
  }

  private mapCurrentUserLocationAndLocationSearchResultToLocationOptions(
    results: LocationSearchResult[],
    currentUserLocation: UserLocation,
  ): LocationSuggestion[] {
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
      disabled: currentUserLocation.loading || !currentUserLocation.location,
    };

    return [currentUserLocationOption, ...results];
  }
}
