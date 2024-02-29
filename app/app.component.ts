import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { SharedModule } from './shared/shared.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SharedModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  @ViewChild(RouterOutlet) public outlet: RouterOutlet | undefined;

  public title = 'citizen-webapp';

  public constructor(private readonly primengConfig: PrimeNGConfig) {}

  public get navigationHeaderTitle(): string {
    return this.outlet?.activatedRouteData?.['navigationHeaderTitle'];
  }

  public ngOnInit(): void {
    this.primengConfig.ripple = true;
  }
}
