import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { IconComponent } from './components/icon/icon.component';
import { NavigationModule } from './components/navigation/navigation.module';
import { MapComponent } from './components/map/map.component';
import { HttpClientModule } from '@angular/common/http';
import { SearchLocationInputComponent } from './components/search-location-input/search-location-input.component';

@NgModule({
  imports: [NavigationModule, IconComponent, MapComponent, SearchLocationInputComponent, HttpClientModule],
  exports: [
    ButtonModule,
    AutoCompleteModule,
    CommonModule,
    NavigationModule,
    IconComponent,
    MapComponent,
    SearchLocationInputComponent,
  ],
})
export class SharedModule {}
