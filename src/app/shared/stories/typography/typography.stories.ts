/* eslint-disable @typescript-eslint/naming-convention */
import type { Meta, StoryFn } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';
import { provideAnimations } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';

export default {
  title: 'Fundamentals/Typography',
  decorators: [
    applicationConfig({
      providers: [provideAnimations()],
    }),
    moduleMetadata({
      imports: [CommonModule],
    }),
  ],
} as Meta;

export const Default: StoryFn = () => {
  const fonts: { name: string; fontSize: string; lineHeight: string; fontWeight: string; className: string }[] = [
    {
      name: 'Display 2xl',
      fontSize: '48px',
      lineHeight: '56px',
      fontWeight: 'Heavy',
      className: 'display-2xl',
    },
    {
      name: 'Display xl',
      fontSize: '40px',
      lineHeight: '48px',
      fontWeight: 'Heavy',
      className: 'display-xl',
    },
    {
      name: 'Display lg',
      fontSize: '32px',
      lineHeight: '40px',
      fontWeight: 'Heavy',
      className: 'display-lg',
    },
    {
      name: 'Display md',
      fontSize: '24px',
      lineHeight: '32px',
      fontWeight: 'Heavy',
      className: 'display-md',
    },
    {
      name: 'Display sm',
      fontSize: '20px',
      lineHeight: '24px',
      fontWeight: 'Heavy',
      className: 'display-sm',
    },
    {
      name: 'Display xs',
      fontSize: '16px',
      lineHeight: '20px',
      fontWeight: 'Heavy',
      className: 'display-xs',
    },
    {
      name: 'Body lg',
      fontSize: '18px',
      lineHeight: '28px',
      fontWeight: 'Regular',
      className: 'body-lg',
    },
    {
      name: 'Body md',
      fontSize: '16px',
      lineHeight: '24px',
      fontWeight: 'Regular',
      className: 'body-md',
    },
    {
      name: 'Body sm',
      fontSize: '14px',
      lineHeight: '22px',
      fontWeight: 'Regular',
      className: 'body-sm',
    },
    {
      name: 'Body xs',
      fontSize: '12px',
      lineHeight: '20px',
      fontWeight: 'Regular',
      className: 'body-xs',
    },
    {
      name: 'Button lg',
      fontSize: '18px',
      lineHeight: '28px',
      fontWeight: 'Medium',
      className: 'button-lg',
    },
    {
      name: 'Button md',
      fontSize: '16px',
      lineHeight: '20px',
      fontWeight: 'Medium',
      className: 'button-md',
    },
    {
      name: 'Button sm',
      fontSize: '14px',
      lineHeight: '22px',
      fontWeight: 'Medium',
      className: 'button-sm',
    },
    {
      name: 'Button xs',
      fontSize: '12px',
      lineHeight: '20px',
      fontWeight: 'Medium',
      className: 'button-xs',
    },
  ];

  return {
    styles: [
      `
      ::ng-deep  .sb-show-main {
        overflow: scroll;
        padding: 64px 80px !important; 
        border-top: 12px solid #48A23F;
      }
      

      .effra {
        font-size: 48px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
      }

      .title {
        margin-bottom: 96px;
      }

      .ag {
        font-size: 112px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
      }

      .abcdef {
        font-size: 48px;
        font-style: normal;
        font-weight: 400;
        line-height: 60px; 
        overflow-wrap: anywhere;
        letter-spacing: -0.96px;
      }

      .header {
        padding-bottom: 16px;
        border-bottom: 1px solid #D0D5DD;
        color: #667085;
      }

      .gap-16 {
        gap: 16px;
      }

      .gap-32 {
        gap: 32px;
      }

      .gap-64 {
        gap: 64px;
      }
    `,
    ],
    template: `
    <p class="title display-2xl">{{ 'Typography' | uppercase }}</p>
    <div class="flex-column gap-64">
      <div class="flex-column gap-16">
        <p class="effra">Effra</p>
        <p class="ag">Ag</p>
      </div>
      <p class="abcdef">ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 !&#64;#$%^&amp;*()</p>
      @for (font of fonts; track font.name) {
        <div class="flex-column gap-32">
          <div class="header flex-row space-between">
          <p class="body-md">{{ font.name }}</p>
          <p class="body-md">Font size: {{ font.fontSize }} | Line height: {{ font.lineHeight }}  | Font-weight: {{ font.fontWeight }} </p>
          </div>
          <p [class]="font.className">{{ 'Lorem ipsum dolor sit amet consectetur.' | uppercase }}</p>
        </div>
      }
    </div>
  `,
    props: { fonts },
  };
};
