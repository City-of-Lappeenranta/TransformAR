import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Shallow } from 'shallow-render';
import { CoreModule } from '../../core.module';
import { DataPointsApi } from './datapoints-api.service';

describe('DataPointsApi', () => {
  let shallow: Shallow<DataPointsApi>;

  beforeEach(() => {
    shallow = new Shallow(DataPointsApi, CoreModule).replaceModule(HttpClientModule, HttpClientTestingModule);
  });
});
