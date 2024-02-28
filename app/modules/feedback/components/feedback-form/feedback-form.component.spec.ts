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

  it('should go to the sub categories when selecting the main category', async () => {
    const { instance, findComponent, fixture } = await shallow.render(`<app-feedback-form></app-feedback-form>`);

    expect(instance.currentFeedbackFormStep).toEqual(FeedbackFormStep.MAIN_CATEGORY);
    expect(findComponent(InputFeedbackCategoryComponent).categories).toEqual([{ value: 'streets' }, { value: 'parcs' }]);

    instance.feedbackForm.controls.mainCategory.setValue('streets');

    expect(instance.currentFeedbackFormStep).toEqual(FeedbackFormStep.SUB_CATEGORY);
    fixture.detectChanges();
    expect(findComponent(InputFeedbackCategoryComponent).categories).toEqual([{ value: 'lamps' }]);
  });

  describe('canClickNextButton', () => {
    let instance: FeedbackFormComponent;

    beforeEach(async () => {
      instance = (await shallow.render(`<app-feedback-form></app-feedback-form>`)).instance;
    });

    it('should return true if the user filled in the information needed for the step', () => {
      instance.feedbackForm.controls.mainCategory.setValue('streets');

      instance.back();

      expect(instance.canClickNextButton()).toBe(true);
    });

    it('should return true if the user didnt fill in the information needed for the step', () => {
      expect(instance.canClickNextButton()).toBe(false);
    });
  });

  describe('next', () => {
    it('should go to the sub categories when selecting the main category', async () => {
      const { instance } = await shallow.render(`<app-feedback-form></app-feedback-form>`);

      expect(instance.currentFeedbackFormStep).toEqual(FeedbackFormStep.MAIN_CATEGORY);

      instance.feedbackForm.controls.mainCategory.setValue('streets');

      expect(instance.currentFeedbackFormStep).toEqual(FeedbackFormStep.SUB_CATEGORY);
    });
  });

  describe('activeStep', () => {
    it('should return 0 when the user is selecting the categories', async () => {
      const { instance } = await shallow.render(`<app-feedback-form></app-feedback-form>`);

      expect(instance.activeStep).toEqual(0);

      instance.feedbackForm.controls.mainCategory.setValue('streets');

      expect(instance.activeStep).toEqual(0);
    });
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
