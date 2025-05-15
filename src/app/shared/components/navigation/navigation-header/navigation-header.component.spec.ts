import { Shallow } from 'shallow-render';
import { NavigationHeaderComponent } from './navigation-header.component';
import { NavigationSidebarComponent } from '../navigation-sidebar/navigation-sidebar.component';
import { SharedModule } from 'primeng/api';

describe('NavigationHeaderComponent', () => {
  let shallow: Shallow<NavigationHeaderComponent>;

  beforeEach(() => {
    shallow = new Shallow(NavigationHeaderComponent).provideMock(SharedModule);
  });

  it('should render the navigation header', async () => {
    const title = 'Title';
    const { find } = await shallow.render(
      '<app-navigation-header [title]="title"></app-navigation-header>',
      {
        bind: { title },
      },
    );

    expect(find('h1').nativeElement.textContent).toEqual(title);
    expect(find('app-icon.menu-item')).toHaveFoundOne();
  });

  it('should open and close the navigation sidebar', async () => {
    const title = 'Title';
    const { fixture, find, findComponent } = await shallow.render(
      '<app-navigation-header [title]="title"></app-navigation-header>',
      { bind: { title } },
    );

    expect(findComponent(NavigationSidebarComponent).sidebarOpen).toEqual(
      false,
    );

    find('app-icon.menu-item').triggerEventHandler('click', {});
    fixture.detectChanges();

    expect(findComponent(NavigationSidebarComponent).sidebarOpen).toEqual(true);

    findComponent(NavigationSidebarComponent).onSidebarClose.emit();
    fixture.detectChanges();

    expect(findComponent(NavigationSidebarComponent).sidebarOpen).toEqual(
      false,
    );
  });
});
