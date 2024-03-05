import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-feedback-attachment-file',
  templateUrl: './feedback-attachment-file.component.html',
  styleUrls: ['./feedback-attachment-file.component.scss'],
})
export class FeedbackAttachmentFileComponent {
  @Input({ required: true }) public name!: string;
  @Input({ required: true }) public size!: string;
  @Input() public percentage: number | undefined;
  @Output() public onDelete = new EventEmitter<void>();

  public getIcon(): string {
    return this.percentage && this.percentage < 100 ? 'close-circle' : 'trash';
  }
}
