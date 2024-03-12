import { FormControl } from '@angular/forms';
import { LatLong } from '@core/models/location';
import { LocationService, UserLocation } from '@core/services/location.service';
import { NavigationHeaderService } from '@shared/components/navigation/navigation-header/navigation-header.service';
import { firstValueFrom, of } from 'rxjs';
import { Shallow } from 'shallow-render';
import { FeedbackModule } from '../../../feedback.module';
import { FeedbackLocationComponent } from './feedback-location.component';
import { RadarService } from '@core/services/radar.service';
import { SharedModule } from 'primeng/api';
import { MapService } from '@shared/components/map/map.service';

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

      const { find, fixture, inject } = await shallow.render(
        `<app-feedback-location [locationFormControl]="locationFormControl"></app-feedback-location>`,
        {
          bind: { locationFormControl },
        },
      );

      const mapService = inject(MapService);
      jest.spyOn(mapService, 'setCenter');

      find('p-autocomplete').componentInstance.onSelect.emit({ value: { latLong: [2, 2] } });

      fixture.detectChanges();

      expect(mapService.setCenter).toHaveBeenCalledWith([2, 2]);
      expect(locationFormControl.value).toEqual([2, 2]);
    });
  });

  describe('complete location', () => {
    it('should search by query and update location search results', async () => {
      const locationFormControl = new FormControl();

      const { inject, find, instance, fixture } = await shallow
        .mock(RadarService, {
          autocomplete: jest.fn(() =>
            Promise.resolve([{ address: 'Noordlaan 18, Kuurne, Belgium', latLong: [3, 3] as LatLong }]),
          ),
        })
        .render(`<app-feedback-location [locationFormControl]="locationFormControl"></app-feedback-location>`, {
          bind: { locationFormControl },
        });
      const radarService = inject(RadarService);

      find('p-autocomplete').componentInstance.completeMethod.emit({ query: 'location-query' });

      expect(radarService.autocomplete).toHaveBeenCalledWith('location-query');

      await fixture.whenStable();

      if (instance.locationSuggestions$) {
        expect(await firstValueFrom(instance.locationSuggestions$)).toEqual([
          { disabled: false, latLong: [52, 52], isCurrentLocation: true, address: 'Your current location' },
          { latLong: [3, 3], address: 'Noordlaan 18, Kuurne, Belgium' },
        ]);
      }
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

      if (instance.locationSuggestions$) {
        expect(await firstValueFrom(instance.locationSuggestions$)).toEqual([
          {
            latLong: [0, 0],
            address: 'Fetching your location...',
            disabled: true,
            isCurrentLocation: true,
          },
        ]);
      }
    });

    it('should handle user location', async () => {
      const { instance } = await shallow
        .mock(LocationService, {
          userLocation$: of({
            loading: false,
            available: true,
            location: [4, 4],
          } as UserLocation),
        })
        .render(`<app-feedback-location [locationFormControl]="locationFormControl"></app-feedback-location>`, {
          bind: { locationFormControl: new FormControl(null) },
        });

      if (instance.locationSuggestions$) {
        expect(await firstValueFrom(instance.locationSuggestions$)).toEqual([
          {
            latLong: [4, 4],
            address: 'Your current location',
            disabled: false,
            isCurrentLocation: true,
          },
        ]);
      }
    });

    it('should handle unavailable user location', async () => {
      const { instance } = await shallow
        .mock(LocationService, {
          userLocation$: of({ loading: false, available: false }),
        })
        .render(`<app-feedback-location [locationFormControl]="locationFormControl"></app-feedback-location>`, {
          bind: { locationFormControl: new FormControl(null) },
        });

      if (instance.locationSuggestions$) {
        expect(await firstValueFrom(instance.locationSuggestions$)).toEqual([
          {
            latLong: [0, 0],
            address: 'We could not determine your location',
            disabled: true,
            isCurrentLocation: true,
          },
        ]);
      }
    });
  });
});
