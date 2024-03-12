import { Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DataPoint, WeatherDataPoint, DATA_POINT_QUALITY_COLOR_CHART, DATA_POINT_TYPE_ICON } from '@core/models/data-point';
import { LatLong } from '@core/models/location';
import { DataPointsApi } from '@core/services/datapoints-api.service';
import { Marker } from '@shared/components/map/map.component';
import { Observable, Subject, take } from 'rxjs';

@Component({
  selector: 'app-dashboard-map',
  templateUrl: './dashboard-map.component.html',
  styleUrls: ['./dashboard-map.component.scss'],
})
export class DashboardMapComponent {
  private dataPoints: DataPoint[] = [];

  public weatherDataPointMarkers: Marker[] = [];
  public weatherDataPointMarkersLoading: boolean = true;

  private _selectedDataPointSubject$: Subject<DataPoint | null> = new Subject<DataPoint | null>();
  public selectedDataPoint$: Observable<DataPoint | null> = this._selectedDataPointSubject$.asObservable();

  public constructor(private readonly dataPointsApi: DataPointsApi) {
    this.dataPointsApi
      .getWeatherDataPoints()
      .pipe(take(1), takeUntilDestroyed())
      .subscribe(this.handleWeatherDataPoints.bind(this));
  }

  public onMarkerClick(latLong: LatLong): void {
    this.setActiveMarker(latLong);
    this._selectedDataPointSubject$.next(
      this.dataPoints.find((point) => this.isSameLocation([point.location, latLong])) ?? null,
    );
  }

  public onDataPointClose(): void {
    this.setActiveMarker();
    this._selectedDataPointSubject$.next(null);
  }

  private setActiveMarker(latLong?: LatLong): void {
    this.weatherDataPointMarkers = this.weatherDataPointMarkers.map((marker) => ({
      ...marker,
      active: latLong ? this.isSameLocation([marker.location, latLong]) : false,
    }));
  }

  private handleWeatherDataPoints(weatherDataPoints: WeatherDataPoint[]): void {
    this.dataPoints = this.dataPoints.concat(weatherDataPoints);

    this.weatherDataPointMarkers = weatherDataPoints.map((point) => ({
      location: point.location,
      icon: DATA_POINT_TYPE_ICON[point.type],
      color: DATA_POINT_QUALITY_COLOR_CHART[point.quality],
    }));
    this.weatherDataPointMarkersLoading = false;
  }

  private isSameLocation(locations: [LatLong, LatLong]): boolean {
    return locations[0].toString() === locations[1].toString();
  }
}
