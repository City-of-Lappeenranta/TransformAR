import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidebarModule } from 'primeng/sidebar';
import { IconComponent } from '../icon/icon.component';
import { NavigationHeaderComponent } from './navigation-header/navigation-header.component';
import { NavigationSidebarComponent } from './navigation-sidebar/navigation-sidebar.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    IconComponent,
    SidebarModule,
    RouterModule,
    TranslateModule,
    NavigationHeaderComponent,
    NavigationSidebarComponent,
  ],
  exports: [NavigationHeaderComponent],
})
export class NavigationModule {}
