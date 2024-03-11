import { ServiceDictionary } from '@core/models/service-api';
import { ServiceApi } from '@core/services/service-api.service';
import { of } from 'rxjs';
import { Shallow } from 'shallow-render';
import { FeedbackModule } from '../../feedback.module';
import { FeedbackContactComponent } from './feedback-contact/feedback-contact.component';
import { FeedbackFormComponent } from './feedback-form.component';
import { FeedbackLocationComponent } from './feedback-location/feedback-location.component';
import { FeedbackMessageAndAttachmentComponent } from './feedback-message-and-attachments/feedback-message-and-attachments.component';
import { InputFeedbackCategoryComponent } from './input-feedback-category/input-feedback-category.component';
import { SharedModule } from 'primeng/api';

describe('FeedbackFormComponent', () => {
  let shallow: Shallow<FeedbackFormComponent>;

  beforeEach(() => {
    shallow = new Shallow(FeedbackFormComponent, FeedbackModule)
      .mock(ServiceApi, {
        getServices: jest.fn().mockReturnValue(of(SERVICE_DICTIONARY)),
      })
      .provideMock(SharedModule);
  });

  it('feedback form flow', async () => {
    const backButtonSelector = 'p-button[label="Back"]';

    const { find, findComponent, instance, fixture } = await shallow.render(`<app-feedback-form></app-feedback-form>`);

    expect(findComponent(InputFeedbackCategoryComponent)).toHaveFound(1);
    expect(findComponent(InputFeedbackCategoryComponent).categories).toEqual([{ value: 'streets' }, { value: 'parcs' }]);

    instance.feedbackForm.controls.description.setValue('streets');
    fixture.detectChanges();

    expect(findComponent(InputFeedbackCategoryComponent)).toHaveFound(1);
    expect(find('.description').nativeElement.innerHTML).toBe('streets');
    expect(findComponent(InputFeedbackCategoryComponent).categories).toEqual([{ value: 'lamps' }]);

    instance.feedbackForm.controls.group.setValue('lamps');
    fixture.detectChanges();

    expect(findComponent(InputFeedbackCategoryComponent)).toHaveFound(1);
    expect(find('.description').nativeElement.innerHTML).toBe('lamps');
    expect(findComponent(InputFeedbackCategoryComponent).categories).toEqual([
      { value: 'missing lamp' },
      { value: 'broken lamp' },
    ]);

    instance.feedbackForm.controls.serviceCode.setValue('1');
    fixture.detectChanges();

    expect(findComponent(FeedbackMessageAndAttachmentComponent)).toHaveFound(1);
    instance.feedbackForm.controls.message.controls.message.setValue('message');
    find('p-button.next-button').triggerEventHandler('click', {});
    fixture.detectChanges();

    expect(findComponent(FeedbackLocationComponent)).toHaveFound(1);
    find('p-button.next-button').triggerEventHandler('click', {});
    fixture.detectChanges();

    expect(findComponent(FeedbackContactComponent)).toHaveFound(1);

    find(backButtonSelector).triggerEventHandler('click', {});
    fixture.detectChanges();

    expect(findComponent(FeedbackLocationComponent)).toHaveFound(1);

    find(backButtonSelector).triggerEventHandler('click', {});
    fixture.detectChanges();

    expect(findComponent(FeedbackMessageAndAttachmentComponent)).toHaveFound(1);

    find(backButtonSelector).triggerEventHandler('click', {});
    fixture.detectChanges();

    expect(findComponent(InputFeedbackCategoryComponent)).toHaveFound(1);
    expect(instance.feedbackForm.controls.serviceCode.value).toBeNull();

    find(backButtonSelector).triggerEventHandler('click', {});
    fixture.detectChanges();

    expect(findComponent(InputFeedbackCategoryComponent)).toHaveFound(1);
    expect(instance.feedbackForm.controls.group.value).toBeNull();

    find(backButtonSelector).triggerEventHandler('click', {});
    fixture.detectChanges();

    expect(findComponent(InputFeedbackCategoryComponent)).toHaveFound(1);
    expect(instance.feedbackForm.controls.description.value).toBeNull();
  });
});

const SERVICE_DICTIONARY: ServiceDictionary = {
  streets: {
    lamps: [
      { code: '1', name: 'missing lamp' },
      { code: '2', name: 'broken lamp' },
    ],
  },
  parcs: {
    trees: [{ code: '3', name: 'dead tree' }],
    benches: [{ code: '4', name: 'broken bench' }],
  },
};
