import { Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { LatLong } from '@core/models/location';
import { environment } from '@environments/environment';
import { BehaviorSubject } from 'rxjs';
import { SearchLocationInputComponent } from '@shared/components/search-location-input/search-location-input.component';
import { MapComponent } from '@shared/components/map/map.component';

@Component({
  selector: 'app-feedback-location',
  templateUrl: './feedback-location.component.html',
  styleUrls: ['./feedback-location.component.scss'],
  imports: [SearchLocationInputComponent, MapComponent, ReactiveFormsModule],
  standalone: true,
})
export class FeedbackLocationComponent implements OnInit {
  @Input({ required: true })
  public locationFormControl!: FormControl<LatLong | null>;

  private _mapCenterSubject$ = new BehaviorSubject<LatLong>(
    environment.defaultLocation as LatLong,
  );
  public mapCenter$ = this._mapCenterSubject$.asObservable();
  private readonly destroyRef = inject(DestroyRef);

  public ngOnInit(): void {
    this.locationFormControl?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((latLong) => {
        if (latLong) {
          this._mapCenterSubject$.next(latLong);
        }
      });
  }

  public onClickMap(latLong: LatLong): void {
    this.locationFormControl.setValue(latLong);
  }
}
