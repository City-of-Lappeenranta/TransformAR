import { Shallow } from 'shallow-render';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let shallow: Shallow<AppComponent>;

  beforeEach(() => {
    shallow = new Shallow(AppComponent);
  });

  it('should render', async () => {
    const component = await shallow.render(`<app-root></app-root>`);

    expect(component).toBeDefined();
  });
});
