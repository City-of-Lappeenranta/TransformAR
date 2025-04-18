import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { IconComponent } from '@shared/components/icon/icon.component';
import { MapComponent } from '@shared/components/map/map.component';
import { NavigationModule } from '@shared/components/navigation/navigation.module';
import { SearchLocationInputComponent } from '@shared/components/search-location-input/search-location-input.component';

@NgModule({
  imports: [
    NavigationModule,
    IconComponent,
    SearchLocationInputComponent,
    MapComponent,
  ],
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
