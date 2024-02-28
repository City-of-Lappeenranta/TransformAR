import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { LatLong } from '@core/models/location';
import { LocationService, UserLocation } from '@core/services/location.service';
import { environment } from '@environments/environment';
import { AutoCompleteCompleteEvent, AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { BehaviorSubject, Observable, Subject, combineLatest, map } from 'rxjs';

interface LocationSearchResult {
  name: string;
  latLong: LatLong;
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
  public locationSuggestions$: Observable<LocationSearchResult[]> = combineLatest([
    this._currentUserLocation$,
    this._locationSearchResults$,
  ]).pipe(
    map(([currentUserLocation, locationSearchResults]) =>
      this.mergeLocationSearchResultsWithCurrentUserLocation(currentUserLocation, locationSearchResults),
    ),
  );

  public constructor(private readonly locationService: LocationService) {}

  public async onSearchLocation(event: AutoCompleteCompleteEvent): Promise<void> {
    const { query } = event;

    const results = await this.locationService.searchLocationByQuery(query);
    this._locationSearchResults$.next(results);
  }

  public onSelectLocation(event: AutoCompleteSelectEvent): void {
    const latLong = (event.value as LocationSearchResult).latLong;

    this.mapCenter$.next(latLong);
    this.locationFormControl.setValue(latLong);
  }

  private mergeLocationSearchResultsWithCurrentUserLocation(
    currentUserLocation: UserLocation,
    results: LocationSearchResult[],
  ): LocationSearchResult[] {
    let currentUserLocationName = 'Fetching your location...';

    if (!currentUserLocation.loading) {
      if (currentUserLocation.available) {
        currentUserLocationName = 'Your current location';
      } else {
        currentUserLocationName = 'We could not determine your location';
      }
    }

    const currentUserLocationOption: LocationSearchResult = {
      latLong: currentUserLocation.location ?? [0, 0],
      name: currentUserLocationName,
      disabled: !currentUserLocation.available,
    };

    return [currentUserLocationOption, ...results];
  }
}
