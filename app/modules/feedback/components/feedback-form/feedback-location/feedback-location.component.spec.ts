import { FormControl } from '@angular/forms';
import { LatLong } from '@core/models/location';
import { LocationService } from '@core/services/location.service';
import { environment } from '@environments/environment';
import { NavigationHeaderService } from '@shared/components/navigation/navigation-header/navigation-header.service';
import { firstValueFrom, of } from 'rxjs';
import { Shallow } from 'shallow-render';
import { FeedbackModule } from '../../../feedback.module';
import { FeedbackLocationComponent } from './feedback-location.component';

describe('FeedbackLocationComponent', () => {
  let shallow: Shallow<FeedbackLocationComponent>;

  beforeEach(() => {
    shallow = new Shallow(FeedbackLocationComponent, FeedbackModule)
      .mock(LocationService, {
        userLocation$: of({ loading: false, available: true, location: [52, 52] as LatLong }),
      })
      .mock(NavigationHeaderService, { setAction: jest.fn() });
  });

  describe('mapCenter$', () => {
    it('should initiate with the default location from the environment', async () => {
      environment.defaultLocation = [1, 1];

      const { instance } = await shallow.render(
        `<app-feedback-location [locationFormControl]="locationFormControl"></app-feedback-location>`,
        {
          bind: { locationFormControl: new FormControl(null) },
        },
      );

      expect(await firstValueFrom(instance.mapCenter$)).toEqual([1, 1]);
    });

    it('should update when location gets selected', async () => {});
  });

  describe('select location', () => {
    it('should update the center of the map and form control value', async () => {
      const locationFormControl = new FormControl();

      const { instance, find, fixture } = await shallow.render(
        `<app-feedback-location [locationFormControl]="locationFormControl"></app-feedback-location>`,
        {
          bind: { locationFormControl },
        },
      );

      find('p-autocomplete').componentInstance.onSelect.emit({ value: { latLong: [2, 2] } });

      fixture.detectChanges();

      expect(await firstValueFrom(instance.mapCenter$)).toEqual([2, 2]);
      expect(locationFormControl.value).toEqual([2, 2]);
    });
  });

  describe('complete location', () => {
    it('should search by query and update location search results', async () => {
      const locationFormControl = new FormControl();

      const { inject, find, instance, fixture } = await shallow
        .mock(LocationService, {
          searchLocationByQuery: jest.fn(() =>
            Promise.resolve([{ address: 'Noordlaan 18, Kuurne, Belgium', latLong: [3, 3] as LatLong }]),
          ),
        })
        .render(`<app-feedback-location [locationFormControl]="locationFormControl"></app-feedback-location>`, {
          bind: { locationFormControl },
        });
      const locationService = inject(LocationService);

      find('p-autocomplete').componentInstance.completeMethod.emit({ query: 'location-query' });

      expect(locationService.searchLocationByQuery).toHaveBeenCalledWith('location-query');

      await fixture.whenStable();

      expect(await firstValueFrom(instance.locationSuggestions$)).toEqual([
        { disabled: false, latLong: [52, 52], isCurrentLocation: true, address: 'Your current location' },
        { latLong: [3, 3], address: 'Noordlaan 18, Kuurne, Belgium' },
      ]);
    });
  });

  describe('user location', () => {
    it('should initially fetch location', async () => {
      const { instance } = await shallow
        .mock(LocationService, {
          userLocation$: of({ loading: true, available: false }),
        })
        .render(`<app-feedback-location [locationFormControl]="locationFormControl"></app-feedback-location>`, {
          bind: { locationFormControl: new FormControl(null) },
        });

      expect(await firstValueFrom(instance.locationSuggestions$)).toEqual([
        {
          latLong: [0, 0],
          address: 'Fetching your location...',
          disabled: true,
          isCurrentLocation: true,
        },
      ]);
    });

    it('should handle user location', async () => {
      const { instance } = await shallow
        .mock(LocationService, {
          userLocation$: of({ loading: false, available: true, location: [4, 4] as LatLong }),
        })
        .render(`<app-feedback-location [locationFormControl]="locationFormControl"></app-feedback-location>`, {
          bind: { locationFormControl: new FormControl(null) },
        });

      expect(await firstValueFrom(instance.locationSuggestions$)).toEqual([
        {
          latLong: [4, 4],
          address: 'Your current location',
          disabled: false,
          isCurrentLocation: true,
        },
      ]);
    });

    it('should handle unavailable user location', async () => {
      const { instance } = await shallow
        .mock(LocationService, {
          userLocation$: of({ loading: false, available: false }),
        })
        .render(`<app-feedback-location [locationFormControl]="locationFormControl"></app-feedback-location>`, {
          bind: { locationFormControl: new FormControl(null) },
        });

      expect(await firstValueFrom(instance.locationSuggestions$)).toEqual([
        {
          latLong: [0, 0],
          address: 'We could not determine your location',
          disabled: true,
          isCurrentLocation: true,
        },
      ]);
    });
  });
});
