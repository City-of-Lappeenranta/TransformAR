import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

interface FormFile {
  name: string;
  size: string;
}

@Component({
  selector: 'app-feedback-message-and-attachments',
  templateUrl: './feedback-message-and-attachments.component.html',
  styleUrls: ['./feedback-message-and-attachments.component.scss'],
})
export class FeedbackMessageAndAttachmentComponent {
  @Input({ required: true }) public reasonForm!: FormGroup<{
    message: FormControl<string | null>;
    publish: FormControl<boolean | null>;
    files: FormArray<FormControl<File>>;
  }>;

  public files: FormFile[] = [];

  public constructor(private readonly formBuilder: FormBuilder) {}

  public onFileInput(event: Event): void {
    const files = (event.target as HTMLInputElement).files;

    if (files && files.length > 0) {
      const file: File = files[0];

      this.files.push({ name: file.name, size: `${Math.round(file.size / 1000)} KB` });
      this.reasonForm.controls.files.push(this.formBuilder.nonNullable.control(file));
    }
  }

  public onFileRemove(indexToRemove: number): void {
    this.reasonForm.controls.files.removeAt(indexToRemove);
    this.files = this.files.filter((_, index: number) => index !== indexToRemove);
  }
}
