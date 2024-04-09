import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-feedback-attachment-file',
  templateUrl: './feedback-attachment-file.component.html',
  styleUrls: ['./feedback-attachment-file.component.scss'],
})
export class FeedbackAttachmentFileComponent {
  @Input({ required: true }) public name!: string;
  @Input() public size: string | undefined;
  @Input() public loading: boolean | undefined;
  @Output() public remove = new EventEmitter<void>();

  public getIcon(): string {
    return this.loading ? 'close-circle' : 'trash';
  }
}
