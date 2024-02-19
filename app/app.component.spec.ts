import { Shallow } from 'shallow-render';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let shallow: Shallow<AppComponent>;

  beforeEach(() => {
    shallow = new Shallow(AppComponent);
  });

  it('displays the header with the title of the city', async () => {
    const { find } = await shallow.render(`<app-root></app-root>`);

    expect(find('h1').nativeElement.textContent).toBe('Lappeenranta');
  });
});
