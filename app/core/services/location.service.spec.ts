import { Shallow } from 'shallow-render';
import { CoreModule } from '../core.module';
import { of, take } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LocationService } from './location.service';

describe('LocationService', () => {
  let shallow: Shallow<LocationService>;

  beforeEach(() => {
    shallow = new Shallow(LocationService, CoreModule).replaceModule(HttpClient, HttpClientTestingModule);
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
        (navigator as any)['permissions'] = {
          query: jest.fn().mockReturnValue(Promise.resolve({ state: 'prompt' })),
        };

        const { instance } = shallow.createService();

        const expectation = [
          {
            available: false,
            loading: true,
            permission: 'prompt' as PermissionState,
          },
          {
            available: true,
            loading: false,
            permission: 'granted' as PermissionState,
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
        (navigator as any)['permissions'] = {
          query: jest.fn().mockReturnValue(Promise.resolve({ state: 'prompt' })),
        };

        const { instance } = shallow.createService();

        const expectation = [
          {
            available: false,
            loading: true,
            permission: 'prompt' as PermissionState,
          },
          {
            available: false,
            loading: false,
            permission: 'denied' as PermissionState,
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
