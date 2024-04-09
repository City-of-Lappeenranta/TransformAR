/* eslint-disable @typescript-eslint/naming-convention */
import type { Meta, StoryFn } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ButtonModule } from 'primeng/button';

export default {
  title: 'Actions/Button',
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [provideAnimations()],
    }),
    moduleMetadata({
      imports: [ButtonModule],
    }),
  ],
  args: {
    label: 'Submit',
  },
  argTypes: {
    onClick: {
      action: 'onClick',
    },
  },
} as Meta;

export const Flat: StoryFn = (args) => ({
  template: `
    <p-button [label]="label" (click)="onClick($event)"></p-button>
  `,
  props: args,
});

export const Stroked: StoryFn = (args) => ({
  template: `
    <p-button [label]="label" [outlined]="true" (click)="onClick($event)"></p-button>
  `,
  props: args,
});
