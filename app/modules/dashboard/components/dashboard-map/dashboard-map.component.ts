import { AfterViewInit, Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DATA_POINT_TYPE_ICON, DATA_POINT_QUALITY_COLOR_CHART, DataPoint, WeatherDataPoint } from '@core/models/data-point';
import { LatLong } from '@core/models/location';
import { DataPointsApi } from '@core/services/datapoints-api.service';
import { LocationService } from '@core/services/location.service';
import { environment } from '@environments/environment';
import { Marker } from '@shared/components/map/map.component';
import { MessageService } from 'primeng/api';
import { isSameLocation } from '@shared/utils/location-utils';
import { BehaviorSubject, Observable, Subject, combineLatest, distinctUntilChanged, map, take } from 'rxjs';

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
  public locationPermissionState$: Observable<PermissionState> = this.locationService.locationPermissionState$;

  public readonly TOAST_KEY = 'loading';
  private _mapCenterSubject$ = new BehaviorSubject<LatLong>(environment.defaultLocation as LatLong);
  public mapCenter$ = this._mapCenterSubject$.asObservable();

  public constructor(
    private readonly locationService: LocationService,
    private readonly dataPointsApi: DataPointsApi,
    private readonly messageService: MessageService,
  ) {
    this.dataPointsApi
      .getWeatherDataPoints()
      .pipe(take(1), takeUntilDestroyed())
      .subscribe(this.handleWeatherDataPoints.bind(this));

    combineLatest([this._weatherDataPointMarkersLoadingSubject$])
      .pipe(takeUntilDestroyed())
      .subscribe((loadingStates) => loadingStates.every((loading) => !loading) && this.closeLoadingDataToast());
  }

  public ngAfterViewInit(): void {
    this.showLoadingDataToast();
  }

  public onMarkerClick(latLong: LatLong): void {
    this.setActiveMarker(latLong);
    this._selectedDataPointSubject$.next(this.dataPoints.find((point) => isSameLocation(point.location, latLong)) ?? null);
  }

  public onDataPointClose(): void {
    this.setActiveMarker();
    this._selectedDataPointSubject$.next(null);
  }

  private showLoadingDataToast(): void {
    this.messageService.add({ key: this.TOAST_KEY, sticky: true, severity: 'custom', detail: 'Fetching data' });
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

  public focusLocation(): void {
    const userLocation$ = this.locationService.userLocation$;
    this.locationLoading$ = userLocation$.pipe(map((userLocation) => userLocation.loading));

    combineLatest([userLocation$, this.locationPermissionState$])
      .pipe(
        map(([currentUserLocation, permissionState]) => ({ currentUserLocation, permissionState })),
        distinctUntilChanged((prev, curr) => {
          return (
            prev.currentUserLocation.loading === curr.currentUserLocation.loading &&
            prev.currentUserLocation.location === curr.currentUserLocation.location
          );
        }),
      )
      .subscribe(({ currentUserLocation, permissionState }) => {
        if (currentUserLocation?.location && permissionState === 'granted') {
          this._mapCenterSubject$.next(currentUserLocation.location as LatLong);
        }

        if (!currentUserLocation.loading && permissionState === 'denied') {
          alert('Allow the app to determine your location. You can do this in your device settings');
        }
      });
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
