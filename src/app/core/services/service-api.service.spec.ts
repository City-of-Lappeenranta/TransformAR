import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ServiceDictionary } from '../models/service-api';
import { EMPTY, firstValueFrom, of } from 'rxjs';
import { Shallow } from 'shallow-render';
import { CoreModule } from '../core.module';
import { ServiceApi, ServiceListApiResponse } from './service-api.service';
import { LatLong } from '../models/location';
import { environment } from '../../../environments/environment';

describe('ServiceApi', () => {
  let shallow: Shallow<ServiceApi>;

  beforeEach(() => {
    shallow = new Shallow(ServiceApi, CoreModule)
      .import(HttpClientTestingModule)
      .dontMock(HttpClientTestingModule)
      .replaceModule(HttpClientModule, HttpClientTestingModule);
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
    const message = 'this is my feedback message';
    const files = [new File([''], '1.jpeg', { type: 'image/jpeg' }), new File([''], '2.jpeg', { type: 'image/jpeg' })];
    const location = [1, 2] as LatLong;
    const email = 'john.doe@verhaert.digital';
    const firstName = 'John';
    const lastName = 'Doe';
    const phone = '+32412345678';

    it('should throw an error that the service_code is missing when the service_code is missing', () => {
      const { instance } = shallow.createService();

      expect(() =>
        instance.postServiceRequest({
          serviceCode: null,
          location,
          message,
          files,
          email,
          firstName,
          lastName,
          phone,
        }),
      ).toThrow('service_code is missing');
    });

    it('should throw an error that the location is missing when the location is missing', () => {
      const { instance } = shallow.createService();

      expect(() =>
        instance.postServiceRequest({
          location: null,
          serviceCode,
          message,
          files,
          email,
          firstName,
          lastName,
          phone,
        }),
      ).toThrow('location is missing');
    });

    it('should post with correct data', async () => {
      const { instance, inject } = shallow.createService();
      const httpTestingController = inject(HttpTestingController);

      const data = {
        service_code: 'streets',
        description: 'this is my feedback message',
        'media[]': expect.any(File),
        lat: '1',
        long: '2',
        email: 'john.doe@verhaert.digital',
        first_name: 'John',
        last_name: 'Doe',
        phone: '+32412345678',
      };

      instance
        .postServiceRequest({
          serviceCode,
          message,
          files,
          location,
          email,
          firstName,
          lastName,
          phone,
        })
        .subscribe();

      const req = httpTestingController.expectOne(`${environment.serviceApiUrl}/requests.json?jurisdiction_id=citizenapp`);
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('Authorization')).toContain('Bearer ');
      expect(Object.fromEntries([...req.request.body])).toEqual(data);
      req.flush('');
    });
  });
});

const SERVICE_LIST_API_RESPONSE: ServiceListApiResponse = [
  {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    service_code: '1',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    service_name: 'missing lamp',
    group: 'streets',
    metadata: false,
    type: 'type',
    keywords: 'keywords',
    description: 'lamps',
  },
  {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    service_code: '2',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    service_name: 'broken lamp',
    group: 'streets',
    metadata: false,
    type: 'type',
    keywords: 'keywords',
    description: 'lamps',
  },
  {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    service_code: '3',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    service_name: 'dead tree',
    group: 'parcs',
    metadata: false,
    type: 'type',
    keywords: 'keywords',
    description: 'trees',
  },
  {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    service_code: '4',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    service_name: 'broken bench',
    group: 'parcs',
    metadata: false,
    type: 'type',
    keywords: 'keywords',
    description: 'benches',
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
