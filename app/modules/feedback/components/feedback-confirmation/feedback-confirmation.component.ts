import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-feedback-confirmation',
  templateUrl: './feedback-confirmation.component.html',
  styleUrls: ['./feedback-confirmation.component.scss'],
})
export class FeedbackConfirmationComponent implements OnInit {
  public email: string | null = null;

  public constructor(private route: ActivatedRoute) {}

  public ngOnInit(): void {
    this.email = this.route.snapshot.queryParamMap.get('email');
  }
}
