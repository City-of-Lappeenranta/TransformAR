import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AboutPageComponent } from './components/about-page/about-page.component';
import { AboutRoutingModule } from './about.routing';

@NgModule({
  declarations: [AboutPageComponent],
  imports: [CommonModule, AboutRoutingModule],
  providers: [MessageService],
})
export class AboutModule {}
