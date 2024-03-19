import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { environment } from '@environments/environment';

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
}
