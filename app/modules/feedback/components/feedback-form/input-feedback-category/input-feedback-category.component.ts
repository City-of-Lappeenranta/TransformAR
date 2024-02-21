import { Component, Injector, Input, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
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
  @Input({ required: true }) public categories: string[] = [];
  @Input() public withColor = true;

  public categoriesToShow: { value: string; selected: boolean }[] = [];

  public constructor(private readonly injector: Injector) {
    super();
  }

  public ngOnInit(): void {
    const ngControl = this.injector.get(NgControl);

    this.categoriesToShow = this.categories.map((value) => ({
      value,
      selected: value === ngControl.value,
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
