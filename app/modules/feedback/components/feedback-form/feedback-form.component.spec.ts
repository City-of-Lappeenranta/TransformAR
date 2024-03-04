import { ServiceDictionary } from '@core/models/service-api';
import { ServiceApi } from '@core/services/service-api.service';
import { of } from 'rxjs';
import { Shallow } from 'shallow-render';
import { FeedbackModule } from '../../feedback.module';
import { FeedbackFormStep } from './feedback-form-step.enum';
import { FeedbackFormComponent } from './feedback-form.component';
import { InputFeedbackCategoryComponent } from './input-feedback-category/input-feedback-category.component';

describe('FeedbackFormComponent', () => {
  let shallow: Shallow<FeedbackFormComponent>;

  beforeEach(() => {
    shallow = new Shallow(FeedbackFormComponent, FeedbackModule).mock(ServiceApi, {
      getServices: jest.fn().mockReturnValue(of(SERVICE_DICTIONARY)),
    });
  });

  it('feedback form flow', async () => {
    const backButtonSelector = 'p-button[label="Back"]';

    const { find, findComponent, instance, fixture } = await shallow.render(`<app-feedback-form></app-feedback-form>`);

    expect(instance.currentFeedbackFormStep).toEqual(FeedbackFormStep.MAIN_CATEGORY);
    expect(instance.activeStep).toEqual(0);
    expect(instance.canClickNextButton()).toEqual(false);
    expect(find(backButtonSelector)).not.toHaveFoundOne();
    expect(findComponent(InputFeedbackCategoryComponent).categories).toEqual([{ value: 'streets' }, { value: 'parcs' }]);

    instance.feedbackForm.controls.mainCategory.setValue('streets');
    fixture.detectChanges();

    expect(instance.currentFeedbackFormStep).toEqual(FeedbackFormStep.SUB_CATEGORY);
    expect(instance.activeStep).toEqual(0);
    expect(instance.canClickNextButton()).toEqual(false);
    expect(findComponent(InputFeedbackCategoryComponent).categories).toEqual([{ value: 'lamps' }]);

    instance.feedbackForm.controls.subCategory.setValue('lamps');
    fixture.detectChanges();

    expect(instance.currentFeedbackFormStep).toEqual(FeedbackFormStep.MOTIVATION);
    expect(instance.activeStep).toEqual(1);
    expect(instance.canClickNextButton()).toEqual(false);
    expect(find(backButtonSelector)).toHaveFoundOne();

    const motivation = instance.motivations[0].value;
    instance.feedbackForm.controls.motivation.setValue(motivation);

    expect(instance.currentFeedbackFormStep).toEqual(FeedbackFormStep.MESSAGE_AND_ATTACHMENTS);

    instance.feedbackForm.controls.message.controls.message.setValue('message');
    expect(instance.canClickNextButton()).toEqual(true);

    find('p-button.next-button').triggerEventHandler('click', {});

    expect(instance.currentFeedbackFormStep).toEqual(FeedbackFormStep.LOCATION);

    instance.back();

    expect(instance.currentFeedbackFormStep).toEqual(FeedbackFormStep.MESSAGE_AND_ATTACHMENTS);
    expect(instance.canClickNextButton()).toEqual(true);

    instance.back();

    expect(instance.currentFeedbackFormStep).toEqual(FeedbackFormStep.MOTIVATION);
    expect(instance.canClickNextButton()).toEqual(true);

    instance.back();

    expect(instance.currentFeedbackFormStep).toEqual(FeedbackFormStep.SUB_CATEGORY);
    expect(instance.canClickNextButton()).toEqual(true);

    instance.back();
    fixture.detectChanges();

    expect(instance.currentFeedbackFormStep).toEqual(FeedbackFormStep.MAIN_CATEGORY);
    expect(instance.canClickNextButton()).toEqual(true);
    expect(find(backButtonSelector)).not.toHaveFoundOne();
  });
});

const SERVICE_DICTIONARY: ServiceDictionary = {
  streets: {
    lamps: [
      { id: '1', name: 'missing lamp' },
      { id: '2', name: 'broken lamp' },
    ],
  },
  parcs: {
    trees: [{ id: '3', name: 'dead tree' }],
    benches: [{ id: '4', name: 'broken bench' }],
  },
};
