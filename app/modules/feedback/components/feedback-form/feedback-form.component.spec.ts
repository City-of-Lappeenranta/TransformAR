import { Shallow } from 'shallow-render';
import { FeedbackModule } from '../../feedback.module';
import { FeedbackFormComponent } from './feedback-form.component';
import { FeedbackFormStep } from './feedback-form-step.enum';

describe('FeedbackFormComponent', () => {
  let shallow: Shallow<FeedbackFormComponent>;

  beforeEach(() => {
    shallow = new Shallow(FeedbackFormComponent, FeedbackModule);
  });

  it('feedback form flow', async () => {
    const backButtonSelector = 'p-button[label="Back"]';

    const { find, instance, fixture } = await shallow.render(`<app-feedback-form></app-feedback-form>`);

    expect(instance.currentFeedbackFormStep).toEqual(FeedbackFormStep.MAIN_CATEGORY);
    expect(instance.activeStep).toEqual(0);
    expect(instance.canClickNextButton()).toEqual(false);
    expect(find(backButtonSelector)).not.toHaveFoundOne();

    const mainCategory = instance.mainCategories[0].value;
    instance.feedbackForm.controls.mainCategory.setValue(mainCategory);

    expect(instance.currentFeedbackFormStep).toEqual(FeedbackFormStep.SUB_CATEGORY);
    expect(instance.activeStep).toEqual(0);
    expect(instance.canClickNextButton()).toEqual(false);

    const subCategory = instance.subCategories[0].value;
    instance.feedbackForm.controls.subCategory.setValue(subCategory);
    fixture.detectChanges();

    expect(instance.currentFeedbackFormStep).toEqual(FeedbackFormStep.MOTIVATION);
    expect(instance.activeStep).toEqual(1);
    expect(instance.canClickNextButton()).toEqual(false);
    expect(find(backButtonSelector)).toHaveFoundOne();

    const motivation = instance.motivations[0].value;
    instance.feedbackForm.controls.motivation.setValue(motivation);

    expect(instance.currentFeedbackFormStep).toEqual(FeedbackFormStep.MESSAGE_AND_ATTACHMENTS);

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
