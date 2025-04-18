import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProgressBar } from 'primeng/progressbar';
import { IconComponent } from '@shared/components/icon/icon.component';
import { Divider } from 'primeng/divider';

@Component({
  selector: 'app-feedback-attachment-file',
  templateUrl: './feedback-attachment-file.component.html',
  styleUrls: ['./feedback-attachment-file.component.scss'],
  imports: [ProgressBar, IconComponent, Divider],
  standalone: true,
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
