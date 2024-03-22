import { Shallow } from 'shallow-render';
import { FeedbackModule } from '../../../feedback.module';
import { FeedbackMessageAndAttachmentComponent } from './feedback-message-and-attachments.component';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { FeedbackAttachmentFileComponent } from './feedback-attachment-file/feedback-attachment-file.component';
import { MessageService, SharedModule } from 'primeng/api';
import imageCompression from 'browser-image-compression';
import { convertMegabytesToBytes } from '@shared/utils/file-utils';

jest.mock('browser-image-compression', () => ({
  __esModule: true,
  default: jest.fn((file) => file),
}));

jest.useFakeTimers();

describe('FeedbackMessageAndAttachmentComponent', () => {
  let shallow: Shallow<FeedbackMessageAndAttachmentComponent>;

  const reasonForm = new FormGroup({
    message: new FormControl<string | null>(null, Validators.required),
    publish: new FormControl<boolean | null>(null),
    files: new FormArray<FormControl<File>>([]),
  });

  beforeEach(() => {
    shallow = new Shallow(FeedbackMessageAndAttachmentComponent, FeedbackModule)
      .mock(MessageService, { add: jest.fn() })
      .provideMock(SharedModule);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not render any files if the files form value is empty', async () => {
    const { find } = await shallow.render(
      `
        <app-feedback-message-and-attachments
          [reasonForm]="reasonForm"
        ></app-feedback-message-and-attachments>
      `,
      {
        bind: { reasonForm },
      },
    );

    expect(find('app-feedback-attachment-file')).not.toHaveFoundOne();
  });

  it('should update files when a file is added and remove it when delete is pressed', async () => {
    const fileName = 'image.jpg';

    const { find, instance, fixture, findComponent, inject } = await shallow.render(
      `
        <app-feedback-message-and-attachments
          [reasonForm]="reasonForm"
        ></app-feedback-message-and-attachments>
      `,
      {
        bind: { reasonForm },
      },
    );
    const messageService = inject(MessageService);

    expect(instance.reasonForm.value.files?.length).toBe(0);

    const file = new File([''], fileName, { type: 'image/jpeg' });
    instance.onFileInput({
      target: { files: [file] },
    } as any);

    await fixture.whenStable();
    fixture.detectChanges();

    expect(messageService.add).not.toHaveBeenCalled();
    expect(imageCompression).toHaveBeenCalledWith(file, expect.objectContaining({ maxSizeMB: 3, maxWidthOrHeight: 1920 }));
    expect(findComponent(FeedbackAttachmentFileComponent).name).toBe(fileName);
    expect(instance.reasonForm.value.files?.length).toBeGreaterThan(0);

    findComponent(FeedbackAttachmentFileComponent).remove.emit();

    fixture.detectChanges();

    expect(find('app-feedback-attachment-file')).not.toHaveFoundOne();
    expect(instance.reasonForm.value.files?.length).toBe(0);
  });

  it('should refuse files larger than 3MB', async () => {
    const fileName = 'image.jpg';

    const { instance, fixture, findComponent, inject } = await shallow.render(
      `
        <app-feedback-message-and-attachments
          [reasonForm]="reasonForm"
        ></app-feedback-message-and-attachments>
      `,
      {
        bind: { reasonForm },
      },
    );
    const messageService = inject(MessageService);

    expect(instance.reasonForm.value.files?.length).toBe(0);

    const file = new File([''], fileName, { type: 'image/jpeg' });
    Object.defineProperty(file, 'size', { value: convertMegabytesToBytes(4) });

    instance.onFileInput({
      target: { files: [file] },
    } as any);

    await fixture.whenStable();
    fixture.detectChanges();

    expect(messageService.add).toHaveBeenCalled();
    expect(imageCompression).toHaveBeenCalledWith(file, expect.objectContaining({ maxSizeMB: 3, maxWidthOrHeight: 1920 }));
    expect(findComponent(FeedbackAttachmentFileComponent)).toHaveLength(0);
    expect(instance.reasonForm.value.files?.length).toBe(0);
  });
});
