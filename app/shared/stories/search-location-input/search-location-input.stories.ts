/* eslint-disable @typescript-eslint/naming-convention */
import type { Meta, StoryFn } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';
import { provideAnimations } from '@angular/platform-browser/animations';
import { SearchLocationInputComponent } from '@shared/components/search-location-input/search-location-input.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { LatLong } from '@core/models/location';
import { HttpClientModule } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { CommonModule } from '@angular/common';

export default {
  title: 'Forms/Search location',
  decorators: [
    applicationConfig({
      providers: [provideAnimations(), importProvidersFrom(HttpClientModule)],
    }),
    moduleMetadata({
      imports: [SearchLocationInputComponent, ReactiveFormsModule, CommonModule],
    }),
  ],
} as Meta;

export const Default: StoryFn = (args) => {
  const latLongFormControl = new FormControl<LatLong | null>(null);

  return {
    template: `
      <app-search-location-input [formControl]="latLongFormControl"></app-search-location-input>
      @if(latLongFormControl.value)
      {
      <p>Latitude: {{latLongFormControl.value?.[0]}}, longitude: {{latLongFormControl.value?.[1]}}</p>
      }
  `,
    props: { ...args, latLongFormControl },
  };
};
