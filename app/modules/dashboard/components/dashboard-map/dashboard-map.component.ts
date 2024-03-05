import { Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { WeatherDataPoint } from '@core/models/data-points-api';
import { LatLong } from '@core/models/location';
import { DataPointsApi } from '@core/services/data-points-api.service';
import { Marker } from '@shared/components/map/map.component';
import { Observable, Subject, take } from 'rxjs';

@Component({
  selector: 'app-dashboard-map',
  templateUrl: './dashboard-map.component.html',
  styleUrls: ['./dashboard-map.component.scss'],
})
export class DashboardMapComponent {
  public weatherDataPoints: WeatherDataPoint[] = [];
  public weatherDataPointMarkers: Marker[] = [];
  public weatherDataPointMarkersLoading: boolean = true;

  private _selectedWeatherDataPointSubject$: Subject<WeatherDataPoint | null> = new Subject<WeatherDataPoint | null>();
  public selectedWeatherDataPoint$: Observable<WeatherDataPoint | null> =
    this._selectedWeatherDataPointSubject$.asObservable();

  public constructor(private readonly dataPointsApi: DataPointsApi) {
    this.dataPointsApi
      .getWeatherDataPoints()
      .pipe(take(1), takeUntilDestroyed())
      .subscribe(this.handleWeatherDataPoints.bind(this));
  }

  public onMarkerClick(latLong: LatLong): void {
    this._selectedWeatherDataPointSubject$.next(this.weatherDataPoints.find((point) => point.location === latLong) ?? null);
  }

  private handleWeatherDataPoints(weatherDataPoints: WeatherDataPoint[]): void {
    this.weatherDataPoints = weatherDataPoints;
    this.weatherDataPointMarkers = weatherDataPoints.map((point) => ({ location: point.location }));
    this.weatherDataPointMarkersLoading = false;
  }
}
