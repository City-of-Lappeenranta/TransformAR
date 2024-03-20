import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { IconComponent } from './components/icon/icon.component';
import { MapComponent } from './components/map/map.component';
import { NavigationModule } from './components/navigation/navigation.module';
import { SearchLocationInputComponent } from './components/search-location-input/search-location-input.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [NavigationModule, IconComponent, MapComponent, SearchLocationInputComponent, HttpClientModule],
  exports: [
    TranslateModule,
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
