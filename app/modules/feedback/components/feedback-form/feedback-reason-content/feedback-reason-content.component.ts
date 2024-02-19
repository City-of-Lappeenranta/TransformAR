import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-feedback-reason-content',
  templateUrl: './feedback-reason-content.component.html',
  styleUrls: ['./feedback-reason-content.component.scss'],
})
export class FeedbackReasonContentComponent {
  @Input({ required: true }) public reasonForm!: FormGroup<{
    message: FormControl<string | null>;
    publish: FormControl<boolean | null>;
  }>;
}
