import { Component, Input, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { convertBytesToMegabytes } from '@shared/utils/file-utils';
import imageCompression, { Options } from 'browser-image-compression';
import { MessageService } from 'primeng/api';

interface FormFile {
  name: string;
  size?: string;
  loading?: boolean;
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
  public readonly MAX_FILE_SIZE_MB = 3;

  public files: FormFile[] = [];
  public amountOfFilesBeingCompressed = signal(0);

  public readonly TOAST_KEY = 'error';

  public constructor(
    private readonly formBuilder: FormBuilder,
    private readonly messageService: MessageService,
  ) {}

  public async onFileInput(event: Event): Promise<void> {
    const files = (event.target as HTMLInputElement).files;

    if (files && files.length > 0) {
      const file: File = files[0];

      if (this.isValidFileType(file)) {
        this.files.push({
          name: file.name,
          loading: true,
        });

        const compressedFile = await this.compressFile(file);

        if (this.hasValidFileSize(compressedFile)) {
          this.files = this.files.map((value) => ({
            ...value,
            size: `${Math.round(convertBytesToMegabytes(compressedFile.size) * 100) / 100} MB`,
            loading: false,
          }));

          this.reasonForm.controls.files.push(this.formBuilder.nonNullable.control(compressedFile));
        } else {
          this.files = this.files.filter((value) => value.name !== file.name);
          this.messageService.add({
            key: this.TOAST_KEY,
            detail: `Your file is too large and could not be compressed down to ${this.MAX_FILE_SIZE_MB}, please try again with a smaller file`,
          });
        }
      }
    }
  }

  public onFileRemove(indexToRemove: number): void {
    this.reasonForm.controls.files.removeAt(indexToRemove);
    this.files = this.files.filter((_, index: number) => index !== indexToRemove);
  }

  private async compressFile(file: File): Promise<File> {
    const options: Options = {
      maxSizeMB: this.MAX_FILE_SIZE_MB,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    return await imageCompression(file, options);
  }

  private isValidFileType(file: File): boolean {
    return file.type === this.IMAGE_JPEG || file.type === this.IMAGE_PNG;
  }

  private hasValidFileSize(file: File): boolean {
    return convertBytesToMegabytes(file.size) < this.MAX_FILE_SIZE_MB;
  }

  private updateAmountOfFilesBeingCompressed(amount: number): void {
    this.amountOfFilesBeingCompressed.update((prev) => (prev += amount));
  }
}
