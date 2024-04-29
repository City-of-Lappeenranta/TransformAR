import { Shallow } from 'shallow-render';
import { AppComponent } from './app.component';
import { RouterModule, RouterOutlet } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NavigationHeaderComponent } from '@shared/components/navigation/navigation-header/navigation-header.component';
import { SharedModule } from 'primeng/api';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { TraceService } from '@sentry/angular-ivy';

describe('AppComponent', () => {
  let shallow: Shallow<AppComponent>;

  beforeEach(() => {
    shallow = new Shallow(AppComponent)
      .mock(TranslateService, { instant: jest.fn(), use: jest.fn() })
      .mockPipe(TranslatePipe, (input) => `translated ${input}`)
      .provideMock(SharedModule);
  });

  it('should render', async () => {
    const component = await shallow.render();

    expect(component).toBeDefined();
  });

  it('should set the correct navigation header depending on the route', async () => {
    const title = 'Title';

    const { findComponent, instance, fixture } = await shallow.replaceModule(RouterModule, RouterTestingModule).render();

    instance.outlet = {
      activatedRouteData: {
        navigationHeaderTitle: title,
      },
    } as any as RouterOutlet;

    fixture.detectChanges();

    expect(findComponent(NavigationHeaderComponent).title).toEqual(`translated ${title}`);
  });
});
