import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { IconComponent } from './components/icon/icon.component';
import { NavigationModule } from './components/navigation/navigation.module';
import { MapComponent } from './components/map/map.component';

@NgModule({
  imports: [NavigationModule, IconComponent, MapComponent],
  exports: [
    ButtonModule,
    CommonModule,
    NavigationModule,
    IconComponent,
    MapComponent,
  ],
})
export class SharedModule {}
