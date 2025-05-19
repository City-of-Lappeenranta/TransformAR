/* eslint-disable @typescript-eslint/naming-convention */
import type { Meta, StoryFn } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';
import { provideAnimations } from '@angular/platform-browser/animations';
import { StepsComponent } from '../../components/steps/steps.component';

export default {
  title: 'Components/Steps',
  decorators: [
    applicationConfig({
      providers: [provideAnimations()],
    }),
    moduleMetadata({
      imports: [StepsComponent],
    }),
  ],
  args: {
    amount: 6,
    active: 2,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile2',
    },
  },
} as Meta;

export const Default: StoryFn = (args) => ({
  template: `
    <app-steps [amount]="amount" [active]="active"></app-steps>
  `,
  props: args,
});
