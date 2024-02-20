/* eslint-disable @typescript-eslint/naming-convention */
import type { Meta, StoryFn } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';
import { provideAnimations } from '@angular/platform-browser/animations';
import { FeedbackModule } from '../../../modules/feedback/feedback.module';

export default {
  title: 'Components/Feedback category',
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [provideAnimations()],
    }),
    moduleMetadata({
      imports: [FeedbackModule],
    }),
  ],
  args: {
    value: 'Submit',
    withColor: true,
    selected: false,
  },
  argTypes: {
    onClick: {
      action: 'onClick',
    },
  },
} as Meta;

export const Default: StoryFn = (args) => ({
  template: `
  <app-feedback-category
    [withColor]="withColor"
    [selected]="selected"
    (click)="onClick($event)"
  >
    {{ value }}
  </app-feedback-category>
  `,
  props: args,
});
