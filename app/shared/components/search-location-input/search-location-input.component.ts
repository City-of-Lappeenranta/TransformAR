import { CommonModule } from '@angular/common';
import { Component, DestroyRef, ViewChild, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { LatLong, LocationSearchResult } from '@core/models/location';
import { LocationService, UserLocation } from '@core/services/location.service';
import { RadarService } from '@core/services/radar.service';
import { ControlValueAccessorHelper } from '@shared/abstract-control-value-accessor';
import { isSameLocation } from '@shared/utils/location-utils';
import { AutoComplete, AutoCompleteCompleteEvent, AutoCompleteModule, AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { BehaviorSubject, Observable, Subject, combineLatest, distinctUntilChanged, firstValueFrom, map, of } from 'rxjs';
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
  imports: [CommonModule, AutoCompleteModule, IconComponent, ReactiveFormsModule],
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

  public selectedSuggestionFormGroup = new FormGroup({
    suggestion: new FormControl<LocationSuggestion | null>(null),
  });
  public locationSuggestions$: Observable<LocationSuggestion[]> | undefined;

  private _locationSearchResults$: Subject<LocationSearchResult[]> = new BehaviorSubject([] as LocationSearchResult[]);
  private readonly destroyRef = inject(DestroyRef);

  public constructor(
    private readonly locationService: LocationService,
    private readonly radarService: RadarService,
  ) {
    super();
  }

  public ngAfterViewInit(): void {
    this.valueChanges
      ?.pipe(takeUntilDestroyed(this.destroyRef), distinctUntilChanged())
      .subscribe(this.onLocationChange.bind(this));
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

  public async onLocationChange(latLong: LatLong): Promise<void> {
    const locationSuggestions = await firstValueFrom(this.locationSuggestions$ ?? of([]));
    const locationSuggestion = locationSuggestions.find((suggestion) => isSameLocation(suggestion.latLong, latLong));
    const address = locationSuggestion?.address ?? (await this.radarService.reverseGeocode(latLong, 'formattedAddress'));

    this.selectedSuggestionFormGroup.patchValue({ suggestion: { address, latLong } });
  }

  public onAutocompleteFocus(): void {
    const userLocation$ = this.locationService.userLocation$;
    const locationPermissionState$ = this.locationService.locationPermissionState$;

    this.locationSuggestions$ = combineLatest([userLocation$, locationPermissionState$, this._locationSearchResults$]).pipe(
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
