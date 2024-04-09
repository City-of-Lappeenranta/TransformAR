import { Shallow } from 'shallow-render';
import { FeedbackModule } from '../../../feedback.module';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedModule } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { FeedbackContactComponent } from './feedback-contact.component';
import { phoneNumberValidator } from '@shared/validators/phone-number.validator';
import { PhoneNumberFormat, PhoneNumberUtil } from 'google-libphonenumber';
import { environment } from '@environments/environment';

describe('FeedbackContactComponent', () => {
  let shallow: Shallow<FeedbackContactComponent>;

  beforeEach(() => {
    shallow = new Shallow(FeedbackContactComponent, FeedbackModule)
      .mock(TranslateService, { instant: jest.fn() })
      .provideMock(SharedModule);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should show invalid email message when the email input is invalid', async () => {
    const { find, instance, fixture } = await shallow.render(
      `
        <app-feedback-contact
          [contactForm]="contactForm"
        ></app-feedback-contact>
      `,
      {
        bind: { contactForm: createContactForm() },
      },
    );

    instance.contactForm.controls.email.setValue('invalid_email');

    fixture.detectChanges();

    expect(find('small')).toHaveFoundOne();
  });

  it('should show invalid email message when the email input is invalid', async () => {
    const { find, instance, fixture, inject } = await shallow.render(
      `
        <app-feedback-contact
          [contactForm]="contactForm"
        ></app-feedback-contact>
      `,
      {
        bind: { contactForm: createContactForm() },
      },
    );

    instance.contactForm.controls.phone.setValue('invalid_phone');

    fixture.detectChanges();

    const phoneNumberUtil = PhoneNumberUtil.getInstance();
    const phoneNumberFormat = phoneNumberUtil.format(
      phoneNumberUtil.getExampleNumber(environment.countryCode),
      PhoneNumberFormat.INTERNATIONAL,
    );

    expect(find('small')).toHaveFoundOne();

    expect(inject(TranslateService).instant).toHaveBeenCalledWith('FEEDBACK.CONTACT.ERROR.INVALID_PHONE_NUMBER', {
      phoneNumberFormat,
    });
  });
});

function createContactForm(): FormGroup {
  return new FormGroup({
    email: new FormControl<string | null>(null, Validators.email),
    firstName: new FormControl<string | null>(null),
    lastName: new FormControl<string | null>(null),
    phone: new FormControl<string | null>(null, phoneNumberValidator),
    termsOfUseAccepted: new FormControl<boolean>(false, { nonNullable: true, validators: [Validators.requiredTrue] }),
  });
}
