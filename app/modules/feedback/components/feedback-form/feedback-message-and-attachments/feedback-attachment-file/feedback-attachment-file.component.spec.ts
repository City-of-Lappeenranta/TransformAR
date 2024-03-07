import { Shallow } from 'shallow-render';
import { FeedbackModule } from '../../../../feedback.module';
import { FeedbackAttachmentFileComponent } from './feedback-attachment-file.component';
import { SharedModule } from 'primeng/api';

describe('FeedbackAttachmentFileComponent', () => {
  let shallow: Shallow<FeedbackAttachmentFileComponent>;

  beforeEach(() => {
    shallow = new Shallow(FeedbackAttachmentFileComponent, FeedbackModule).provideMock(SharedModule);
  });

  it('should render the title and description', async () => {
    const name = 'Name';
    const size = '256 kB';

    const { find } = await shallow.render(
      `
        <app-feedback-attachment-file
          [name]="name"
          [size]="size"
        ></app-feedback-attachment-file>
      `,
      {
        bind: { name, size },
      },
    );

    expect(find('h5').nativeElement.innerHTML).toBe(name);
    expect(find('p').nativeElement.innerHTML).toBe(size);
  });

  it('should show the progress bar and close icon when the upload is in progress', async () => {
    const name = 'Name';
    const size = '256 kB';
    const percentage = 20;

    const { find } = await shallow.render(
      `
        <app-feedback-attachment-file
          [name]="name"
          [size]="size"
          [percentage]="percentage"
        ></app-feedback-attachment-file>
      `,
      {
        bind: { name, size, percentage },
      },
    );

    expect(find('p-progressbar')).toHaveFoundOne();
    expect((find('.close').nativeElement as HTMLElement).getAttribute('ng-reflect-icon')).toBe('close-circle');
  });
  it('should hide the progress bar and show trash icon when the upload is complete', async () => {
    const name = 'Name';
    const size = '256 kB';
    const percentage = 100;

    const { find } = await shallow.render(
      `
        <app-feedback-attachment-file
          [name]="name"
          [size]="size"
          [percentage]="percentage"
        ></app-feedback-attachment-file>
      `,
      {
        bind: { name, size, percentage },
      },
    );

    expect(find('p-progressbar')).not.toHaveFoundOne();
    expect((find('.close').nativeElement as HTMLElement).getAttribute('ng-reflect-icon')).toBe('trash');
  });

  it('should emit remove when clicking the icon', async () => {
    const name = 'Name';
    const size = '256 kB';

    const { find, instance } = await shallow.render(
      `
        <app-feedback-attachment-file
          [name]="name"
          [size]="size"
          [percentage]="percentage"
        ></app-feedback-attachment-file>
      `,
      {
        bind: { name, size },
      },
    );

    find('.close').triggerEventHandler('click', {});
    expect(instance.remove.emit).toHaveBeenCalled();
  });
});
