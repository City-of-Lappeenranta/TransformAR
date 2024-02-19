import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-feedback-reason-content-file',
  templateUrl: './feedback-reason-content-file.component.html',
  styleUrls: ['./feedback-reason-content-file.component.scss'],
})
export class FeedbackReasonContentFileComponent {
  @Input({ required: true }) public name: string | undefined;
  @Input({ required: true }) public size: string | undefined;
  @Input() public percentage: number | undefined;
  @Output() public onDelete = new EventEmitter<void>();
}
