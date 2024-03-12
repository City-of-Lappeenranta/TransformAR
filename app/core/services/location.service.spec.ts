import { Shallow } from 'shallow-render';
import { CoreModule } from '../core.module';
import { take } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LocationService, UserLocation } from './location.service';

describe('LocationService', () => {
  let shallow: Shallow<LocationService>;

  beforeEach(() => {
    shallow = new Shallow(LocationService, CoreModule).replaceModule(HttpClient, HttpClientTestingModule);

    // @ts-ignore
    navigator.permissions = {
      query: jest.fn().mockReturnValue(Promise.resolve({ state: 'prompt' })),
    };
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

        const userLocationExpectation: UserLocation[] = [
          {
            loading: true,
          },
          {
            loading: false,
            location: [10, 10],
          },
        ];

        let result: unknown[] = [];
        instance.userLocation$.pipe(take(2)).subscribe((emission) => {
          result.push(emission);

          if (result.length === 2) {
            expect(result).toEqual(userLocationExpectation);
            done();
          }
        });

        const permissionExpectation: PermissionState[] = ['prompt', 'prompt', 'granted'];

        result = [];
        instance.locationPermissionState$.pipe(take(3)).subscribe((permission) => {
          result.push(permission);
          if (result.length === 3) {
            expect(result).toEqual(permissionExpectation);
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

        const userLocationExpectation: UserLocation[] = [
          {
            loading: true,
          },
          {
            loading: false,
          },
        ];

        let result: unknown[] = [];

        instance.userLocation$.pipe(take(2)).subscribe((emission) => {
          result.push(emission);

          if (result.length === 2) {
            expect(result).toEqual(userLocationExpectation);
            done();
          }
        });

        const permissionExpectation: PermissionState[] = ['prompt', 'prompt', 'denied'];

        result = [];
        instance.locationPermissionState$.pipe(take(3)).subscribe((permission) => {
          result.push(permission);
          if (result.length === 3) {
            expect(result).toEqual(permissionExpectation);
            done();
          }
        });
      });
    });
  });
});
