import { FormControl } from '@angular/forms';
import { LatLong } from '../../../../../core/models/location';
import { LocationService, UserLocation } from '../../../../../core/services/location.service';
import { NavigationHeaderService } from '../../../../../shared/components/navigation/navigation-header/navigation-header.service';
import { of, take } from 'rxjs';
import { Shallow } from 'shallow-render';
import { FeedbackModule } from '../../../feedback.module';
import { FeedbackLocationComponent } from './feedback-location.component';
import { SharedModule } from 'primeng/api';

describe('FeedbackLocationComponent', () => {
  let shallow: Shallow<FeedbackLocationComponent>;

  beforeEach(() => {
    shallow = new Shallow(FeedbackLocationComponent, FeedbackModule)
      .mock(LocationService, {
        userLocation$: of({
          loading: false,
          available: true,
          location: [52, 52],
        } as UserLocation),
      })
      .provideMock(SharedModule)
      .mock(NavigationHeaderService, { setSkip: jest.fn() });
  });

  describe('select location', () => {
    it('should update the center of the map and form control value', async () => {
      const locationFormControl = new FormControl();

      const { instance } = await shallow.render(
        '<app-feedback-location [locationFormControl]="locationFormControl"></app-feedback-location>',
        {
          bind: { locationFormControl },
        },
      );

      const latLong: LatLong = [0, 2];
      locationFormControl.setValue(latLong);

      expect(locationFormControl.value).toEqual(latLong);
      instance.mapCenter$.pipe(take(1)).subscribe((result) => expect(result === latLong));
    });
  });
});
