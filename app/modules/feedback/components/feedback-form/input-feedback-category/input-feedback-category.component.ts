import { Component, Input, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ControlValueAccessorHelper } from '@shared/abstract-control-value-accessor';

@Component({
  selector: 'app-input-feedback-category',
  templateUrl: './input-feedback-category.component.html',
  styleUrls: ['./input-feedback-category.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: InputFeedbackCategoryComponent,
      multi: true,
    },
  ],
})
export class InputFeedbackCategoryComponent
  extends ControlValueAccessorHelper<string>
  implements OnInit
{
  @Input() public categories: string[] = [];

  public categoriesToShow: { value: string; selected: boolean }[] = [];

  public ngOnInit(): void {
    this.categoriesToShow = this.categories.map((value) => ({
      value,
      selected: false,
    }));
  }

  public toggleCategory(indexToToggle: number): void {
    let value = '';
    this.categoriesToShow = this.categoriesToShow.map((category, index) => {
      let selected = false;
      if (index === indexToToggle) {
        value = category.value;
        selected = true;
      }

      return { value: category.value, selected };
    });

    this.writeValue(value);
  }
}
