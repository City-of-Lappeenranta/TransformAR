import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { LatLong, LocationSearchResult } from '@core/models/location';
import { LocationService, UserLocation } from '@core/services/location.service';
import { environment } from '@environments/environment';
import { NavigationHeaderAction } from '@shared/components/navigation/navigation-header/navigation-header-action.interface';
import { NavigationHeaderService } from '@shared/components/navigation/navigation-header/navigation-header.service';
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
export class FeedbackLocationComponent implements OnInit, OnDestroy {
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
    private readonly navigationHeaderService: NavigationHeaderService,
    private readonly locationService: LocationService,
  ) {}

  public ngOnInit(): void {
    this.navigationHeaderService.setAction({
      type: 'text',
      value: 'Skip',
    } as NavigationHeaderAction);
  }

  public ngOnDestroy(): void {
    this.navigationHeaderService.setAction(null);
  }

  public async onSearchLocation(event: AutoCompleteCompleteEvent): Promise<void> {
    const { query } = event;

    const results = await this.locationService.searchLocationByQuery(query);
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
