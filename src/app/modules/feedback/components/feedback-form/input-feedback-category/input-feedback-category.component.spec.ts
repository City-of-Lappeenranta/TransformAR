import { Shallow } from 'shallow-render';
import { InputFeedbackCategoryComponent } from './input-feedback-category.component';
import { NgControl } from '@angular/forms';
import { SharedModule } from 'primeng/api';

describe('InputFeedbackCategoryComponent', () => {
  let shallow: Shallow<InputFeedbackCategoryComponent>;

  beforeEach(() => {
    shallow = new Shallow(InputFeedbackCategoryComponent)
      .provide([NgControl])
      .provideMock(SharedModule);
  });

  it('should initialize categoriesToShow', async () => {
    const categories = [
      { value: 'Category 1', icon: 'icon1' },
      { value: 'Category 2', icon: 'icon2' },
    ];

    const { instance } = await shallow.render(
      `
        <app-input-feedback-category
          [categories]="categories"
        ></app-input-feedback-category>
      `,
      {
        bind: { categories },
      },
    );

    expect(instance.categoriesToShow[0].selected).toBe(false);
    expect(instance.categoriesToShow[1].selected).toBe(false);
  });

  it('should toggle category on click', async () => {
    const categories = [{ value: 'Category 1' }, { value: 'Category 2' }];

    const { find, instance } = await shallow.render(
      `
        <app-input-feedback-category
          [categories]="categories"
        ></app-input-feedback-category>
      `,
      {
        bind: { categories },
      },
    );

    find('app-feedback-category')[0].triggerEventHandler('click', {});

    expect(instance.categoriesToShow[0].selected).toBe(true);
    expect(instance.categoriesToShow[1].selected).toBe(false);
  });
});
