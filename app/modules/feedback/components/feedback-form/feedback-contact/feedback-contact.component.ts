import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { environment } from '@environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { PhoneNumberFormat, PhoneNumberUtil } from 'google-libphonenumber';

@Component({
  selector: 'app-feedback-contact',
  templateUrl: './feedback-contact.component.html',
  styleUrls: ['./feedback-contact.component.scss'],
})
export class FeedbackContactComponent {
  @Input({ required: true }) public contactForm!: FormGroup<{
    email: FormControl<string | null>;
    firstName: FormControl<string | null>;
    lastName: FormControl<string | null>;
    phone: FormControl<string | null>;
    termsOfUseAccepted: FormControl<boolean>;
  }>;

  public termsOfUseUrl = environment.termsOfUseUrl;
  public privacyPolicyUrl = environment.privacyPolicyUrl;

  public constructor(private readonly translateService: TranslateService) {}

  public get invalidPhoneNumberMessage(): string {
    const phoneNumberUtil = PhoneNumberUtil.getInstance();

    return this.translateService.instant('FEEDBACK.CONTACT.ERROR.INVALID_PHONE_NUMBER', {
      phoneNumberFormat: phoneNumberUtil.format(
        phoneNumberUtil.getExampleNumber(environment.countryCode),
        PhoneNumberFormat.INTERNATIONAL,
      ),
    });
  }
}
