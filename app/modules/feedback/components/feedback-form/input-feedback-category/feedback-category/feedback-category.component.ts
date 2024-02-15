import { Component, HostListener, Input } from '@angular/core';

@Component({
  selector: 'app-feedback-category',
  templateUrl: './feedback-category.component.html',
  styleUrls: ['./feedback-category.component.scss'],
})
export class FeedbackCategoryComponent {
  @Input() public withColor: boolean | undefined;
  @Input() public selected: boolean | undefined;
  @Input() public index: number | undefined;

  @HostListener('click', ['$event']) public inClick(e: MouseEvent) {
    e.stopPropagation();
    this.selected = !this.selected;
  }

  public get color(): string {
    const colors = [
      'green',
      'blue',
      'lime',
      'grey',
      'cream',
      'pink',
      'orange',
      'yellow',
    ];

    return colors[this.index ?? 0 % colors.length];
  }
}
