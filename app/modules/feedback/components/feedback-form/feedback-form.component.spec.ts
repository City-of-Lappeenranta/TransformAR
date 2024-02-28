import { Shallow } from 'shallow-render';
import { FeedbackModule } from '../../feedback.module';
import { FeedbackFormComponent } from './feedback-form.component';
import { FeedbackFormStep } from './feedback-form-step.enum';

describe('FeedbackFormComponent', () => {
  let shallow: Shallow<FeedbackFormComponent>;

  beforeEach(() => {
    shallow = new Shallow(FeedbackFormComponent, FeedbackModule);
  });

  it('should go to the sub categories when selecting the main category', async () => {
    const { instance } = await shallow.render(`<app-feedback-form></app-feedback-form>`);

    expect(instance.currentFeedbackFormStep).toEqual(FeedbackFormStep.MAIN_CATEGORY);

    const mainCategory = instance.mainCategories[0].value;
    instance.feedbackForm.controls.mainCategory.setValue(mainCategory);

    expect(instance.currentFeedbackFormStep).toEqual(FeedbackFormStep.SUB_CATEGORY);
  });

  describe('canClickNextButton', () => {
    let instance: FeedbackFormComponent;

    beforeEach(async () => {
      instance = (await shallow.render(`<app-feedback-form></app-feedback-form>`)).instance;
    });

    it('should return true if the user filled in the information needed for the step', () => {
      const mainCategory = instance.mainCategories[0].value;
      instance.feedbackForm.controls.mainCategory.setValue(mainCategory);

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

      const mainCategory = instance.mainCategories[0].value;
      instance.feedbackForm.controls.mainCategory.setValue(mainCategory);

      expect(instance.currentFeedbackFormStep).toEqual(FeedbackFormStep.SUB_CATEGORY);
    });
  });

  describe('activeStep', () => {
    it('should return 0 when the user is selecting the categories', async () => {
      const { instance } = await shallow.render(`<app-feedback-form></app-feedback-form>`);

      expect(instance.activeStep).toEqual(0);

      const mainCategory = instance.mainCategories[0].value;
      instance.feedbackForm.controls.mainCategory.setValue(mainCategory);

      expect(instance.activeStep).toEqual(0);
    });
  });
});
