import { Shallow } from 'shallow-render';
import { FeedbackModule } from '../../../../feedback.module';
import { FeedbackCategoryComponent } from './feedback-category.component';
import { SharedModule } from 'primeng/api';

describe('FeedbackCategoryComponent', () => {
  let shallow: Shallow<FeedbackCategoryComponent>;

  beforeEach(() => {
    shallow = new Shallow(FeedbackCategoryComponent, FeedbackModule).provideMock(SharedModule);
  });

  describe('should render the component', () => {
    it('without color, icon and not selected', async () => {
      const withColor = false;
      const selected = false;
      const icon = null;

      const { fixture } = await shallow.render(
        `
          <app-feedback-category
            [withColor]="withColor"
            [selected]="selected"
            [icon]="icon"
          ></app-feedback-category>
        `,
        {
          bind: { withColor, selected, icon },
        },
      );

      expect(fixture).toMatchSnapshot();
    });

    it('without color, icon and selected', async () => {
      const withColor = false;
      const selected = true;
      const icon = null;

      const { fixture } = await shallow.render(
        `
          <app-feedback-category
            [withColor]="withColor"
            [selected]="selected"
            [icon]="icon"
          ></app-feedback-category>
        `,
        {
          bind: { withColor, selected, icon },
        },
      );

      expect(fixture).toMatchSnapshot();
    });

    it('with color, without icon and not selected', async () => {
      const withColor = true;
      const selected = false;
      const icon = null;

      const { fixture } = await shallow.render(
        `
          <app-feedback-category
            [withColor]="withColor"
            [selected]="selected"
            [icon]="icon"
          ></app-feedback-category>
        `,
        {
          bind: { withColor, selected, icon },
        },
      );

      expect(fixture).toMatchSnapshot();
    });

    it('with color, without icon and selected', async () => {
      const withColor = true;
      const selected = true;
      const icon = null;

      const { fixture } = await shallow.render(
        `
          <app-feedback-category
            [withColor]="withColor"
            [selected]="selected"
            [icon]="icon"
          ></app-feedback-category>
        `,
        {
          bind: { withColor, selected, icon },
        },
      );

      expect(fixture).toMatchSnapshot();
    });

    it('without color, with icon and not selected', async () => {
      const withColor = false;
      const selected = false;
      const icon = 'thumbs-up';

      const { fixture } = await shallow.render(
        `
          <app-feedback-category
            [withColor]="withColor"
            [selected]="selected"
            [icon]="icon"
          ></app-feedback-category>
        `,
        {
          bind: { withColor, selected, icon },
        },
      );

      expect(fixture).toMatchSnapshot();
    });

    it('with color and icon and selected', async () => {
      const withColor = true;
      const selected = true;
      const icon = 'thumbs-up';

      const { fixture } = await shallow.render(
        `
          <app-feedback-category
            [withColor]="withColor"
            [selected]="selected"
            [icon]="icon"
          ></app-feedback-category>
        `,
        {
          bind: { withColor, selected, icon },
        },
      );

      expect(fixture).toMatchSnapshot();
    });
  });

  it('should toggle selected when pressing the category', async () => {
    const selected = false;

    const { fixture, find, element } = await shallow.render(
      `
          <app-feedback-category
            [withColor]="withColor"
            [selected]="selected"
            [icon]="icon"
          ></app-feedback-category>
        `,
      {
        bind: { withColor: false, selected },
      },
    );

    expect(find('.feedback-category').classes).not.toHaveProperty('selected');

    element.nativeElement.dispatchEvent(new MouseEvent('click'));
    fixture.detectChanges();

    expect(find('.feedback-category').classes).toHaveProperty('selected');

    element.nativeElement.dispatchEvent(new MouseEvent('click'));
    fixture.detectChanges();

    expect(find('.feedback-category').classes).not.toHaveProperty('selected');
  });
});
