import { NgModule } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { NavigationHeaderComponent } from './navigation-header/navigation-header.component';
import { NavigationSidebarComponent } from './navigation-sidebar/navigation-sidebar.component';
import { SidebarModule } from 'primeng/sidebar';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [NavigationHeaderComponent, NavigationSidebarComponent],
  imports: [CommonModule, IconComponent, SidebarModule, RouterModule],
  exports: [NavigationHeaderComponent],
})
export class NavigationModule {}
