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
} as Meta;

export const FormInput: StoryFn = (args) => {
  const categories = [
    'Transactions, customer service, communication and general feedback',
    'Exercise and outdoor activities',
    'Zoning, construction and housing',
    'Streets and traffic',
    'Urban environment and accessibility and nature',
    'Library, cultural institutions and cultural events',
    'Early childhood education, teaching and youth',
    'Employment and business services',
  ];

  return {
    template: `
    <app-input-feedback-category
      [categories]="categories"
    >
    </app-input-feedback-category>
  `,
    props: { ...args, categories },
  };
};
