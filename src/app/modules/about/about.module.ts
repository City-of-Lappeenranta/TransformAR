import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AboutPageComponent } from './components/about-page/about-page.component';
import { AboutRoutingModule } from './about.routing';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [AboutPageComponent],
  imports: [CommonModule, AboutRoutingModule, TranslateModule.forChild()],
  providers: [MessageService],
})
export class AboutModule {}
