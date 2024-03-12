import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ServiceDictionary } from '@core/models/service-api';
import { of } from 'rxjs';
import { Shallow } from 'shallow-render';
import { CoreModule } from '../core.module';
import { ServiceApi, ServiceListApiResponse } from './service-api.service';
import { LatLong } from '@core/models/location';

describe('ServiceApi', () => {
  let shallow: Shallow<ServiceApi>;

  beforeEach(() => {
    shallow = new Shallow(ServiceApi, CoreModule).replaceModule(HttpClientModule, HttpClientTestingModule);
  });

  describe('getServices', () => {
    it('should return a dictionary of services', (done) => {
      const { instance } = shallow.mock(HttpClient, { get: () => of(SERVICE_LIST_API_RESPONSE) }).createService();

      instance.getServices().subscribe((result) => {
        expect(result).toEqual(SERVICE_DICTIONARY);
        done();
      });
    });
  });

  describe('postServiceRequest', () => {
    const serviceCode = 'streets';
    const description = 'lamps';
    const files = [new File([''], 'fileName.jpeg', { type: 'image/jpeg' })];
    const location = [0, 0] as LatLong;
    const email = 'john.doe@verhaert.digital';
    const firstName = 'John';
    const lastName = 'Doe';
    const phone = '+32412345678';

    it('should throw an error that the service_code is missing when the service_code is missing', () => {
      const { instance } = shallow.mock(HttpClient, {}).createService();

      expect(() =>
        instance.postServiceRequest({
          serviceCode: null,
          description,
          files,
          location,
          email,
          firstName,
          lastName,
          phone,
        }),
      ).toThrow('service_code is missing');
    });

    it('should throw an error that the description is missing when the description is missing', () => {
      const { instance } = shallow.mock(HttpClient, {}).createService();

      expect(() =>
        instance.postServiceRequest({
          serviceCode,
          description: null,
          files,
          location,
          email,
          firstName,
          lastName,
          phone,
        }),
      ).toThrow('description is missing');
    });

    it('should throw an error that the location is missing when the location is missing', () => {
      const { instance } = shallow.mock(HttpClient, {}).createService();

      expect(() =>
        instance.postServiceRequest({
          serviceCode,
          description,
          files,
          location: null,
          email,
          firstName,
          lastName,
          phone,
        }),
      ).toThrow('location is missing');
    });

    it('should return the email as response when the post request is successful when the email was set', () => {
      const { instance } = shallow.mock(HttpClient, {}).createService();

      instance
        .postServiceRequest({
          serviceCode,
          description,
          files,
          location,
          email,
          firstName,
          lastName,
          phone,
        })
        .subscribe((response?: string) => {
          expect(response).toEqual(email);
        });
    });

    it('should return an empty string as response when the post request is successful when the email was not set', () => {
      const { instance } = shallow.mock(HttpClient, {}).createService();

      instance
        .postServiceRequest({
          serviceCode,
          description,
          files,
          location,
          email: null,
          firstName,
          lastName,
          phone,
        })
        .subscribe((response?: string) => {
          expect(response).toEqual('');
        });
    });
  });
});

const SERVICE_LIST_API_RESPONSE: ServiceListApiResponse = [
  {
    service_code: '1',
    service_name: 'missing lamp',
    description: 'streets',
    metadata: false,
    type: 'type',
    keywords: 'keywords',
    group: 'lamps',
  },
  {
    service_code: '2',
    service_name: 'broken lamp',
    description: 'streets',
    metadata: false,
    type: 'type',
    keywords: 'keywords',
    group: 'lamps',
  },
  {
    service_code: '3',
    service_name: 'dead tree',
    description: 'parcs',
    metadata: false,
    type: 'type',
    keywords: 'keywords',
    group: 'trees',
  },
  {
    service_code: '4',
    service_name: 'broken bench',
    description: 'parcs',
    metadata: false,
    type: 'type',
    keywords: 'keywords',
    group: 'benches',
  },
];

const SERVICE_DICTIONARY: ServiceDictionary = {
  streets: {
    lamps: [
      { code: '1', name: 'missing lamp' },
      { code: '2', name: 'broken lamp' },
    ],
  },
  parcs: {
    trees: [{ code: '3', name: 'dead tree' }],
    benches: [{ code: '4', name: 'broken bench' }],
  },
};
