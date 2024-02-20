import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NavigationHeaderAction } from '@shared/components/navigation/navigation-header/navigation-header-action.interface';
import { NavigationHeaderService } from '@shared/components/navigation/navigation-header/navigation-header.service';
import {
  AutoCompleteCompleteEvent,
  AutoCompleteSelectEvent,
} from 'primeng/autocomplete';
import { BehaviorSubject, Subject } from 'rxjs';
import { LatLong } from '../../../../../core/models/location';
import { environment } from '../../../../../environment/environment';

interface LocationSearchResult {
  name: string;
  latLong: LatLong;
  optionDisabled?: boolean;
}

@Component({
  selector: 'app-feedback-location',
  templateUrl: './feedback-location.component.html',
  styleUrls: ['./feedback-location.component.scss'],
})
export class FeedbackLocationComponent implements OnInit, OnDestroy {
  @Input({ required: true })
  public locationFormControl!: FormControl<LatLong | null>;
  public mapCenter$: Subject<LatLong> = new BehaviorSubject(
    environment.defaultLocation
  );

  private _currentUserLocation: LatLong | undefined;
  private _locationSearchResults: LocationSearchResult[] = [];

  public constructor(
    private readonly navigationHeaderService: NavigationHeaderService
  ) {}

  public ngOnInit(): void {
    this.navigationHeaderService.setAction({
      type: 'text',
      value: 'Skip',
    } as NavigationHeaderAction);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        this._currentUserLocation = [latitude, longitude];
        this.locationSearchResults = [];
      },
      (error) => {
        this._currentUserLocation = undefined;
        this.locationSearchResults = [];
      }
    );
  }

  public ngOnDestroy(): void {
    this.navigationHeaderService.setAction(null);
  }

  public async onSearchLocation(event: AutoCompleteCompleteEvent) {
    const { query } = event;

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?${query}`
    );

    console.log(response);

    this.locationSearchResults = [{ latLong: [0, 0], name: query }];
  }

  public onSelectLocation(event: AutoCompleteSelectEvent) {
    const latLong = (event.value as LocationSearchResult).latLong;

    this.mapCenter$.next(latLong);
    this.locationFormControl.setValue(latLong);
  }

  public get locationSearchResults(): LocationSearchResult[] {
    return this._locationSearchResults;
  }

  private set locationSearchResults(results: LocationSearchResult[]) {
    const currentLocation: LocationSearchResult = {
      latLong: this._currentUserLocation ?? [0, 0],
      name: this._currentUserLocation
        ? 'Your current location'
        : 'We could not determine your location',
      optionDisabled: Boolean(this._currentUserLocation),
    };

    this._locationSearchResults = [currentLocation, ...results];
  }
}
