import { animate, style, transition, trigger } from '@angular/animations';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import {
  DATA_POINT_QUALITY_COLOR_CHART,
  DATA_POINT_TYPE_ICON,
  DataPoint,
  DataPointQuality,
  DataPointType,
} from '@core/models/data-point';
import { LatLong } from '@core/models/location';
import { DataPointsApi } from '@core/services/datapoints-api/datapoints-api.service';
import { LocationService, UserLocation } from '@core/services/location.service';
import { environment } from '@environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { Marker } from '@shared/components/map/map.component';
import { isSameLocation } from '@shared/utils/location-utils';
import { groupBy } from 'lodash';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, Observable, Subject, combineLatest, filter, map, take, withLatestFrom } from 'rxjs';

//TODO: move data fetching to dashboard-map.service

@Component({
  selector: 'app-dashboard-map',
  templateUrl: './dashboard-map.component.html',
  styleUrls: ['./dashboard-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('slideInAndOut', [
      transition(':enter', [
        style({ transform: 'translateY(100%)' }),
        animate('200ms ease-in-out', style({ transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        style({ transform: 'translateY(0)' }),
        animate('150ms ease-in-out', style({ transform: 'translateY(100%)' })),
      ]),
    ]),
  ],
})
export class DashboardMapComponent implements AfterViewInit {
  private _allDataPoints = signal<DataPoint[]>([]);

  public showDataPointTypeFilter = signal<boolean>(false);
  public dataPointTypeFilter = signal<DataPointType[]>([]);
  private _filteredDataPoints$: Observable<DataPoint[]> = combineLatest([
    toObservable(this._allDataPoints),
    toObservable(this.dataPointTypeFilter),
  ]).pipe(
    map(([allDataPoints, dataPointFilter]) =>
      dataPointFilter.length > 0 ? allDataPoints.filter((point) => dataPointFilter.includes(point.type)) : allDataPoints,
    ),
  );

  private _activeLocation = signal<LatLong | undefined>(undefined);
  public selectedDataPoints = computed(() => {
    const latLong = this._activeLocation();

    if (latLong) {
      return this._allDataPoints().filter((point) => isSameLocation(point.location, latLong));
    }

    return null;
  });

  public dataPointMarkers$: Observable<Marker[]> = combineLatest([
    this._filteredDataPoints$,
    toObservable(this._activeLocation),
  ]).pipe(map(([points, activeLocation]) => this.createMarkersFromDataPoints(points, activeLocation)));

  private _weatherConditionDataPointMarkersLoadingSubject$ = new BehaviorSubject(true);
  private _weatherStormWaterDataPointMarkersLoadingSubject$ = new BehaviorSubject(true);
  private _weatherAirQualityDataPointMarkersLoadingSubject$ = new BehaviorSubject(true);
  private _parkingDataPointMarkersLoadingSubject$ = new BehaviorSubject(true);

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
    combineLatest([
      this._weatherConditionDataPointMarkersLoadingSubject$,
      this._weatherStormWaterDataPointMarkersLoadingSubject$,
      this._weatherAirQualityDataPointMarkersLoadingSubject$,
      this._parkingDataPointMarkersLoadingSubject$,
    ])
      .pipe(takeUntilDestroyed())
      .subscribe((loadingStates) => loadingStates.every((loading) => !loading) && this.closeLoadingDataToast());

    this.dataPointsApi
      .getWeatherConditions()
      .pipe(take(1), takeUntilDestroyed())
      .subscribe((points) => this.handleDataPointsByType(points, DataPointType.WEATHER_CONDITIONS));

    this.dataPointsApi
      .getWeatherStormWater()
      .pipe(take(1), takeUntilDestroyed())
      .subscribe((points) => this.handleDataPointsByType(points, DataPointType.STORM_WATER));

    this.dataPointsApi
      .getWeatherAirQuality()
      .pipe(take(1), takeUntilDestroyed())
      .subscribe((points) => this.handleDataPointsByType(points, DataPointType.AIR_QUALITY));

    this.dataPointsApi
      .getParking()
      .pipe(take(1), takeUntilDestroyed())
      .subscribe((points) => this.handleDataPointsByType(points, DataPointType.PARKING));

    this._focusLocation$.pipe(take(1), takeUntilDestroyed()).subscribe(this.onInitialFocusLocation.bind(this));

    effect(() => this._activeLocation() && this.showDataPointTypeFilter.set(false), { allowSignalWrites: true });
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
  }

  public onDataPointClose(): void {
    this.setActiveMarker();
  }

  public onFilterOpen(): void {
    this.showDataPointTypeFilter.set(true);
  }

  public onFilterClose(): void {
    this.showDataPointTypeFilter.set(false);
  }

  public onFilterToggle(type: DataPointType): void {
    this.dataPointTypeFilter.update((current) => {
      const update = [...current];

      if (!update.includes(type)) {
        update.push(type);
      } else {
        update.splice(update.indexOf(type), 1);
      }

      return update;
    });
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

  public async setActiveMarker(latLong?: LatLong): Promise<void> {
    this._activeLocation.set(latLong);
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

  private createMarkersFromDataPoints(points: DataPoint[], activeLocation?: LatLong): Marker[] {
    const pointsByLocation = groupBy(points, 'location');

    return Object.entries(pointsByLocation).map(([_, dataPoints]) => {
      const hasMultipleDataPoints = dataPoints.length > 1;

      return {
        location: dataPoints[0].location,
        icon: hasMultipleDataPoints ? 'multiple-data-points.svg' : DATA_POINT_TYPE_ICON[dataPoints[0].type],
        color: hasMultipleDataPoints
          ? DATA_POINT_QUALITY_COLOR_CHART[DataPointQuality.DEFAULT]
          : DATA_POINT_QUALITY_COLOR_CHART[dataPoints[0].quality],
        ...(activeLocation && isSameLocation(dataPoints[0].location, activeLocation) && { active: true }),
      };
    });
  }

  private handleDataPointsByType(dataPoints: DataPoint[], type: DataPointType): void {
    this._allDataPoints.update((current) => current.filter((point) => point.type !== type).concat(dataPoints));

    switch (type) {
      case DataPointType.WEATHER_CONDITIONS:
        this._weatherConditionDataPointMarkersLoadingSubject$.next(false);
        break;
      case DataPointType.STORM_WATER:
        this._weatherStormWaterDataPointMarkersLoadingSubject$.next(false);
        break;
      case DataPointType.AIR_QUALITY:
        this._weatherAirQualityDataPointMarkersLoadingSubject$.next(false);
        break;
      case DataPointType.PARKING:
        this._parkingDataPointMarkersLoadingSubject$.next(false);
        break;
    }
  }
}
