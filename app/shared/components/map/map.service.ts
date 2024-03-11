import { Injectable } from '@angular/core';
import { LatLong } from '@core/models/location';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private centerSubject = new Subject<LatLong>();
  public center$ = this.centerSubject.asObservable();

  public setCenter(center: LatLong): void {
    this.centerSubject.next(center);
  }
}
