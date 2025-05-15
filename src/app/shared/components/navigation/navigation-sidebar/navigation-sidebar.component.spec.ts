import { Shallow } from 'shallow-render';
import { NavigationSidebarComponent } from './navigation-sidebar.component';
import { SharedModule } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

describe('NavigationSidebarComponent', () => {
  let shallow: Shallow<NavigationSidebarComponent>;

  beforeEach(() => {
    shallow = new Shallow(NavigationSidebarComponent)
      .mock(TranslateService, { get: jest.fn })
      .provideMock(SharedModule);
  });

  it('should not render the navigation sidebar when the sidebar is closed', async () => {
    const sidebarOpen = false;

    const { find } = await shallow.render(
      '<app-navigation-sidebar [sidebarOpen]="sidebarOpen"></app-navigation-sidebar>',
      {
        bind: { sidebarOpen },
      },
    );

    expect(find('.sidebar').attributes['ng-reflect-visible']).toEqual(
      `${sidebarOpen}`,
    );
  });

  it('should render the navigation sidebar with menu items if the sidebar is open', async () => {
    const sidebarOpen = true;

    const { find } = await shallow.render(
      '<app-navigation-sidebar [sidebarOpen]="sidebarOpen"></app-navigation-sidebar>',
      {
        bind: { sidebarOpen },
      },
    );

    expect(find('.sidebar').attributes['ng-reflect-visible']).toEqual(
      `${sidebarOpen}`,
    );
  });
});
