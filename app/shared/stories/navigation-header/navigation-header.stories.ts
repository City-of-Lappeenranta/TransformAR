/* eslint-disable @typescript-eslint/naming-convention */
import type { Meta, StoryFn } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NavigationModule } from '../../components/navigation/navigation.module';

export default {
  title: 'Components/Navigation header',
  decorators: [
    applicationConfig({
      providers: [provideAnimations()],
    }),
    moduleMetadata({
      imports: [NavigationModule],
    }),
  ],
  args: {
    title: 'Lappeenranta',
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
  styles: [
    `
      ::ng-deep .sb-main-padded {
      padding: 0 !important;
      }
  `,
  ],
  template: `
    <app-navigation-header [title]="title"></app-navigation-header>
  `,
  props: args,
});
