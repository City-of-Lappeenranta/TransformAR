import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { IconComponent } from './components/icon/icon.component';
import { NavigationModule } from './components/navigation/navigation.module';

@NgModule({
  imports: [NavigationModule, IconComponent],
  exports: [ButtonModule, CommonModule, NavigationModule, IconComponent],
})
export class SharedModule {}
