import { AfterViewInit, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import {
  DATA_POINT_QUALITY_COLOR_CHART,
  DATA_POINT_TYPE_ICON,
  DataPoint,
  WeatherConditionDataPoint,
  WeatherStormWaterDataPoint,
} from '@core/models/data-point';
import { LatLong } from '@core/models/location';
import { DataPointsApi } from '@core/services/datapoints-api/datapoints-api.service';
import { LocationService } from '@core/services/location.service';
import { environment } from '@environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { Marker } from '@shared/components/map/map.component';
import { isSameLocation } from '@shared/utils/location-utils';
import { MessageService } from 'primeng/api';
import {
  BehaviorSubject,
  Observable,
  Subject,
  combineLatest,
  distinctUntilChanged,
  firstValueFrom,
  map,
  scan,
  take,
} from 'rxjs';

@Component({
  selector: 'app-dashboard-map',
  templateUrl: './dashboard-map.component.html',
  styleUrls: ['./dashboard-map.component.scss'],
})
export class DashboardMapComponent implements AfterViewInit {
  private dataPoints: DataPoint[] = [];

  public _dataPointMarkers$ = new BehaviorSubject<Marker[]>([]);
  public dataPointMarkers$: Observable<Marker[]> = this._dataPointMarkers$.pipe(
    scan((previousMarkers: Marker[], newMarkers: Marker[]) => {
      newMarkers.forEach((newMarker) => {
        const index = previousMarkers.findIndex(
          (marker) => marker.icon === newMarker.icon && isSameLocation(marker.location, newMarker.location),
        );
        if (index !== -1) {
          previousMarkers[index] = newMarker;
        } else {
          previousMarkers.push(newMarker);
        }
      });

      return previousMarkers;
    }, []),
  );

  private _weatherConditionDataPointMarkersLoadingSubject$ = new BehaviorSubject(true);
  private _weatherStormWaterDataPointMarkersLoadingSubject$ = new BehaviorSubject(true);

  private _selectedDataPointSubject$: Subject<DataPoint | null> = new Subject<DataPoint | null>();
  public selectedDataPoint$: Observable<DataPoint | null> = this._selectedDataPointSubject$.asObservable();

  public locationLoading$: Observable<boolean> | undefined;
  public locationPermissionState$: Observable<PermissionState> = this.locationService.locationPermissionState$;

  public locationFormControl = new FormControl<LatLong | null>(null);

  public readonly TOAST_KEY = 'loading';
  private _mapCenterSubject$ = new BehaviorSubject<LatLong>(environment.defaultLocation as LatLong);
  public mapCenter$ = this._mapCenterSubject$.asObservable();

  private readonly destroyRef = inject(DestroyRef);

  public constructor(
    private readonly locationService: LocationService,
    private readonly dataPointsApi: DataPointsApi,
    private readonly messageService: MessageService,
    private readonly translateService: TranslateService,
  ) {
    combineLatest([
      this._weatherConditionDataPointMarkersLoadingSubject$,
      this._weatherStormWaterDataPointMarkersLoadingSubject$,
    ])
      .pipe(takeUntilDestroyed())
      .subscribe((loadingStates) => loadingStates.every((loading) => !loading) && this.closeLoadingDataToast());

    this.dataPointsApi
      .getWeatherConditions()
      .pipe(take(1), takeUntilDestroyed())
      .subscribe(this.handleWeatherConditionDataPoints.bind(this));

    this.dataPointsApi
      .getWeatherStormWater()
      .pipe(take(1), takeUntilDestroyed())
      .subscribe(this.handleWeatherStormWaterDataPoints.bind(this));
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

  public async setActiveMarker(latLong?: LatLong): Promise<void> {
    const markers = await firstValueFrom(this.dataPointMarkers$);
    this._dataPointMarkers$.next(
      markers.map((marker) => ({ ...marker, active: !!latLong && isSameLocation(marker.location, latLong) })),
    );
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
          alert(this.translateService.instant('PERMISSIONS.LOCATION.DENIED.ALERT'));
        }
      });
  }

  private handleWeatherConditionDataPoints(weatherConditionDataPoints: WeatherConditionDataPoint[]): void {
    this.dataPoints = this.dataPoints.concat(weatherConditionDataPoints);

    this._dataPointMarkers$.next(
      weatherConditionDataPoints.map((point) => ({
        location: point.location,
        icon: DATA_POINT_TYPE_ICON[point.type],
        color: DATA_POINT_QUALITY_COLOR_CHART[point.quality],
      })),
    );
    this._weatherConditionDataPointMarkersLoadingSubject$.next(false);
  }

  private handleWeatherStormWaterDataPoints(weatherStormWaterDataPoint: WeatherStormWaterDataPoint[]): void {
    this.dataPoints = this.dataPoints.concat(weatherStormWaterDataPoint);

    this._dataPointMarkers$.next(
      weatherStormWaterDataPoint.map((point) => ({
        location: point.location,
        icon: DATA_POINT_TYPE_ICON[point.type],
        color: DATA_POINT_QUALITY_COLOR_CHART[point.quality],
      })),
    );

    this._weatherStormWaterDataPointMarkersLoadingSubject$.next(false);
  }
}
