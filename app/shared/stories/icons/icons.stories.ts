/* eslint-disable @typescript-eslint/naming-convention */
import type { Meta, StoryFn } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';
import { provideAnimations } from '@angular/platform-browser/animations';
import { IconComponent } from '../../components/icon/icon.component';
import { CommonModule } from '@angular/common';

export default {
  title: 'Fundamentals/Icons',
  decorators: [
    applicationConfig({
      providers: [provideAnimations()],
    }),
    moduleMetadata({
      imports: [CommonModule, IconComponent],
    }),
  ],
} as Meta;

export const Default: StoryFn = (args) => {
  const icons = ['menu', 'close', 'bell', 'map', 'climate-change', 'feedback'];
  return {
    styles: [
      `
      .container {
        overflow: hidden;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        column-gap: 16px;
        row-gap: 32px;

        .item {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
        }
      }
    `,
    ],
    template: `
    <div class="container">
        @for (icon of icons; track icon) {
            <div class="item">
                <app-icon [icon]="icon"></app-icon>
                <p>{{icon}}</p>
            </div>
        }
    </div>
  `,
    props: { ...args, icons },
  };
};
