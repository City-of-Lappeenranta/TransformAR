import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-feedback-form',
  templateUrl: './feedback-form.component.html',
  styleUrls: ['./feedback-form.component.scss'],
})
export class FeedbackFormComponent {
  public categories = [
    'Transactions, customer service, communication and general feedback',
    'Exercise and outdoor activities',
    'Zoning, construction and housing',
    'Streets and traffic',
    'Urban environment and accessibility and nature',
    'Library, cultural institutions and cultural events',
    'Early childhood education, teaching and youth',
    'Employment and business services',
  ];

  public reasonForm = new FormGroup({
    reason: new FormControl<string | null>(null),
  });
}
