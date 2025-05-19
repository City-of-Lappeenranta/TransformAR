import { DataPointType } from '../../../../core/models/data-point';
import { SharedModule } from 'primeng/api';
import { Shallow } from 'shallow-render';
import { DashboardModule } from '../../dashboard.module';
import { DashboardFilterComponent } from './dashboard-filter.component';

describe('DashboardFilterComponent', () => {
  let shallow: Shallow<DashboardFilterComponent>;

  beforeEach(() => {
    shallow = new Shallow(DashboardFilterComponent).provideMock(SharedModule);
  });

  describe('inputs', () => {
    it('should set active options', async () => {
      const { find, fixture, instance } = await shallow.render({
        bind: { filter: [DataPointType.AIR_QUALITY, DataPointType.PARKING] },
      });

      const state = [undefined, true, undefined, true, undefined];
      find('.shadow-md').forEach((option, index) => expect(option.classes['active']).toBe(state[index]));
    });
  });

  describe('outputs', () => {
    it('should emit toggle on option click', async () => {
      const { find, fixture, instance } = await shallow.render();

      find('.shadow-md')[2].triggerEventHandler('click');
      fixture.detectChanges();

      expect(instance.toggle.emit).toHaveBeenCalledWith(DataPointType.STORM_WATER);
    });

    it('should emit close on close icon click', async () => {
      const { find, instance } = await shallow.render();

      find('app-icon.close').triggerEventHandler('click', {});

      expect(instance.close.emit).toHaveBeenCalled();
    });
  });
});
