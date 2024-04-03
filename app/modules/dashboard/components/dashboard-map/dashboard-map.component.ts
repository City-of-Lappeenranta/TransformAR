import { AfterViewInit, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { DATA_POINT_QUALITY_COLOR_CHART, DATA_POINT_TYPE_ICON, DataPoint, WeatherDataPoint } from '@core/models/data-point';
import { LatLong } from '@core/models/location';
import { DataPointsApi } from '@core/services/datapoints-api.service';
import { LocationService, UserLocation } from '@core/services/location.service';
import { environment } from '@environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { Marker } from '@shared/components/map/map.component';
import { isSameLocation } from '@shared/utils/location-utils';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, Observable, Subject, combineLatest, filter, map, take, withLatestFrom } from 'rxjs';

@Component({
  selector: 'app-dashboard-map',
  templateUrl: './dashboard-map.component.html',
  styleUrls: ['./dashboard-map.component.scss'],
})
export class DashboardMapComponent implements AfterViewInit {
  private dataPoints: DataPoint[] = [];

  private _weatherDataPointMarkersLoadingSubject$ = new BehaviorSubject(true);
  public weatherDataPointMarkers: Marker[] = [];

  private _selectedDataPointSubject$: Subject<DataPoint | null> = new Subject<DataPoint | null>();
  public selectedDataPoint$: Observable<DataPoint | null> = this._selectedDataPointSubject$.asObservable();

  public locationLoading$: Observable<boolean> | undefined;
  public locationPermissionState$: Observable<PermissionState> | undefined;

  public locationFormControl = new FormControl<LatLong | null>(null);

  public readonly TOAST_KEY = 'loading';

  private _mapCenterSubject$ = new BehaviorSubject<LatLong>(environment.defaultLocation as LatLong);
  public mapCenter$ = this._mapCenterSubject$.asObservable();

  private _focusLocation$ = new Subject<void>();

  private readonly destroyRef = inject(DestroyRef);

  public constructor(
    private readonly locationService: LocationService,
    private readonly dataPointsApi: DataPointsApi,
    private readonly messageService: MessageService,
    private readonly translateService: TranslateService,
  ) {
    this.dataPointsApi
      .getWeatherDataPoints()
      .pipe(take(1), takeUntilDestroyed())
      .subscribe(this.handleWeatherDataPoints.bind(this));

    combineLatest([this._weatherDataPointMarkersLoadingSubject$])
      .pipe(takeUntilDestroyed())
      .subscribe((loadingStates) => loadingStates.every((loading) => !loading) && this.closeLoadingDataToast());

    this._focusLocation$.pipe(take(1), takeUntilDestroyed()).subscribe(this.onInitialFocusLocation.bind(this));
  }

  public ngAfterViewInit(): void {
    this.showLoadingDataToast();

    this.locationFormControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((latLong) => {
      if (latLong) {
        this._mapCenterSubject$.next(latLong);
      }
    });
  }

  public onMarkerClick(latLong: LatLong): void {
    this.setActiveMarker(latLong);
    this._selectedDataPointSubject$.next(this.dataPoints.find((point) => isSameLocation(point.location, latLong)) ?? null);
  }

  public onDataPointClose(): void {
    this.setActiveMarker();
    this._selectedDataPointSubject$.next(null);
  }

  public onFocusLocationClick(): void {
    this._focusLocation$.next();
  }

  private async showLoadingDataToast(): Promise<void> {
    this.messageService.add({
      key: this.TOAST_KEY,
      sticky: true,
      severity: 'custom',
      detail: this.translateService.instant('LOADING_STATES.FETCHING_DATA'),
    });
  }

  private closeLoadingDataToast(): void {
    this.messageService.clear(this.TOAST_KEY);
  }

  private setActiveMarker(latLong?: LatLong): void {
    this.weatherDataPointMarkers = this.weatherDataPointMarkers.map((marker) => ({
      ...marker,
      active: latLong ? isSameLocation(marker.location, latLong) : false,
    }));
  }

  private onInitialFocusLocation(): void {
    this.locationPermissionState$ = this.locationService.locationPermissionState$;
    this.locationLoading$ = this.locationService.userLocation$.pipe(map(({ loading }) => loading));

    this._focusLocation$
      .pipe(
        withLatestFrom(this.locationService.userLocation$, this.locationService.locationPermissionState$),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(([_, userLocation, permissionState]) => this.onFocusLocation(userLocation, permissionState));

    this.locationLoading$
      .pipe(
        filter((loading) => !loading),
        take(1),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this._focusLocation$.next());
  }

  private onFocusLocation(userLocation: UserLocation, permissionState: PermissionState): void {
    if (userLocation.location && permissionState === 'granted') {
      this._mapCenterSubject$.next(userLocation.location);
    }

    if (!userLocation.loading && permissionState === 'denied') {
      alert(this.translateService.instant('PERMISSIONS.LOCATION.DENIED.ALERT'));
    }
  }

  private handleWeatherDataPoints(weatherDataPoints: WeatherDataPoint[]): void {
    this.dataPoints = this.dataPoints.concat(weatherDataPoints);

    this.weatherDataPointMarkers = weatherDataPoints.map((point) => ({
      location: point.location,
      icon: DATA_POINT_TYPE_ICON[point.type],
      color: DATA_POINT_QUALITY_COLOR_CHART[point.quality],
    }));
    this._weatherDataPointMarkersLoadingSubject$.next(false);
  }
}
