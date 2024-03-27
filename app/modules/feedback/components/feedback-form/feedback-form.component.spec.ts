import { FormControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { LatLong } from '@core/models/location';
import { ServiceDictionary } from '@core/models/service-api';
import { ServiceApi } from '@core/services/service-api.service';
import { SharedModule } from 'primeng/api';
import { of } from 'rxjs';
import { Shallow } from 'shallow-render';
import { FeedbackModule } from '../../feedback.module';
import { FeedbackContactComponent } from './feedback-contact/feedback-contact.component';
import { FeedbackFormComponent } from './feedback-form.component';
import { FeedbackFormService } from './feedback-form.service';
import { FeedbackLocationComponent } from './feedback-location/feedback-location.component';
import { FeedbackMessageAndAttachmentComponent } from './feedback-message-and-attachments/feedback-message-and-attachments.component';
import { InputFeedbackCategoryComponent } from './input-feedback-category/input-feedback-category.component';

describe('FeedbackFormComponent', () => {
  const email = 'john.doe@verhaert.digital';

  let shallow: Shallow<FeedbackFormComponent>;

  beforeEach(() => {
    shallow = new Shallow(FeedbackFormComponent, FeedbackModule)
      .provideMock(SharedModule)
      .replaceModule(RouterModule, RouterTestingModule)
      .mock(ServiceApi, {
        getServices: jest.fn().mockReturnValue(of(SERVICE_DICTIONARY)),
        postServiceRequest: jest.fn().mockReturnValue(of(email)),
      })
      .dontMock(FeedbackFormService);
  });

  it('should submit the post request', async () => {
    const nextButtonSelector = 'p-button.next-button';

    const description = 'streets';
    const group = 'lamps';
    const serviceCode = '1';
    const message = 'message';
    const files = [new File([''], 'fileName', { type: 'image/jpeg' })];
    const location = [0, 0] as LatLong;
    const firstName = 'John';
    const lastName = 'Doe';
    const phone = '+32412345678';

    const { find, fixture, inject, instance } = await shallow
      .mock(Router, {
        navigateByUrl: jest.fn(),
      })
      .render();

    instance.feedbackForm.controls.description.setValue(description);
    instance.feedbackForm.controls.group.setValue(group);
    instance.feedbackForm.controls.service_code.setValue(serviceCode);

    fixture.detectChanges();
    instance.feedbackForm.controls.message.controls.message.setValue(message);
    files.forEach((file) =>
      instance.feedbackForm.controls.message.controls.files.push(new FormControl<File>(file, { nonNullable: true })),
    );
    find(nextButtonSelector).triggerEventHandler('click', {});

    fixture.detectChanges();
    instance.feedbackForm.controls.location.setValue(location);
    find(nextButtonSelector).triggerEventHandler('click', {});

    fixture.detectChanges();
    instance.feedbackForm.controls.contact.controls.email.setValue(email);
    instance.feedbackForm.controls.contact.controls.firstName.setValue(firstName);
    instance.feedbackForm.controls.contact.controls.lastName.setValue(lastName);
    instance.feedbackForm.controls.contact.controls.phone.setValue(phone);

    find(nextButtonSelector).triggerEventHandler('click', {});

    expect(inject(ServiceApi).postServiceRequest).toHaveBeenCalledWith({
      description,
      serviceCode,
      files,
      location,
      email,
      firstName,
      lastName,
      phone,
    });
    expect(inject(Router).navigateByUrl).toHaveBeenCalledWith(`feedback/confirmed?email=${email}`);
  });

  it('feedback form flow', async () => {
    const backButtonSelector = 'p-button.back-button';
    const nextButtonSelector = 'p-button.next-button';

    const { find, findComponent, instance, fixture } = await shallow.render();

    expect(findComponent(InputFeedbackCategoryComponent)).toHaveFound(1);
    expect(findComponent(InputFeedbackCategoryComponent).categories).toEqual([{ value: 'streets' }, { value: 'parcs' }]);

    instance.feedbackForm.controls.group.setValue('streets');
    fixture.detectChanges();

    expect(findComponent(InputFeedbackCategoryComponent)).toHaveFound(1);
    expect(find('.description').nativeElement.innerHTML).toBe('streets');
    expect(findComponent(InputFeedbackCategoryComponent).categories).toEqual([{ value: 'lamps' }]);

    instance.feedbackForm.controls.description.setValue('lamps');
    fixture.detectChanges();

    expect(findComponent(InputFeedbackCategoryComponent)).toHaveFound(1);
    expect(find('.description').nativeElement.innerHTML).toBe('lamps');
    expect(findComponent(InputFeedbackCategoryComponent).categories).toEqual([
      { label: 'missing lamp', value: '1' },
      { label: 'broken lamp', value: '2' },
    ]);

    instance.feedbackForm.controls.service_code.setValue('1');
    fixture.detectChanges();

    expect(findComponent(FeedbackMessageAndAttachmentComponent)).toHaveFound(1);
    instance.feedbackForm.controls.message.controls.message.setValue('message');
    find(nextButtonSelector).triggerEventHandler('click', {});
    fixture.detectChanges();

    expect(findComponent(FeedbackLocationComponent)).toHaveFound(1);
    find(nextButtonSelector).triggerEventHandler('click', {});
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
    expect(instance.feedbackForm.controls.service_code.value).toBeNull();

    find(backButtonSelector).triggerEventHandler('click', {});
    fixture.detectChanges();

    expect(findComponent(InputFeedbackCategoryComponent)).toHaveFound(1);
    expect(instance.feedbackForm.controls.description.value).toBeNull();

    find(backButtonSelector).triggerEventHandler('click', {});
    fixture.detectChanges();

    expect(findComponent(InputFeedbackCategoryComponent)).toHaveFound(1);
    expect(instance.feedbackForm.controls.group.value).toBeNull();
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
