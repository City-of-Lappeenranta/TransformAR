import { Shallow } from 'shallow-render';
import { FeedbackModule } from '../../../feedback.module';
import { FeedbackContactComponent } from './feedback-contact.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from 'primeng/api';

describe('FeedbackContactComponent', () => {
  let shallow: Shallow<FeedbackContactComponent>;
  let contactForm: FormGroup;

  beforeEach(() => {
    shallow = new Shallow(FeedbackContactComponent, FeedbackModule).provideMock(SharedModule);

    contactForm = new FormGroup({
      email: new FormControl<string | null>(null, Validators.email),
      firstName: new FormControl<string | null>(null),
      lastName: new FormControl<string | null>(null),
      phone: new FormControl<string | null>(null),
      receiveResponseByMail: new FormControl<boolean | null>(null),
      termsOfUseAccepted: new FormControl<boolean>(false, { nonNullable: true, validators: [Validators.requiredTrue] }),
    });
  });

  describe('receive response by email checkbox', () => {
    it('should toggle based on email field value', async () => {
      const labelSelector = 'label[for=receiveResponseByMail]';
      const { find, fixture } = await shallow.render(
        `<app-feedback-contact [contactForm]="contactForm"></app-feedback-contact>`,
        {
          bind: { contactForm },
        },
      );
      expect(find(labelSelector)).toHaveLength(0);

      contactForm.controls['email'].setValue('foo');
      fixture.detectChanges();
      expect(find(labelSelector)).toHaveLength(1);

      contactForm.controls['email'].setValue('');
      fixture.detectChanges();
      expect(find(labelSelector)).toHaveLength(0);
    });
  });
});
