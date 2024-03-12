import { Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { LatLong } from '@core/models/location';
import { MapService } from '@shared/components/map/map.service';

@Component({
  selector: 'app-feedback-location',
  templateUrl: './feedback-location.component.html',
  styleUrls: ['./feedback-location.component.scss'],
})
export class FeedbackLocationComponent implements OnInit {
  @Input({ required: true }) public locationFormControl!: FormControl<LatLong | null>;

  private readonly destroyRef = inject(DestroyRef);

  public constructor(private readonly mapService: MapService) {}

  public ngOnInit(): void {
    this.locationFormControl?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((latLong) => {
      if (latLong) {
        this.mapService.setCenter(latLong);
      }
    });
  }
}
