import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ServiceDictionary } from '@core/models/service-api';
import { of } from 'rxjs';
import { Shallow } from 'shallow-render';
import { CoreModule } from '../core.module';
import { ServiceApi, ServiceListApiResponse } from './service-api.service';

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
