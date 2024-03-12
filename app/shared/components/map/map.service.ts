import { Injectable } from '@angular/core';
import { LatLong } from '@core/models/location';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private _centerSubject$ = new Subject<LatLong>();
  public center$ = this._centerSubject$.asObservable();

  public setCenter(center: LatLong): void {
    this._centerSubject$.next(center);
  }
}
