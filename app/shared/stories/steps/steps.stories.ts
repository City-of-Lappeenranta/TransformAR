/* eslint-disable @typescript-eslint/naming-convention */
import type { Meta, StoryFn } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';
import { provideAnimations } from '@angular/platform-browser/animations';
import { StepsComponent } from '@shared/components/steps/steps.component';

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
  argTypes: {
    onClick: {
      action: 'onClick',
    },
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile2',
    },
  },
} as Meta;

export const Header: StoryFn = (args) => ({
  template: `
    <app-steps [amount]="amount" [active]="active"></app-steps>
  `,
  props: args,
});
