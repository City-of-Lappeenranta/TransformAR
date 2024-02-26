import { FormControl } from '@angular/forms';
import { LocationService } from '@core/services/location.service';
import { NavigationHeaderService } from '@shared/components/navigation/navigation-header/navigation-header.service';
import { EMPTY, first, firstValueFrom, of } from 'rxjs';
import { Shallow } from 'shallow-render';
import { FeedbackModule } from '../../../feedback.module';
import { FeedbackLocationComponent } from './feedback-location.component';
import { environment } from '@environments/environment';
import { LatLong } from '@core/models/location';

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

      const { inject, find, instance } = await shallow
        .mock(LocationService, {
          searchLocationByQuery: jest.fn(() => Promise.resolve([{ name: 'location-result', latLong: [3, 3] as LatLong }])),
        })
        .render(`<app-feedback-location [locationFormControl]="locationFormControl"></app-feedback-location>`, {
          bind: { locationFormControl },
        });
      const locationService = inject(LocationService);

      find('p-autocomplete').componentInstance.completeMethod.emit({ query: 'location-query' });

      expect(locationService.searchLocationByQuery).toHaveBeenCalledWith('location-query');

      await new Promise((resolve) => setTimeout(() => resolve(true), 0));

      expect(await firstValueFrom(instance.locationSuggestions$)).toEqual([
        { disabled: false, latLong: [52, 52], name: 'Your current location' },
        { latLong: [3, 3], name: 'location-result' },
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
          name: 'Fetching your location...',
          disabled: true,
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
          name: 'Your current location',
          disabled: false,
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
          name: 'We could not determine your location',
          disabled: true,
        },
      ]);
    });
  });
});
