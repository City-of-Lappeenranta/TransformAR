import { Component, Input, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import {
  convertBytesToKilobytes,
  convertBytesToMegabytes,
} from '@shared/utils/file-utils';
import imageCompression, { Options } from 'browser-image-compression';
import { MessageService, PrimeTemplate } from 'primeng/api';
import { IconComponent } from '@shared/components/icon/icon.component';
import { Button } from 'primeng/button';
import { FeedbackAttachmentFileComponent } from './feedback-attachment-file/feedback-attachment-file.component';
import { Toast } from 'primeng/toast';
import { Textarea } from 'primeng/textarea';
import { isEmpty } from 'lodash-es';

interface FormFile {
  name: string;
  size?: string;
  loading?: boolean;
}

@Component({
  selector: 'app-feedback-message-and-attachments',
  templateUrl: './feedback-message-and-attachments.component.html',
  styleUrls: ['./feedback-message-and-attachments.component.scss'],
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    IconComponent,
    Button,
    FeedbackAttachmentFileComponent,
    Toast,
    Textarea,
    PrimeTemplate,
  ],
  standalone: true,
})
export class FeedbackMessageAndAttachmentComponent implements OnInit {
  @Input({ required: true }) public reasonForm!: FormGroup<{
    message: FormControl<string | null>;
    files: FormArray<FormControl<File>>;
  }>;

  private readonly IMAGE_JPEG = 'image/jpeg';
  private readonly IMAGE_PNG = 'image/png';
  public readonly MAX_FILE_SIZE_MB = 3;

  public files: FormFile[] = [];

  public readonly TOAST_KEY = 'error';

  public constructor(
    private readonly formBuilder: FormBuilder,
    private readonly messageService: MessageService,
    private readonly translateService: TranslateService,
  ) {}

  public ngOnInit(): void {
    if (!isEmpty(this.reasonForm.controls.files)) {
      (this.reasonForm.controls.files.value as File[]).forEach((file: File) => {
        this.files.push({
          name: file.name,
          size: this.getFileSize(file.size),
          loading: false,
        });
      });
    }
  }

  public async onFileInput(event: Event): Promise<void> {
    const files = (event.target as HTMLInputElement).files;

    if (files && files.length > 0) {
      const file: File = files[0];

      if (this.isValidFileType(file)) {
        const selectedFile = {
          name: file.name,
          loading: true,
        };

        this.files.push(selectedFile);

        const fileIndex: number = this.files.indexOf(selectedFile);
        const compressedBlob = await this.compressFile(file);

        if (this.hasValidFileSize(compressedBlob)) {
          const compressedFile = new File([compressedBlob], file.name, {
            type: file.type,
          });

          this.files[fileIndex].loading = false;
          this.files[fileIndex].size = this.getFileSize(compressedFile.size);

          this.reasonForm.controls.files.push(
            this.formBuilder.nonNullable.control(compressedFile),
          );
        } else {
          this.files = this.files.filter((value) => value.name !== file.name);
          this.messageService.add({
            key: this.TOAST_KEY,
            detail: this.translateService.instant(
              'FEEDBACK.MESSAGES_AND_ATTACHMENTS.ATTACHMENTS.WARNING',
              {
                maxSize: this.MAX_FILE_SIZE_MB,
              },
            ),
          });
        }
      }
    }
  }

  public resetFileInput(event: Event): void {
    // Clear the input value to always trigger the change detection (eg; same file)
    (event.target as HTMLInputElement).value = '';
  }

  public onFileRemove(indexToRemove: number): void {
    this.reasonForm.controls.files.removeAt(indexToRemove);
    this.files = this.files.filter(
      (_, index: number) => index !== indexToRemove,
    );
  }

  private getFileSize(size: number): string {
    const sizeInMb: number =
      Math.round(convertBytesToMegabytes(size) * 100) / 100;

    if (sizeInMb >= 1) {
      return `${sizeInMb} MB`;
    }

    return `${Math.round(convertBytesToKilobytes(size) * 100) / 100} KB`;
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
}
