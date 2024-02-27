import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { Shallow } from 'shallow-render';
import { CoreModule } from '../core.module';
import { ServiceApi } from './service-api.service';
import { ServiceListApiResponse } from '@core/models/service-api';

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
    service_code: 'sl',
    service_name: 'lamps',
    description: 'lamps description',
    metadata: false,
    type: 'type',
    keywords: 'keywords',
    group: 'street',
  },
  {
    service_code: 'sc',
    service_name: 'curbs',
    description: 'curbs description',
    metadata: false,
    type: 'type',
    keywords: 'keywords',
    group: 'street',
  },
  {
    service_code: 'pt',
    service_name: 'trees',
    description: 'trees description',
    metadata: false,
    type: 'type',
    keywords: 'keywords',
    group: 'parcs',
  },
];

const SERVICE_DICTIONARY = {
  street: [
    { code: 'sl', name: 'lamps', description: 'lamps description' },
    { code: 'sc', name: 'curbs', description: 'curbs description' },
  ],
  parcs: [{ code: 'pt', name: 'trees', description: 'trees description' }],
};
