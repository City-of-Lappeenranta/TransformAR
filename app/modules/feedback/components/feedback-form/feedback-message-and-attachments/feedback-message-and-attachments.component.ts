import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-feedback-message-and-attachments',
  templateUrl: './feedback-message-and-attachments.component.html',
  styleUrls: ['./feedback-message-and-attachments.component.scss'],
})
export class FeedbackMessageAndAttachmentComponent {
  @Input({ required: true }) public reasonForm!: FormGroup<{
    message: FormControl<string | null>;
    publish: FormControl<boolean | null>;
  }>;
}
