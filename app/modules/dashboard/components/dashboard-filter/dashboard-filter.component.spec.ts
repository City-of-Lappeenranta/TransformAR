import { SharedModule } from 'primeng/api';
import { Shallow } from 'shallow-render';
import { DashboardModule } from '../../dashboard.module';
import { DashboardFilterComponent } from './dashboard-filter.component';

jest.useFakeTimers();

describe('DashboardFilterComponent', () => {
  let shallow: Shallow<DashboardFilterComponent>;

  beforeEach(() => {
    shallow = new Shallow(DashboardFilterComponent, DashboardModule).provideMock(SharedModule);
  });
});
