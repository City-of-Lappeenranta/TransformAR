import { Shallow } from 'shallow-render';
import { AppComponent } from './app.component';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NavigationHeaderComponent } from '@shared/components/navigation/navigation-header/navigation-header.component';

describe('AppComponent', () => {
  let shallow: Shallow<AppComponent>;

  beforeEach(() => {
    shallow = new Shallow(AppComponent);
  });

  it('should render', async () => {
    const component = await shallow.render(`<app-root></app-root>`);

    expect(component).toBeDefined();
  });

  it('should set the correct navigation header depending on the route', async () => {
    const title = 'Title';

    const { findComponent, instance, fixture } = await shallow
      .replaceModule(RouterModule, RouterTestingModule)
      .render(`<app-root></app-root>`);

    instance.outlet = {
      activatedRouteData: {
        navigationHeaderTitle: title,
      },
    } as any as RouterOutlet;

    fixture.detectChanges();

    expect(findComponent(NavigationHeaderComponent).title).toEqual(title);
  });
});
