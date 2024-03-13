import { LatLong } from '@core/models/location';
import { LocationService, UserLocation } from '@core/services/location.service';
import { NavigationHeaderService } from '@shared/components/navigation/navigation-header/navigation-header.service';
import { firstValueFrom, of } from 'rxjs';
import { Shallow } from 'shallow-render';
import { RadarService } from '@core/services/radar.service';
import { SharedModule } from 'primeng/api';
import { SearchLocationInputComponent } from './search-location-input.component';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AutoCompleteModule } from 'primeng/autocomplete';

describe('SearchLocationInputComponent', () => {
  let shallow: Shallow<SearchLocationInputComponent>;

  beforeEach(() => {
    shallow = new Shallow(SearchLocationInputComponent)
      .mock(LocationService, {
        userLocation$: of({
          loading: false,
          available: true,
          location: [52, 52],
        } as UserLocation),
      })
      .provideMock(SharedModule)
      .provideMock(AutoCompleteModule)
      .mock(NavigationHeaderService, { setSkip: jest.fn() })
      .mock(RadarService, {
        autocomplete: jest.fn(() =>
          Promise.resolve([{ address: 'Noordlaan 18, Kuurne, Belgium', latLong: [3, 3] as LatLong }]),
        ),
      })
      .replaceModule(HttpClient, HttpClientTestingModule);
  });

  describe('select location', () => {
    it('should update the form control value', async () => {
      const { find, fixture, instance } = await shallow.render();

      find('p-autocomplete').componentInstance.onSelect.emit({ value: { latLong: [2, 2] } });

      fixture.detectChanges();

      expect(instance.value).toEqual([2, 2]);
    });
  });

  describe('complete location', () => {
    it('should search by query and update location search results', async () => {
      const { inject, find, instance, fixture } = await shallow.render();
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
          locationPermissionState$: of('prompt' as PermissionState),
          userLocation$: of({ loading: true, available: false }),
        })
        .render();

      instance.onAutocompleteFocus();

      if (instance.locationSuggestions$) {
        expect(await firstValueFrom(instance.locationSuggestions$)).toEqual([
          {
            latLong: [0, 0],
            address: 'Fetching your location...',
            isCurrentLocation: true,
            disabled: true,
          },
        ]);
      }
    });
    it('should initially fetch location without current user location if withCurrentLocation is false', async () => {
      const { instance } = await shallow.render({
        bind: { withCurrentLocation: false },
      });

      instance.onAutocompleteFocus();

      if (instance.locationSuggestions$) {
        expect(await firstValueFrom(instance.locationSuggestions$)).toEqual([]);
      }
    });

    it('should handle user location', async () => {
      const { instance } = await shallow
        .mock(LocationService, {
          locationPermissionState$: of('granted' as PermissionState),
          userLocation$: of({
            loading: false,
            available: true,
            location: [4, 4],
          } as UserLocation),
        })
        .render();

      instance.onAutocompleteFocus();

      if (instance.locationSuggestions$) {
        expect(await firstValueFrom(instance.locationSuggestions$)).toEqual([
          {
            latLong: [4, 4],
            address: 'Your current location',
            isCurrentLocation: true,
            disabled: false,
          },
        ]);
      }
    });

    it('should handle unavailable user location', async () => {
      const { instance } = await shallow
        .mock(LocationService, {
          locationPermissionState$: of('denied' as PermissionState),
          userLocation$: of({ loading: false, available: false }),
        })
        .render();

      instance.onAutocompleteFocus();

      if (instance.locationSuggestions$) {
        expect(await firstValueFrom(instance.locationSuggestions$)).toEqual([
          {
            latLong: [0, 0],
            address: 'We could not determine your location',
            isCurrentLocation: true,
            disabled: true,
          },
        ]);
      }
    });
  });
});
