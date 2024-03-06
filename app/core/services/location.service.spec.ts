import { Shallow } from 'shallow-render';
import { CoreModule } from '../core.module';
import { LocationService } from './location.service';
import { take } from 'rxjs';
import { RadarService } from './radar.service';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

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
