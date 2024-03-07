import { Shallow } from 'shallow-render';
import { FeedbackModule } from '../../../feedback.module';
import { FeedbackMessageAndAttachmentComponent } from './feedback-message-and-attachments.component';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { FeedbackAttachmentFileComponent } from './feedback-attachment-file/feedback-attachment-file.component';
import { SharedModule } from 'primeng/api';

describe('FeedbackMessageAndAttachmentComponent', () => {
  let shallow: Shallow<FeedbackMessageAndAttachmentComponent>;

  const reasonForm = new FormGroup({
    message: new FormControl<string | null>(null, Validators.required),
    publish: new FormControl<boolean | null>(null),
    files: new FormArray<FormControl<File>>([]),
  });

  beforeEach(() => {
    shallow = new Shallow(FeedbackMessageAndAttachmentComponent, FeedbackModule).provideMock(SharedModule);
  });

  it('should not render any files if the files form value is empty', async () => {
    const { find, fixture } = await shallow.render(
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

    const { find, instance, fixture, findComponent } = await shallow.render(
      `
        <app-feedback-message-and-attachments
          [reasonForm]="reasonForm"
        ></app-feedback-message-and-attachments>
      `,
      {
        bind: { reasonForm },
      },
    );

    expect(instance.reasonForm.value.files?.length).toBe(0);

    instance.onFileInput({
      target: { files: [new File([''], fileName, { type: 'image/jpeg' })] },
    } as any);

    fixture.detectChanges();

    expect(find('app-feedback-attachment-file')).toHaveFoundOne();
    expect(findComponent(FeedbackAttachmentFileComponent).name).toBe(fileName);
    expect(instance.reasonForm.value.files?.length).toBeGreaterThan(0);

    findComponent(FeedbackAttachmentFileComponent).remove.emit();

    fixture.detectChanges();

    expect(find('app-feedback-attachment-file')).not.toHaveFoundOne();
    expect(instance.reasonForm.value.files?.length).toBe(0);
  });
});
