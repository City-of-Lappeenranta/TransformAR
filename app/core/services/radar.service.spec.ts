import { Shallow } from 'shallow-render';
import { CoreModule } from '../core.module';
import { RadarService } from './radar.service';
import { environment } from '@environments/environment';

describe('RadarService', () => {
  let service: RadarService;

  beforeEach(() => {
    service = new Shallow(RadarService, CoreModule).createService().instance;
  });

  describe('autocomplete', () => {
    it('should return an empty array if no query is passed', async () => {
      expect(await service.autocomplete('')).toEqual([]);
    });

    it('should throw if radar api key is missing in environment', async () => {
      //@ts-ignore
      environment.radarApiKey = undefined;
      await expect(service.autocomplete('')).rejects.toThrow('Invalid or missing Radar API key');
    });

    /* TODO: test parsing after merging TRAN-67 */
  });
});
