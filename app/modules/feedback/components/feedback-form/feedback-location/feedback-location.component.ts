import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { LatLong, LocationSearchResult } from '@core/models/location';
import { LocationService, UserLocation } from '@core/services/location.service';
import { RadarService } from '@core/services/radar.service';
import { environment } from '@environments/environment';
import { AutoCompleteCompleteEvent, AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { BehaviorSubject, Observable, Subject, combineLatest, map } from 'rxjs';

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

  private _currentUserLocation$: Observable<UserLocation> = this.locationService.userLocation$;
  private _locationSearchResults$: Subject<LocationSearchResult[]> = new BehaviorSubject([] as LocationSearchResult[]);

  public mapCenter$: Subject<LatLong> = new BehaviorSubject(environment.defaultLocation as [number, number]);
  public locationSuggestions$: Observable<LocationSuggestion[]> = combineLatest([
    this._currentUserLocation$,
    this._locationSearchResults$,
  ]).pipe(
    map(([currentUserLocation, locationSearchResults]) =>
      this.mapCurrentUserLocationAndLocationSearchResultToLocationOptions(currentUserLocation, locationSearchResults),
    ),
  );

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

    this.mapCenter$.next(latLong);
    this.locationFormControl.setValue(latLong);
  }

  private mapCurrentUserLocationAndLocationSearchResultToLocationOptions(
    currentUserLocation: UserLocation,
    results: LocationSearchResult[],
  ): LocationSuggestion[] {
    let currentUserLocationName = 'Fetching your location...';

    if (!currentUserLocation.loading) {
      if (currentUserLocation.available) {
        currentUserLocationName = 'Your current location';
      } else {
        currentUserLocationName = 'We could not determine your location';
      }
    }

    const currentUserLocationOption: LocationSuggestion = {
      latLong: currentUserLocation.location ?? [0, 0],
      address: currentUserLocationName,
      disabled: !currentUserLocation.available,
      isCurrentLocation: true,
    };

    return [currentUserLocationOption, ...results];
  }
}
