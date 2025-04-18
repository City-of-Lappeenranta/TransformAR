import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import { IconComponent } from '@shared/components/icon/icon.component';
import { NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-feedback-confirmation',
  templateUrl: './feedback-confirmation.component.html',
  styleUrls: ['./feedback-confirmation.component.scss'],
  imports: [IconComponent, NgIf, TranslateModule, Button, RouterLink],
  standalone: true,
})
export class FeedbackConfirmationComponent implements OnInit {
  public email: string | null = null;

  public constructor(private route: ActivatedRoute) {}

  public ngOnInit(): void {
    this.email = this.route.snapshot.queryParamMap.get('email');
  }
}
