import { NgModule } from '@angular/core';
import { ServiceApi } from './services/service-api.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  providers: [ServiceApi],
  imports: [HttpClientModule],
})
export class CoreModule {}
