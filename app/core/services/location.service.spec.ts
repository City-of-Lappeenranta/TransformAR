import { Shallow } from 'shallow-render';
import { CoreModule } from '../core.module';
import { LocationService } from './location.service';
import { take } from 'rxjs';
import { RadarService } from './radar.service';

describe('LocationService', () => {
  let shallow: Shallow<LocationService>;

  beforeEach(() => {
    shallow = new Shallow(LocationService, CoreModule);
  });

  describe('searchLocationByQuery', () => {
    it('should return location results from API call', async () => {
      // @ts-ignore
      navigator.geolocation = { getCurrentPosition: jest.fn() };

      const { instance } = shallow
        .mock(RadarService, {
          autocomplete: jest.fn().mockReturnValue(Promise.resolve([{ address: 'location', latLong: [52, 52] }])),
        })
        .createService();

      const result = await instance.searchLocationByQuery('location');

      expect(result).toEqual([{ address: 'location', latLong: [52, 52] }]);
    });
  });

  describe('userLocation$', () => {
    describe('on success', () => {
      it('should emit user location ', (done) => {
        // @ts-ignore
        navigator.geolocation = {
          getCurrentPosition: (success: Function) => {
            setTimeout(() => {
              success({ coords: { latitude: 10, longitude: 10 } });
            }, 500);
          },
        };

        const { instance } = shallow.createService();

        const expectation = [
          {
            available: false,
            loading: true,
          },
          {
            available: true,
            loading: false,
            location: [10, 10],
          },
        ];

        const result: unknown[] = [];

        instance.userLocation$.pipe(take(2)).subscribe((emission) => {
          result.push(emission);

          if (result.length === 2) {
            expect(result).toEqual(expectation);
            done();
          }
        });
      });
    });

    describe('on error', () => {
      it('should emit user location ', (done) => {
        // @ts-ignore
        navigator.geolocation = {
          getCurrentPosition: (_: Function, error: Function) => {
            setTimeout(() => {
              error();
            }, 500);
          },
        };

        const { instance } = shallow.createService();

        const expectation = [
          {
            available: false,
            loading: true,
          },
          {
            available: false,
            loading: false,
          },
        ];

        const result: unknown[] = [];

        instance.userLocation$.pipe(take(2)).subscribe((emission) => {
          result.push(emission);

          if (result.length === 2) {
            expect(result).toEqual(expectation);
            done();
          }
        });
      });
    });
  });
});
