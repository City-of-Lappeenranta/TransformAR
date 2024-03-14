import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { convertBytesToMegabytes } from '@shared/utils/file-utils';
import imageCompression, { Options } from 'browser-image-compression';
import { MessageService } from 'primeng/api';

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

  private readonly IMAGE_JPEG = 'image/jpeg';
  private readonly IMAGE_PNG = 'image/png';
  public readonly MAX_FILE_SIZE = 3;

  public files: FormFile[] = [];

  public readonly TOAST_KEY = 'error';

  public constructor(
    private readonly formBuilder: FormBuilder,
    private readonly messageService: MessageService,
  ) {}

  public async onFileInput(event: Event): Promise<void> {
    const files = (event.target as HTMLInputElement).files;

    if (files && files.length > 0) {
      const file: File = files[0];

      if (this.isValidFileType(file) && this.isValidFileSize(file)) {
        const compressedFile = await this.compressFile(file);

        this.files.push({
          name: compressedFile.name,
          size: `${Math.round(convertBytesToMegabytes(compressedFile.size) * 100) / 100} MB`,
        });

        this.reasonForm.controls.files.push(this.formBuilder.nonNullable.control(compressedFile));
      } else {
        this.messageService.add({
          key: this.TOAST_KEY,
          detail: 'The uploaded file should be a JPEG or PNG and be smaller than 3MB',
        });
      }
    }
  }

  public onFileRemove(indexToRemove: number): void {
    this.reasonForm.controls.files.removeAt(indexToRemove);
    this.files = this.files.filter((_, index: number) => index !== indexToRemove);
  }

  private async compressFile(file: File): Promise<File> {
    const options: Options = {
      maxSizeMB: this.MAX_FILE_SIZE,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    return await imageCompression(file, options);
  }

  private isValidFileType(file: File): boolean {
    return file.type === this.IMAGE_JPEG || file.type === this.IMAGE_PNG;
  }

  private isValidFileSize(file: File): boolean {
    return convertBytesToMegabytes(file.size) < this.MAX_FILE_SIZE;
  }
}
