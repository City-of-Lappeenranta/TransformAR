import { Component, HostListener, Input } from '@angular/core';

@Component({
  selector: 'app-feedback-category',
  templateUrl: './feedback-category.component.html',
  styleUrls: ['./feedback-category.component.scss'],
})
export class FeedbackCategoryComponent {
  @Input({ required: true }) public withColor: boolean | undefined;
  @Input({ required: true }) public selected: boolean | undefined;
  @Input() public index: number | undefined;
  @Input() public icon: string | undefined;

  @HostListener('click', ['$event']) public inClick(e: MouseEvent): void {
    e.stopPropagation();
    this.selected = !this.selected;
  }

  public get color(): string {
    const colors = ['green', 'blue', 'lime', 'grey', 'cream', 'pink', 'orange', 'yellow'];

    return colors[this.index ?? 0 % colors.length];
  }
}
