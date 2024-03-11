import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { environment } from '@environments/environment';
import { Shallow } from 'shallow-render';
import { CoreModule } from '../core.module';
import { RadarSearchReponse, RadarService } from './radar.service';
import { of } from 'rxjs';

describe('RadarService', () => {
  let shallow: Shallow<RadarService>;

  beforeEach(() => {
    shallow = new Shallow(RadarService, CoreModule).replaceModule(HttpClientModule, HttpClientTestingModule);
  });

  describe('autocomplete', () => {
    it('should return an empty array if no query is passed', async () => {
      const { instance } = shallow.mock(HttpClient, { get: () => of(MOCK_SEARCH_RESPONSE) }).createService();

      expect(await instance.autocomplete('')).toEqual([]);
    });

    it('should the formatted address for every result', async () => {
      const { instance } = shallow.mock(HttpClient, { get: () => of(MOCK_SEARCH_RESPONSE) }).createService();

      expect(await instance.autocomplete('Taipalsaarentie')).toEqual([
        {
          address: 'Taipalsaarentie, Lappeenranta, South Karelia FIN',
          latLong: [61.060861, 28.181929],
        },
      ]);
    });
  });

  describe('reverse geocode', () => {
    it('should return the address label', async () => {
      const { instance } = shallow.mock(HttpClient, { get: () => of(MOCK_SEARCH_RESPONSE) }).createService();

      expect(await instance.reverseGeocode([61.060861, 28.181929])).toEqual('Taipalsaarentie');
    });
  });
});

const MOCK_SEARCH_RESPONSE: RadarSearchReponse = {
  meta: {
    code: 200,
  },
  addresses: [
    {
      latitude: 61.060861,
      longitude: 28.181929,
      geometry: {
        type: 'Point',
        coordinates: [28.181929, 61.060861],
      },
      country: 'Finland',
      countryCode: 'FI',
      countryFlag: '🇫🇮',
      county: 'Lappeenranta',
      distance: 18,
      city: 'Lappeenranta',
      state: 'South Karelia',
      street: 'Taipalsaarentie',
      layer: 'street',
      formattedAddress: 'Taipalsaarentie, Lappeenranta, South Karelia FIN',
      addressLabel: 'Taipalsaarentie',
    },
  ],
};
